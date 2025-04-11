<template>
  <section class="blog-container">
    <!-- 左侧个人信息栏 -->
    <aside class="sidebar">
      <CardProfile />
      <TagsFilter :availableTags="allTags" @filter="handleFilter" />
    </aside>

    <!-- 中间内容区域 -->
    <main class="blog-content">
      <SearchFilter class="search-bar" />
      <div class="post-list">
        <article v-for="post in filteredPosts" :key="post.id" class="post-item">
          <div class="post-image" :style="{ backgroundImage: `url(${getRandomCover()})` }"></div>
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p class="excerpt">{{ post.excerpt }}</p>
            <div class="meta">
              <time>{{ post.date }}</time>
              <span class="tags">{{ post.tags.join(', ') }}</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  </section>
</template>

<script>
import CardProfile from '@/components/BlogComponents/CardProfile.vue'
import SearchFilter from '@/components/BlogComponents/SearchFilter.vue'
import TagsFilter from '@/components/BlogComponents/TagsFilter.vue'

export default {
  components: {
    SearchFilter,
    TagsFilter,
    CardProfile
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
        {
          id: 2,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        {
          id: 3,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        {
          id: 4,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        {
          id: 5,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        {
          id: 6,
          title: 'Vue3组合式API实践',
          excerpt: '探索Vue3组合式API在大型项目中的应用...',
          date: '2025-03-15',
          tags: ['Vue', '前端工程']
        },
        {
          id: 7,
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
    },
    getRandomCover() {
      const covers = [
        '/src/assets/images/cover-1.jpg',
        '/src/assets/images/cover-2.jpg',
        '/src/assets/images/cover-3.jpg',
        '/src/assets/images/cover-4.jpg',
        '/src/assets/images/cover-5.jpg',
        '/src/assets/images/cover-6.jpg',
        '/src/assets/images/cover-7.jpg',
        '/src/assets/images/cover-8.jpg',
        '/src/assets/images/cover-9.jpg'
      ];
      return covers[Math.floor(Math.random() * covers.length)];
    }
  }
}
</script>

<style scoped>
.blog-container {
  display: flex;
  justify-content: center;
  padding-left: 6rem;
  padding-right: 6rem;
  gap: 1rem;
  min-height: 100vh;
}

.sidebar {
  width: 300px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.blog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-bar {
  margin-bottom: 2rem;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-auto-rows: minmax(300px, auto);
  grid-auto-flow: dense;
  border-top: 1px solid #000;
  padding: .5rem;
  grid-gap: .5rem;
  .wide {
    grid-column: span 2;
  }

  .tall {
    grid-row: span 2;
  }

  .big {
    grid-column: span 2;
    grid-row: span 2;
  }
}

.post-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-bottom: 1px solid #000;
  border-radius: 1rem;
}

.post-item:hover {
  transform: translateY(-3px);
}

.post-image {
  position: relative;
  width: 100%;
  height: 210px;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.post-content {
  position: relative;
  color: rgb(0, 0, 0);
  padding: 1rem 2rem;
  height: 165px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* justify-content: space-between; */
}

.post-content h3 {
  /* margin-bottom: 0.5rem; */
  font-size: 1.5rem;
}

.excerpt {
  font-size: 1.25rem;
  /* margin-bottom: 1rem; */
  opacity: 0.9;
}

.meta {
  position: absolute;
  bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .blog-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .sidebar {
    position: static;
    display: none;
    /* 移动端隐藏侧边栏 */
  }
}
</style>
