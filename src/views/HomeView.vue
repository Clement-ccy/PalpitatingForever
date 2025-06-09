<script setup>
import { ref, computed } from 'vue';
import worksData from '@/data/works.json';

// 分类映射
const categoryMapping = {
  'Product Design': '实体产品设计',
  'Software Product Design': '软件产品设计',
  'Graphic Design': '平面设计',
  'Research': '我的研究',
  'Miscellaneous': '杂七杂八'
};

// 处理作品数据
const allWorks = ref(worksData
  .filter(work => work.status === '发布 (Published)' || work.status === '已归档 (Archived)')
  .map(work => ({
    id: work.id,
    title: work.title || '未命名项目',
    description: work.tags?.join('、') || '暂无描述',
    link: '#',
    image: work.mainVisual?.url || '/src/assets/images/placeholder-1.svg',
    category: work.category,
    tags: work.tags || [],
    featured: work.featured || false
  }))
);

// 按分类组织项目
const categorizedProjects = computed(() => {
  const categories = [
    { key: 'Product Design', name: '实体产品设计', description: '专注于创新产品的设计与开发' },
    { key: 'Software Product Design', name: '软件产品设计', description: '构建数字化产品体验' },
    { key: 'Graphic Design', name: '平面设计', description: '视觉传达与品牌设计' },
    { key: 'Research', name: '我的研究', description: '学术研究与技术探索' },
    { key: 'Miscellaneous', name: '杂七杂八', description: '其他有趣的创作与实验' }
  ];

  return categories.map(category => ({
    ...category,
    projects: allWorks.value.filter(work => work.category === category.key)
  })).filter(category => category.projects.length > 0);
});

// 特色项目
const featuredProjects = computed(() => {
  return allWorks.value.filter(work => work.featured).slice(0, 3);
});
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            CLEMENT <span class="hero-subtitle-text">PF</span>
          </h1>
          <h2 class="hero-subtitle">
            DIGITAL <span class="highlight">CREATOR</span>
          </h2>
          <div class="hero-description">
            <span class="description-text">
              探索技术与艺术的边界，<br>
              <span class="sub-text">构建令人难忘的数字体验。</span>
            </span>
          </div>
          <div class="hero-links">
            <a href="#about" class="about-button">了解我</a>
            <a href="https://github.com" class="social-button" target="_blank">
              <i class="icon-github"></i>
            </a>
            <a href="mailto:contact@example.com" class="social-button" target="_blank">
              <i class="icon-mail"></i>
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-avatar">
            <img src="/src/assets/images/PF.png" alt="avatar" class="avatar-image">
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="about-content">
        <span class="about-description">
          <p>
            <b>大多数产品是一群看重效益的企业家配合需要完成绩效指标的员工所完成的</b>。这样的产品往往优先考虑的是销量。而用户体验这种只能从侧面去量化的指标只有当足够恶劣的情况才会被作为KPI出现，通常不被重视。<br><br>
            然而在这个互联网需求接近饱和的时代，产品开发其实应该更多地去<b>关注人</b>，<b>人机交互体验</b>，<b>注重软件的体验</b>，<b>研究用户的使用心理</b>、<b>使用动机以及目标完成流程的状态变化</b>。这就是我所追求的。
          </p>
        </span>
        <div class="about-info">
          <img loading="lazy" class="about-avatar" src="/src/assets/images/PF.png" alt="avatar">
          <span class="about-name">Clement PF</span>
          <span class="about-title">产品设计师、独立开发者、技术与艺术领域创作者</span>
        </div>
      </div>
    </section>

    <!-- Featured Projects Banner -->
    <div v-if="featuredProjects.length > 0" class="featured-banner">
      <div class="banner-info">
        <span class="banner-tips">特色项目</span>
        <span class="banner-title">精选作品<span class="punctuation">，</span><br>创意无限<span class="punctuation">。</span></span>
        <div class="banner-description-group">
          <span class="banner-description">展示我最引以为豪的创作<span class="inline-word">成果<span class="punctuation">。</span></span></span>
        </div>
        <div class="banner-link-group">
          <a class="primary-button" href="#projects">查看所有项目</a>
        </div>
      </div>
      <div class="banner-visual">
        <div class="featured-preview">
          <div v-for="project in featuredProjects" :key="project.id" class="featured-item">
            <img :src="project.image" :alt="project.title" loading="lazy">
          </div>
        </div>
      </div>
    </div>

    <!-- Projects by Category -->
    <div id="projects" class="projects-container">
      <div v-for="category in categorizedProjects" :key="category.key" class="project-group">
        <h2 class="group-title">{{ category.name }}</h2>
        <span class="group-description">{{ category.description }}</span>
        <div class="group-items">
          <div v-for="project in category.projects" :key="project.id" class="group-item">
            <a class="group-item-icon" :href="project.link" target="_blank">
              <img
                loading="lazy"
                class="group-item-icon-img"
                :src="project.image"
                :alt="project.title"
                @error="$event.target.src = '/src/assets/images/placeholder-1.svg'"
              >
            </a>
            <div class="group-info-container">
              <div class="group-info">
                <a class="project-title" :href="project.link" target="_blank">
                  {{ project.title }}
                  <sup v-if="project.featured" class="hot">特色</sup>
                </a>
                <a class="project-description" :href="project.link" target="_blank">{{ project.description }}</a>
              </div>
              <div class="group-info-button">
                <a class="link-button" :href="project.link" target="_blank">查看</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.home-view {
  overflow-x: hidden;
}

