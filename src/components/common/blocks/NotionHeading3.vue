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
  <h3>
    <NotionRichTextRenderer :richText="block.heading_3.rich_text" />
  </h3>
</template>

<style scoped lang="scss">
/* Add specific h3 styles here if needed beyond global 'h3' styles */
</style>