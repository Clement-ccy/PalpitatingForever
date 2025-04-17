<template>
  <figure class="notion-image-block">
    <img :src="imageUrl" alt="Notion image block" />
    <figcaption v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.image.caption" :key="index" :text-item="textItem" />
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const imageUrl = computed(() => {
  if (props.block.image?.type === 'external') {
    return props.block.image.external.url;
  }
  if (props.block.image?.type === 'file') {
    // Notion's file URLs expire. You might need a server-side proxy
    // or alternative way to handle these if they are not publicly accessible
    // or if you need them to persist long-term.
    return props.block.image.file.url;
  }
  return ''; // Fallback or placeholder image URL
});

const hasCaption = computed(() => props.block.image?.caption?.length > 0);

</script>

<style scoped>
.notion-image-block {
  margin: 1em 0;
  text-align: center; /* Center image and caption */
}

img {
  max-width: 100%;
  height: auto;
  display: block; /* Remove extra space below image */
  margin-left: auto;
  margin-right: auto;
  border-radius: 3px; /* Optional: slight rounding */
}

.caption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  text-align: center;
  line-height: 1.4;
}
</style>