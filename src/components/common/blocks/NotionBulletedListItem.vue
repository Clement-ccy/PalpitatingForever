<script setup>
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';
// Import the main renderer recursively
import NotionBlockRenderer from '../NotionBlockRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  level: { // Receive nesting level
      type: Number,
      default: 0
  }
});

// Check if this list item has children blocks (for nested lists)
// Note: The fetch script must populate block[type].children for this to work
const hasChildren = props.block.has_children && props.block.bulleted_list_item.children;

</script>

<template>
  <li>
    <NotionRichTextRenderer :richText="block.bulleted_list_item.rich_text" />
    <!-- Recursively render children if they exist -->
    <div v-if="hasChildren" class="nested-list">
      <!-- Pass children blocks and increment level -->
      <NotionBlockRenderer :blocks="block.bulleted_list_item.children" :level="level + 1" />
    </div>
  </li>
</template>

<style scoped lang="scss">


li {
  // Base styles are in _typographism.scss
  // Add specific styles if needed
}

.nested-list {
  // Add indentation or specific styling for nested lists
  // This div wrapper might not be ideal, styling direct ul/ol might be better
  // if list grouping is implemented in the parent renderer.
  margin-left: var(--space-xl); // Example indentation
  margin-top: var(--space-xs); // Space before nested list
}
</style>