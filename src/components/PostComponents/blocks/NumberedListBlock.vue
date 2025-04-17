<template>
  <ol class="numbered-list">
    <ListItemBlock v-for="item in block.items" :key="item.id" :block="item" />
  </ol>
</template>

<script setup>
import ListItemBlock from './ListItemBlock.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  block: Object // Expects an object with an 'items' array property
});
</script>

<style scoped>
.numbered-list {
  list-style-type: decimal;
  margin-left: 1.5rem; /* Adjust indentation */
  margin-bottom: 0.5rem;
}
</style>