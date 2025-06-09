<script setup>
import { ref } from 'vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

const props = defineProps({
  authorInfo: {
    type: Object,
    default: () => ({
      name: 'PalpitatingForever',
      description: '分享技术与生活',
      sayhi: '分享技术与生活的点点滴滴',
      avatar: '/src/assets/images/PF.png'
    })
  },
  hotPosts: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  stats: {
    type: Object,
    default: () => ({
      posts: 128,
      days: 365,
      words: '256.8k',
      comments: 1024
    })
  }
})

// 是否显示所有标签
const showAllTags = ref(false)

const toggleAllTags = () => {
  showAllTags.value = !showAllTags.value
}
</script>

<template>
  <div class="aside-content">
    <!-- 个人信息卡片 -->
    <div class="card-widget card-info">
      <div class="card-content">
        <div class="card-info-avatar">
          <div class="author-info__top-group">
            <div class="author-info__sayhi">{{ authorInfo.sayhi }}</div>
          </div>
        </div>
        <div class="avatar-img-group">
          <div class="avatar-img">
            <img :src="authorInfo.avatar" alt="avatar" />
          </div>
        </div>
        <div class="author-info__description-group">
          <div class="author-info__description">
            这有关于<b>前端开发、设计、摄影</b>相关的问题和思考，还有<b>生活感悟</b>和<b>技术分享</b>。
          </div>
          <div class="author-info__description">
            相信你可以在这里找到对你有用的<b>知识</b>和<b>灵感</b>。
          </div>
        </div>
        <div class="author-info__bottom-group">
          <TransitionLink to="/blog/about" class="author-info__bottom-group-left">
            <div class="author-info__name">{{ authorInfo.name }}</div>
            <div class="author-info__desc">{{ authorInfo.description }}</div>
          </TransitionLink>
        </div>
      </div>
    </div>

    <!-- 热门文章卡片 -->
    <div class="card-widget card-hotpost" v-if="hotPosts.length">
      <div class="item-headline">
        <i class="icon-fire"></i>
        <span>今日热门</span>
      </div>
      <div class="card-hotpost-content">
        <TransitionLink 
          v-for="post in hotPosts" 
          :key="post.rank"
          to="#" 
          class="hot-post-link"
        >
          <span 
            class="post-rank"
            :class="`rank-${post.rank}`"
          >
            {{ post.rank }}
          </span>
          <div class="post-title-container">
            <span class="post-title">{{ post.title }}</span>
          </div>
        </TransitionLink>
      </div>
    </div>

    <!-- 标签云卡片 -->
    <div class="card-widget card-tags" v-if="tags.length">
      <div class="item-headline">
        <i class="icon-tags"></i>
        <span>标签</span>
      </div>
      <div class="card-tag-cloud">
        <TransitionLink 
          v-for="tag in (showAllTags ? tags : tags.slice(0, 12))" 
          :key="tag.name"
          :to="`/blog/tag/${tag.name}`"
          class="tag-link"
        >
          {{ tag.name }}<sup>{{ tag.count }}</sup>
        </TransitionLink>
      </div>
      <button 
        class="more-tags-btn" 
        @click="toggleAllTags"
        v-if="tags.length > 12"
      >
        {{ showAllTags ? '收起' : '查看全部' }}
      </button>
    </div>

    <!-- 统计信息卡片 -->
    <div class="card-widget card-webinfo">
      <div class="item-headline">
        <i class="icon-chart"></i>
        <span>统计</span>
      </div>
      <div class="webinfo">
        <div class="webinfo-item">
          <div class="webinfo-item-title">
            <i class="icon-folder"></i>
            <div class="item-name">文章总数:</div>
          </div>
          <div class="item-count">{{ stats.posts }}</div>
        </div>
        <div class="webinfo-item">
          <div class="webinfo-item-title">
            <i class="icon-calendar"></i>
            <div class="item-name">建站天数:</div>
          </div>
          <div class="item-count">{{ stats.days }} 天</div>
        </div>
        <div class="webinfo-item">
          <div class="webinfo-item-title">
            <i class="icon-file"></i>
            <div class="item-name">全站字数:</div>
          </div>
          <div class="item-count">{{ stats.words }}</div>
        </div>
        <div class="webinfo-item">
          <div class="webinfo-item-title">
            <i class="icon-chat"></i>
            <div class="item-name">评论总数:</div>
          </div>
          <div class="item-count">{{ stats.comments }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aside-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  
  @media (max-width: 1200px) {
    margin-top: var(--space-xl);
  }
}

