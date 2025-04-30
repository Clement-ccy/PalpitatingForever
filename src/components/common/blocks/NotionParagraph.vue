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
  <p>
    <NotionRichTextRenderer :richText="block.paragraph.rich_text" />
  </p>
</template>

<style scoped lang="scss">
/* Add specific paragraph styles here if needed beyond global 'p' styles */
/* For example, handling Notion's paragraph color background */
/*
p[data-color-bg="gray_background"] {
  background-color: #ebeced; // Example
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
*/
</style>