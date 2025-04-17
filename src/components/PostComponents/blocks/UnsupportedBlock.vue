<template>
  <div class="unsupported-block">
    <p>[Unsupported Block Type: {{ block.type }}]</p>
    <!-- Optionally display raw block data for debugging -->
    <!-- <pre>{{ JSON.stringify(block, null, 2) }}</pre> -->
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  block: Object
});
</script>

<style scoped>
.unsupported-block {
  border: 1px solid red;
  background-color: #ffebee;
  color: red;
  padding: 1rem;
  margin: 1rem 0;
  font-style: italic;
}
pre {
  font-size: 0.8em;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>