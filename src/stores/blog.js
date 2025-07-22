// src/stores/blog.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  transformBlogPosts,
  getPublishedPosts,
  getFeaturedPosts,
  groupPostsByCategory,
  getCategories,
  getTags,
  getBlogStats
} from '@/utils/dataTransformers';

export const useBlogStore = defineStore('blog', () => {
  // 状态
  const rawPosts = ref([]); // 原始 Notion 数据
  const isLoading = ref(false);
  const error = ref(null);
  const lastUpdated = ref(null);

  // 计算属性 - 转换后的数据
  const posts = computed(() => transformBlogPosts(rawPosts.value));
  const publishedPosts = computed(() => getPublishedPosts(posts.value));
  const featuredPosts = computed(() => getFeaturedPosts(publishedPosts.value, 5));
  const recentPosts = computed(() => publishedPosts.value.slice(0, 10));
  const categories = computed(() => getCategories(publishedPosts.value));
  const tags = computed(() => getTags(publishedPosts.value));
  const stats = computed(() => getBlogStats(posts.value));
  const postsByCategory = computed(() => groupPostsByCategory(publishedPosts.value));

  // 热门文章 - 可以根据阅读量、点赞等指标计算
  const hotPosts = computed(() => {
    return publishedPosts.value
      .slice(0, 5)
      .map((post, index) => ({
        title: post.title,
        rank: index + 1,
        url: post.url,
        date: post.date
      }));
  });

  // 作者信息 - 可以从配置文件或单独的数据源获取
  const authorInfo = ref({
    name: 'PalpitatingForever',
    description: '分享技术与生活',
    sayhi: '分享技术与生活的点点滴滴',
    avatar: '/src/assets/images/PF.png'
  });

  // 技能数据 - 这部分可能不会频繁变化，可以保持静态或从配置获取
  const skills = ref([
    { title: 'Vue.js', icon: '🖼️', color: '#4FC08D' },
    { title: 'React', icon: '⚛️', color: '#61DAFB' },
    { title: 'TypeScript', icon: '📘', color: '#3178C6' },
    { title: 'Node.js', icon: '🟢', color: '#339933' },
    { title: 'Python', icon: '🐍', color: '#3776AB' },
    { title: 'Design', icon: '🎨', color: '#FF6B6B' },
    { title: 'Photography', icon: '📷', color: '#FFA726' },
    { title: 'Music', icon: '🎵', color: '#9C27B0' },
    { title: 'Travel', icon: '✈️', color: '#2196F3' },
    { title: 'Coffee', icon: '☕', color: '#8D6E63' },
    { title: 'Books', icon: '📚', color: '#FF9800' },
    { title: 'Games', icon: '🎮', color: '#E91E63' }
  ]);

  // 动作
  async function loadBlogData() {
    if (isLoading.value) return;
    
    isLoading.value = true;
    error.value = null;

    try {
      // 动态导入 JSON 数据
      const blogsModule = await import('@/data/blogs.json');
      rawPosts.value = blogsModule.default || blogsModule;
      lastUpdated.value = new Date().toISOString();
      
      console.log(`✅ 成功加载 ${rawPosts.value.length} 篇博客文章`);
    } catch (err) {
      error.value = `加载博客数据失败: ${err.message}`;
      console.error('❌ 加载博客数据失败:', err);
      
      // 如果加载失败，使用默认数据避免页面崩溃
      rawPosts.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // 根据 ID 获取文章
  function getPostById(id) {
    return posts.value.find(post => post.id === id);
  }

  // 根据 slug 获取文章
  function getPostBySlug(slug) {
    return posts.value.find(post => post.slug === slug);
  }

  // 根据分类获取文章
  function getPostsByCategory(categoryName) {
    if (categoryName === '精选') {
      return featuredPosts.value;
    }
    if (categoryName === '全部文章') {
      return publishedPosts.value;
    }
    return publishedPosts.value.filter(post => post.category === categoryName);
  }

  // 根据标签获取文章
  function getPostsByTag(tagName) {
    return publishedPosts.value.filter(post => 
      post.tags && post.tags.includes(tagName)
    );
  }

  // 搜索文章
  function searchPosts(query) {
    if (!query) return publishedPosts.value;
    
    const lowerQuery = query.toLowerCase();
    return publishedPosts.value.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.category.toLowerCase().includes(lowerQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  // 刷新数据
  async function refreshData() {
    console.log('🔄 刷新博客数据...');
    await loadBlogData();
  }

  // 获取数据状态信息
  const dataStatus = computed(() => ({
    isLoading: isLoading.value,
    error: error.value,
    lastUpdated: lastUpdated.value,
    totalPosts: rawPosts.value.length,
    publishedCount: publishedPosts.value.length,
    hasData: rawPosts.value.length > 0
  }));

  return {
    // 状态
    rawPosts,
    isLoading,
    error,
    lastUpdated,

    // 计算属性 - 处理后的数据
    posts,
    publishedPosts,
    featuredPosts,
    recentPosts,
    categories,
    tags,
    stats,
    postsByCategory,
    hotPosts,
    authorInfo,
    skills,
    dataStatus,

    // 方法
    loadBlogData,
    refreshData,
    getPostById,
    getPostBySlug,
    getPostsByCategory,
    getPostsByTag,
    searchPosts
  };
});