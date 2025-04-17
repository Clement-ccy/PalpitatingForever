<template>
  <ul class="bulleted-list">
    <ListItemBlock v-for="item in block.items" :key="item.id" :block="item" />
  </ul>
</template>

<script setup>
import ListItemBlock from './ListItemBlock.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  block: Object // Expects an object with an 'items' array property
});
</script>

<style scoped>
.bulleted-list {
  list-style-type: disc;
  margin-left: 1.5rem; /* Adjust indentation */
  margin-bottom: 0.5rem;
}
</style>