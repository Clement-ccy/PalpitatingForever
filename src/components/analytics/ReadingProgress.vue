<template>
  <div
    v-if="isActive && postId"
    class="reading-progress-container"
    :class="{ 'visible': isVisible, 'fixed': isFixed }"
  >
    <div
      class="reading-progress-bar"
      :style="{ width: `${progress}%` }"
    ></div>
    
    <!-- 可选的百分比显示 -->
    <div v-if="showPercentage" class="progress-percentage">
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { useReadingTracker } from '@/composables/useReadingTracker'
import { useRoute } from 'vue-router'

const props = defineProps({
  // 文章信息
  postId: {
    type: String,
    required: true
  },
  
  // 显示选项
  showPercentage: {
    type: Boolean,
    default: false
  },
  
  // 样式选项
  height: {
    type: String,
    default: '3px'
  },
  
  color: {
    type: String,
    default: 'var(--accent-primary)'
  },
  
  backgroundColor: {
    type: String,
    default: 'var(--separator-secondary)'
  },
  
  // 行为选项
  isFixed: {
    type: Boolean,
    default: true
  },
  
  hideWhenComplete: {
    type: Boolean,
    default: false
  },
  
  autoSave: {
    type: Boolean,
    default: true
  },
  
  saveInterval: {
    type: Number,
    default: 5000 // 5秒保存一次
  }
})

const emit = defineEmits(['progress-changed', 'reading-complete'])

// 使用阅读跟踪器
const { updateReadingProgress, getReadingInfo } = useReadingTracker()

// 路由监听
const route = useRoute()

// 响应式状态
const progress = ref(0)
const isVisible = ref(false)
const lastSaveTime = ref(0)
const startTime = ref(0)
const isActive = ref(true) // 添加组件活动状态

// 计算属性
const isComplete = computed(() => progress.value >= 99)

/**
 * 计算阅读进度
 */
const calculateProgress = () => {
  // 检查组件是否还处于活动状态
  if (!isActive.value || !props.postId) {
    return
  }
  
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (scrollHeight <= 0) {
      progress.value = 0
      return
    }
    
    const currentProgress = Math.min((scrollTop / scrollHeight) * 100, 100)
    progress.value = currentProgress
    
    // 显示/隐藏进度条
    isVisible.value = currentProgress > 1 && (!props.hideWhenComplete || !isComplete.value)
    
    // 发送进度变化事件
    emit('progress-changed', {
      progress: currentProgress,
      scrollTop,
      scrollHeight
    })
    
    // 如果完成阅读，发送完成事件
    if (isComplete.value) {
      emit('reading-complete', {
        postId: props.postId,
        readingTime: Date.now() - startTime.value
      })
    }
    
    // 自动保存进度
    if (props.autoSave && Date.now() - lastSaveTime.value > props.saveInterval) {
      saveProgress()
    }
  } catch (error) {
    console.warn('计算阅读进度时出错:', error)
  }
}

/**
 * 保存阅读进度
 */
const saveProgress = () => {
  if (!props.postId) return
  
  const currentTime = Date.now()
  const readingTime = Math.round((currentTime - startTime.value) / 1000)
  
  updateReadingProgress(
    props.postId, 
    progress.value / 100, 
    readingTime
  )
  
  lastSaveTime.value = currentTime
}

/**
 * 恢复保存的进度
 */
