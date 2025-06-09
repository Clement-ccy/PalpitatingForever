<script setup>
import PhotoWaterfall from '@/components/plog/PhotoWaterfall.vue';
// No need to import plogsData here as the component handles it internally for now
</script>

<template>
  <div class="plog-all-photos-view"> <!-- Use a more specific class -->
    <!-- Optional: Add a title or header if needed outside the component -->
    <!-- <h1>所有照片</h1> -->
    <PhotoWaterfall /> <!-- Use the waterfall component -->
  </div>
</template>

<style scoped lang="scss">

.plog-all-photos-view {
  // The main styling is within the PhotoWaterfall component.
  // Add padding or margins here if needed to position the waterfall within the view.
  // For example, to match the blog post detail padding:
  // padding: var(--space-xl) var(--space-lg);
  min-height: calc(100vh - var(--header-height, 0px) - var(--player-height, 60px)); // Ensure view takes height
  background-color: var(--bg-primary); // Match theme background
}
</style>