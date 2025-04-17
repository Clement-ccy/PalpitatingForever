<template>
  <div class="notion-file-block">
    <a :href="fileUrl" target="_blank" rel="noopener noreferrer" class="file-link">
      <span class="file-icon">📄</span> <!-- Basic file icon -->
      <span class="file-name">{{ fileName }}</span>
    </a>
    <div v-if="hasCaption" class="caption">
      <RichTextRenderer v-for="(textItem, index) in block.file.caption" :key="index" :text-item="textItem" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: Object
});

const fileUrl = computed(() => {
  // Note: Notion 'file' type URLs often expire.
  // Consider a proxy or alternative handling for long-term access.
  if (props.block.file?.type === 'file') {
    return props.block.file.file.url;
  }
  if (props.block.file?.type === 'external') {
    return props.block.file.external.url;
  }
  return '#'; // Fallback link
});

// Use the provided name if available, otherwise try to extract from URL
const fileName = computed(() => {
  if (props.block.file?.name) {
    return props.block.file.name;
  }
  try {
    const url = new URL(fileUrl.value);
    // Get last part of path, decode URI component
    return decodeURIComponent(url.pathname.split('/').pop() || 'Download File');
  } catch (e) {
    return 'Download File'; // Fallback name
  }
});

const hasCaption = computed(() => props.block.file?.caption?.length > 0);

</script>

<style scoped>
.notion-file-block {
  margin: 1em 0;
  border: 1px solid #e3e2e0;
  border-radius: 3px;
  padding: 0.8em 1em;
  background-color: #fbfbfa;
}

.file-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease-in-out;
}
.file-link:hover {
    background-color: #f1f1f1; /* Slight hover effect */
}

.file-icon {
  font-size: 1.2em;
  margin-right: 0.5em;
}

.file-name {
  flex-grow: 1;
  word-break: break-all; /* Prevent long names from overflowing */
}

.caption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
}
</style>