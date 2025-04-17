<template>
  <figure class="notion-audio-block">
    <audio v-if="audioUrl" controls :src="audioUrl">
      Your browser does not support the audio element.
    </audio>
    <div v-else class="media-placeholder">Audio source not available.</div>
    <figcaption v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.audio.caption" :key="index" :text-item="textItem" />
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const audioUrl = computed(() => {
  // Note: Notion 'file' type URLs often expire.
  // Consider a proxy or alternative handling for long-term access.
  if (props.block.audio?.type === 'file') {
    return props.block.audio.file.url;
  }
  if (props.block.audio?.type === 'external') {
    return props.block.audio.external.url;
  }
  return '';
});

const hasCaption = computed(() => props.block.audio?.caption?.length > 0);

</script>

<style scoped>
.notion-audio-block {
  margin: 1em 0;
}

audio {
  width: 100%; /* Make audio player take full width */
  display: block;
  margin-bottom: 0.5em; /* Space before caption */
}

.caption {
  font-size: 0.9em;
  color: #666;
  text-align: left; /* Align caption below player */
  line-height: 1.4;
}

.media-placeholder {
  border: 1px dashed #ccc;
  padding: 1rem;
  text-align: center;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 3px;
}
</style>