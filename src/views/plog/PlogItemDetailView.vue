<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import plogsData from '@/data/plogs.json'; // Import the fetched plog data
import NotionBlockRenderer from '@/components/common/NotionBlockRenderer.vue';

const props = defineProps({
  id: String,   // From /plog/item/:id
  slug: String, // From /plog/:slug
});

const route = useRoute();
const plogItem = ref(null);
const isLoading = ref(true);
const error = ref(null);

const findPlogItem = () => {
  isLoading.value = true;
  error.value = null;
  plogItem.value = null;
  let foundPlog = null;

  console.log("Route params for Plog Detail:", route.params);
  console.log("Props for Plog Detail:", props);

  if (props.id) {
    console.log(`Finding Plog by ID: ${props.id}`);
    foundPlog = plogsData.find(p => p.id === props.id);
  } else if (props.slug) {
    console.log(`Finding Plog by slug: ${props.slug}`);
    foundPlog = plogsData.find(p => p.slug === props.slug);
  } else {
    error.value = '无法确定要加载的 Plog 项目。';
    console.error("Plog Detail: Insufficient parameters. Need 'id' or 'slug'.");
  }

  if (foundPlog) {
    plogItem.value = foundPlog;
    console.log('Plog item found:', plogItem.value.title);
  } else if (!error.value) {
    error.value = 'Plog 项目未找到。';
    console.error(`Plog item not found with id: ${props.id} or slug: ${props.slug}`);
  }
  isLoading.value = false;
};

// Watch for route param changes to re-fetch if needed
// Using watch on route.params directly is often more reliable for reactivity with router props
watch(() => route.params, findPlogItem, { immediate: true, deep: true });

// Fallback if props are not immediately available (though with props:true in router, they should be)
onMounted(() => {
  if (!plogItem.value && !error.value) { // Only run if watch didn't already load it
    findPlogItem();
  }
});

</script>

<template>
  <div class="container section plog-item-detail">
    <div v-if="isLoading" class="loading-message">正在加载 Plog 内容...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <article v-else-if="plogItem">
      <header class="plog-header">
        <h1>{{ plogItem.title }}</h1>
        <div class="plog-meta">
          <span v-if="plogItem.date?.start">拍摄于: {{ new Date(plogItem.date.start).toLocaleDateString() }}</span>
          <span v-if="plogItem.location && plogItem.location.length > 0">
            地点: {{ plogItem.location.map(loc => loc.plain_text).join(', ') }}
          </span>
          <span v-if="plogItem.category && plogItem.category.length > 0">
            分类: {{ plogItem.category.join(', ') }}
          </span>
           <span v-if="plogItem.tags && plogItem.tags.length > 0">
            标签: {{ plogItem.tags.join(', ') }}
          </span>
        </div>
      </header>

      <!-- Render the main visual if it exists and is different from blocks -->
      <!-- Or decide if the main visual is just the first image in blocks -->
      <!-- For now, we focus on rendering all blocks -->

      <div class="plog-content">
        <NotionBlockRenderer v-if="plogItem.blocks && plogItem.blocks.length" :blocks="plogItem.blocks" />
        <p v-else>此 Plog 没有更多内容。</p>
      </div>
    </article>
    <div v-else class="info-message">Plog 数据似乎无法加载。</div>
  </div>
</template>

<style scoped lang="scss">

@use "@/pf-ui/typographism" as typo; // Assuming you have typography mixins/vars

.plog-item-detail {
  padding-top: var(--space-xxl);
  padding-bottom: var(--space-xxl);
}

.plog-header {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--separator-secondary);

  h1 {
    margin-bottom: var(--space-md);
    color: var(--text-primary);
  }
}

.plog-meta {
  color: var(--text-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm) var(--space-lg); // Row and column gap

  span {
    display: inline-flex; // Allows for better alignment if icons were added
    align-items: center;
  }
}

.plog-content {
  margin-top: var(--space-xl);
  // Styling for Notion blocks will be handled by NotionBlockRenderer
  // and its child components, plus global styles.
}

.loading-message,
.error-message,
.info-message {
  text-align: center;
  padding: var(--space-xxxl) 0;
}

.error-message {
  color: var(--color-error);
}
</style>