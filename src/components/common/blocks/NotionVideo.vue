<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const videoData = computed(() => props.block.video);

const videoUrl = computed(() => {
  if (!videoData.value) return null;
  // Ensure URL exists before returning
  if (videoData.value.type === 'external' && videoData.value.external?.url) {
      return videoData.value.external.url;
  } else if (videoData.value.type === 'file' && videoData.value.file?.url) {
      return videoData.value.file.url;
  }
  return null; // Return null if no valid URL found
});

const caption = computed(() => videoData.value?.caption);

</script>

<template>
  <figure v-if="videoUrl" class="notion-video">
    <div class="video-wrapper">
      <!-- Use playsinline for better mobile experience -->
      <!-- preload="metadata" loads basic info without downloading video -->
      <video controls playsinline preload="metadata">
        <source :src="videoUrl" />
        Your browser does not support the video tag.
      </video>
    </div>
    <figcaption v-if="caption && caption.length > 0">
      <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </figure>
  <div v-else class="notion-unsupported">
      [Video block data is missing or invalid URL]
  </div>
</template>

<style scoped lang="scss">


figure.notion-video {
  margin: var(--space-xl) 0;

  .video-wrapper {
    position: relative;
    // Maintain aspect ratio - 16:9 is common, adjust if needed
    // padding-bottom: 56.25%;
    // Or use aspect-ratio property if browser support allows
    aspect-ratio: 16 / 9;
    height: auto; // Height is determined by aspect ratio
    width: 100%; // Take full width
    overflow: hidden;
    background-color: #000; // Black background while loading
    border-radius: var(--radius-md); // Optional radius

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none; // Remove default border
      display: block; // Ensure no extra space
    }
  }

  figcaption {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    text-align: center;
    margin-top: var(--space-sm);
    padding: 0 var(--space-md);
  }
}
.notion-unsupported { // Copied from NotionUnsupported for consistency
  border: 1px dashed var(--color-warning);
  padding: var(--space-md);
  margin: var(--space-lg) 0;
  font-size: var(--font-size-caption1);
  color: var(--text-secondary);
}
</style>