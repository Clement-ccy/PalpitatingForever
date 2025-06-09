<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'; // Import nextTick
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const expression = ref(props.block.equation?.expression || '');
const equationRef = ref(null);
const errorMsg = ref('');

const renderEquation = () => {
  errorMsg.value = ''; // Clear previous error
  const currentExpression = expression.value; // Use ref value

  if (equationRef.value && currentExpression) {
    try {
      katex.render(currentExpression, equationRef.value, {
        throwOnError: false, // Don't throw, display error message instead
        displayMode: true, // Render as block equation
        // Other KaTeX options can be added here
        // e.g., macros: { "\\RR": "\\mathbb{R}" }
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      errorMsg.value = `KaTeX Error: ${e.message}`;
      // Display the raw expression as fallback inside the ref element
      if(equationRef.value) equationRef.value.textContent = currentExpression;
    }
  } else if (!currentExpression) {
       errorMsg.value = '[Equation block has no expression]';
       if(equationRef.value) equationRef.value.textContent = ''; // Clear previous render
  }
};

onMounted(renderEquation);

// Re-render if the expression changes
watch(() => props.block.equation?.expression, (newExpression) => {
    expression.value = newExpression || '';
    // Wait for DOM update if needed, though KaTeX targets the ref directly
    nextTick(renderEquation);
});

</script>

<template>
  <div class="notion-equation">
    <!-- Use v-once on the span if expression won't change after initial render? -->
    <!-- No, watch handles updates. -->
    <span ref="equationRef" :aria-label="`Math equation: ${expression}`">
        <!-- KaTeX will render here -->
        <!-- Display raw expression as fallback only if KaTeX fails -->
        {{ errorMsg ? '' : '' }} <!-- Initially empty, KaTeX renders or error shows below -->
    </span>
    <div v-if="errorMsg" class="katex-error">
        {{ errorMsg }}
        <!-- Optionally show raw expression on error -->
        <pre>{{ expression }}</pre>
    </div>
  </div>
</template>

<style scoped lang="scss">


.notion-equation {
  overflow-x: auto; // Allow scrolling for long equations
  padding: var(--space-sm) 0;
  margin: var(--space-md) 0;
  text-align: center; // Center block equations

  // KaTeX styles are imported globally or scoped via :deep() if needed
  // Ensure KaTeX display math has appropriate styling
  :deep(.katex-display) {
      margin: 0; // Reset default KaTeX display margin if needed
  }
}

.katex-error {
    color: var(--color-error);
    font-size: var(--font-size-caption1);
    margin-top: var(--space-xs);
    text-align: center; // Keep error centered
    white-space: pre-wrap; // Ensure error message wraps

    pre { // Style for raw expression shown on error
        margin-top: var(--space-xs);
        font-family: var(--font-family-mono);
        background-color: var(--bg-secondary);
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        display: inline-block; // Keep it centered
        text-align: left;
    }
}
</style>