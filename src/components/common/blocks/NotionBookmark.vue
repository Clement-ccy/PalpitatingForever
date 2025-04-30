<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const bookmarkData = computed(() => props.block.bookmark);
const url = computed(() => bookmarkData.value?.url);
const caption = computed(() => bookmarkData.value?.caption);

// Metadata fetched by Notion (might be missing or under a 'meta' key depending on API version/fetch details)
// Check both possibilities for robustness
const meta = computed(() => bookmarkData.value?.meta || {});
const title = computed(() => meta.value?.title || bookmarkData.value?.title || url.value); // Fallback to URL
const description = computed(() => meta.value?.description || bookmarkData.value?.description);
const iconUrl = computed(() => meta.value?.icon?.url || bookmarkData.value?.icon?.url);
const imageUrl = computed(() => meta.value?.image?.url || bookmarkData.value?.image?.url);

// Helper to get hostname for display
const displayUrl = computed(() => {
    if (!url.value) return '';
    try {
        // Use URL constructor for robust parsing
        return new URL(url.value).hostname.replace(/^www\./, ''); // Remove www.
    } catch {
        return url.value; // Show full URL if parsing fails
    }
});

</script>

<template>
  <div v-if="url" class="notion-bookmark-wrapper">
    <a :href="url" target="_blank" rel="noopener noreferrer" class="notion-bookmark">
      <div class="bookmark-content">
        <div v-if="title" class="bookmark-title">{{ title }}</div>
        <div v-if="description" class="bookmark-description">{{ description }}</div>
        <div class="bookmark-link">
          <img v-if="iconUrl" :src="iconUrl" alt="" class="bookmark-favicon" width="16" height="16" /> <!-- Add width/height -->
          <span>{{ displayUrl }}</span>
        </div>
      </div>
      <div v-if="imageUrl" class="bookmark-image">
        <img :src="imageUrl" alt="Bookmark Preview" loading="lazy" />
      </div>
    </a>
    <!-- Render caption if present -->
    <figcaption v-if="caption && caption.length > 0" class="bookmark-caption">
      <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </div>
   <div v-else class="notion-unsupported">
      [Bookmark block data is missing URL]
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.notion-bookmark-wrapper {
    margin: var.$space-lg 0;
}

a.notion-bookmark {
  display: flex;
  border: 1px solid var(--separator-primary);
  border-radius: var.$radius-sm;
  overflow: hidden;
  text-decoration: none;
  color: inherit; // Inherit text color
  background-color: var(--bg-primary); // Use primary bg
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary); // Slight change on hover
  }
}

.bookmark-content {
  padding: var.$space-lg var.$space-xl;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; // Center content vertically if image is short
  min-width: 0; // Prevent content from overflowing container
}

.bookmark-title {
  font-weight: var.$font-weight-medium;
  margin-bottom: var.$space-xs;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; // Add ellipsis for long titles
  font-size: var.$font-size-body; // Use body size for title
}

.bookmark-description {
  font-size: var.$font-size-footnote;
  color: var(--text-secondary);
  margin-bottom: var.$space-md;
  // Limit description lines
  display: -webkit-box;
  -webkit-line-clamp: 2; // Show max 2 lines
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; // Adjust line height for clamping
  min-height: calc(1.4em * 2); // Reserve space for two lines
}

.bookmark-link {
  display: flex;
  align-items: center;
  gap: var.$space-sm;
  font-size: var.$font-size-caption1;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: auto; // Push link to bottom if content is short

  .bookmark-favicon {
    width: 16px;
    height: 16px;
    object-fit: contain; // Prevent distortion
    flex-shrink: 0; // Prevent icon from shrinking
  }
}

.bookmark-image {
  flex-shrink: 0; // Prevent image from shrinking
  width: 120px; // Adjust image width as desired
  max-height: 120px; // Limit image height to roughly match content height
  overflow: hidden;
  background-color: var(--bg-secondary); // Placeholder bg

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; // Cover the area
  }
}

.bookmark-caption {
    font-size: var.$font-size-caption1;
    color: var(--text-secondary);
    text-align: left; // Align caption with the block
    margin-top: var.$space-sm;
    padding: 0 var.$space-xs;
}

.notion-unsupported { // Copied from NotionUnsupported for consistency
  border: 1px dashed var(--color-warning);
  padding: var.$space-md;
  margin: var.$space-lg 0;
  font-size: var.$font-size-caption1;
  color: var(--text-secondary);
}
</style>