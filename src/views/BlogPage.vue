<template>
  <section class="blog-container">
    <!-- 左侧个人信息栏 -->
    <aside class="sidebar left">
      <div class="profile-card">
        <img src="@/assets/images/PF.png" alt="Profile" class="avatar">
        <h2>PalpitatingForever</h2>
        <p>前端开发者 & 技术博主</p>
        <div class="social-links">
          <a href="#" class="icon-github">GitHub</a>
          <a href="#" class="icon-twitter">Twitter</a>
        </div>
      </div>
    </aside>

    <!-- 中间内容区域 -->
    <main class="content">
      <SearchFilter class="search-bar" />
      <div class="post-list">
        <article v-for="post in filteredPosts" :key="post.id" class="post-card">
          <h3>{{ post.title }}</h3>
          <p class="excerpt">{{ post.excerpt }}</p>
          <div class="meta">
            <time>{{ post.date }}</time>
            <span class="tags">{{ post.tags.join(', ') }}</span>
          </div>
        </article>
      </div>
    </main>

    <!-- 右侧标签筛选 -->
    <aside class="sidebar right">
      <TagsFilter :availableTags="allTags" @filter="handleFilter" />
    </aside>
  </section>
</template>

<script>
import SearchFilter from '@/components/BlogComponents/SearchFilter.vue'
import TagsFilter from '@/components/BlogComponents/TagsFilter.vue'

export default {
  components: {
    SearchFilter,
    TagsFilter
  },
  data() {
    return {
      posts: [
        { 
          id: 1,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        // 更多文章...
      ],
      allTags: ['Vue', 'JavaScript', 'CSS', '动画', '性能优化'],
      selectedTags: []
    }
  },
  computed: {
    filteredPosts() {
      if (!this.selectedTags.length) return this.posts
      return this.posts.filter(post => 
        this.selectedTags.every(tag => post.tags.includes(tag))
      )
    }
  },
  methods: {
    handleFilter(selectedTags) {
      this.selectedTags = selectedTags;
    }
  }
}
</script>

<style scoped>
.blog-container {
  display: grid;
  grid-template-columns: 240px 1fr 200px;
  gap: 2rem;
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 1rem;
  height: calc(100vh - 2rem);
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.left {
  padding-left: 2rem;
}

.right {
  padding-right: 2rem;
}

.search-bar {
  margin-bottom: 2rem;
}

.post-list {
  display: grid;
  gap: 1.5rem;
}

.post-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.profile-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 8px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .blog-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .sidebar {
    position: static;
    height: auto;
    display: none; /* 移动端隐藏侧边栏 */
  }
}
</style>
