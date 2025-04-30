<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const audioData = computed(() => props.block.audio);

const audioUrl = computed(() => {
  if (!audioData.value) return null;
  // Ensure URL exists before returning
  if (audioData.value.type === 'external' && audioData.value.external?.url) {
      return audioData.value.external.url;
  } else if (audioData.value.type === 'file' && audioData.value.file?.url) {
      return audioData.value.file.url;
  }
  return null; // Return null if no valid URL found
});

const caption = computed(() => audioData.value?.caption);

</script>

<template>
  <figure v-if="audioUrl" class="notion-audio">
    <audio controls preload="metadata">
      <source :src="audioUrl" />
      Your browser does not support the audio element.
    </audio>
    <figcaption v-if="caption && caption.length > 0">
      <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </figure>
   <div v-else class="notion-unsupported">
      [Audio block data is missing or invalid URL]
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

figure.notion-audio {
  margin: var.$space-lg 0;

  audio {
    width: 100%; // Make player take full width
    display: block;
    // Consider styling the audio player controls for consistency if possible/needed
    // This is browser-dependent, but some basic overrides might work
    border-radius: var.$radius-sm; // Example
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