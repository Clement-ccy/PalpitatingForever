<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import blogsData from '@/data/blogs.json'; // Import the fetched blog data
// Import the Notion block renderer component
import NotionBlockRenderer from '@/components/common/NotionBlockRenderer.vue';

const props = defineProps({
  id: String, // Accept ID from route params
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
  let foundPost = null;

  console.log("Route params received:", route.params); // Log all params
  console.log("Props received:", props); // Log props

  if (props.id) {
    console.log(`Finding post by ID: ${props.id}`);
    foundPost = blogsData.find(p => p.id === props.id);
    if (!foundPost) {
        console.error(`Post with ID "${props.id}" not found.`);
    }
  } else if (props.category && props.slug) {
    const fullSlug = `${props.category}/${props.slug}`;
    console.log(`Finding post by category/slug: ${fullSlug}`);
    // Assuming blogsData has a 'slug' field combining category/slug or similar unique identifier
    // If not, adjust the find logic based on your actual data structure for slugs.
    // For now, let's assume 'slug' property exists and is unique like 'category/slug'
    foundPost = blogsData.find(p => p.slug === fullSlug); // Adjust find logic if needed
     if (!foundPost) {
        console.error(`Post with slug "${fullSlug}" not found.`);
     }
  } else {
    console.error("Insufficient parameters to find post. Need either 'id' or both 'category' and 'slug'.");
    error.value = '无法确定要加载的文章。';
  }


  if (foundPost) {
    post.value = foundPost;
    console.log('Post found:', post.value.title);
  } else if (!error.value) { // Set error only if not already set by param check
    error.value = '博客文章未找到。';
  }

  isLoading.value = false;
};

// Fetch post when component mounts and when route params change
// Using watch on route.params ensures reactivity if props aren't immediately updated
watch(() => route.params, findPost, { immediate: true, deep: true }); // Use immediate: true to load on initial mount

</script>

<template>
  <div class="container section blog-post-detail">
    <div v-if="isLoading">正在加载文章...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <article v-else-if="post">
      <header class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <!-- Use optional chaining and provide fallbacks -->
          <span v-if="post.publishDate?.start">发布于: {{ new Date(post.publishDate.start).toLocaleDateString() }}</span>
          <span v-else>日期未知</span>
          <span v-if="post.mainCategory">分类: {{ post.mainCategory }}</span>
          <span v-if="post.tags && post.tags.length > 0">标签: {{ post.tags.join(', ') }}</span>
        </div>
      </header>
      <div class="post-content">
        <!-- Render the Notion blocks -->
        <NotionBlockRenderer v-if="post.blocks" :blocks="post.blocks" />
        <p v-else>文章内容为空。</p>
      </div>
    </article>
    <div v-else>文章数据似乎丢失了。</div> <!-- This case might be redundant now -->
  </div>
</template>

<style scoped lang="scss">
.blog-post-detail {
  // Add specific styling for blog post details
}

.post-header {
  margin-bottom: var(--space-xxxl);
  border-bottom: 1px solid var(--separator-primary);
  padding-bottom: var(--space-xl);

  h1 {
    margin-bottom: var(--space-md);
    color: var(--text-primary); // Ensure text color respects theme
  }
}

.post-meta {
  font-size: var(--font-size-footnote);
  color: var(--text-secondary);

  span {
    margin-right: var(--space-lg);
    &:last-child {
      margin-right: 0;
    }
  }
}

.post-content {
  // Styles for the rendered Notion content will primarily be handled
  // by the NotionBlockRenderer component and global styles in pf-ui.
  color: var(--text-primary); // Ensure base text color
  line-height: var(--line-height-loose); // Improve readability
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var(--space-xxxl) 0;
}
</style>