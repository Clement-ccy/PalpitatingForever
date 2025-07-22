import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGitHubAPI } from '@/composables/useGitHubAPI'

/**
 * 博客统计数据状态管理
 */
export const useAnalyticsStore = defineStore('analytics', () => {
  // GitHub API 实例
  const githubAPI = useGitHubAPI()
  
  // 响应式状态
  const postsStats = ref(new Map()) // 文章统计缓存
  const popularPosts = ref([]) // 热门文章列表
  const lastSyncTime = ref(null) // 最后同步时间
  const syncInProgress = ref(false) // 同步进行中
  
  // 缓存配置
  const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存
  const SYNC_INTERVAL = 30 * 1000 // 30秒同步间隔
  
  // 计算属性
  const isOnline = computed(() => githubAPI.isOnline.value)
  const canSync = computed(() => githubAPI.canMakeRequest.value && !syncInProgress.value)
  const pendingUpdatesCount = computed(() => githubAPI.pendingUpdates.value.length)
  
  /**
   * 获取文章统计信息（带缓存）
   */
  const getPostStats = async (postId, postTitle, forceRefresh = false) => {
    const cacheKey = postId
    const cached = postsStats.value.get(cacheKey)
    
    // 检查缓存有效性
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    
    try {
      // 从 GitHub API 获取最新数据
      const stats = await githubAPI.getPostStats(postId, postTitle)
      
      if (stats) {
        // 更新缓存
        postsStats.value.set(cacheKey, {
          data: stats,
          timestamp: Date.now()
        })
        return stats
      }
      
      // 如果 API 调用失败，返回缓存的数据或默认值
      return cached?.data || { views: 0, lastUpdated: null }
    } catch (err) {
      console.error('获取文章统计失败:', err)
      return cached?.data || { views: 0, lastUpdated: null }
    }
  }
  
  /**
   * 增加文章阅读计数
   */
  const incrementReadCount = async (postInfo, count = 1) => {
    try {
      const result = await githubAPI.incrementReadCount(postInfo, count)
      
      if (result.success) {
        // 更新本地缓存
        const cacheKey = postInfo.id
        const cached = postsStats.value.get(cacheKey)
        
        if (cached) {
          cached.data.views += count
          cached.data.lastUpdated = new Date()
          cached.timestamp = Date.now()
        } else {
          // 创建新的缓存条目
          postsStats.value.set(cacheKey, {
            data: {
              views: count,
              lastUpdated: new Date()
            },
            timestamp: Date.now()
          })
        }
        
        // 刷新热门文章列表
        refreshPopularPosts()
      }
      
      return result
    } catch (err) {
      console.error('增加阅读计数失败:', err)
      return { success: false, error: err.message }
    }
  }
  
  /**
   * 刷新热门文章列表
   */
  const refreshPopularPosts = async (forceRefresh = false) => {
    if (!canSync.value && !forceRefresh) {
      return
    }
    
    try {
      const posts = await githubAPI.getPopularPosts(20)
      popularPosts.value = posts
      
      // 同时更新文章统计缓存
      posts.forEach(post => {
        postsStats.value.set(post.id, {
          data: {
            views: post.views,
            lastUpdated: new Date(),
            discussion: post.discussion
          },
          timestamp: Date.now()
        })
      })
      
      return posts
    } catch (err) {
      console.error('刷新热门文章失败:', err)
      return []
    }
  }
  
  /**
   * 同步待处理的更新
   */
  const syncPendingUpdates = async () => {
    if (!canSync.value || syncInProgress.value) {
      return { synced: 0, failed: 0 }
    }
    
    syncInProgress.value = true
    
    try {
      const result = await githubAPI.syncPendingUpdates()
      lastSyncTime.value = new Date()
      
      if (result.synced > 0) {
        // 同步成功后刷新热门文章
        await refreshPopularPosts()
      }
      
      return result
    } catch (err) {
      console.error('同步失败:', err)
      return { synced: 0, failed: 0 }
    } finally {
      syncInProgress.value = false
    }
  }
  
  /**
   * 清理过期缓存
   */
  const cleanExpiredCache = () => {
    const now = Date.now()
    const expiredKeys = []
    
    postsStats.value.forEach((value, key) => {
      if (now - value.timestamp > CACHE_DURATION * 2) { // 清理超过10分钟的缓存
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => {
      postsStats.value.delete(key)
    })
    
    console.log(`清理了 ${expiredKeys.length} 个过期缓存条目`)
  }
  
  /**
   * 获取统计概览
   */
  const getStatsOverview = computed(() => {
    const totalPosts = postsStats.value.size
    const totalViews = Array.from(postsStats.value.values())
      .reduce((sum, item) => sum + (item.data.views || 0), 0)
    
    return {
      totalPosts,
      totalViews,
      popularPostsCount: popularPosts.value.length,
      pendingUpdates: pendingUpdatesCount.value,
      lastSync: lastSyncTime.value,
      isOnline: isOnline.value
    }
  })
  
  /**
   * 初始化统计系统
   */
  const initialize = async () => {
    console.log('初始化博客统计系统...')
    
    // 设置网络状态监听
    const cleanupNetworkListener = githubAPI.setupNetworkListener()
    
    // 初始刷新热门文章
    if (canSync.value) {
      await refreshPopularPosts()
    }
    
    // 设置定期同步
    const syncTimer = setInterval(async () => {
      if (canSync.value && pendingUpdatesCount.value > 0) {
        await syncPendingUpdates()
      }
    }, SYNC_INTERVAL)
    
    // 设置缓存清理定时器
    const cleanupTimer = setInterval(cleanExpiredCache, CACHE_DURATION)
    
    // 返回清理函数
    return () => {
      cleanupNetworkListener()
      clearInterval(syncTimer)
      clearInterval(cleanupTimer)
    }
  }
  
  /**
   * 获取文章在热门排行中的位置
   */
  const getPostRanking = (postId) => {
    const index = popularPosts.value.findIndex(post => post.id === postId)
    return index >= 0 ? index + 1 : null
  }
  
  /**
   * 检查文章是否为热门文章
   */
  const isHotPost = (postId, threshold = 10) => {
    const stats = postsStats.value.get(postId)
    return stats && stats.data.views >= threshold
  }
  
  /**
   * 导出统计数据
   */
  const exportStats = () => {
    const statsData = {
      postsStats: Object.fromEntries(postsStats.value),
      popularPosts: popularPosts.value,
      lastSyncTime: lastSyncTime.value,
      exportTime: new Date().toISOString(),
      version: '1.0'
    }
    
    return JSON.stringify(statsData, null, 2)
  }
  
  /**
   * 导入统计数据
   */
  const importStats = (data) => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data
      
      if (parsed.postsStats) {
        postsStats.value = new Map(Object.entries(parsed.postsStats))
      }
      
      if (parsed.popularPosts) {
        popularPosts.value = parsed.popularPosts
      }
      
      if (parsed.lastSyncTime) {
        lastSyncTime.value = new Date(parsed.lastSyncTime)
      }
      
      return { success: true, imported: postsStats.value.size }
    } catch (err) {
      console.error('导入统计数据失败:', err)
      return { success: false, error: err.message }
    }
  }
  
  /**
   * 重置所有统计数据
   */
  const resetAllStats = () => {
    postsStats.value.clear()
    popularPosts.value = []
    lastSyncTime.value = null
    console.log('统计数据已重置')
  }
  
  // 返回公共接口
  return {
    // 状态
    postsStats,
    popularPosts,
    lastSyncTime,
    syncInProgress,
    
    // 计算属性
    isOnline,
    canSync,
    pendingUpdatesCount,
    getStatsOverview,
    
    // 核心方法
    getPostStats,
    incrementReadCount,
    refreshPopularPosts,
    syncPendingUpdates,
    
    // 工具方法
    getPostRanking,
    isHotPost,
    cleanExpiredCache,
    
    // 数据管理
    exportStats,
    importStats,
    resetAllStats,
    
    // 初始化
    initialize
  }
})