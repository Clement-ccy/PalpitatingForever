<script setup>
import TransitionLink from '@/components/common/TransitionLink.vue'
</script>

<template>
  <div class="banners-content">
    <div class="banners-title">
      <div class="banner-title-tips">
        <span class="banner-symbol">✦</span>
        <span>内容方向</span>
      </div>
      <div class="banners-title-big">分享技术</div>
      <div class="banners-title-big">与生活感悟</div>
      <div class="banners-title-small">前端、设计、摄影、思考</div>
    </div>
    <div class="banners-link">
      <TransitionLink 
        to="/blog/category/hot" 
        class="banners-link-btn blb-hot"
      >
        <i class="icon-fire"></i>
        <div class="banners-link-title">热门</div>
      </TransitionLink>
      <TransitionLink 
        to="/blog/category/featured" 
        class="banners-link-btn blb-top"
      >
        <i class="icon-star"></i>
        <div class="banners-link-title">精选</div>
      </TransitionLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banners-content {
  flex: 1;
  text-align: right;
  
  @media (max-width: 992px) {
    text-align: center;
  }
}

.banners-title {
  margin-bottom: var(--space-lg);
  
  .banner-title-tips {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-xs);
    color: var(--text-secondary);
    font-size: var(--font-size-callout);
    margin-bottom: var(--space-sm);
    
    @media (max-width: 992px) {
      justify-content: center;
    }
    
    .banner-symbol {
      color: var(--accent-primary);
    }
  }
  
  .banners-title-big {
    font-size: var(--font-size-large-title);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    line-height: var(--line-height-tight);
    margin-bottom: var(--space-xs);
  }
  
  .banners-title-small {
    color: var(--text-secondary);
    font-size: var(--font-size-body);
  }
}

.banners-link {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
}

.banners-link-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--global-transition);
  
  &.blb-hot {
    background: linear-gradient(135deg, #ff6b6b, #ff5722);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
  }
  
  &.blb-top {
    background: linear-gradient(135deg, #4fc3f7, #2196f3);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
    }
  }
  
  .banners-link-title {
    font-size: var(--font-size-callout);
  }
}
</style>