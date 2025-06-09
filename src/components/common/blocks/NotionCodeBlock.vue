<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';
// Import highlight.js core - languages are registered in main.js
import hljs from 'highlight.js/lib/core';
// Import Mermaid API
import mermaid from 'mermaid';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const codeContent = computed(() => {
  // Code block rich_text usually contains just one segment with the code
  return props.block.code.rich_text?.[0]?.plain_text || '';
});

const language = computed(() => {
  // Normalize mermaid language name if needed (e.g., Notion might use 'diagram')
  const lang = props.block.code.language?.toLowerCase();
  if (lang === 'mermaid' || lang === 'diagram') {
      return 'mermaid';
  }
  return lang || 'plaintext';
});

const codeBlockRef = ref(null); // Ref for the code element (hljs) or container (mermaid)
const uniqueId = computed(() => `mermaid-${props.block.id}`); // Unique ID for mermaid rendering

const renderDiagram = async () => {
  if (language.value === 'mermaid' && codeBlockRef.value) {
    try {
        // Ensure container is empty before rendering
        codeBlockRef.value.innerHTML = '';
        console.log(`Rendering Mermaid diagram: ${uniqueId.value}`);
        // Insert the diagram code directly for Mermaid API
        const { svg } = await mermaid.render(uniqueId.value, codeContent.value);
        codeBlockRef.value.innerHTML = svg;
        console.log(`Mermaid diagram ${uniqueId.value} rendered.`);
    } catch (error) {
        console.error("Mermaid rendering error:", error);
        codeBlockRef.value.innerHTML = `<pre>Mermaid Error: ${error.message}\n\n${codeContent.value}</pre>`;
    }
  } else if (codeBlockRef.value && typeof hljs !== 'undefined') {
    // Handle other languages with Highlight.js
    try {
      // Ensure the class is correct for hljs
      codeBlockRef.value.className = `language-${language.value}`;
      // Set text content before highlighting
      codeBlockRef.value.textContent = codeContent.value;
      hljs.highlightElement(codeBlockRef.value);
    } catch (error) {
      console.error("Highlight.js error:", error);
      // Optionally display raw code on error
      codeBlockRef.value.textContent = codeContent.value;
    }
  } else if (!codeBlockRef.value) {
    console.warn('Code block ref not found during render attempt.');
  } else if (language.value !== 'mermaid') {
    console.warn('hljs object not available during highlight attempt.');
  }
};

onMounted(() => {
    // Initial render might need nextTick if DOM isn't ready immediately
    nextTick(renderDiagram);
});

// Re-render if the block content or language changes
watch([codeContent, language], () => {
    nextTick(renderDiagram);
}, { flush: 'post' }); // Ensure DOM is updated before rendering

</script>

<template>
  <div class="notion-code-block">
    <!-- Use a div container for Mermaid to render SVG into -->
    <!-- Use pre > code for Highlight.js -->
    <div v-if="language === 'mermaid'" ref="codeBlockRef" class="mermaid-container">
      <!-- Mermaid will render SVG here -->
      <!-- Initial placeholder or loading state could go here -->
      Rendering diagram...
    </div>
    <pre v-else><code ref="codeBlockRef" :class="`language-${language}`">{{ codeContent }}</code></pre>
    <!-- Render caption -->
    <figcaption v-if="block.code.caption && block.code.caption.length > 0">
      <NotionRichTextRenderer :richText="block.code.caption" />
    </figcaption>
  </div>
</template>

<style scoped lang="scss">


.notion-code-block {
  position: relative; // For potential copy button positioning
  margin: var(--space-lg) 0; // Add margin to the block itself

  pre, .mermaid-container { // Apply common styles to both
    margin-bottom: 0; // Remove margin if caption exists below
    background-color: var(--bg-secondary); // Ensure background
    padding: var(--space-lg) var(--space-xl);
    border-radius: var(--radius-md);
    overflow-x: auto;
    font-size: var(--font-size-footnote); // Consistent font size
  }

  .mermaid-container {
      // Specific styles for mermaid container
      padding: var(--space-lg); // Mermaid might need padding inside
      line-height: 0; // Prevent extra space from initial text node
      text-align: center; // Center diagram by default

      // Style the generated SVG if necessary
      // Using :deep() as SVG is injected
      :deep(svg) {
          display: inline-block; // Allow centering via text-align
          max-width: 100%; // Ensure responsiveness
          height: auto !important; // Override potential fixed height from mermaid
          line-height: normal; // Reset line-height for SVG content
      }
      // Style error message within mermaid container
      pre {
          background-color: transparent;
          color: var(--color-error);
          padding: 0;
          margin: 0;
          text-align: left;
          font-size: var(--font-size-caption1);
          white-space: pre-wrap;
      }
  }

  code { // Only for hljs
     // Base styles in _typographism.scss
     white-space: pre; // Ensure whitespace is preserved
     // hljs styles are applied via global theme CSS
  }

  figcaption {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    text-align: center;
    margin-top: var(--space-sm);
    padding: 0 var(--space-xl); // Match pre padding
  }

  // Add styles for copy button later
}

/* Import highlight.js theme styles globally or scope them here */
/* Consider importing themes in main.js or App.vue */
/* @import 'highlight.js/styles/github-dark.css'; */

</style>