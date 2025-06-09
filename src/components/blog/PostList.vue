<script setup>
import TransitionLink from '@/components/common/TransitionLink.vue'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<template>
  <div class="recent-posts">
    <div 
      v-for="(post, index) in posts" 
      :key="post.id"
      class="recent-post-item"
      :class="{ 
        'latest-post-item': post.isNew,
        'left-radius': index % 2 === 0, 
        'right-radius': index % 2 === 1 
      }"
    >
      <div class="post-cover">
        <TransitionLink :to="`/blog/post/${post.id}`">
          <img 
            :src="post.cover" 
            :alt="post.title"
            class="post-bg"
            loading="lazy"
          />
        </TransitionLink>
      </div>
      <div class="recent-post-info">
        <div class="recent-post-info-top">
          <div class="recent-post-info-top-tips">
            <span class="original">{{ post.category }}</span>
            <span v-if="post.isNew" class="latest-post">最新</span>
            <span v-if="post.isUnread" class="unvisited-post">未读</span>
          </div>
          <TransitionLink 
            :to="`/blog/post/${post.id}`" 
            class="article-title"
          >
            {{ post.title }}
          </TransitionLink>
          <div class="content">{{ post.excerpt }}</div>
        </div>
        <div class="article-meta-wrap">
          <span class="article-meta tags" v-if="post.tags && post.tags.length">
            <span class="article-meta__separator">|</span>
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="article-meta__tags"
            >
              <span class="tags-punctuation">{{ tag }}</span>
              <span v-if="tag !== post.tags[post.tags.length - 1]" class="article-meta__link">•</span>
            </span>
          </span>
          <span class="post-meta-date">
            <i class="icon-calendar"></i>
            <span class="article-meta-label">创建</span>
            <time>{{ formatDate(post.date) }}</time>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recent-posts {
  margin-bottom: var(--space-xxl);
}

.recent-post-item {
  display: flex;
  margin-bottom: var(--space-xl);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--global-transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &.left-radius {
    border-top-right-radius: var(--radius-xl);
  }
  
  &.right-radius {
    border-top-left-radius: var(--radius-xl);
  }
  
  &.latest-post-item {
    .recent-post-info-top-tips .latest-post {
      background: var(--color-success);
      color: white;
      padding: var(--space-xxs) var(--space-xs);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-caption1);
      margin-left: var(--space-xs);
    }
  }
  
  .post-cover {
    width: 300px;
    height: 200px;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
    
    @media (max-width: 768px) {
      width: 100%;
      height: 150px;
    }
    
    a {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .post-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-duration-slow);
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.recent-post-info {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
}

.recent-post-info-top {
  flex: 1;
  
  .recent-post-info-top-tips {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin-bottom: var(--space-sm);
    
    .original {
      color: var(--accent-primary);
      font-size: var(--font-size-caption1);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .unvisited-post {
      background: var(--color-warning);
      color: white;
      padding: var(--space-xxs) var(--space-xs);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-caption1);
      font-weight: var(--font-weight-medium);
    }
  }
  
  .article-title {
    display: block;
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    text-decoration: none;
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-sm);
    transition: var(--global-transition);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-callout);
    }
    
    &:hover {
      color: var(--accent-primary);
    }
  }
  
  .content {
    color: var(--text-secondary);
    font-size: var(--font-size-subhead);
    line-height: var(--line-height-normal);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-footnote);
      -webkit-line-clamp: 2;
    }
  }
}

.article-meta-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  color: var(--text-tertiary);
  font-size: var(--font-size-caption1);
  margin-top: var(--space-md);
  
  @media (max-width: 768px) {
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }
  
  .article-meta {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    
    &.tags {
      flex: 1;
    }
  }
  
  .article-meta__separator {
    color: var(--text-tertiary);
    margin-right: var(--space-xs);
  }
  
  .article-meta__tags {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xxs);
    
    .tags-punctuation {
      color: var(--accent-primary);
      font-weight: var(--font-weight-medium);
    }
    
    .article-meta__link {
      color: var(--text-tertiary);
      margin: 0 var(--space-xs);
    }
  }
  
  .post-meta-date {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--text-tertiary);
    font-size: var(--font-size-caption1);
    
    i {
      font-size: 12px;
    }
    
    .article-meta-label {
      margin-right: var(--space-xxs);
    }
  }
}

// 响应式优化
@media (max-width: 576px) {
  .recent-post-item {
    margin-bottom: var(--space-lg);
    border-radius: var(--radius-md);
    
    &.left-radius,
    &.right-radius {
      border-radius: var(--radius-md);
    }
    
    .post-cover {
      height: 120px;
    }
    
    .recent-post-info {
      padding: var(--space-sm);
    }
    
    .article-title {
      font-size: var(--font-size-subhead);
      margin-bottom: var(--space-xs);
    }
    
    .content {
      font-size: var(--font-size-caption1);
      -webkit-line-clamp: 2;
    }
    
    .article-meta-wrap {
      font-size: var(--font-size-caption2);
      margin-top: var(--space-xs);
      gap: var(--space-xs);
    }
  }
}
</style>