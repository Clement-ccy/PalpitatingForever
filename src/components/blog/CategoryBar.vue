<script setup>
import { ref } from 'vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['category-change'])

const scrollLeft = () => {
  const container = document.querySelector('.category-bar-items')
  if (container) {
    container.scrollLeft -= 200
  }
}

const scrollRight = () => {
  const container = document.querySelector('.category-bar-items')
  if (container) {
    container.scrollLeft += 200
  }
}

const handleCategoryClick = (category) => {
  emit('category-change', category)
}
</script>

<template>
  <div class="category-bar">
    <div class="category-bar-items">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="category-bar-item"
        :class="{ select: activeCategory === category.name }"
        @click="handleCategoryClick(category)"
      >
        <TransitionLink :to="category.path">{{ category.name }}</TransitionLink>
      </div>
    </div>
    <div class="category-bar-more-group">
      <button 
        class="category-bar-nav"
        @click="scrollLeft"
        title="向左滚动"
      >
        <i class="icon-arrow-left"></i>
      </button>
      <button 
        class="category-bar-nav"
        @click="scrollRight"
        title="向右滚动"
      >
        <i class="icon-arrow-right"></i>
      </button>
      <TransitionLink to="/blog/categories" class="category-bar-more">更多</TransitionLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-bar {
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  gap: var(--space-lg);
  
  .category-bar-items {
    display: flex;
    gap: var(--space-md);
    flex: 1;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    @media (max-width: 768px) {
      flex-wrap: nowrap;
      min-width: max-content;
    }
  }
  
  .category-bar-item {
    cursor: pointer;
    flex-shrink: 0;
    
    a {
      display: block;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: var(--text-secondary);
      font-size: var(--font-size-callout);
      transition: var(--global-transition);
      white-space: nowrap;
      
      &:hover {
        color: var(--accent-primary);
        background: var(--accent-hover);
      }
    }
    
    &.select a {
      color: var(--accent-primary);
      background: var(--accent-hover);
      font-weight: var(--font-weight-medium);
    }
  }
}

.category-bar-more-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
  
  .category-bar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--fill-secondary);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-secondary);
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-hover);
      color: var(--accent-primary);
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .category-bar-more {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: var(--font-size-callout);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    transition: var(--global-transition);
    white-space: nowrap;
    
    &:hover {
      color: var(--accent-primary);
      background: var(--accent-hover);
    }
  }
}

@media (max-width: 768px) {
  .category-bar {
    padding: var(--space-sm);
    gap: var(--space-md);
    
    .category-bar-items {
      gap: var(--space-sm);
    }
    
    .category-bar-item a {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-subhead);
    }
  }
}
</style>