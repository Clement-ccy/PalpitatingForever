<script setup>
// Import the main renderer recursively for column content
import NotionBlockRenderer from '../NotionBlockRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  level: {
      type: Number,
      default: 0
  }
});

// Columns are children of the column_list block
// Ensure fetch script populates block.column_list.children
const columns = props.block.column_list?.children || [];

</script>

<template>
  <div class="notion-column-list">
    <!-- Render each column block -->
    <!-- We don't need a specific NotionColumn component if it just renders its children -->
    <div v-for="columnBlock in columns" :key="columnBlock.id" class="notion-column">
        <!-- Recursively render the blocks *inside* each column -->
        <!-- Ensure columnBlock.column.children exists and is populated by fetch script -->
        <NotionBlockRenderer :blocks="columnBlock.column?.children || []" :level="level + 1" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.notion-column-list {
  display: flex;
  gap: var.$space-xl; // Adjust gap between columns
  margin: var.$space-lg 0;

  // Handle responsive stacking if needed
  @media (max-width: var.$breakpoint-md) { // Stack on medium screens and below
      flex-direction: column;
      gap: 0; // Remove gap when stacked
  }
}

.notion-column {
  flex: 1; // Distribute space equally by default
  min-width: 0; // Prevent columns from overflowing

  // Add margin for stacked view
   @media (max-width: var.$breakpoint-md) {
       margin-bottom: var.$space-lg;
       &:last-child {
           margin-bottom: 0;
       }
   }
}
</style>