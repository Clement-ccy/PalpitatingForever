<template>
  <div class="notion-renderer">
    <!-- Pass processedBlocks specifically to ToC component -->
    <component
      v-for="block in processedBlocks"
      :is="getComponent(block.type)"
      :key="block.id"
      :block="block"
      :allBlocks="
        block.type === 'table_of_contents' ? processedBlocks : undefined
      "
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

// Core Blocks
import TextBlock from "./blocks/TextBlock.vue";
import ImageBlock from "./blocks/ImageBlock.vue";
import CodeBlock from "./blocks/CodeBlock.vue";
import CalloutBlock from "./blocks/CalloutBlock.vue";
import QuoteBlock from "./blocks/QuoteBlock.vue";
import DividerBlock from "./blocks/DividerBlock.vue";
import TableOfContentsBlock from "./blocks/TableOfContentsBlock.vue";
import ColumnListBlock from "./blocks/ColumnListBlock.vue";
import UnsupportedBlock from "./blocks/UnsupportedBlock.vue";

// List Blocks
import BulletedListBlock from "./blocks/BulletedListBlock.vue";
import NumberedListBlock from "./blocks/NumberedListBlock.vue";
// Note: ListItemBlock is used internally by list wrappers

// New Blocks
import TableBlock from "./blocks/TableBlock.vue";
import VideoBlock from "./blocks/VideoBlock.vue";
import AudioBlock from "./blocks/AudioBlock.vue";
import FileBlock from "./blocks/FileBlock.vue";
import BookmarkBlock from "./blocks/BookmarkBlock.vue";
import EquationBlock from "./blocks/EquationBlock.vue"; // Block-level equation
import EmbedBlock from "./blocks/EmbedBlock.vue";

const props = defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
});

// Group consecutive list items
const processedBlocks = computed(() => {
  if (!props.blocks) return [];

  const grouped = [];
  let currentList = null;

  for (const block of props.blocks) {
    const isBulleted = block.type === "bulleted_list_item";
    const isNumbered = block.type === "numbered_list_item";

    if (isBulleted || isNumbered) {
      const listType = isBulleted ? "bulleted_list" : "numbered_list";
      if (currentList && currentList.type === listType) {
        // Add to existing list
        currentList.items.push(block);
      } else {
        // Start a new list
        currentList = {
          id: block.id + "_list", // Generate a unique ID for the list group
          type: listType,
          items: [block],
        };
        grouped.push(currentList);
      }
    } else {
      // Not a list item, push directly and reset current list
      grouped.push(block);
      currentList = null;
    }
  }
  return grouped;
});

const getComponent = (type) => {
  const components = {
    // Standard Blocks
    paragraph: TextBlock,
    heading_1: TextBlock,
    heading_2: TextBlock,
    heading_3: TextBlock,
    callout: CalloutBlock,
    quote: QuoteBlock,
    divider: DividerBlock,
    image: ImageBlock,
    code: CodeBlock,
    table_of_contents: TableOfContentsBlock,
    column_list: ColumnListBlock,

    // List Blocks (Grouped)
    bulleted_list: BulletedListBlock,
    numbered_list: NumberedListBlock,

    // New Blocks
    table: TableBlock,
    video: VideoBlock,
    audio: AudioBlock,
    file: FileBlock,
    bookmark: BookmarkBlock,
    equation: EquationBlock, // Block-level equation
    embed: EmbedBlock,

    // Fallback
    unsupported: UnsupportedBlock,
  };
  // Fallback to UnsupportedBlock for unmapped types
  return components[type] || UnsupportedBlock;
};
</script>

<!-- No specific styles needed for the renderer itself -->
<style scoped>
.notion-renderer {
  /* Add any global styles for the rendered content area if needed */
  line-height: 1.6; /* Example base line-height */
  color: #37352f; /* Example base text color */
}
</style>
