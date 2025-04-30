<script setup>
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <h1>
    <NotionRichTextRenderer :richText="block.heading_1.rich_text" />
  </h1>
</template>

<style scoped lang="scss">
/* Add specific h1 styles here if needed beyond global 'h1' styles */
</style>