// --- Hero Section ---
.hero-section {
  padding: var(--space-xxl) var(--space-lg);
  min-height: 80vh;
  display: flex;
  align-items: center;
  background-color: var(--bg-primary);
}

.hero-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-xxl);
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-xl);
  }
}

.hero-text {
  .hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
    line-height: 1.1;
    
    .hero-subtitle-text {
      font-weight: var(--font-weight-light);
      opacity: 0.8;
    }
  }

  .hero-subtitle {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    line-height: 1.2;
    
    .highlight {
      color: var(--accent-primary);
    }
  }

  .hero-description {
    margin-bottom: var(--space-xl);
    
    .description-text {
      font-size: var(--font-size-body);
      color: var(--text-secondary);
      line-height: var(--line-height-loose);
      
      .sub-text {
        opacity: 0.8;
      }
    }
  }

  .hero-links {
    display: flex;
    gap: var(--space-md);
    align-items: center;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .about-button {
    padding: var(--space-md) var(--space-lg);
    background-color: var(--accent-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-full);
    font-weight: var(--font-weight-medium);
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--accent-hover);
      transform: translateY(-2px);
    }
  }

  .social-button {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-secondary);
    border-radius: 50%;
    text-decoration: none;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--accent-primary);
      color: white;
      transform: translateY(-2px);
    }
  }
}

.hero-visual {
  .hero-avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    padding: 4px;
    
    @media (max-width: 768px) {
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }
    
    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
}

// --- About Section ---
.about-section {
  padding: var(--space-xxl) var(--space-lg);
  background-color: var(--bg-secondary);
}

.about-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xxl);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    text-align: center;
  }
}

.about-description {
  p {
    font-size: var(--font-size-body);
    line-height: var(--line-height-loose);
    color: var(--text-secondary);
    margin: 0;
    
    b {
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
    }
  }
}

.about-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .about-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: var(--space-md);
    border: 3px solid var(--accent-primary);
  }
  
  .about-name {
    font-size: var(--font-size-title3);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }
  
  .about-title {
    font-size: var(--font-size-footnote);
    color: var(--text-secondary);
    text-align: center;
    line-height: var(--line-height-normal);
  }
}

// --- Featured Banner ---
.featured-banner {
  padding: var(--space-xxl) var(--space-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
}

.banner-info {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-xxl);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .banner-tips {
    font-size: var(--font-size-footnote);
    opacity: 0.8;
    margin-bottom: var(--space-sm);
    display: block;
  }
  
  .banner-title {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-md);
    line-height: 1.2;
    
    .punctuation {
      opacity: 0.6;
    }
  }
  
  .banner-description-group {
    margin-bottom: var(--space-lg);
    
    .banner-description {
      font-size: var(--font-size-body);
      opacity: 0.9;
      
      .inline-word .punctuation {
        opacity: 0.6;
      }
    }
  }
  
  .banner-link-group {
    .primary-button {
      padding: var(--space-md) var(--space-lg);
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-medium);
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }
  }
}

.banner-visual {
  .featured-preview {
    display: flex;
    gap: var(--space-md);
    
    @media (max-width: 768px) {
      justify-content: center;
    }
    
    .featured-item {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

// --- Projects Container ---
.projects-container {
  padding: var(--space-xxl) var(--space-lg);
}

.project-group {
  max-width: var(--container-max-width);
  margin: 0 auto var(--space-xxl) auto;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .group-title {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }
  
  .group-description {
    font-size: var(--font-size-body);
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    display: block;
  }
  
  .group-items {
    display: grid;
    gap: var(--space-lg);
  }
}

.group-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .group-item-icon {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .group-item-icon-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .group-info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
  }
  
  .group-info {
    .project-title {
      font-size: var(--font-size-title3);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      text-decoration: none;
      margin-bottom: var(--space-xs);
      display: block;
      
      &:hover {
        color: var(--accent-primary);
      }
      
      .hot {
        font-size: var(--font-size-caption);
        color: var(--accent-primary);
        background-color: rgba(var(--accent-primary-rgb), 0.1);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        margin-left: var(--space-xs);
      }
    }
    
    .project-description {
      font-size: var(--font-size-footnote);
      color: var(--text-secondary);
      text-decoration: none;
      
      &:hover {
        color: var(--text-primary);
      }
    }
  }
  
  .group-info-button {
    .link-button {
      padding: var(--space-sm) var(--space-md);
      background-color: var(--accent-primary);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-footnote);
      font-weight: var(--font-weight-medium);
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--accent-hover);
        transform: translateY(-1px);
      }
    }
  }
}

// Icon placeholders (should be replaced with actual icon font or SVGs)
.icon-github::before {
  content: "⚡";
}

.icon-mail::before {
  content: "✉";
}

</style>