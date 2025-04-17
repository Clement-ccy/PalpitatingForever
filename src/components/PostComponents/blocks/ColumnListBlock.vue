<template>
  <div class="column-list-container">
    <div v-if="loading" class="loading-placeholder">Loading columns...</div>
    <div v-else-if="error" class="error-placeholder">Error loading column content.</div>
    <div v-else class="column-list" :style="columnListStyle">
      <div v-for="column in columnsWithContent" :key="column.id" class="column">
        <!-- Recursively render content within each column -->
        <NotionRenderer :blocks="column.children" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// IMPORTANT: Assumes queryPageBlocks exists and fetches Notion block children
import { queryPageBlocks } from '@/utils/notion'; // Import the function
import NotionRenderer from '../NotionRenderer.vue'; // Import for recursive rendering

const props = defineProps({
  block: { // The column_list block itself
    type: Object,
    required: true
  }
});

const columnsWithContent = ref([]);
const loading = ref(true);
const error = ref(false);

// Fetch children of the column_list (these are the column blocks)
// Then fetch children for each column block
const fetchColumnsAndContent = async () => {
  loading.value = true;
  error.value = false;
  try {
    // 1. Fetch the direct children (the column blocks) of the column_list
    // Replace with your actual API call function if different
    const columnBlocks = await queryPageBlocks(props.block.id); 

    // 2. For each column block, fetch its children (the actual content)
    const columnsData = await Promise.all(
      columnBlocks
        .filter(col => col.type === 'column') // Ensure it's actually a column block
        .map(async (columnBlock) => {
          const contentBlocks = await queryPageBlocks(columnBlock.id);
          return {
            ...columnBlock, // Keep column block info if needed
            children: contentBlocks // Store the content blocks
          };
        })
    );
    
    columnsWithContent.value = columnsData;

  } catch (err) {
    console.error("Failed to fetch column content:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchColumnsAndContent();
});

// Optional: Style columns dynamically based on count
const columnListStyle = computed(() => {
    const count = columnsWithContent.value.length;
    return {
        // Example: Use CSS Grid for layout
        display: 'grid',
        gridTemplateColumns: `repeat(${count > 0 ? count : 1}, 1fr)`,
        gap: '1.5rem' // Adjust gap between columns
    };
});

</script>

<style scoped>
.column-list-container {
  margin: 1rem 0;
}

.column-list {
  /* Layout handled by computed style (e.g., grid) */
}

.column {
  /* Add styling for individual columns if needed */
  min-width: 0; /* Prevent overflow issues with grid/flex */
}

.loading-placeholder,
.error-placeholder {
  border: 1px dashed #ccc;
  padding: 2rem;
  text-align: center;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 3px;
}
.error-placeholder {
    border-color: red;
    color: red;
    background-color: #ffebee;
}
</style>