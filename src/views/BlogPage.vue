<template>
  <section class="blog-container">
    <!-- 左侧个人信息栏 -->
    <aside class="sidebar neum-panel--inset">
      <CardProfile />
      <TagsFilter :availableTags="allTags" @filter="handleFilter" />
    </aside>

    <!-- 中间内容区域 -->
    <main class="blog-content neum-panel">
      <!-- <SearchFilter class="search-bar" /> -->
      <div class="post-list" v-if="!isLoading && !error">
        <article v-for="post in filteredPosts" :key="post.id" class="post-item neum-card">
          <router-link :to="`/blog/${post.id}`">
            <div
              class="post-image"
              :style="{ backgroundImage: `url(${post.coverImage})` }"
            ></div>
            <div class="post-content">
              <h3>{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="meta">
                <time>{{ formatDate(post.lastEditedTime) }}</time>
                <!-- Added formatting -->
                <span class="tags">{{ post.tags.join(", ") }}</span>
              </div>
            </div>
          </router-link>
        </article>
      </div>
      <div v-else-if="isLoading" class="loading">Loading...</div>
      <div v-else class="error">{{ error }}</div>
    </main>
  </section>
</template>

<script>
import CardProfile from "@/components/BlogComponents/CardProfile.vue";
import TagsFilter from "@/components/BlogComponents/TagsFilter.vue";
import { queryBlogsDatabase } from "@/utils/notion.js"; // Import the notion utility

export default {
  components: {
    TagsFilter,
    CardProfile,
  },
  data() {
    return {
      posts: [], // Initialize posts as empty
      allTags: [], // Will be populated dynamically
      selectedTags: [],
      isLoading: true, // Add a loading state
      error: null, // Add an error state
    };
  },
  computed: {
    filteredPosts() {
      if (!this.selectedTags.length) return this.posts;
      return this.posts.filter((post) =>
        this.selectedTags.every((tag) => post.tags.includes(tag))
      );
    },
  },
  async mounted() {
    // Make mounted async
    this.isLoading = true;
    this.error = null;
    try {
      // Fetch data using the utility function
      const blogPosts = await queryBlogsDatabase();
      console.log("Notion Response in Component:", blogPosts);
      this.posts = blogPosts;
      // Dynamically generate allTags from fetched posts
      const tagsSet = new Set(this.posts.flatMap((post) => post.tags || [])); // Use flatMap and handle potential missing tags
      this.allTags = [...tagsSet]; // Convert Set to array and sort alphabetically
    } catch (err) {
      console.error("Error fetching or processing Notion data:", err);
      this.error = "Failed to load blog posts.";
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    // Add a date formatting method
    formatDate(dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleFilter(selectedTags) {
      this.selectedTags = selectedTags;
    },
  },
};
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
  padding: 0.5rem;
  grid-gap: 0.5rem;
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
  position: relative; /* Keep position */
  overflow: hidden; /* Keep overflow */
  /* transition handled by neum-card */
  /* border-bottom removed */
  /* border-radius handled by neum-card */
}

/* Remove hover effect - handled by neum-card */
/* .post-item:hover {
  transform: translateY(-3px);
} */

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
  position: relative; /* Keep position */
  /* color should be inherited from theme */
  padding: 1rem 2rem; /* Keep padding */
  height: 165px; /* Keep height */
  display: flex; /* Keep display */
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
