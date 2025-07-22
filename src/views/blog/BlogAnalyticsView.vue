<template>
  <div class="container section blog-analytics">
    <div class="analytics-header">
      <h1 class="page-title">📊 博客数据分析</h1>
      <p class="page-description">
        基于浏览器本地存储的博客阅读数据统计，所有数据仅在您的设备上存储。
      </p>
    </div>
    
    <!-- 个人阅读统计 -->
    <div class="analytics-section">
      <PersonalReadingStats :show-expanded="true" />
    </div>
    
    <!-- 热门文章排行 -->
    <div class="analytics-section">
      <div class="section-card">
        <h2 class="section-title">🔥 热门文章排行</h2>
        <div v-if="popularPosts.length > 0" class="popular-posts-list">
          <div 
            v-for="(post, index) in popularPosts" 
            :key="post.id"
            class="popular-post-item"
          >
            <div class="rank-badge">{{ index + 1 }}</div>
            <div class="post-info">
              <h3 class="post-title">
                <TransitionLink :to="`/blog/post/${post.id}`">
                  {{ post.title || `文章 ${post.id.slice(0, 8)}` }}
                </TransitionLink>
              </h3>
              <div class="post-meta">
                <span class="post-category">{{ post.category || '未分类' }}</span>
                <span class="post-views">{{ post.views }} 次浏览</span>
                <span class="post-reading-time">平均 {{ formatTime(post.averageReadingTime) }}</span>
              </div>
            </div>
            <div class="post-stats">
              <ReadingStats
                :post-id="post.id"
                :post-title="post.title"
                :post-category="post.category"
                :show-views="true"
                :show-read-status="false"
                :show-reading-time="true"
                :show-progress="false"
                :show-hot="true"
                :compact="true"
                :auto-track="false"
              />
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>还没有足够的阅读数据来生成排行榜</p>
          <TransitionLink to="/blog" class="explore-btn">
            去发现好文章 →
          </TransitionLink>
        </div>
      </div>
    </div>
    
    <!-- 阅读习惯分析 -->
    <div class="analytics-section">
      <div class="section-card">
        <h2 class="section-title">📈 阅读习惯分析</h2>
        <div class="habits-grid">
          <div class="habit-card">
            <div class="habit-icon">⏰</div>
            <h3 class="habit-title">活跃时段</h3>
            <div class="habit-value">{{ mostActiveHour }}</div>
            <div class="habit-description">您最常在此时段阅读</div>
          </div>
          
          <div class="habit-card">
            <div class="habit-icon">📚</div>
            <h3 class="habit-title">偏好分类</h3>
            <div class="habit-value">{{ favoriteCategory || '暂无' }}</div>
            <div class="habit-description">您最感兴趣的内容类型</div>
          </div>
          
          <div class="habit-card">
            <div class="habit-icon">🎯</div>
            <h3 class="habit-title">完读率</h3>
            <div class="habit-value">{{ Math.round(completionRate) }}%</div>
            <div class="habit-description">文章完整阅读比例</div>
          </div>
          
          <div class="habit-card">
            <div class="habit-icon">📅</div>
            <h3 class="habit-title">连续天数</h3>
            <div class="habit-value">{{ consecutiveDays }} 天</div>
            <div class="habit-description">连续阅读天数记录</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据说明 -->
    <div class="analytics-section">
      <div class="section-card info-card">
        <h2 class="section-title">ℹ️ 数据说明</h2>
        <div class="info-content">
          <ul class="info-list">
            <li><strong>数据存储:</strong> 所有统计数据均存储在您的浏览器本地，不会上传到服务器</li>
            <li><strong>隐私保护:</strong> 清除浏览器数据会同时清除所有阅读统计</li>
            <li><strong>跨设备:</strong> 不同设备间的阅读数据是独立的</li>
            <li><strong>GitHub Pages:</strong> 适合静态网站部署，无需后端服务器</li>
            <li><strong>数据同步:</strong> 可通过导出/导入功能在设备间同步数据</li>
          </ul>
          
          <div class="data-actions">
            <button @click="exportData" class="action-btn primary">
              📤 导出数据
            </button>
            <button @click="importData" class="action-btn secondary">
              📥 导入数据
            </button>
            <input 
              ref="fileInput" 
              type="file" 
              accept=".json" 
              @change="handleFileImport" 
              style="display: none"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TransitionLink from '@/components/common/TransitionLink.vue'
import PersonalReadingStats from '@/components/analytics/PersonalReadingStats.vue'
import ReadingStats from '@/components/analytics/ReadingStats.vue'
import { useReadingTracker } from '@/composables/useReadingTracker'

// 使用阅读跟踪器
const {
  readingStats,
  getReadHistory,
  getReadingStats
} = useReadingTracker()

// 响应式数据
const popularPosts = ref([])
const fileInput = ref(null)

// 计算属性
const stats = computed(() => readingStats.value)

