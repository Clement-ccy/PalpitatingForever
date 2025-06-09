<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  }
})

const sliderRef = ref(null)
const currentIndex = ref(0)
const isAutoPlaying = ref(true)
const autoPlayInterval = ref(null)

// 自动播放
const startAutoPlay = () => {
  if (autoPlayInterval.value) return
  autoPlayInterval.value = setInterval(() => {
    nextSlide()
  }, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

// 切换到下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.posts.length
}

// 切换到上一张
const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? props.posts.length - 1 : currentIndex.value - 1
}

// 跳转到指定索引
const goToSlide = (index) => {
  currentIndex.value = index
}

// 鼠标悬停时暂停自动播放
const handleMouseEnter = () => {
  if (isAutoPlaying.value) {
    stopAutoPlay()
  }
}

const handleMouseLeave = () => {
  if (isAutoPlaying.value) {
    startAutoPlay()
  }
}

onMounted(() => {
  if (isAutoPlaying.value) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div 
    class="featured-posts-slider"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="slider-container" ref="sliderRef">
      <div 
        class="slider-track"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="post in posts"
          :key="post.id"
          class="slide-item"
        >
          <div class="post-cover">
            <TransitionLink :to="`/blog/post/${post.id}`">
              <span class="featured-post-tag">荐</span>
              <img 
                :src="post.cover" 
                :alt="post.title"
                class="post-bg"
                loading="lazy"
              />
            </TransitionLink>
          </div>
          <div class="post-info">
            <div class="post-category">{{ post.category }}</div>
            <TransitionLink 
              :to="`/blog/post/${post.id}`" 
              class="post-title"
            >
              {{ post.title }}
            </TransitionLink>
            <div class="post-excerpt">{{ post.excerpt }}</div>
            <div class="post-date">{{ formatDate(post.date) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button 
      class="slider-nav slider-nav--prev"
      @click="prevSlide"
      :disabled="posts.length <= 1"
    >
      <i class="icon-arrow-left"></i>
    </button>
    <button 
      class="slider-nav slider-nav--next"
      @click="nextSlide"
      :disabled="posts.length <= 1"
    >
      <i class="icon-arrow-right"></i>
    </button>

    <!-- 指示器 -->
    <div class="slider-indicators">
      <button
        v-for="(post, index) in posts"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.featured-posts-slider {
  width: 100%;
  height: 400px;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-md);
  transition: var(--global-transition);
  
  @media (max-width: 1200px) {
    height: 300px;
    margin-bottom: var(--space-xl);
  }
  
  @media (max-width: 768px) {
    height: 250px;
  }
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
}

.slider-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slider-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.post-cover {
  flex: 0 0 60%;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex: 0 0 50%;
  }
  
  a {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .featured-post-tag {
    position: absolute;
    top: var(--space-md);
    left: var(--space-md);
    background: var(--accent-primary);
    color: white;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-caption1);
    font-weight: var(--font-weight-bold);
    z-index: 2;
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

.post-info {
  flex: 1;
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-md);
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    gap: var(--space-sm);
  }
}

.post-category {
  color: var(--accent-primary);
  font-size: var(--font-size-caption1);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-title {
  font-size: var(--font-size-title3);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  text-decoration: none;
  line-height: var(--line-height-tight);
  transition: var(--global-transition);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-headline);
  }
  
  &:hover {
    color: var(--accent-primary);
  }
}

.post-excerpt {
  color: var(--text-secondary);
  font-size: var(--font-size-subhead);
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    -webkit-line-clamp: 2;
    font-size: var(--font-size-footnote);
  }
}

.post-date {
  color: var(--text-tertiary);
  font-size: var(--font-size-caption1);
  margin-top: auto;
}

// 导航按钮
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--global-transition);
  z-index: 3;
  backdrop-filter: var(--backdrop-blur);
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  
  &:hover:not(:disabled) {
    background: white;
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &--prev {
    left: var(--space-md);
  }
  
  &--next {
    right: var(--space-md);
  }
  
  i {
    color: var(--text-primary);
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
}

// 指示器
.slider-indicators {
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-sm);
  z-index: 3;
  
  @media (max-width: 768px) {
    bottom: var(--space-md);
  }
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: var(--global-transition);
  
  &.active {
    background: white;
    transform: scale(1.2);
  }
  
  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.7);
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .featured-posts-slider {
    // 在响应式状态下与today-card保持相同宽度
    width: 100%;
  }
}
</style>