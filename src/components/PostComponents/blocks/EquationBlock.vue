<template>
  <div class="notion-equation-block" ref="katexContainer">
    <!-- KaTeX will render here -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import katex from 'katex';
// Ensure katex.min.css is imported, likely already done in RichTextRenderer or globally

const props = defineProps({
  block: Object
});

const katexContainer = ref(null);

const renderKatex = () => {
  if (props.block.equation?.expression && katexContainer.value) {
    try {
      katex.render(props.block.equation.expression, katexContainer.value, {
        throwOnError: false, // Don't throw errors, display fallback
        displayMode: true // Render as display block
      });
    } catch (error) {
      console.error('KaTeX block rendering error:', error);
      // Display raw expression as fallback on error
      katexContainer.value.textContent = props.block.equation.expression;
      katexContainer.value.style.color = 'red'; // Indicate error
    }
  }
};

onMounted(() => {
  renderKatex();
});

// Re-render if the expression changes
watch(() => props.block.equation?.expression, () => {
  renderKatex();
});

</script>

<style scoped>
.notion-equation-block {
  margin: 1em 0;
  padding: 0.5em 0; /* Add some vertical padding */
  overflow-x: auto; /* Handle potential horizontal overflow */
  text-align: center; /* Center the equation block */
}
/* KaTeX styles are imported globally or via RichTextRenderer */
</style>