<template>
  <section class="wid-work">
    <div class="headline">
      <h2 class="tag"><span>我的作品</span></h2>
      <marqueeComponent></marqueeComponent>
    </div>

    <div class="filters-1" v-if="loaded">
      <button class="checkbox" @click="selectAll">
        <div
          class="checkbox__custom"
          :class="{ '--checked': selectedCategories.length === 0 }"
        >
          <span>全部</span>
          <sup>{{ totalCount }}</sup>
        </div>
      </button>
      <label
        class="checkbox"
        v-for="category in categories"
        :key="category.value"
      >
        <input
          type="checkbox"
          v-model="selectedCategories"
          :value="category.value"
          hidden
        />
        <div
          class="checkbox__custom"
          :class="{ '--checked': selectedCategories.includes(category.value) }"
        >
          <span>{{ category.name }}</span>
          <sup>{{ category.count }}</sup>
        </div>
      </label>
    </div>

    <div class="projects-grid" v-if="loaded">
      <!-- Column 1 -->
      <div class="projects-grid-column">
        <div
          v-for="article in column1Articles"
          :key="article.id"
          class="projects-grid-item"
        >
          <a :href="article.url" class="project-thumb-preview" target="_blank">
            <div class="cover">
              <img :src="article.cover || 'https://fakeimg.pl/540x300'" :alt="article.title" loading="lazy" />
            </div>
            <h3 class="title">{{ article.title }}</h3>
            <div class="tags">
              <ul class="tags">
                <li v-for="tag in article.tags" :key="tag">
                  {{ tag }}
                </li>
              </ul>
            </div>
          </a>
        </div>
      </div>
      <!-- Column 2 -->
      <div class="projects-grid-column">
        <div
          v-for="article in column2Articles"
          :key="article.id"
          class="projects-grid-item"
        >
          <a :href="article.url" class="project-thumb-preview" target="_blank">
            <div class="cover">
              <img :src="article.cover || 'https://fakeimg.pl/540x300'" :alt="article.title" loading="lazy" />
            </div>
            <h3 class="title">{{ article.title }}</h3>
            <div class="tags">
              <ul class="tags">
                <li v-for="tag in article.tags" :key="tag">
                  {{ tag }}
                </li>
              </ul>
            </div>
          </a>
        </div>
      </div>
      <!-- Column 3 -->
      <div class="projects-grid-column">
        <div
          v-for="article in column3Articles"
          :key="article.id"
          class="projects-grid-item"
        >
          <a :href="article.url" class="project-thumb-preview" target="_blank">
            <div class="cover">
              <img :src="article.cover || 'https://fakeimg.pl/540x300'" :alt="article.title" loading="lazy" />
            </div>
            <h3 class="title">{{ article.title }}</h3>
            <div class="tags">
              <ul class="tags">
                <li v-for="tag in article.tags" :key="tag">
                  {{ tag }}
                </li>
              </ul>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div v-else class="loading">Loading...</div>
  </section>
</template>

<script>
import marqueeComponent from "@/components/StaticComponents/marqueeComponent.vue";
import { queryWorksDatabase } from "@/utils/notion.js";

export default {
  components: {
    marqueeComponent,
  },
  data() {
    return {
      loaded: false,
      allArticles: [], // 将存储从 Notion 获取并处理后的 WorkPost 数据
      categories: [], // 将存储从 tags 提取的筛选选项
      selectedCategories: [], // 存储用户选择的筛选标签
      totalCount: 0, // 总项目数
    };
  },
  computed: {
    filteredArticles() {
      // 如果没有选择任何分类，则显示所有文章
      if (this.selectedCategories.length === 0) {
        return this.allArticles;
      }
      // 否则，筛选出包含所选标签中至少一个的文章
      return this.allArticles.filter((article) =>
        article.tags.some((tag) => this.selectedCategories.includes(tag))
      );
    },
    // 计算属性：第一列的文章
    column1Articles() {
      return this.filteredArticles.filter((_, index) => index % 3 === 0);
    },
    // 计算属性：第二列的文章
    column2Articles() {
      return this.filteredArticles.filter((_, index) => index % 3 === 1);
    },
    // 计算属性：第三列的文章
    column3Articles() {
      return this.filteredArticles.filter((_, index) => index % 3 === 2);
    },
  },
  async created() {
    await this.fetchNotionData();
    this.calculateCategories(); // 获取数据后计算分类
    this.loaded = true;
  },
  methods: {
    async fetchNotionData() {
      try {
        const workPosts = await queryWorksDatabase(); // 获取原始 WorkPost 数据
        // 将 WorkPost 映射到组件内部使用的 article 结构，并处理封面图
        this.allArticles = workPosts.map(post => ({
          id: post.id,
          title: post.title,
          cover: post.mainVisual, // 将 mainVisual 映射到 cover
          tags: post.tags || [], // 确保 tags 是数组
          url: post.url,
          // 可以根据需要添加其他 WorkPost 属性
          projectType: post.projectType,
          projectStatus: post.projectStatus,
          skillsUsed: post.skillsUsed,
          finishedDate: post.finishedDate,
          projectDescription: post.projectDescription,
          context: post.context,
          featuredProject: post.featuredProject,
        }));
        console.log("Fetched and processed articles:", this.allArticles);
      } catch (error) {
        console.error("Error fetching or processing Notion data:", error);
        this.allArticles = []; // 出错时清空
      }
    },

    // getCoverImage 不再需要，已在 fetchNotionData 中处理

    calculateCategories() {
      const categoryMap = new Map();
      console.log("Calculating categories from articles:", this.allArticles);

      // 遍历处理后的文章，统计 tags
      this.allArticles.forEach((article) => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag) => {
            const count = categoryMap.get(tag) || 0;
            categoryMap.set(tag, count + 1);
          });
        }
      });

      // 将 Map 转换为筛选器所需的格式
      this.categories = Array.from(categoryMap)
        .map(([name, count]) => ({
          name: name, // 显示名称
          value: name, // 用于 v-model 的值
          count: count, // 该标签下的项目数量
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序

      this.totalCount = this.allArticles.length; // 更新总数
      console.log("Calculated categories:", this.categories);
      console.log("Total count:", this.totalCount);
    },

    selectAll() {
      this.selectedCategories = []; // 清空选择以显示全部
    },
  },
};
</script>

