// src/components/common/NotionBlockRenderer.vue
<script setup>
import { defineAsyncComponent, computed } from 'vue';

// Define props
const props = defineProps({
  blocks: {
    type: Array,
    required: true,
    default: () => []
  },
  level: {
      type: Number,
      default: 0
  }
});

// --- Dynamically load block components ---
const blockComponents = {
  paragraph: defineAsyncComponent(() => import('./blocks/NotionParagraph.vue')),
  heading_1: defineAsyncComponent(() => import('./blocks/NotionHeading1.vue')),
  heading_2: defineAsyncComponent(() => import('./blocks/NotionHeading2.vue')),
  heading_3: defineAsyncComponent(() => import('./blocks/NotionHeading3.vue')),
  // List items will be handled by the list components below
  // bulleted_list_item: defineAsyncComponent(() => import('./blocks/NotionBulletedListItem.vue')),
  // numbered_list_item: defineAsyncComponent(() => import('./blocks/NotionNumberedListItem.vue')),
  quote: defineAsyncComponent(() => import('./blocks/NotionQuote.vue')),
  code: defineAsyncComponent(() => import('./blocks/NotionCodeBlock.vue')),
  image: defineAsyncComponent(() => import('./blocks/NotionImage.vue')),
  divider: defineAsyncComponent(() => import('./blocks/NotionDivider.vue')),
  callout: defineAsyncComponent(() => import('./blocks/NotionCallout.vue')),
  toggle: defineAsyncComponent(() => import('./blocks/NotionToggle.vue')),
  video: defineAsyncComponent(() => import('./blocks/NotionVideo.vue')), // Add Video
  embed: defineAsyncComponent(() => import('./blocks/NotionEmbed.vue')), // Add Embed
  // NEW: Components to render grouped lists
  bulleted_list: defineAsyncComponent(() => import('./blocks/NotionBulletedList.vue')),
  numbered_list: defineAsyncComponent(() => import('./blocks/NotionNumberedList.vue')),
  table: defineAsyncComponent(() => import('./blocks/NotionTable.vue')), // Add Table
  bookmark: defineAsyncComponent(() => import('./blocks/NotionBookmark.vue')), // Add Bookmark
  column_list: defineAsyncComponent(() => import('./blocks/NotionColumnList.vue')), // Add Column List
  audio: defineAsyncComponent(() => import('./blocks/NotionAudio.vue')), // Add Audio
  file: defineAsyncComponent(() => import('./blocks/NotionFile.vue')), // Add File
  equation: defineAsyncComponent(() => import('./blocks/NotionEquation.vue')), // Add Equation
  // Note: 'column' block itself doesn't need a component, it's handled by ColumnList
  // Add mappings for other supported block types here
  unsupported: defineAsyncComponent(() => import('./blocks/NotionUnsupported.vue')),
};

// Function to get the correct component based on block type
const getBlockComponent = (blockType) => {
  if (Object.prototype.hasOwnProperty.call(blockComponents, blockType)) {
      return blockComponents[blockType];
  }
  // Handle list items explicitly if they somehow reach here (shouldn't with grouping)
  if (blockType === 'bulleted_list_item' || blockType === 'numbered_list_item') {
      console.warn(`List item block type "${blockType}" encountered outside of a list group.`);
      // Optionally render a fallback or just the item component directly
      // return blockType === 'bulleted_list_item' ? blockComponents.bulleted_list_item : blockComponents.numbered_list_item;
      return blockComponents.unsupported; // Treat as unsupported if ungrouped
  }
  console.warn(`Unsupported Notion block type encountered: ${blockType}. Rendering fallback.`);
  return blockComponents.unsupported;
};

// --- List Grouping Logic ---
const processedBlocks = computed(() => {
    const groupedBlocks = [];
    let currentList = null; // { type: 'bulleted_list' | 'numbered_list', items: [] }

    for (const block of props.blocks) {
        const isBulleted = block.type === 'bulleted_list_item';
        const isNumbered = block.type === 'numbered_list_item';

        if (isBulleted || isNumbered) {
            const listType = isBulleted ? 'bulleted_list' : 'numbered_list';
            // If starting a new list or switching list type
            if (!currentList || currentList.type !== listType) {
                // Push previous list if exists
                if (currentList) {
                    groupedBlocks.push(currentList);
                }
                // Start new list
                currentList = {
                    // Use a unique key based on the first item's ID for the group
                    id: `${listType}-${block.id}`,
                    type: listType,
                    items: [block] // Add the first item
                };
            } else {
                // Add item to existing list
                currentList.items.push(block);
            }
        } else {
            // Not a list item, push any existing list first
            if (currentList) {
                groupedBlocks.push(currentList);
                currentList = null;
            }
            // Push the non-list block
            groupedBlocks.push(block);
        }
    }

    // Push the last list if it exists
    if (currentList) {
        groupedBlocks.push(currentList);
    }

    return groupedBlocks;
});

</script>

<template>
  <div class="notion-blocks-container">
    <!-- Iterate through PROCESSED blocks (with lists grouped) -->
    <component
      v-for="block in processedBlocks"
      :key="block.id"
      :is="getBlockComponent(block.type)"
      :block="block"
      :level="level"
      :items="block.items"
    /> <!-- Pass items specifically for list components -->
  </div>
</template>

<style lang="scss">
.notion-blocks-container {
  > :deep(*) {
      margin-bottom: var(--space-sm); // Default spacing between blocks
       &:last-child {
           margin-bottom: 0;
       }
  }
   // Adjust list margins if needed, considering items might have margins too
   > :deep(ul),
   > :deep(ol) {
       margin-bottom: var(--space-lg);
       // Indentation is handled in _typographism.scss or list components
   }
}
</style>