.card-widget {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--global-transition);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
  
  .item-headline {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    
    i {
      color: var(--accent-primary);
      font-size: 18px;
    }
  }
}

// 个人信息卡片
.card-info {
  text-align: center;
  
  .author-info__sayhi {
    color: var(--text-secondary);
    font-size: var(--font-size-callout);
    margin-bottom: var(--space-lg);
    line-height: var(--line-height-normal);
  }
  
  .avatar-img-group {
    margin-bottom: var(--space-lg);
    
    .avatar-img img {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      object-fit: cover;
      border: 3px solid var(--separator-secondary);
      transition: var(--global-transition);
      
      &:hover {
        transform: scale(1.05);
        border-color: var(--accent-primary);
      }
    }
  }
  
  .author-info__description-group {
    margin-bottom: var(--space-lg);
    
    .author-info__description {
      color: var(--text-secondary);
      font-size: var(--font-size-subhead);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-sm);
      text-align: left;
      
      b {
        color: var(--accent-primary);
        font-weight: var(--font-weight-semibold);
      }
    }
  }
  
  .author-info__bottom-group-left {
    text-decoration: none;
    transition: var(--global-transition);
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .author-info__name {
      color: var(--text-primary);
      font-size: var(--font-size-headline);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-xs);
    }
    
    .author-info__desc {
      color: var(--text-secondary);
      font-size: var(--font-size-subhead);
    }
  }
}

// 热门文章卡片
.card-hotpost-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  
  .hot-post-link {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    text-decoration: none;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-hover);
      transform: translateX(2px);
    }
    
    .post-rank {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-caption1);
      font-weight: var(--font-weight-bold);
      color: white;
      
      &.rank-1 { 
        background: linear-gradient(135deg, #ffd700, #ffb300);
      }
      &.rank-2 { 
        background: linear-gradient(135deg, #c0c0c0, #9e9e9e);
      }
      &.rank-3 { 
        background: linear-gradient(135deg, #cd7f32, #bf6000);
      }
      &:not(.rank-1):not(.rank-2):not(.rank-3) {
        background: var(--fill-primary);
        color: var(--text-secondary);
      }
    }
    
    .post-title {
      color: var(--text-primary);
      font-size: var(--font-size-subhead);
      line-height: var(--line-height-normal);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

// 标签云卡片
.card-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  .tag-link {
    display: inline-flex;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    background: var(--fill-secondary);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text-secondary);
    font-size: var(--font-size-caption1);
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-hover);
      color: var(--accent-primary);
      transform: translateY(-1px);
    }
    
    sup {
      margin-left: var(--space-xxs);
      font-size: var(--font-size-caption2);
      color: var(--text-tertiary);
    }
  }
}

.more-tags-btn {
  width: 100%;
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-callout);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--global-transition);
  
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }
}

// 统计信息卡片
.webinfo {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  
  .webinfo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    transition: var(--global-transition);
    
    &:hover {
      background: var(--fill-tertiary);
    }
    
    .webinfo-item-title {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      
      i {
        color: var(--accent-primary);
        font-size: 16px;
      }
      
      .item-name {
        color: var(--text-secondary);
        font-size: var(--font-size-subhead);
      }
    }
    
    .item-count {
      color: var(--text-primary);
      font-size: var(--font-size-callout);
      font-weight: var(--font-weight-semibold);
    }
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .aside-content {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }
}

@media (max-width: 768px) {
  .card-widget {
    padding: var(--space-md);
    
    .item-headline {
      font-size: var(--font-size-callout);
      margin-bottom: var(--space-md);
    }
  }
  
  .card-info {
    .author-info__description {
      font-size: var(--font-size-footnote);
    }
    
    .avatar-img img {
      width: 60px;
      height: 60px;
    }
  }
  
  .card-hotpost-content .hot-post-link {
    padding: var(--space-xs);
    gap: var(--space-sm);
    
    .post-rank {
      width: 20px;
      height: 20px;
      font-size: 10px;
    }
    
    .post-title {
      font-size: var(--font-size-footnote);
    }
  }
  
  .card-tag-cloud .tag-link {
    padding: var(--space-xxs) var(--space-xs);
    font-size: 10px;
  }
  
  .webinfo-item {
    .webinfo-item-title .item-name {
      font-size: var(--font-size-footnote);
    }
    
    .item-count {
      font-size: var(--font-size-subhead);
    }
  }
}
</style>