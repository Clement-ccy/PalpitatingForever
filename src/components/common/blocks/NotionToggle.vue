<script setup>
import { ref } from 'vue';
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

// Check if this toggle block has children blocks
// Note: The fetch script must populate block[type].children for this to work
const hasChildren = props.block.has_children && props.block.toggle.children;

// State to control if the toggle is open or closed
const isOpen = ref(false); // Toggles start closed by default

</script>

<template>
  <details class="notion-toggle" :open="isOpen" @toggle="isOpen = $event.target.open">
    <summary>
      <NotionRichTextRenderer :richText="block.toggle.rich_text" />
    </summary>
    <!-- Conditionally render children only when needed (or always render and let <details> hide) -->
    <!-- Always rendering might be simpler if performance isn't an issue -->
    <div v-if="hasChildren" class="toggle-content">
      <!-- Pass children blocks and increment level -->
      <NotionBlockRenderer :blocks="block.toggle.children" :level="level + 1" />
    </div>
  </details>
</template>

<style scoped lang="scss">


details.notion-toggle {
  margin: var(--space-sm) 0;

  summary {
    cursor: pointer;
    font-weight: var(--font-weight-medium); // Make summary slightly bolder
    padding: var(--space-xs) 0;
    list-style: none; // Remove default marker in some browsers
    position: relative;
    padding-left: var(--space-xl); // Space for custom marker

    // Hide default marker in Webkit browsers
    &::-webkit-details-marker {
        display: none;
    }

    &::before { // Custom marker (e.g., triangle)
      content: '▶';
      position: absolute;
      left: 0;
      top: calc(var(--space-xs) + 0.1em); // Adjust vertical alignment
      font-size: 0.8em;
      color: var(--text-secondary);
      transition: transform 0.2s ease;
      display: inline-block; // Needed for transform
    }

    &:hover {
      opacity: 0.8;
    }
  }

  &[open] > summary::before {
      transform: rotate(90deg); // Rotate marker when open
  }
}

.toggle-content {
  padding-left: var(--space-xl); // Indent content same as marker space
  margin-top: var(--space-sm);
  // Optional: Add a subtle border or background
  // border-left: 2px solid var(--separator-primary);
  // padding-top: var(--space-sm);
  // padding-bottom: var(--space-sm);
}
</style>