<template>
  <li>
    <!-- Render rich text using RichTextRenderer -->
    <RichTextRenderer v-for="(textItem, index) in richText" :key="index" :text-item="textItem" />
    <!-- TODO: Handle nested children if any (requires recursive rendering or fetching) -->
  </li>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  block: Object
});

// Get the rich_text array based on block type
const richText = computed(() => {
  const type = props.block.type; // 'bulleted_list_item' or 'numbered_list_item'
  // Correctly check for rich_text existence
  if (props.block[type] && props.block[type].rich_text) {
    return props.block[type].rich_text;
  }
  return [];
});

// getTextClasses is no longer needed here
</script>

<!-- No specific styles needed here unless overriding list item defaults -->