const restoreProgress = () => {
  if (!props.postId) return
  
  const readingInfo = getReadingInfo(props.postId)
  if (readingInfo?.lastPosition) {
    // 可以选择是否自动滚动到上次阅读位置
    // const targetScroll = readingInfo.lastPosition * (document.documentElement.scrollHeight - window.innerHeight)
    // window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }
}

/**
 * 滚动事件处理函数
 */
const handleScroll = () => {
  if (!isActive.value) return
  requestAnimationFrame(calculateProgress)
}

/**
 * Lenis 滚动事件处理函数
 */
const handleLenisScroll = (e) => {
  if (!isActive.value) return
  requestAnimationFrame(calculateProgress)
}

/**
 * 页面离开时保存进度
 */
const handleBeforeUnload = () => {
  saveProgress()
}

// 存储事件监听器引用，确保正确清理
let scrollListener = null
let beforeUnloadListener = null
let lenisScrollListener = null
let isCleanedUp = ref(false)

// 清理函数，确保事件监听器被正确移除
const cleanup = () => {
  if (isCleanedUp.value) {
    console.log('ReadingProgress: 已经清理过，跳过')
    return
  }
  
  console.log('ReadingProgress: 开始清理事件监听器')
  isCleanedUp.value = true
  
  // 标记组件为非活动状态
  isActive.value = false
  
  try {
    // 保存最终进度
    saveProgress()
  } catch (error) {
    console.warn('保存阅读进度时出错:', error)
  }
  
  // 移除事件监听器
  if (typeof window !== 'undefined') {
    // 移除 Lenis 滚动监听器
    if (window.lenis && lenisScrollListener) {
      try {
        window.lenis.off('scroll', lenisScrollListener)
        lenisScrollListener = null
        console.log('ReadingProgress: Lenis 监听器已移除')
      } catch (error) {
        console.warn('移除 Lenis 滚动监听器失败:', error)
      }
    }
    
    // 移除原生滚动监听器
    if (scrollListener) {
      window.removeEventListener('scroll', scrollListener, { passive: true })
      scrollListener = null
      console.log('ReadingProgress: 原生滚动监听器已移除')
    }
    
    // 移除 beforeunload 监听器
    if (beforeUnloadListener) {
      window.removeEventListener('beforeunload', beforeUnloadListener)
      beforeUnloadListener = null
      console.log('ReadingProgress: beforeunload 监听器已移除')
    }
  }
}

// 组件挂载
onMounted(() => {
  console.log('ReadingProgress: 组件挂载，PostId:', props.postId)
  startTime.value = Date.now()
  isCleanedUp.value = false
  
  // 恢复上次阅读进度
  restoreProgress()
  
  // 添加滚动监听，确保在客户端环境
  if (typeof window !== 'undefined') {
    scrollListener = handleScroll
    beforeUnloadListener = handleBeforeUnload
    lenisScrollListener = handleLenisScroll
    
    // 优先使用 Lenis 滚动事件，如果不可用则使用原生滚动事件
    if (window.lenis) {
      window.lenis.on('scroll', lenisScrollListener)
      console.log('ReadingProgress: Lenis 监听器已添加')
    } else {
      window.addEventListener('scroll', scrollListener, { passive: true })
      console.log('ReadingProgress: 原生滚动监听器已添加')
    }
    
    window.addEventListener('beforeunload', beforeUnloadListener)
    console.log('ReadingProgress: beforeunload 监听器已添加')
  }
  
  // 初始计算一次进度
  calculateProgress()
})

// 监听路由变化，确保在路由切换时清理
watch(() => route.path, (newPath, oldPath) => {
  if (oldPath && newPath !== oldPath) {
    console.log('ReadingProgress: 路由变化，清理事件监听器', { from: oldPath, to: newPath })
    cleanup()
  }
}, { flush: 'pre' })

// 监听组件属性变化
watch(() => props.postId, (newId, oldId) => {
  if (oldId && newId !== oldId) {
    console.log('ReadingProgress: PostId 变化，清理事件监听器', { from: oldId, to: newId })
    cleanup()
  }
})

// 组件卸载前清理
onBeforeUnmount(() => {
  cleanup()
})

// 组件卸载
onUnmounted(() => {
  cleanup()
})

// 暴露方法给父组件
defineExpose({
  progress,
  isVisible,
  isComplete,
  saveProgress,
  restoreProgress
})
</script>

<style scoped lang="scss">
.reading-progress-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  background-color: v-bind(backgroundColor);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
  
  &.visible {
    opacity: 1;
  }
  
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    v-bind(color) 0%,
    color-mix(in srgb, v-bind(color) 80%, white) 100%
  );
  transition: width 0.1s ease;
  position: relative;
  
  // 添加光泽效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.6) 100%
    );
    opacity: 0.8;
  }
}

.progress-percentage {
  position: absolute;
  right: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-caption2);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  background: var(--bg-primary);
  padding: var(--space-xxs) var(--space-xs);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-xs);
  transition: opacity 0.3s ease;
}

// 响应式设计
@media (max-width: 768px) {
  .reading-progress-container {
    height: 2px;
    
    .progress-percentage {
      font-size: var(--font-size-caption2);
      padding: 1px var(--space-xxs);
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .reading-progress-bar {
    background: linear-gradient(
      90deg,
      v-bind(color) 0%,
      color-mix(in srgb, v-bind(color) 80%, black) 100%
    );
  }
  
  .progress-percentage {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-sm);
  }
}

// 平滑动画
@media (prefers-reduced-motion: reduce) {
  .reading-progress-container,
  .reading-progress-bar,
  .progress-percentage {
    transition: none;
  }
}
</style>