<script setup>
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const icon = props.block.callout.icon; // Icon can be emoji or file object
const richText = props.block.callout.rich_text;
// Notion API might provide color information for callout background/border
const color = props.block.callout.color; // e.g., "gray_background"

</script>

<template>
  <div class="notion-callout" :class="color ? `notion-callout-${color}` : ''">
    <div v-if="icon" class="callout-icon">
      <span v-if="icon.type === 'emoji'">{{ icon.emoji }}</span>
      <!-- TODO: Handle file icons if needed -->
      <!-- <img v-if="icon.type === 'file'" :src="icon.file.url" alt="Callout icon" /> -->
      <!-- <img v-if="icon.type === 'external'" :src="icon.external.url" alt="Callout icon" /> -->
    </div>
    <div class="callout-content">
      <NotionRichTextRenderer :richText="richText" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.notion-callout {
  display: flex;
  align-items: flex-start; // Align icon top with text
  gap: var.$space-md;
  padding: var.$space-lg var.$space-xl;
  border-radius: var.$radius-sm;
  margin: var.$space-lg 0;
  background-color: var(--bg-secondary); // Default background

  // Add specific styles based on Notion color names if needed
  // These classes match the :class binding in the template
  // Use rgba for subtle backgrounds that adapt slightly to theme
  &.notion-callout-gray_background { background-color: rgba(120, 120, 128, 0.1); }
  &.notion-callout-brown_background { background-color: rgba(165, 42, 42, 0.1); }
  &.notion-callout-orange_background { background-color: rgba(255, 165, 0, 0.1); }
  &.notion-callout-yellow_background { background-color: rgba(255, 255, 0, 0.1); }
  &.notion-callout-green_background { background-color: rgba(0, 128, 0, 0.1); }
  &.notion-callout-blue_background { background-color: rgba(0, 0, 255, 0.1); }
  &.notion-callout-purple_background { background-color: rgba(128, 0, 128, 0.1); }
  &.notion-callout-pink_background { background-color: rgba(255, 192, 203, 0.2); }
  &.notion-callout-red_background { background-color: rgba(255, 0, 0, 0.1); }
  // Add more as needed based on Notion's color options

  // Dark mode adjustments might be needed if rgba isn't sufficient
  // [data-theme="dark"] & { ... }
}

.callout-icon {
  font-size: 1.2em; // Make icon slightly larger
  line-height: 1.4; // Match text line height for alignment
  margin-top: 0.1em; // Fine-tune vertical alignment
  // Add styles for file icons (img) if implemented
}

.callout-content {
  flex: 1; // Allow text content to take remaining space
  // Ensure nested elements like <p> don't add extra margins if not desired
  // Using :deep() to target potentially nested elements rendered by NotionRichTextRenderer
  :deep(p:last-child) {
      margin-bottom: 0;
  }
}
</style>