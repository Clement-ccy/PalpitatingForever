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
  <blockquote>
    <NotionRichTextRenderer :richText="block.quote.rich_text" />
    <!-- Notion API doesn't provide a separate 'cite' field, it might be part of rich_text or a following paragraph -->
  </blockquote>
</template>

<style scoped lang="scss">
/* Add specific blockquote styles here if needed beyond global 'blockquote' styles */
</style>