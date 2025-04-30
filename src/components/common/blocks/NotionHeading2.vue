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
  <h2>
    <NotionRichTextRenderer :richText="block.heading_2.rich_text" />
  </h2>
</template>

<style scoped lang="scss">
/* Add specific h2 styles here if needed beyond global 'h2' styles */
</style>