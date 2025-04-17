<template>
  <blockquote class="quote">
    <RichTextRenderer v-for="(textItem, index) in block.quote.rich_text" :key="index" :text-item="textItem" />
  </blockquote>
</template>

<script setup>
import RichTextRenderer from './RichTextRenderer.vue'; // Import the component

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  block: Object
});

// getTextClasses is no longer needed here
</script>

<style scoped>
.quote {
  border-left: 3px solid #e3e2e0; /* Match callout border style */
  padding-left: 1rem;
  margin: 1rem 0;
  color: #37352f; /* Notion's default text color */
  line-height: 1.6;
}
/* Add specific styling for quote colors if needed, e.g., .notion-color-gray */
</style>