<template>
  <div class="notion-table-container">
    <div v-if="loading" class="loading-placeholder">Loading table...</div>
    <div v-else-if="error" class="error-placeholder">Error loading table content.</div>
    <table v-else class="notion-table">
      <thead v-if="hasColumnHeader">
        <tr v-if="headerRow">
          <th v-for="(cell, cellIndex) in headerRow.table_row.cells" :key="cellIndex">
            <RichTextRenderer v-for="(textItem, textIndex) in cell" :key="textIndex" :text-item="textItem" />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterate over bodyRows -->
        <tr v-for="row in bodyRows" :key="row.id"> 
          <!-- Handle row header if enabled -->
          <template v-if="hasRowHeader">
            <th v-if="row.table_row.cells.length > 0">
              <RichTextRenderer v-for="(textItem, textIndex) in row.table_row.cells[0]" :key="textIndex" :text-item="textItem" />
            </th>
            <td v-for="(cell, cellIndex) in row.table_row.cells.slice(1)" :key="cellIndex">
              <RichTextRenderer v-for="(textItem, textIndex) in cell" :key="textIndex" :text-item="textItem" />
            </td>
          </template>
          <!-- Handle regular rows -->
          <template v-else>
             <td v-for="(cell, cellIndex) in row.table_row.cells" :key="cellIndex">
               <RichTextRenderer v-for="(textItem, textIndex) in cell" :key="textIndex" :text-item="textItem" />
             </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { queryPageBlocks } from '@/utils/notion'; // Assumed import
import RichTextRenderer from './RichTextRenderer.vue';

const props = defineProps({
  block: { // The table block itself
    type: Object,
    required: true
  }
});

const tableRows = ref([]);
const loading = ref(true);
const error = ref(false);

const hasColumnHeader = computed(() => props.block.table?.has_column_header);
const hasRowHeader = computed(() => props.block.table?.has_row_header);

// Separate header row and body rows
const headerRow = computed(() => hasColumnHeader.value ? tableRows.value[0] : null);
// Correctly define bodyRows based on header presence
const bodyRows = computed(() => {
    if (!tableRows.value) return [];
    return hasColumnHeader.value ? tableRows.value.slice(1) : tableRows.value;
});

const fetchTableContent = async () => {
  loading.value = true;
  error.value = false;
  try {
    // Fetch the direct children (table_row blocks) of the table block
    const rows = await queryPageBlocks(props.block.id);
    tableRows.value = rows.filter(r => r.type === 'table_row'); // Ensure they are rows
  } catch (err) {
    console.error("Failed to fetch table content:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTableContent();
});

</script>

<style scoped>
.notion-table-container {
  margin: 1.5em 0;
  overflow-x: auto; /* Allow horizontal scrolling for wide tables */
}
.notion-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e3e2e0; /* Notion-like border */
  font-size: 0.95em;
}
.notion-table th,
.notion-table td {
  border: 1px solid #e3e2e0;
  padding: 0.5em 0.75em;
  vertical-align: top;
  line-height: 1.5;
  min-width: 100px; /* Ensure minimum width for cells */
}
.notion-table th {
  background-color: #f7f7f5; /* Notion-like header background */
  font-weight: 600;
  text-align: left;
}
.notion-table thead th {
    border-bottom-width: 2px; /* Thicker border below header */
}
tbody tr:nth-child(even) {
    background-color: #fbfbfa; /* Subtle striping */
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