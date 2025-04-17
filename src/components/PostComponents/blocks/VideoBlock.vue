<template>
  <figure class="notion-video-block">
    <video v-if="videoUrl" controls :src="videoUrl">
      Your browser does not support the video tag.
    </video>
    <div v-else class="media-placeholder">Video source not available.</div>
    <figcaption v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.video.caption" :key="index" :text-item="textItem" />
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const videoUrl = computed(() => {
  // Note: Notion 'file' type URLs often expire.
  // Consider a proxy or alternative handling for long-term access.
  if (props.block.video?.type === 'file') {
    return props.block.video.file.url;
  }
  if (props.block.video?.type === 'external') {
    return props.block.video.external.url;
  }
  // Add support for other video types (e.g., YouTube via embed URL parsing) if needed
  return '';
});

const hasCaption = computed(() => props.block.video?.caption?.length > 0);

</script>

<style scoped>
.notion-video-block {
  margin: 1em 0;
  text-align: center;
}

video {
  max-width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 3px;
  background-color: #eee; /* Placeholder background */
}

.caption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

.media-placeholder {
  border: 1px dashed #ccc;
  padding: 2rem;
  text-align: center;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 3px;
}
</style>