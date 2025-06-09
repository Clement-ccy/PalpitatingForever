<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import mlogsData from '@/data/mlogs.json'; // Import the fetched mlog data

const props = defineProps({
  slug: String, // Assuming albums will have a unique slug, otherwise use ID or filter tracks by album property
});

const route = useRoute();
const albumInfo = ref(null); // Could store album-specific info if available
const tracks = ref([]);
const isLoading = ref(true);
const error = ref(null);

const findAlbumTracks = () => {
  isLoading.value = true;
  error.value = null;
  albumInfo.value = null; // Reset album info
  tracks.value = [];
  // TODO: Determine how album slug is generated or if we filter tracks by album property
  // Example: Filtering tracks where the 'album' rich_text property matches the slug
  // This requires the 'album' property in Notion to be consistent and the fetch script to extract it properly.
  const albumSlug = props.slug;
  const foundTracks = mlogsData.filter(track => {
    const albumName = track.album?.map(t => t.plain_text).join('') || '';
    // Simple comparison, might need more robust slug matching (e.g., kebab-case)
    return toKebabCase(albumName) === albumSlug;
  });

  if (foundTracks.length > 0) {
    tracks.value = foundTracks;
    // You might want to extract common album info from the first track if not stored separately
    albumInfo.value = { title: foundTracks[0].album?.map(t => t.plain_text).join('') || albumSlug };
  } else {
    error.value = '专辑或曲目未找到。';
    console.error(`Tracks for album slug "${albumSlug}" not found in mlogs.json`);
  }
  isLoading.value = false;
};

// Helper function (should be moved to utils later)
function toKebabCase(str) {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
}


onMounted(findAlbumTracks);
watch(() => route.params.slug, findAlbumTracks);

</script>

<template>
  <div class="container section mlog-album-detail">
    <div v-if="isLoading">正在加载专辑信息...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <article v-else-if="albumInfo">
      <h1>专辑: {{ albumInfo.title }}</h1>
      <div class="track-list">
        <h2>曲目列表</h2>
        <ul>
          <li v-for="track in tracks" :key="track.id">
            {{ track.title }}
            <!-- Add button to play track using global player -->
          </li>
        </ul>
      </div>
       <!-- Placeholder for potential Notion Block content for album description -->
       <!-- <NotionBlockRenderer :blocks="albumInfo.blocks" /> -->
    </article>
     <div v-else>专辑数据似乎丢失了。</div>
  </div>
</template>

<style scoped lang="scss">


.track-list {
  margin-top: var(--space-xl);
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--separator-primary);
    &:last-child {
      border-bottom: none;
    }
  }
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var(--space-xxxl) 0;
}
</style>