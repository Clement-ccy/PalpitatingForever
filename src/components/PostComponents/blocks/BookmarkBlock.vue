<template>
  <div class="notion-bookmark-block">
    <a :href="block.bookmark.url" target="_blank" rel="noopener noreferrer" class="bookmark-link">
      <!-- Basic Preview Placeholder -->
      <div class="preview-placeholder">
        <span class="link-icon">🔗</span>
        <span class="url">{{ block.bookmark.url }}</span>
        <!-- TODO: Fetch and display actual title, description, image -->
      </div>
    </a>
    <div v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.bookmark.caption" :key="index" :text-item="textItem" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const hasCaption = computed(() => props.block.bookmark?.caption?.length > 0);

// In a real implementation, you might fetch metadata here:
// onMounted(async () => {
//   try {
//     // const metadata = await fetchBookmarkMetadata(props.block.bookmark.url);
//     // Update component state with title, description, image etc.
//   } catch (error) {
//     console.error("Failed to fetch bookmark metadata:", error);
//   }
// });

</script>

<style scoped>
.notion-bookmark-block {
  margin: 1em 0;
}
.bookmark-link {
  display: block;
  border: 1px solid #e3e2e0;
  border-radius: 3px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease-in-out;
}
.bookmark-link:hover {
    background-color: #fbfbfa;
}
.preview-placeholder {
  padding: 0.8em 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.link-icon {
  font-size: 1.1em;
}
.url {
  flex-grow: 1;
  font-size: 0.9em;
  color: #337ab7; /* Link-like color */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.caption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
  padding: 0 0.2em; /* Slight padding for caption */
}
</style>