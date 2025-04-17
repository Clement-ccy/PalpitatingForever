<template>
  <div class="notion-code-block">
    <!-- Mermaid Diagram -->
    <div v-if="isMermaid" ref="mermaidContainer" class="mermaid">
      {{ codeContent }}
    </div>

    <!-- Standard Code Block -->
    <pre v-else ref="codeContainer"><code :class="codeClass">{{ codeContent }}</code></pre>

    <!-- Caption -->
    <div v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.code.caption" :key="index" :text-item="textItem" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';
import hljs from 'highlight.js';
// Import desired highlight.js languages and styles in your main entry file (e.g., main.js)
// Example: import 'highlight.js/styles/github-dark.css';
import mermaid from 'mermaid';

const props = defineProps({
  block: Object
});

const mermaidContainer = ref(null);
const codeContainer = ref(null);

const language = computed(() => props.block.code?.language?.toLowerCase() || 'plaintext');
const isMermaid = computed(() => language.value === 'mermaid');

// Extract plain text content from rich_text array
const codeContent = computed(() => {
  return props.block.code?.rich_text?.map(text => text.plain_text).join('') || '';
});

const hasCaption = computed(() => props.block.code?.caption?.length > 0);

const codeClass = computed(() => `language-${language.value}`);

const renderMermaid = async () => {
  if (isMermaid.value && mermaidContainer.value && codeContent.value) {
    try {
      // Ensure Mermaid is initialized (consider doing this once globally)
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' }); // Or 'dark', 'forest', etc.
      
      // Clear previous render if any
      mermaidContainer.value.innerHTML = codeContent.value; 
      mermaidContainer.value.removeAttribute('data-processed');

      await mermaid.run({ nodes: [mermaidContainer.value] });
    } catch (error) {
      console.error("Mermaid rendering failed:", error);
      // Display error message or raw code as fallback
      mermaidContainer.value.innerHTML = `<pre>Error rendering Mermaid diagram:\n${codeContent.value}</pre>`;
    }
  }
};

const highlightCode = () => {
  if (!isMermaid.value && codeContainer.value) {
    hljs.highlightElement(codeContainer.value.querySelector('code'));
  }
};

onMounted(() => {
  renderMermaid();
  highlightCode();
});

// Watch for changes in code content or language
watch([codeContent, language], () => {
  // Use nextTick if necessary to ensure DOM is updated before rendering/highlighting
  renderMermaid();
  highlightCode();
});

</script>

<style scoped>
.notion-code-block {
  margin: 1em 0;
  position: relative;
}

pre {
  background-color: #f5f5f5; /* Light background for code */
  color: #333;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Source Code Pro', monospace; /* Monospaced font */
  font-size: 0.9em;
  line-height: 1.5;
}

/* Add styles for dark mode if needed */
/* @media (prefers-color-scheme: dark) {
  pre {
    background-color: #2d2d2d; 
    color: #ccc;
  }
} */

/* Style for hljs */
pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
  background: #f5f5f5; /* Match pre background */
  color: #333; /* Match pre color */
}

.mermaid {
  background-color: #ffffff; /* Background for mermaid diagrams */
  padding: 1em;
  border-radius: 4px;
  text-align: center; /* Center diagram */
  overflow-x: auto;
}

.caption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  text-align: center;
}
</style>