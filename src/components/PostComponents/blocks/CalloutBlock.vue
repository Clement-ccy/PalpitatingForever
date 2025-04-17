<template>
  <div class="callout" :class="`notion-color-${block.callout.color}_background`"> <!-- Use notion-color-* class -->
    <span class="icon" v-if="block.callout.icon">{{ block.callout.icon.type === 'emoji' ? block.callout.icon.emoji : '?' }}</span>
    <div class="text">
      <RichTextRenderer v-for="(textItem, index) in block.callout.rich_text" :key="index" :text-item="textItem" />
    </div>
  </div>
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
.callout {
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.icon {
  margin-right: 0.5rem;
  font-size: 1.25rem; /* Adjust size as needed */
  line-height: 1.3; /* Align icon better with text */
}
.text {
  flex-grow: 1;
}

/* Add background color classes based on Notion's color names */
/* These should match the classes defined in RichTextRenderer.vue or a global CSS file */
/* Example: */
.notion-color-gray_background { background-color: #f1f1f1; border-left: 3px solid #e3e2e0; }
.notion-color-default_background { background-color: #ffffff; border-left: 3px solid #e3e2e0; } /* Assuming default is white */
/* Add other color mappings as needed */
.notion-color-brown_background { background-color: #f3eeee; border-left: 3px solid #e9e1dd; }
.notion-color-orange_background { background-color: #f8f1e9; border-left: 3px solid #fae6d3; }
.notion-color-yellow_background { background-color: #fbf7e9; border-left: 3px solid #fbecc8; }
.notion-color-green_background { background-color: #edf3ec; border-left: 3px solid #ddebe1; }
.notion-color-blue_background { background-color: #e9f0f5; border-left: 3px solid #ddebf1; }
.notion-color-purple_background { background-color: #f2eef5; border-left: 3px solid #e9e4f0; }
.notion-color-pink_background { background-color: #f8eef3; border-left: 3px solid #f5e4ed; }
.notion-color-red_background { background-color: #f9ecee; border-left: 3px solid #f8e2e4; }

</style>