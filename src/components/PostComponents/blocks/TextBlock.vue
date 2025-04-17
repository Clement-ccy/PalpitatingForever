<template>
  <div :class="['notion-block', block.type]">
    <!-- Use dynamic component for h1, h2, h3 with ID -->
    <component :is="headingTag" v-if="isHeading" :id="headingId">
      <RichTextRenderer v-for="(textItem, index) in richText" :key="index" :text-item="textItem" />
    </component>
    <!-- Paragraph -->
    <p v-else>
      <RichTextRenderer v-for="(textItem, index) in richText" :key="index" :text-item="textItem" />
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const isHeading = computed(() => props.block.type.startsWith('heading_'));
const headingTag = computed(() => {
  if (!isHeading.value) return 'p';
  return `h${props.block.type.slice(-1)}`;
});

// Get the rich_text array based on block type
const richText = computed(() => {
  const type = props.block.type;
  if (props.block[type] && props.block[type].rich_text) {
    return props.block[type].rich_text;
  }
  return [];
});

// --- ID Generation Logic (mirrors TableOfContentsBlock) ---
const getHeadingText = (headingBlock) => {
  const rt = headingBlock[headingBlock.type]?.rich_text || [];
  return rt.map(t => t.plain_text).join('');
};

const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const headingId = computed(() => {
  if (!isHeading.value) return null;
  const text = getHeadingText(props.block);
  return slugify(text) || props.block.id; // Fallback to block ID
});
// --- End ID Generation Logic ---

</script>

<style scoped>
.notion-block {
  margin-bottom: 0.5rem;
}
h1, h2, h3 {
    margin-top: 1.2em; /* Slightly more space above headings */
    margin-bottom: 0.3em;
    font-weight: 600;
    scroll-margin-top: 70px; /* Offset for fixed headers when scrolling to ID */
}
h1 { font-size: 1.8em; }
h2 { font-size: 1.5em; }
h3 { font-size: 1.25em; }
p {
    line-height: 1.6;
}
</style>