<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const embedData = computed(() => props.block.embed);
const embedUrl = computed(() => embedData.value?.url);
const caption = computed(() => embedData.value?.caption);

// Basic check for common video platforms to potentially use aspect ratio
const isVideoEmbed = computed(() => {
    if (!embedUrl.value) return false;
    try {
        const url = new URL(embedUrl.value); // Use URL constructor for robust parsing
        const hostname = url.hostname.toLowerCase();
        return hostname.includes('youtube.com') || hostname.includes('youtu.be') || hostname.includes('vimeo.com');
    } catch (e) {
        // Invalid URL format
        console.error("Invalid URL for embed:", embedUrl.value, e);
        return false;
    }
});

</script>

<template>
  <figure v-if="embedUrl" class="notion-embed" :class="{ 'is-video': isVideoEmbed }">
    <div class="embed-wrapper">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms"
        loading="lazy"
        title="Embedded Content"
      ></iframe>
    </div>
    <figcaption v-if="caption && caption.length > 0">
      <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </figure>
   <div v-else class="notion-unsupported">
      [Embed block data is missing or invalid URL]
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

figure.notion-embed {
  margin: var.$space-xl 0;

  .embed-wrapper {
    position: relative;
    width: 100%;
    // Default height or aspect ratio for non-video embeds
    height: 450px; // Example fixed height, adjust as needed
    background-color: var(--bg-secondary); // Placeholder background
    border-radius: var.$radius-sm; // Optional
    overflow: hidden; // Ensure iframe respects border radius

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  // Apply aspect ratio specifically for video embeds
  &.is-video .embed-wrapper {
    // padding-bottom: 56.25%; // 16:9 aspect ratio
    aspect-ratio: 16 / 9; // Use modern aspect-ratio property
    height: auto; // Height is determined by aspect ratio
    background-color: #000; // Black bg for videos
  }

  figcaption {
    font-size: var.$font-size-caption1;
    color: var(--text-secondary);
    text-align: center;
    margin-top: var.$space-sm;
    padding: 0 var.$space-md;
  }
}
.notion-unsupported { // Copied from NotionUnsupported for consistency
  border: 1px dashed var(--color-warning);
  padding: var.$space-md;
  margin: var.$space-lg 0;
  font-size: var.$font-size-caption1;
  color: var(--text-secondary);
}
</style>