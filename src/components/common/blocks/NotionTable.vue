<script setup>
import { computed } from 'vue';
import NotionRichTextRenderer from '../NotionRichTextRenderer.vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const tableData = computed(() => props.block.table);
const hasColumnHeader = computed(() => tableData.value?.has_column_header || false);
// Note: Notion API might not explicitly provide row headers in the same way,
// often the first cell of a row acts as a header conceptually.
// We'll assume standard td for now unless specific logic is needed.
// const hasRowHeader = computed(() => tableData.value?.has_row_header || false);

// The actual rows are children of the table block, populated by fetch script
// Ensure the fetch script correctly adds children to block.table.children
const tableRows = computed(() => props.block.table?.children || []);

const headerRow = computed(() => {
    // Ensure there are rows before accessing index 0
    return hasColumnHeader.value && tableRows.value.length > 0 ? tableRows.value[0] : null;
});
const bodyRows = computed(() => {
    return hasColumnHeader.value ? tableRows.value.slice(1) : tableRows.value;
});

</script>

<template>
  <div class="notion-table-wrapper">
    <table>
      <thead v-if="headerRow">
        <tr>
          <!-- Render header cells -->
          <th v-for="(cell, index) in headerRow.table_row.cells" :key="`${block.id}-header-${index}`">
            <NotionRichTextRenderer :richText="cell" />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Render body rows -->
        <tr v-for="row in bodyRows" :key="row.id">
          <!-- Render cells for each row -->
          <td v-for="(cell, index) in row.table_row.cells" :key="`${row.id}-cell-${index}`">
             <NotionRichTextRenderer :richText="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.notion-table-wrapper {
  overflow-x: auto; // Allow horizontal scrolling for wide tables
  margin: var.$space-lg 0;
  max-width: 100%;
  border: 1px solid var(--separator-primary); // Add border to wrapper for better scroll context
  border-radius: var.$radius-sm; // Optional radius for wrapper
}

table {
  width: 100%; // Make table take full width of wrapper
  border-collapse: collapse; // Collapse borders
  border-spacing: 0;
  font-size: var.$font-size-footnote; // Tables often use smaller text
  // border: 1px solid var(--separator-primary); // Outer border moved to wrapper

  th, td {
    border: 1px solid var(--separator-primary); // Cell borders
    padding: var.$space-sm var.$space-md;
    text-align: left;
    vertical-align: top; // Align content to top
    // Ensure rich text inside doesn't add extra margins
    :deep(p:last-child) {
        margin-bottom: 0;
    }
  }

  thead {
    background-color: var(--bg-secondary); // Header background
    th {
      font-weight: var.$font-weight-semibold; // Bolder header text
      vertical-align: middle; // Center header text vertically
      position: sticky; // Make header sticky within the wrapper
      top: 0; // Stick to the top of the wrapper
      z-index: 1; // Ensure header stays above body during scroll
      background-color: inherit; // Inherit thead background
    }
  }

  tbody {
    tr:nth-child(even) {
      // Optional: Zebra striping for readability
      // background-color: rgba(var.$light-text-primary, 0.03);
      // [data-theme="dark"] & {
      //    background-color: rgba(var.$dark-text-primary, 0.05);
      // }
    }
  }
}
</style>