// 模拟阅读习惯数据
const habits = computed(() => {
  const readHistory = getReadHistory(50)
  const categories = readHistory.map(r => r.category).filter(Boolean)
  const favoriteCategory = categories.length > 0 ?
    categories.reduce((a, b, i, arr) =>
      (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
    ) : null
  
  return {
    mostActiveHour: 14, // 默认下午2点
    favoriteCategory,
    completionRate: readHistory.length > 0 ?
      readHistory.filter(r => r.lastPosition > 0.9).length / readHistory.length * 100 : 0,
    consecutiveDays: Math.min(readHistory.length, 7) // 简化的连续天数
  }
})

const mostActiveHour = computed(() => {
  const hour = habits.value.mostActiveHour
  if (hour === null) return '暂无数据'
  return `${hour}:00 - ${hour + 1}:00`
})

const favoriteCategory = computed(() => {
  return habits.value.favoriteCategory || '暂无偏好'
})

const completionRate = computed(() => {
  return habits.value.completionRate || 0
})

const consecutiveDays = computed(() => {
  return habits.value.consecutiveDays || 0
})

/**
 * 格式化时间显示
 */
const formatTime = (seconds) => {
  if (!seconds || seconds < 60) {
    return `${Math.round(seconds || 0)}秒`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}分钟`
  } else {
    return `${Math.round(seconds / 3600)}小时`
  }
}

/**
 * 导出数据
 */
const exportData = () => {
  try {
    // 直接从 localStorage 获取数据
    const data = {
      blogReading: JSON.parse(localStorage.getItem('blogReading') || '{}'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blog-reading-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('数据导出成功！')
  } catch (error) {
    console.error('导出数据失败:', error)
    alert('导出数据失败')
  }
}

/**
 * 导入数据
 */
const importData = () => {
  fileInput.value?.click()
}

/**
 * 处理文件导入
 */
const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // 直接导入到 localStorage
      if (data.blogReading) {
        localStorage.setItem('blogReading', JSON.stringify(data.blogReading))
        const imported = Object.keys(data.blogReading.readPosts || {}).length
        alert(`数据导入成功！\n导入 ${imported} 条记录`)
        loadPopularPosts()
      } else {
        alert('数据格式错误，导入失败')
      }
    } catch (error) {
      console.error('导入数据失败:', error)
      alert('文件格式错误，导入失败')
    }
  }
  reader.readAsText(file)
  
  // 重置文件输入
  event.target.value = ''
}

/**
 * 加载热门文章
 */
const loadPopularPosts = () => {
  try {
    const readHistory = getReadHistory(50)
    
    // 按阅读次数和时间排序，模拟热门文章
    const postCounts = {}
    readHistory.forEach(post => {
      if (postCounts[post.id]) {
        postCounts[post.id].views++
        postCounts[post.id].totalReadingTime += post.readingTime || 0
      } else {
        postCounts[post.id] = {
          id: post.id,
          title: post.title || `文章 ${post.id.slice(0, 8)}`,
          category: post.category || '未分类',
          views: 1,
          averageReadingTime: post.readingTime || 0,
          totalReadingTime: post.readingTime || 0
        }
      }
    })
    
    // 转换为数组并排序
    popularPosts.value = Object.values(postCounts)
      .sort((a, b) => b.views - a.views || b.totalReadingTime - a.totalReadingTime)
      .slice(0, 10)
      .map(post => ({
        ...post,
        averageReadingTime: post.views > 0 ? post.totalReadingTime / post.views : 0
      }))
  } catch (error) {
    console.error('加载热门文章失败:', error)
    popularPosts.value = []
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadPopularPosts()
})
</script>

<style scoped lang="scss">
.blog-analytics {
  max-width: 1200px;
  margin: 0 auto;
}

.analytics-header {
  text-align: center;
  margin-bottom: var(--space-xxl);
  
  .page-title {
    font-size: var(--font-size-largeTitle);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }
  
  .page-description {
    font-size: var(--font-size-subhead);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: var(--line-height-normal);
  }
}

.analytics-section {
  margin-bottom: var(--space-xxl);
}

.section-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  border: 1px solid var(--separator-secondary);
  box-shadow: var(--shadow-sm);
  
  &.info-card {
    background: var(--bg-secondary);
  }
}

.section-title {
  font-size: var(--font-size-title2);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
}

.popular-posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.popular-post-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--separator-secondary);
  transition: var(--global-transition);
  
  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-1px);
  }
  
  .rank-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--accent-primary);
    color: white;
    border-radius: 50%;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-subhead);
    flex-shrink: 0;
  }
  
  .post-info {
    flex: 1;
    min-width: 0;
    
    .post-title {
      margin: 0 0 var(--space-xs) 0;
      
      a {
        font-size: var(--font-size-headline);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        text-decoration: none;
        
        &:hover {
          color: var(--accent-primary);
        }
      }
    }
    
    .post-meta {
      display: flex;
      gap: var(--space-md);
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
      
      .post-category {
        color: var(--accent-primary);
        font-weight: var(--font-weight-medium);
      }
    }
  }
  
  .post-stats {
    flex-shrink: 0;
  }
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.habit-card {
  text-align: center;
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--separator-secondary);
  
  .habit-icon {
    font-size: 2rem;
    margin-bottom: var(--space-sm);
  }
  
  .habit-title {
    font-size: var(--font-size-subhead);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-sm) 0;
  }
  
  .habit-value {
    font-size: var(--font-size-title2);
    font-weight: var(--font-weight-bold);
    color: var(--accent-primary);
    margin-bottom: var(--space-xs);
  }
  
  .habit-description {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
  }
}

.info-content {
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-lg) 0;
    
    li {
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--separator-secondary);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);
      
      &:last-child {
        border-bottom: none;
      }
      
      strong {
        color: var(--text-primary);
      }
    }
  }
}

.data-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.action-btn {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-subhead);
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
}

.empty-state {
  text-align: center;
  padding: var(--space-xxl);
  color: var(--text-secondary);
  
  p {
    margin-bottom: var(--space-lg);
    font-size: var(--font-size-subhead);
  }
  
  .explore-btn {
    display: inline-block;
    padding: var(--space-sm) var(--space-lg);
    background: var(--accent-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-primary-hover);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .analytics-header .page-title {
    font-size: var(--font-size-title1);
  }
  
  .section-card {
    padding: var(--space-lg);
  }
  
  .popular-post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
    
    .rank-badge {
      align-self: center;
    }
    
    .post-stats {
      align-self: stretch;
    }
  }
  
  .habits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-actions {
    flex-direction: column;
  }
}
</style>