<template>
  <div class="personal-reading-stats">
    <div class="stats-header">
      <h3 class="stats-title">📊 我的阅读统计</h3>
      <button 
        v-if="!isExpanded" 
        @click="toggleExpanded"
        class="expand-btn"
      >
        展开
      </button>
    </div>
    
    <div class="stats-content" :class="{ 'expanded': isExpanded }">
      <!-- 核心统计数据 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalRead }}</div>
          <div class="stat-label">已读文章</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">{{ formatTime(stats.totalReadingTime) }}</div>
          <div class="stat-label">阅读时长</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">{{ stats.categoriesRead.length }}</div>
          <div class="stat-label">涉及分类</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">{{ formatTime(stats.averageReadingTime) }}</div>
          <div class="stat-label">平均时长</div>
        </div>
      </div>
      
      <!-- 展开内容 -->
      <div v-if="isExpanded" class="expanded-content">
        <!-- 最近阅读 -->
        <div class="recent-reads-section">
          <h4 class="section-title">📖 最近阅读</h4>
          <div v-if="recentReads.length > 0" class="recent-reads-list">
            <div 
              v-for="read in recentReads.slice(0, 5)" 
              :key="read.id"
              class="recent-read-item"
            >
              <div class="read-info">
                <div class="read-title">{{ read.title || `文章 ${read.id.slice(0, 8)}` }}</div>
                <div class="read-meta">
                  <span class="read-category">{{ read.category || '未分类' }}</span>
                  <span class="read-time">{{ formatDate(read.readAt) }}</span>
                </div>
              </div>
              <div class="read-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: `${(read.lastPosition || 0) * 100}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ Math.round((read.lastPosition || 0) * 100) }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            还没有阅读记录
          </div>
        </div>
        
        <!-- 分类统计 -->
        <div v-if="stats.categoriesRead.length > 0" class="categories-section">
          <h4 class="section-title">🏷️ 阅读分类</h4>
          <div class="categories-list">
            <span 
              v-for="category in stats.categoriesRead" 
              :key="category"
              class="category-tag"
            >
              {{ category }}
            </span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="actions-section">
          <button @click="clearOldData" class="action-btn secondary">
            🗑️ 清理90天前数据
          </button>
          <button @click="resetAllData" class="action-btn danger">
            ⚠️ 重置所有数据
          </button>
          <button @click="toggleExpanded" class="action-btn primary">
            收起
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReadingTracker } from '@/composables/useReadingTracker'

const props = defineProps({
  showExpanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['data-cleared', 'data-reset'])

// 使用阅读跟踪器
const {
  readingStats,
  getReadHistory,
  clearOldHistory,
  resetAllData: resetData
} = useReadingTracker()

// 响应式状态
const isExpanded = ref(props.showExpanded)
const recentReads = ref([])
const isLoading = ref(false)

// 计算属性
const stats = computed(() => readingStats.value)

/**
 * 格式化时间显示
 */
const formatTime = (seconds) => {
  if (!seconds || seconds < 60) {
    return `${Math.round(seconds || 0)}s`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`
  } else {
    return `${Math.round(seconds / 3600)}h`
  }
}

/**
 * 格式化日期显示
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * 切换展开状态
 */
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    loadRecentReads()
  }
}

/**
 * 加载最近阅读数据
 */
const loadRecentReads = () => {
  recentReads.value = getReadHistory(10)
}

/**
 * 清理旧数据
 */
const clearOldData = async () => {
  if (!confirm('确定要清理90天前的阅读数据吗？')) {
    return
  }
  
  isLoading.value = true
  try {
    const clearedCount = clearOldHistory(90)
    alert(`已清理 ${clearedCount} 条过期记录`)
    loadRecentReads()
    emit('data-cleared', { clearedCount })
  } catch (error) {
    console.error('清理数据失败:', error)
    alert('清理数据失败')
  } finally {
    isLoading.value = false
  }
}

/**
 * 重置所有数据
 */
const resetAllData = async () => {
  if (!confirm('确定要重置所有阅读数据吗？此操作不可恢复！')) {
    return
  }
  
  isLoading.value = true
  try {
    resetData()
    recentReads.value = []
    alert('所有阅读数据已重置')
    emit('data-reset')
  } catch (error) {
    console.error('重置数据失败:', error)
    alert('重置数据失败')
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  if (isExpanded.value) {
    loadRecentReads()
  }
})
</script>

<style scoped lang="scss">
.personal-reading-stats {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border: 1px solid var(--separator-secondary);
  box-shadow: var(--shadow-sm);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  
  .stats-title {
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0;
  }
  
  .expand-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-caption1);
    cursor: pointer;
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-primary-hover);
    }
  }
}

.stats-content {
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &:not(.expanded) {
    max-height: 200px;
  }
  
  &.expanded {
    max-height: none;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.stat-card {
  text-align: center;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--separator-secondary);
  
  .stat-number {
    font-size: var(--font-size-title2);
    font-weight: var(--font-weight-bold);
    color: var(--accent-primary);
    margin-bottom: var(--space-xs);
  }
  
  .stat-label {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
  }
}

.expanded-content {
  border-top: 1px solid var(--separator-secondary);
  padding-top: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-subhead);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
}

.recent-reads-section {
  margin-bottom: var(--space-lg);
}

.recent-reads-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.recent-read-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--separator-secondary);
  
  .read-info {
    flex: 1;
    min-width: 0;
    
    .read-title {
      font-size: var(--font-size-subhead);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--space-xxs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .read-meta {
      display: flex;
      gap: var(--space-sm);
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
      
      .read-category {
        color: var(--accent-primary);
        font-weight: var(--font-weight-medium);
      }
    }
  }
  
  .read-progress {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    min-width: 60px;
    
    .progress-bar {
      width: 40px;
      height: 4px;
      background: var(--separator-secondary);
      border-radius: var(--radius-xs);
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: var(--accent-primary);
        transition: width 0.3s ease;
      }
    }
    
    .progress-text {
      font-size: var(--font-size-caption2);
      color: var(--text-tertiary);
      min-width: 25px;
    }
  }
}

.categories-section {
  margin-bottom: var(--space-lg);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.category-tag {
  background: var(--accent-primary);
  color: white;
  padding: var(--space-xxs) var(--space-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-caption1);
  font-weight: var(--font-weight-medium);
}

.actions-section {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.action-btn {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-caption1);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--global-transition);
  border: 1px solid;
  
  &.primary {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
    
    &:hover {
      background: var(--accent-primary-hover);
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--separator-secondary);
    
    &:hover {
      background: var(--bg-tertiary);
    }
  }
  
  &.danger {
    background: var(--color-error);
    color: white;
    border-color: var(--color-error);
    
    &:hover {
      background: var(--color-error-hover);
    }
  }
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: var(--space-lg);
}

// 响应式设计
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recent-read-item {
    flex-direction: column;
    align-items: flex-start;
    
    .read-progress {
      align-self: flex-end;
      margin-top: var(--space-xs);
    }
  }
  
  .actions-section {
    flex-direction: column;
    
    .action-btn {
      text-align: center;
    }
  }
}
</style>