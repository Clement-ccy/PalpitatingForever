<template>
  <div class="reading-stats" :class="{ 'compact': compact }">
    <!-- 阅读量显示 -->
    <div v-if="showViews" class="stat-item views" :class="{ 'loading': isLoadingCloudStats }">
      <span class="stat-icon">👁️</span>
      <span class="stat-value">{{ formatNumber(totalViews) }}</span>
      <span class="stat-label">{{ compact ? '' : '阅读' }}</span>
      <!-- 云端同步状态指示器 -->
      <span v-if="showCloudStats && !compact" class="cloud-status" :class="{ 'synced': !isLoadingCloudStats && !cloudStatsError, 'error': cloudStatsError }">
        {{ isLoadingCloudStats ? '📡' : cloudStatsError ? '⚠️' : '☁️' }}
      </span>
    </div>

    <!-- 已读标记 -->
    <div v-if="showReadStatus && isRead" class="stat-item read-status">
      <span class="stat-icon">✓</span>
      <span class="stat-label" v-if="!compact">已读</span>
    </div>

    <!-- 阅读时长 -->
    <div v-if="showReadingTime && readingInfo?.readingTime" class="stat-item reading-time">
      <span class="stat-icon">⏱️</span>
      <span class="stat-value">{{ formatTime(readingInfo.readingTime) }}</span>
      <span class="stat-label" v-if="!compact">阅读时长</span>
    </div>

    <!-- 阅读进度 -->
    <div v-if="showProgress && readingInfo?.lastPosition" class="stat-item progress">
      <span class="stat-icon">📖</span>
      <span class="stat-value">{{ Math.round(readingInfo.lastPosition * 100) }}%</span>
      <span class="stat-label" v-if="!compact">进度</span>
    </div>

    <!-- 热门标记 -->
    <div v-if="showHot && isHot" class="stat-item hot-badge">
      <span class="stat-icon">🔥</span>
      <span class="stat-label" v-if="!compact">热门</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReadingTracker } from '@/composables/useReadingTracker'
import { useAnalyticsStore } from '@/stores/analytics'

