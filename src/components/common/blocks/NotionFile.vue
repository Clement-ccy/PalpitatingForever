<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const fileData = computed(() => props.block.file);

const fileUrl = computed(() => {
  if (!fileData.value) return null;
  if (fileData.value.type === 'external' && fileData.value.external?.url) {
      return fileData.value.external.url;
  } else if (fileData.value.type === 'file' && fileData.value.file?.url) {
      // Notion file URLs might expire, consider this if linking directly
      return fileData.value.file.url;
  }
  return null;
});

// Get filename from rich text caption or from the file object name
const fileName = computed(() => {
    // Notion API provides name directly on the file object now
    if (fileData.value?.name) {
        return fileData.value.name;
    }
    // Fallback to caption if name is missing (less common now)
    if (fileData.value?.caption?.length > 0) {
        return fileData.value.caption[0]?.plain_text;
    }
    return 'Download File'; // Generic fallback
});

const caption = computed(() => fileData.value?.caption); // Keep caption for potential display below link

</script>

<template>
  <div v-if="fileUrl" class="notion-file-wrapper">
    <a :href="fileUrl" target="_blank" rel="noopener noreferrer" download class="notion-file-link">
      <span class="file-icon">📄</span> <!-- Basic file icon -->
      <span class="file-name">{{ fileName }}</span>
    </a>
    <!-- Optional: Display caption separately -->
    <figcaption v-if="caption && caption.length > 0" class="file-caption">
       <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </div>
   <div v-else class="notion-unsupported">
      [File block data is missing or invalid URL]
  </div>
</template>

<style scoped lang="scss">


.notion-file-wrapper {
    margin: var(--space-md) 0;
}

a.notion-file-link {
    display: inline-flex; // Align icon and text
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--separator-primary);
    border-radius: var(--radius-sm);
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    text-decoration: none;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    max-width: 100%; // Prevent overflow

    &:hover {
      background-color: var(--fill-primary);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
}

.file-icon {
    font-size: 1.2em;
    flex-shrink: 0; // Prevent icon from shrinking
}

.file-name {
    font-size: var(--font-size-body);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-caption { // Style like other captions
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    margin-top: var(--space-xs);
    padding-left: var(--space-xs); // Slight indent
}

.notion-unsupported { // Copied from NotionUnsupported for consistency
  border: 1px dashed var(--color-warning);
  padding: var(--space-md);
  margin: var(--space-lg) 0;
  font-size: var(--font-size-caption1);
  color: var(--text-secondary);
}
</style>