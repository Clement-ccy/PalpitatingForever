<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import SkillIconsCard from '@/components/blog/SkillIconsCard.vue'
import BannerContent from '@/components/blog/BannerContent.vue'
import FeaturedPostsSlider from '@/components/blog/FeaturedPostsSlider.vue'
import TodayCard from '@/components/blog/TodayCard.vue'
import CategoryBar from '@/components/blog/CategoryBar.vue'
import PostList from '@/components/blog/PostList.vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import BlogPagination from '@/components/blog/Pagination.vue'

// 使用博客 store
const blogStore = useBlogStore()

// 当前选中的分类
const activeCategory = ref('精选')

// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 10,
  basePath: '/blog'
})

// 计算属性 - 从 store 获取数据
const pageData = computed(() => ({
  skills: blogStore.skills,
  featuredPosts: blogStore.featuredPosts,
  categories: blogStore.categories,
  recentPosts: blogStore.recentPosts,
  hotPosts: blogStore.hotPosts,
  tags: blogStore.tags,
  authorInfo: blogStore.authorInfo,
  stats: blogStore.stats
}))

// 获取当前分类的文章
const currentPosts = computed(() => {
  return blogStore.getPostsByCategory(activeCategory.value)
})

// 计算总页数
const totalPages = computed(() => {
  const postsPerPage = 10
  return Math.ceil(currentPosts.value.length / postsPerPage)
})

// 获取当前页的文章
const currentPagePosts = computed(() => {
  const postsPerPage = 10
  const start = (pagination.value.currentPage - 1) * postsPerPage
  const end = start + postsPerPage
  return currentPosts.value.slice(start, end)
})

// 页面挂载后的处理
onMounted(async () => {
  // 如果数据还没有加载，则重新加载
  if (!blogStore.dataStatus.hasData && !blogStore.dataStatus.isLoading) {
    console.log('📱 BlogIndexView: 重新加载博客数据...')
    await blogStore.loadBlogData()
  }
  
  // 更新分页信息
  pagination.value.totalPages = totalPages.value
})

// 方法
const handleCategoryChange = (category) => {
  activeCategory.value = category.name
  // 重置到第一页
  pagination.value.currentPage = 1
  pagination.value.totalPages = totalPages.value
  
  console.log('分类切换到:', category.name, '文章数量:', currentPosts.value.length)
}

const handlePageChange = (page) => {
  pagination.value.currentPage = page
  console.log('页面切换到:', page)
}

// 刷新数据
const refreshData = async () => {
  console.log('🔄 手动刷新数据...')
  await blogStore.refreshData()
}
</script>

<template>
  <PageWrapper class="blog-index-page" :class="{ loading: blogStore.dataStatus.isLoading }">
    <!-- 顶部横幅区域 -->
    <div class="home-top">
      <div class="recent-top-post-group">
        <!-- 技能图标和Banner内容 -->
        <div class="home-top-content">
          <SkillIconsCard :skills="pageData.skills" />
          <BannerContent />
        </div>
        
        <!-- 推荐文章和今日推荐 -->
        <div class="top-group">
          <FeaturedPostsSlider :posts="pageData.featuredPosts" />
          <TodayCard 
            title="探索技术<br>分享生活"
            tips="新内容"
            link="/blog/all"
          />
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="layout">
      <div class="home-bar-and-posts">
        <!-- 分类导航栏 -->
        <CategoryBar 
          :categories="pageData.categories"
          :active-category="activeCategory"
          @category-change="handleCategoryChange"
        />

        <!-- 文章列表 -->
        <PostList :posts="currentPagePosts" />

        <!-- 分页导航 -->
        <BlogPagination
          :current-page="pagination.currentPage"
          :total-pages="totalPages"
          :base-path="pagination.basePath"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 侧边栏 -->
      <BlogSidebar 
        :author-info="pageData.authorInfo"
        :hot-posts="pageData.hotPosts"
        :tags="pageData.tags"
        :stats="pageData.stats"
      />
    </main>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.blog-index-page {
  // 确保页面使用正确的布局
  .page-content {
    padding: 0;
    max-width: none;
  }
}

// 顶部区域样式
.home-top {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  padding: var(--space-xxl) 0;
  margin-bottom: var(--space-xl);

  .recent-top-post-group {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-xxl);
  }
}

// 技能图标和Banner区域
.home-top-content {
  display: flex;
  gap: var(--space-xxl);
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: var(--space-xl);
  }
}

// 推荐文章组
.top-group {
  display: flex;
  gap: var(--space-xl);
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
}

// 主内容区域
.layout {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--space-xl);
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-xxl);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  
  @media (max-width: 768px) {
    padding: 0 var(--space-md);
  }
}

.home-bar-and-posts {
  min-width: 0; // 防止flex子项溢出
}

// 响应式适配
@media (max-width: 992px) {
  .home-top {
    padding: var(--space-xl) 0;
    
    .recent-top-post-group {
      padding: 0 var(--space-lg);
    }
  }
  
  .layout {
    padding: 0 var(--space-lg);
  }
}

@media (max-width: 768px) {
  .home-top {
    padding: var(--space-lg) 0;
    
    .recent-top-post-group {
      padding: 0 var(--space-md);
      gap: var(--space-xl);
    }
  }
  
  .layout {
    padding: 0 var(--space-md);
  }
  
  .home-top-content {
    gap: var(--space-lg);
  }
  
  .top-group {
    gap: var(--space-lg);
  }
}

@media (max-width: 576px) {
  .home-top {
    margin-bottom: var(--space-lg);
    
    .recent-top-post-group {
      padding: 0 var(--space-sm);
      gap: var(--space-lg);
    }
  }
  
  .layout {
    padding: 0 var(--space-sm);
    gap: var(--space-lg);
  }
}

// 加载状态
.blog-index-page.loading {
  opacity: 0.8;
  pointer-events: none;
}

// 平滑滚动
.layout {
  scroll-behavior: smooth;
}

// 辅助动画
.home-top-content,
.top-group,
.layout {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 分层动画延迟
.home-top-content {
  animation-delay: 0.1s;
}

.top-group {
  animation-delay: 0.2s;
}

.layout {
  animation-delay: 0.3s;
}
</style>