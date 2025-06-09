<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import SkillIconsCard from '@/components/blog/SkillIconsCard.vue'
import BannerContent from '@/components/blog/BannerContent.vue'
import FeaturedPostsSlider from '@/components/blog/FeaturedPostsSlider.vue'
import TodayCard from '@/components/blog/TodayCard.vue'
import CategoryBar from '@/components/blog/CategoryBar.vue'
import PostList from '@/components/blog/PostList.vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import BlogPagination from '@/components/blog/Pagination.vue'

// 响应式数据
const pageData = reactive({
  // 技能图标数据
  skills: [
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
  ],
  
  // 推荐文章数据
  featuredPosts: [
    {
      id: 1,
      title: '探索 Vue 3 的新特性',
      excerpt: '深入了解 Vue 3 带来的 Composition API、性能提升和新功能',
      cover: '/src/assets/images/cover-1.jpg',
      category: '前端开发',
      date: '2025-06-01',
      recommended: true
    },
    {
      id: 2,
      title: '现代 CSS 布局技巧',
      excerpt: '使用 Grid 和 Flexbox 创建响应式布局的最佳实践',
      cover: '/src/assets/images/cover-2.jpg',
      category: '前端开发',
      date: '2025-05-28',
      recommended: true
    },
    {
      id: 3,
      title: 'TypeScript 进阶指南',
      excerpt: '掌握高级类型、泛型和装饰器等 TypeScript 特性',
      cover: '/src/assets/images/cover-3.jpg',
      category: '编程语言',
      date: '2025-05-25',
      recommended: true
    },
    {
      id: 4,
      title: '设计系统构建实践',
      excerpt: '如何从零开始构建一套完整的设计系统',
      cover: '/src/assets/images/cover-4.jpg',
      category: '设计',
      date: '2025-05-22',
      recommended: true
    },
    {
      id: 5,
      title: '摄影构图技巧分享',
      excerpt: '提升摄影作品质量的构图方法和实用技巧',
      cover: '/src/assets/images/cover-5.jpg',
      category: '摄影',
      date: '2025-05-20',
      recommended: true
    }
  ],
  
  // 分类数据
  categories: [
    { name: '精选', path: '/blog', active: true },
    { name: '全部文章', path: '/blog/all' },
    { name: '前端开发', path: '/blog/category/frontend' },
    { name: '后端开发', path: '/blog/category/backend' },
    { name: '设计', path: '/blog/category/design' },
    { name: '摄影', path: '/blog/category/photography' },
    { name: '生活随笔', path: '/blog/category/life' },
    { name: '技术教程', path: '/blog/category/tutorial' },
    { name: '产品思考', path: '/blog/category/product' }
  ],
  
  // 最新文章数据
  recentPosts: [
    {
      id: 7,
      title: 'Mac如何将喜欢的视频作为屏幕保护程序？自定义Mac视频屏保，最新系统教程',
      excerpt: '看到评论区有人问如何自定义屏保，这个屏保确实平常我也开着，但是没想过自定义，现在想来如果能自定义，我下一些高清视频做屏保也确实是一件美事。',
      cover: '/src/assets/images/cover-7.jpg',
      category: '经验分享',
      date: '2025-05-23',
      tags: ['教程', 'Mac'],
      isNew: true,
      isUnread: true
    },
    {
      id: 8,
      title: 'iPhone如何查看自己电话卡的上网优先级QCI？SIM卡的QCI查看教程',
      excerpt: '刷视频的时候看到有人提到自己的SIM卡是QCI6的优先级。这个QCI是个啥呢？研究了一下，一般自己流量卡都会有网络优先级...',
      cover: '/src/assets/images/cover-8.jpg',
      category: '经验分享',
      date: '2025-05-23',
      tags: ['教程', 'iOS'],
      isUnread: true
    },
    {
      id: 9,
      title: '如何让老旧打印机支持隔空打印，在Mac上搭建Airprint服务',
      excerpt: '连接的打印机不支持隔空打印，手机没有办法打印，可以尝试搭建一个airprint服务。',
      cover: '/src/assets/images/cover-9.jpg',
      category: '经验分享',
      date: '2025-05-12',
      tags: ['教程', 'Mac', '办公'],
      isUnread: true
    }
  ],
  
  // 热门文章
  hotPosts: [
    { title: 'Ice上手：Mac上免费开源的菜单栏管理工具，Bartender的免费平替', rank: 1 },
    { title: 'Mac如何将喜欢的视频作为屏幕保护程序？自定义Mac视频屏保，最新系统教程', rank: 2 },
    { title: 'Mac如何查看移动硬盘盒温度？查看SSD固态硬盘工作温度教程', rank: 3 },
    { title: '我在2025年推荐的Mac软件', rank: 4 },
    { title: '敲木鱼App - 打节拍敲音效解压神器', rank: 5 }
  ],
  
  // 标签数据
  tags: [
    { name: '教程', count: 383 },
    { name: '设计', count: 265 },
    { name: '开发', count: 232 },
    { name: '干货', count: 172 },
    { name: 'Swift', count: 126 },
    { name: '软件', count: 106 },
    { name: '日常', count: 102 },
    { name: 'Mac', count: 88 },
    { name: 'Sketch', count: 80 },
    { name: '热门', count: 71 },
    { name: '必看', count: 70 },
    { name: '网页前端', count: 61 }
  ],
  
  // 作者信息
  authorInfo: {
    name: 'PalpitatingForever',
    description: '分享技术与生活',
    sayhi: '分享技术与生活的点点滴滴',
    avatar: '/src/assets/images/PF.png'
  },
  
  // 统计信息
  stats: {
    posts: 128,
    days: 365,
    words: '256.8k',
    comments: 1024
  }
})

// 当前选中的分类
const activeCategory = ref('精选')

// 分页信息
const pagination = reactive({
  currentPage: 1,
  totalPages: 10,
  basePath: '/blog'
})

// 页面挂载后的处理
onMounted(() => {
  // 可以在这里加载数据
})

// 方法
const handleCategoryChange = (category) => {
  activeCategory.value = category.name
  // 可以在这里处理分类切换逻辑
  console.log('Category changed to:', category.name)
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  // 可以在这里处理分页逻辑
  console.log('Page changed to:', page)
}
</script>

<template>
  <PageWrapper class="blog-index-page">
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
        <PostList :posts="pageData.recentPosts" />

        <!-- 分页导航 -->
        <BlogPagination 
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
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