<style scoped>
.wid-work {
  background: #181717;
  color: #fff;
}

.tag:before {
  background-color: #fff;
}

.wid-work .filters-1 {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6944444444vw 2.8935185185vw;
  padding: 2.8935185185vw 0;
}

.wid-work .filters-1 .checkbox {
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}

.checkbox input {
  height: 100%;
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}

.checkbox__custom {
  align-items: center;
  display: flex;
  gap: 0.625rem;
  opacity: 0.4;
  position: relative;
  transition: opacity 0.42s cubic-bezier(0.36, 0.33, 0, 1);
  gap: 0.5787037037vw;
}

.checkbox__custom:before {
  border: 0.1rem solid #181717;
  border-radius: 50%;
  content: "";
  display: block;
  border-width: 0.1157407407vw;
  height: 0.6944444444vw;
  min-width: 0.6944444444vw;
  border-color: #fff;
  transition: background 0.24s cubic-bezier(0.36, 0.33, 0, 1);
}

.checkbox__custom:before:hover {
  background-color: #fff;
}

.checkbox input:checked + .checkbox__custom,
.checkbox .checkbox__custom.--checked,
html:not(.--touch) .checkbox:hover .checkbox__custom {
  opacity: 1;
}

.checkbox input:checked + .checkbox__custom:before,
.checkbox .checkbox__custom.--checked:before {
  background: #fff;
}

.checkbox span {
  font-size: 1.3310185185vw;
}

.checkbox sup {
  align-self: flex-start;
  margin-left: -0.25em;
  font-size: 0.5em;
}

.wid-work .projects-grid {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

/* 修改为 .projects-grid-column 的样式 */
.wid-work .projects-grid-column {
  align-items: flex-start;
  display: flex;
  flex-direction: column; /* 让项目垂直排列 */
  flex: 1; /* 每列占据可用空间的三分之一 */
  gap: 2.8935185185vw; /* 项目之间的垂直间距 */
}

.wid-work .projects-grid .projects-grid-item {
  min-width: 100%;
  transition: opacity 1.2scubic-bezier(0.36, 0.33, 0, 1);
}

.project-thumb-preview {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  line-height: 1;
  max-width: 15.3125rem;
  width: 100%;
  font-size: 1.1574074074vw;
}

.projects-grid .project-thumb-preview {
  max-width: 100%;
}

.project-thumb-preview .cover {
  aspect-ratio: 1.4;
  background: #f4f4f4;
  border-radius: 0.625rem;
  margin-bottom: 1.25rem;
  overflow: hidden;
  position: relative;
  transition: transform 0.48s cubic-bezier(0.36, 0.33, 0, 1);
  width: 100%;
  margin-bottom: 1.1574074074vw;
  background: #0b0b0b;
  aspect-ratio: 540 / 300;
}

.project-thumb-preview .cover img {
  height: 100%;
  left: 0;
  -o-object-fit: cover;
  object-fit: cover;
  position: absolute;
  top: 0;
  transition: opacity 0.42scubic-bezier (0.36, 0.33, 0, 1);
  width: 100%;
}

.project-thumb-preview .title {
  font-size: 1.5rem;
  font-weight: 400;
  font-size: 1.6203703704vw;
}

.project-thumb-preview .tags {
  align-items: center;
  display: flex;
  font-size: 0.9375rem;
  gap: 0.4375rem;
  opacity: 0.5;
  font-size: 1.2731481481vw;
  gap: 0.4050925926vw;
  li:first-child::before {
    content: '';
    margin-right: 0;
  }
  li::before {
    content: "✦";
    margin-right: 0.4375rem;
    font-size: 0.9375rem;
    font-size: 1.2731481481vw;
  }
}

.project-thumb-preview .tags ul {
  align-items: center;
  display: inline-flex;
  gap: 0.4375rem;
  margin: 0.4375rem 0 0.3125rem;
}
</style>
