<script setup>
// Import the list item component
import NotionBulletedListItem from './NotionBulletedListItem.vue';

const props = defineProps({
  // The 'block' prop here represents the grouped list object created by NotionBlockRenderer
  // We might not need the 'block' prop itself if 'items' contains everything.
  // block: {
  //   type: Object,
  //   required: true
  // },
  items: { // The array of actual list item blocks passed from the renderer
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
  <ul>
    <!-- Render each list item using the NotionBulletedListItem component -->
    <NotionBulletedListItem
      v-for="itemBlock in items"
      :key="itemBlock.id"
      :block="itemBlock"
      :level="level"
    />
  </ul>
</template>

<style scoped lang="scss">
ul {
  // Base styles are in _typographism.scss
  // Add specific styles for the list container if needed
  // e.g., adjust margin/padding based on level
  // padding-left: calc(var(--space-xxl) + #{props.level} * var(--space-xl)); // Example dynamic padding
}
</style>