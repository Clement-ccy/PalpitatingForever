<script setup>
// Import the list item component
import NotionNumberedListItem from './NotionNumberedListItem.vue';

const props = defineProps({
  // block: { // Grouped list object (might not be needed)
  //   type: Object,
  //   required: true
  // },
  items: { // Array of numbered_list_item blocks passed from the renderer
    type: Array,
    required: true,
    default: () => []
  },
  level: { // Pass down the level for potential deeper nesting styling
      type: Number,
      default: 0
  }
});
</script>

<template>
  <ol>
    <!-- Render each list item using the NotionNumberedListItem component -->
    <NotionNumberedListItem
      v-for="itemBlock in items"
      :key="itemBlock.id"
      :block="itemBlock"
      :level="level"
    />
  </ol>
</template>

<style scoped lang="scss">
ol {
  // Base styles are in _typographism.scss
  // Add specific styles for the list container if needed
  // e.g., adjust margin/padding based on level
}
</style>