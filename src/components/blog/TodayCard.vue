<script setup>
import TransitionLink from '@/components/common/TransitionLink.vue'

defineProps({
  title: {
    type: String,
    default: '探索技术\n分享生活'
  },
  tips: {
    type: String,
    default: '新内容'
  },
  link: {
    type: String,
    default: '/blog/all'
  },
  backgroundImage: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <TransitionLink class="today-card" :to="link">
    <div class="today-card-info">
      <div class="today-card-title" v-html="title.replace('\n', '<br>')"></div>
      <div class="today-card-tips">{{ tips }}</div>
    </div>
    <div 
      class="today-card-cover"
      :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}"
    ></div>
    <div class="banner-button-group">
      <TransitionLink :to="link" class="banner-button" @click.stop>
        <i class="icon-add-circle"></i>
        <span class="banner-button-text">更多文章</span>
      </TransitionLink>
    </div>
  </TransitionLink>
</template>

<style lang="scss" scoped>
.today-card {
  width: 300px;
  height: 400px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: var(--global-transition);
  
  @media (max-width: 1200px) {
    width: 100%;
    height: 300px;
  }
  
  @media (max-width: 768px) {
    height: 250px;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
}

.today-card-info {
  position: absolute;
  top: var(--space-xl);
  left: var(--space-xl);
  z-index: 2;
  
  .today-card-title {
    color: white;
    font-size: var(--font-size-title2);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin-bottom: var(--space-sm);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-title3);
    }
  }
  
  .today-card-tips {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-callout);
    padding: var(--space-xs) var(--space-sm);
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-sm);
    display: inline-block;
    backdrop-filter: var(--backdrop-blur);
  }
}

.today-card-cover {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl) 0 0 0;
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    width: 50%;
    height: 50%;
  }
}

.banner-button-group {
  position: absolute;
  bottom: var(--space-xl);
  left: var(--space-xl);
  
  @media (max-width: 768px) {
    bottom: var(--space-lg);
    left: var(--space-lg);
  }
  
  .banner-button {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: white;
    text-decoration: none;
    font-size: var(--font-size-callout);
    font-weight: var(--font-weight-medium);
    transition: var(--global-transition);
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
      transform: translateX(2px);
    }
    
    @media (max-width: 768px) {
      font-size: var(--font-size-subhead);
    }
  }
}
</style>