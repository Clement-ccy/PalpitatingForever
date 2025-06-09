<script setup>
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

// Determine image URL based on type (external or file)
const imageUrl = props.block.image.type === 'external'
  ? props.block.image.external.url
  : props.block.image.file.url;

// Get the caption rich text array
const caption = props.block.image.caption;

</script>

<template>
  <figure class="notion-image">
    <!-- TODO: Consider adding loading="lazy" for performance -->
    <img :src="imageUrl" alt="Notion Image" loading="lazy" />
    <!-- Render caption using NotionRichTextRenderer -->
    <figcaption v-if="caption && caption.length > 0">
      <NotionRichTextRenderer :richText="caption" />
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">


figure.notion-image {
  margin: var(--space-xl) 0; // Consistent vertical margin
  
  img {
    max-width: 100%;
    max-height: 600px;
    display: block; // Remove extra space below image
    border-radius: var(--radius-md); // Optional: consistent radius
    margin-left: auto; // Center image if container is wider
    margin-right: auto;
  }

  figcaption {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    text-align: center;
    margin-top: var(--space-sm);
    padding: 0 var(--space-md); // Add some padding
  }
}
</style>