const props = defineProps({
  // 文章信息
  postId: {
    type: String,
    required: true
  },
  postTitle: {
    type: String,
    default: ''
  },
  postCategory: {
    type: String,
    default: ''
  },
  postSlug: {
    type: String,
    default: ''
  },
  
  // 显示选项
  showViews: {
    type: Boolean,
    default: true
  },
  showReadStatus: {
    type: Boolean,
    default: true
  },
  showReadingTime: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  showHot: {
    type: Boolean,
    default: false
  },
  
  // 样式选项
  compact: {
    type: Boolean,
    default: false
  },
  autoTrack: {
    type: Boolean,
    default: true
  },
  
  // 热门文章阈值
  hotThreshold: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['read-status-changed', 'view-tracked'])

// 使用阅读跟踪器和分析存储
const {
  isPostRead,
  markAsRead,
  getReadingInfo,
  updateReadingProgress
} = useReadingTracker()

const analyticsStore = useAnalyticsStore()

// 响应式状态
const localViews = ref(0)
const isTracking = ref(false)
const trackingError = ref(null)

// 云端统计状态
const cloudStats = ref({ views: 0, lastUpdated: null })
const isLoadingCloudStats = ref(false)
const cloudStatsError = ref(null)

// 计算属性
const isRead = computed(() => isPostRead(props.postId))
const readingInfo = computed(() => getReadingInfo(props.postId))

// 总浏览量 = 云端统计 + 本地统计
const totalViews = computed(() => {
  return Math.max(cloudStats.value.views || 0, localViews.value)
})

const isHot = computed(() => totalViews.value >= props.hotThreshold)

// 是否显示云端数据
const showCloudStats = computed(() => {
  return analyticsStore.isOnline && analyticsStore.canSync
})

/**
 * 格式化数字显示
 */
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 格式化时间显示
 */
const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`
  } else {
    return `${Math.round(seconds / 3600)}h`
  }
}

/**
 * 标记文章为已读
 */
const trackAsRead = async () => {
  if (!props.autoTrack || isTracking.value || isRead.value) {
    return
  }

  isTracking.value = true
  trackingError.value = null

  try {
    const success = markAsRead(props.postId, {
      title: props.postTitle,
      category: props.postCategory,
      slug: props.postSlug
    })

    if (success) {
      // 增加本地显示的阅读量
      localViews.value += 1
      
      console.log(`文章 ${props.postId} 本地阅读状态已跟踪，开始同步到云端...`)
      
      // 同步到云端
      await syncToCloud()
      
      emit('read-status-changed', {
        postId: props.postId,
        isRead: true,
        readingInfo: getReadingInfo(props.postId)
      })
      
      emit('view-tracked', {
        postId: props.postId,
        views: totalViews.value
      })
      
      console.log(`文章 ${props.postId} 阅读状态已跟踪，总浏览量: ${totalViews.value}`)
    } else {
      console.warn(`文章 ${props.postId} 本地标记失败`)
    }
  } catch (error) {
    console.error('跟踪阅读状态失败:', error)
    trackingError.value = error.message
  } finally {
    isTracking.value = false
  }
}

/**
 * 同步到云端
 */
const syncToCloud = async () => {
  if (!analyticsStore.canSync) {
    console.log(`无法同步到云端 (canSync: ${analyticsStore.canSync}, isOnline: ${analyticsStore.isOnline})，将在网络恢复时自动同步`)
    return
  }
  
  try {
    const postInfo = {
      id: props.postId,
      title: props.postTitle,
      category: props.postCategory,
      slug: props.postSlug
    }
    
    console.log('开始同步到云端...', postInfo)
    const result = await analyticsStore.incrementReadCount(postInfo, 1)
    
    if (result.success) {
      console.log(`✅ 文章 ${props.postId} 已成功同步到云端`)
    } else {
      console.warn(`⚠️ 文章 ${props.postId} 同步失败，已加入队列:`, result)
    }
  } catch (error) {
    console.error('❌ 同步到云端失败:', error)
    cloudStatsError.value = error.message
  }
}

/**
 * 加载云端统计数据
 */
const loadCloudStats = async () => {
  if (!showCloudStats.value) {
    return
  }
  
  isLoadingCloudStats.value = true
  cloudStatsError.value = null
  
  try {
    const stats = await analyticsStore.getPostStats(props.postId, props.postTitle)
    if (stats) {
      cloudStats.value = stats
    }
  } catch (error) {
    console.error('加载云端统计失败:', error)
    cloudStatsError.value = error.message
  } finally {
    isLoadingCloudStats.value = false
  }
}

/**
 * 手动标记为已读
 */
const markRead = () => {
  trackAsRead()
}

/**
 * 更新阅读进度
 */
const updateProgress = (position, readingTime = 0) => {
  updateReadingProgress(props.postId, position, readingTime)
}

/**
 * 初始化组件
 */
const initialize = async () => {
  // 设置初始阅读量
  localViews.value = 0
  
  // 加载云端统计数据
  await loadCloudStats()
  
  // 如果启用自动跟踪且文章未读，则标记为已读
  if (props.autoTrack && !isRead.value) {
    // 延迟一小段时间再标记，确保用户真的在阅读
    setTimeout(() => {
      trackAsRead()
    }, 2000)
  }
}

// 监听 postId 变化
watch(() => props.postId, () => {
  if (props.postId) {
    initialize()
  }
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  initialize()
})

// 暴露方法给父组件
defineExpose({
  markRead,
  updateProgress,
  isRead,
  readingInfo,
  localViews,
  totalViews,
  cloudStats,
  isLoadingCloudStats,
  syncToCloud,
  loadCloudStats
})
</script>

<style scoped lang="scss">
.reading-stats {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-caption);
  color: var(--text-secondary);

  &.compact {
    gap: var(--space-sm);
    font-size: var(--font-size-caption2);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &.views {
    color: var(--text-secondary);
  }
  
  &.read-status {
    color: var(--color-success);
    font-weight: 500;
  }
  
  &.reading-time {
    color: var(--text-tertiary);
  }
  
  &.progress {
    color: var(--color-primary);
  }
  
  &.hot-badge {
    color: var(--color-warning);
    font-weight: 500;
  }
}

.stat-icon {
  font-size: 0.9em;
  opacity: 0.8;
}

.stat-value {
  font-weight: 500;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.8;
}

// 响应式设计
@media (max-width: 768px) {
  .reading-stats {
    gap: var(--space-sm);
    font-size: var(--font-size-caption2);
    
    .stat-label {
      display: none; // 在小屏幕上隐藏标签
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .stat-item {
    &.views {
      color: var(--text-secondary);
    }
    
    &.read-status {
      color: var(--color-success-light);
    }
    
    &.hot-badge {
      color: var(--color-warning-light);
    }
  }
}

// 悬停效果
.stat-item {
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
  }
}

// 加载状态
.reading-stats[data-loading="true"] {
  opacity: 0.6;
}

// 错误状态
.reading-stats[data-error="true"] {
  .stat-item {
    color: var(--color-error);
  }
}
</style>