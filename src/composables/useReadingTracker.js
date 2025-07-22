import { ref, reactive, computed } from 'vue'

/**
 * 轻量级博客阅读状态跟踪 Composable
 * 功能：本地存储用户阅读状态，防重复统计，管理阅读历史
 */
export function useReadingTracker() {
  // 存储键名
  const STORAGE_KEY = 'blogReading'
  const STORAGE_VERSION = '1.0'
  
  // 响应式状态
  const isLoading = ref(false)
  const error = ref(null)
  
  // 默认数据结构
  const defaultData = {
    readPosts: {},
    preferences: {
      trackReading: true,
      showStats: true,
      enableAnalytics: true
    },
    cache: {
      lastClearTime: new Date().toISOString(),
      version: STORAGE_VERSION
    }
  }

  /**
   * 从 localStorage 获取数据
   */
  const getStorageData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return defaultData
      
      const data = JSON.parse(stored)
      
      // 版本检查和数据迁移
      if (!data.cache || data.cache.version !== STORAGE_VERSION) {
        console.log('博客阅读数据版本升级，重置数据')
        return defaultData
      }
      
      return { ...defaultData, ...data }
    } catch (err) {
      console.error('读取阅读数据失败:', err)
      error.value = '数据读取失败'
      return defaultData
    }
  }

  /**
   * 保存数据到 localStorage
   */
  const saveStorageData = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      error.value = null
    } catch (err) {
      console.error('保存阅读数据失败:', err)
      error.value = '数据保存失败'
    }
  }

  /**
   * 检查文章是否已读
   * @param {string} postId - 文章ID
   * @returns {boolean} 是否已读
   */
  const isPostRead = (postId) => {
    if (!postId) return false
    
    const data = getStorageData()
    return !!data.readPosts[postId]
  }

  /**
   * 标记文章为已读
   * @param {string} postId - 文章ID
   * @param {object} postInfo - 文章信息 { title, category, slug }
   * @returns {boolean} 是否成功标记
   */
  const markAsRead = (postId, postInfo = {}) => {
    if (!postId) {
      error.value = '文章ID不能为空'
      return false
    }

    try {
      const data = getStorageData()
      
      // 检查是否已经读过（防重复）
      if (data.readPosts[postId]) {
        console.log(`文章 ${postId} 已经标记为已读`)
        return true
      }

      // 标记为已读
      data.readPosts[postId] = {
        readAt: new Date().toISOString(),
        readCount: 1,
        lastPosition: 0,
        readingTime: 0,
        title: postInfo.title || '',
        category: postInfo.category || '',
        slug: postInfo.slug || ''
      }

      saveStorageData(data)
      console.log(`文章 ${postId} 已标记为已读`)
      return true
    } catch (err) {
      console.error('标记文章已读失败:', err)
      error.value = '标记失败'
      return false
    }
  }

  /**
   * 更新阅读进度
   * @param {string} postId - 文章ID
   * @param {number} position - 阅读位置 (0-1)
   * @param {number} readingTime - 阅读时长（秒）
   */
  const updateReadingProgress = (postId, position, readingTime = 0) => {
    if (!postId || typeof position !== 'number') return

    try {
      const data = getStorageData()
      
      if (data.readPosts[postId]) {
        data.readPosts[postId].lastPosition = Math.max(0, Math.min(1, position))
        data.readPosts[postId].readingTime += readingTime
        saveStorageData(data)
      }
    } catch (err) {
      console.error('更新阅读进度失败:', err)
    }
  }

  /**
   * 获取文章阅读信息
   * @param {string} postId - 文章ID
   * @returns {object|null} 阅读信息
   */
  const getReadingInfo = (postId) => {
    if (!postId) return null
    
    const data = getStorageData()
    return data.readPosts[postId] || null
  }

  /**
   * 获取阅读历史列表
   * @param {number} limit - 限制数量
   * @returns {Array} 阅读历史数组
   */
  const getReadHistory = (limit = 10) => {
    try {
      const data = getStorageData()
      const posts = Object.entries(data.readPosts)
        .map(([id, info]) => ({ id, ...info }))
        .sort((a, b) => new Date(b.readAt) - new Date(a.readAt))
        .slice(0, limit)
      
      return posts
    } catch (err) {
      console.error('获取阅读历史失败:', err)
      return []
    }
  }

  /**
   * 获取阅读统计
   * @returns {object} 统计信息
   */
  const getReadingStats = () => {
    try {
      const data = getStorageData()
      const posts = Object.values(data.readPosts)
      
      return {
        totalRead: posts.length,
        totalReadingTime: posts.reduce((sum, post) => sum + (post.readingTime || 0), 0),
        categoriesRead: [...new Set(posts.map(p => p.category).filter(Boolean))],
        averageReadingTime: posts.length > 0 ? 
          posts.reduce((sum, post) => sum + (post.readingTime || 0), 0) / posts.length : 0,
        lastReadAt: posts.length > 0 ? 
          Math.max(...posts.map(p => new Date(p.readAt).getTime())) : null
      }
    } catch (err) {
      console.error('获取阅读统计失败:', err)
      return {
        totalRead: 0,
        totalReadingTime: 0,
        categoriesRead: [],
        averageReadingTime: 0,
        lastReadAt: null
      }
    }
  }

  /**
   * 清除阅读历史
   * @param {number} daysAgo - 清除多少天前的数据（默认90天）
   */
  const clearOldHistory = (daysAgo = 90) => {
    try {
      const data = getStorageData()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
      
      let clearCount = 0
      Object.keys(data.readPosts).forEach(postId => {
        const readAt = new Date(data.readPosts[postId].readAt)
        if (readAt < cutoffDate) {
          delete data.readPosts[postId]
          clearCount++
        }
      })
      
      if (clearCount > 0) {
        data.cache.lastClearTime = new Date().toISOString()
        saveStorageData(data)
        console.log(`清除了 ${clearCount} 条过期阅读记录`)
      }
      
      return clearCount
    } catch (err) {
      console.error('清除历史记录失败:', err)
      return 0
    }
  }

  /**
   * 获取用户偏好设置
   */
  const getPreferences = () => {
    const data = getStorageData()
    return data.preferences
  }

  /**
   * 更新用户偏好设置
   * @param {object} newPrefs - 新的偏好设置
   */
  const updatePreferences = (newPrefs) => {
    try {
      const data = getStorageData()
      data.preferences = { ...data.preferences, ...newPrefs }
      saveStorageData(data)
    } catch (err) {
      console.error('更新偏好设置失败:', err)
    }
  }

  /**
   * 完全重置阅读数据
   */
  const resetAllData = () => {
    try {
      saveStorageData(defaultData)
      console.log('阅读数据已重置')
    } catch (err) {
      console.error('重置数据失败:', err)
    }
  }

  // 计算属性
  const readingStats = computed(() => getReadingStats())
  const preferences = computed(() => getPreferences())

  // 返回公共接口
  return {
    // 状态
    isLoading,
    error,
    readingStats,
    preferences,
    
    // 核心功能
    isPostRead,
    markAsRead,
    updateReadingProgress,
    getReadingInfo,
    
    // 历史和统计
    getReadHistory,
    getReadingStats,
    
    // 设置管理
    getPreferences,
    updatePreferences,
    
    // 数据管理
    clearOldHistory,
    resetAllData
  }
}

// 导出单例实例，避免重复创建
let trackerInstance = null

export function useReadingTrackerSingleton() {
  if (!trackerInstance) {
    trackerInstance = useReadingTracker()
  }
  return trackerInstance
}