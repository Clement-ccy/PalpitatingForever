<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import plogsData from '@/data/plogs.json'; // Import the fetched plog data

const props = defineProps({
  slug: String, // Assuming plog items will have a unique slug, otherwise use ID
});

const route = useRoute();
const plogItem = ref(null);
const isLoading = ref(true);
const error = ref(null);

const findPlogItem = () => {
  isLoading.value = true;
  error.value = null;
  plogItem.value = null;
  // TODO: Determine how slug is generated or if we should use ID
  // For now, let's assume we filter by ID if slug prop matches Notion ID format
  // Or if you add a 'slug' property to your Plog Notion DB and fetch script
  const foundItem = plogsData.find(p => p.id === props.slug); // Example: using ID as slug for now

  if (foundItem) {
    plogItem.value = foundItem;
  } else {
    error.value = '摄影作品未找到。';
    console.error(`Plog item with slug/ID "${props.slug}" not found in plogs.json`);
  }
  isLoading.value = false;
};

onMounted(findPlogItem);
watch(() => route.params.slug, findPlogItem);

</script>

<template>
  <div class="container section plog-item-detail">
    <div v-if="isLoading">正在加载摄影作品...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <article v-else-if="plogItem">
      <h1>{{ plogItem.title }}</h1>
      <div v-if="plogItem.imageFile">
        <img :src="plogItem.imageFile.url" :alt="plogItem.title">
        <!-- Add more details like description, date, location, tags -->
        <p v-if="plogItem.notes && plogItem.notes.length > 0">
          {{ plogItem.notes.map(t => t.plain_text).join('') }}
        </p>
         <div class="plog-meta">
          <span v-if="plogItem.date">拍摄于: {{ new Date(plogItem.date.start).toLocaleDateString() }}</span>
          <span v-if="plogItem.location && plogItem.location.length > 0">地点: {{ plogItem.location.map(t => t.plain_text).join('') }}</span>
          <span v-if="plogItem.category && plogItem.category.length > 0">分类: {{ plogItem.category.join(', ') }}</span>
        </div>
      </div>
       <!-- Placeholder for potential Notion Block content if needed -->
       <!-- <NotionBlockRenderer :blocks="plogItem.blocks" /> -->
    </article>
     <div v-else>作品数据似乎丢失了。</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.plog-item-detail {
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-bottom: var.$space-xl;
    border-radius: var.$radius-lg; // Add some radius
  }
}

.plog-meta {
  font-size: var.$font-size-footnote;
  color: var(--text-secondary);
  margin-top: var.$space-lg;

  span {
    margin-right: var.$space-lg;
    &:last-child {
      margin-right: 0;
    }
  }
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var.$space-xxxl 0;
}
</style>