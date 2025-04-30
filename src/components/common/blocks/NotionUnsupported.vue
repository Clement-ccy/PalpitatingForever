<script setup>
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="notion-unsupported">
    [Unsupported Block Type: {{ block.type }}]
    <!-- <pre>{{ JSON.stringify(block, null, 2) }}</pre> -->
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.notion-unsupported {
  border: 1px dashed var(--color-warning);
  padding: var.$space-md;
  margin: var.$space-lg 0;
  font-size: var.$font-size-caption1;
  color: var(--text-secondary);
  background-color: rgba(var.$light-accent-primary, 0.05); // Subtle background hint

  pre { // Optional debug view
    margin-top: var.$space-sm;
    font-size: 10px;
    max-height: 100px;
    overflow: auto;
    background-color: var(--bg-secondary);
  }
}
</style>