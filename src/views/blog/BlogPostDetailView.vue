<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import blogsData from '@/data/blogs.json'; // Import the fetched blog data
// Import the Notion block renderer component
import NotionBlockRenderer from '@/components/common/NotionBlockRenderer.vue';

const props = defineProps({
  category: String,
  slug: String,
});

const route = useRoute();
const post = ref(null);
const isLoading = ref(true);
const error = ref(null);

const findPost = () => {
  isLoading.value = true;
  error.value = null;
  post.value = null;
  const fullSlug = `${props.category}/${props.slug}`;
  console.log(`Finding post with slug: ${fullSlug}`); // Debug log
  const foundPost = blogsData.find(p => p.slug === fullSlug);

  if (foundPost) {
    post.value = foundPost;
    console.log('Post found:', post.value.title); // Debug log
  } else {
    error.value = '博客文章未找到。';
    console.error(`Post with slug "${fullSlug}" not found in blogs.json`);
  }
  isLoading.value = false;
};

// Fetch post when component mounts and when route params change
onMounted(findPost);
watch(() => route.params, findPost, { immediate: false }); // Watch for route changes

</script>

<template>
  <div class="container section blog-post-detail">
    <div v-if="isLoading">正在加载文章...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <article v-else-if="post">
      <header class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span>发布于: {{ new Date(post.publishDate.start).toLocaleDateString() }}</span>
          <span v-if="post.mainCategory">分类: {{ post.mainCategory }}</span>
          <span v-if="post.tags && post.tags.length > 0">标签: {{ post.tags.join(', ') }}</span>
        </div>
      </header>
      <div class="post-content">
        <!-- Render the Notion blocks -->
        <NotionBlockRenderer :blocks="post.blocks" />
      </div>
    </article>
    <div v-else>文章数据似乎丢失了。</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.blog-post-detail {
  // Add specific styling for blog post details
}

.post-header {
  margin-bottom: var.$space-xxxl;
  border-bottom: 1px solid var(--separator-primary);
  padding-bottom: var.$space-xl;

  h1 {
    margin-bottom: var.$space-md;
  }
}

.post-meta {
  font-size: var.$font-size-footnote;
  color: var(--text-secondary);

  span {
    margin-right: var.$space-lg;
    &:last-child {
      margin-right: 0;
    }
  }
}

.post-content {
  // Styles for the rendered Notion content will primarily be handled
  // by the NotionBlockRenderer component and global styles in pf-ui.
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var.$space-xxxl 0;
}
</style>