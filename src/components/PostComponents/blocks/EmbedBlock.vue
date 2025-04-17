<template>
  <figure class="notion-embed-block">
    <div class="embed-container">
      <iframe
        v-if="block.embed?.url"
        :src="block.embed.url"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
        loading="lazy"
        title="Embedded Content"
      ></iframe>
      <div v-else class="media-placeholder">Embed source URL not available.</div>
    </div>
    <figcaption v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.embed.caption" :key="index" :text-item="textItem" />
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const hasCaption = computed(() => props.block.embed?.caption?.length > 0);

// Note: The sandbox attribute restricts functionality for security. 
// You might need to adjust it based on the embed source if things don't work.

</script>

<style scoped>
.notion-embed-block {
  margin: 1.5em 0;
}

.embed-container {
  position: relative;
  width: 100%;
  /* Default aspect ratio for embeds, adjust as needed */
  /* Example: 16:9 aspect ratio */
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  background-color: #eee; /* Placeholder background */
  border-radius: 3px;
}

.embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none; /* Ensure no iframe border */
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
  position: absolute; /* Position inside container */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>