<template>
  <div class="toc" :style="{ color: block.table_of_contents?.color }">
    <h4>Table of Contents</h4>
    <ul v-if="headings.length">
      <li v-for="heading in headings" :key="heading.id" :class="`toc-level-${heading.level}`">
        <a :href="`#${getHeadingId(heading)}`">{{ getHeadingText(heading) }}</a>
      </li>
    </ul>
    <p v-else>No headings found for Table of Contents.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  block: Object, // The ToC block itself
  allBlocks: {    // All processed blocks passed from NotionRenderer
    type: Array,
    default: () => []
  }
});

// Filter for heading blocks and add level information
const headings = computed(() => {
  return props.allBlocks
    .filter(b => b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3')
    .map(h => ({
      ...h,
      level: parseInt(h.type.slice(-1)) // Add level (1, 2, or 3)
    }));
});

// Function to extract plain text from a heading block
const getHeadingText = (headingBlock) => {
  const richText = headingBlock[headingBlock.type]?.rich_text || [];
  return richText.map(rt => rt.plain_text).join('');
};

// Function to generate a URL-friendly ID from heading text or block ID
const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

const getHeadingId = (headingBlock) => {
  const text = getHeadingText(headingBlock);
  // Use slugified text if available, otherwise fallback to block ID
  return slugify(text) || headingBlock.id;
};

</script>

<style scoped>
.toc {
  border: 1px solid #e3e2e0; /* Notion-like border */
  background-color: #fbfbfa; /* Notion-like background */
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 3px;
}
.toc h4 {
    margin-top: 0;
    margin-bottom: 0.75em;
    font-weight: 600;
    font-size: 1.1em;
}
.toc ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.toc li {
  margin-bottom: 0.4em;
}
.toc a {
  text-decoration: none;
  color: inherit; /* Inherit color from .toc */
  transition: opacity 0.2s ease-in-out;
}
.toc a:hover {
  opacity: 0.7;
}

/* Indentation based on heading level */
.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 1.5em; }
.toc-level-3 { padding-left: 3em; }

/* Add styles for Notion colors if needed */
/* Example: .toc[style*="color: gray"] { color: gray; } */
</style>