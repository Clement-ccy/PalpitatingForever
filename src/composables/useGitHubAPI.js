import { ref, computed } from 'vue'

/**
 * GitHub API 集成 Composable
 * 用于管理博客阅读量的云端同步
 */
export function useGitHubAPI() {
  // 配置常量
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
  const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'PalpitatingForever'
  const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME || 'PalpitatingForever'
  const ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  
  // API 基础 URL
  const GITHUB_API_BASE = 'https://api.github.com'
  const DISCUSSIONS_CATEGORY = 'Analytics' // 统计数据分类
  
  // 响应式状态
  const isLoading = ref(false)
  const error = ref(null)
  const rateLimitRemaining = ref(5000)
  const rateLimitReset = ref(null)
  
  // 离线队列
  const pendingUpdates = ref([])
  const isOnline = ref(navigator.onLine)
  
  // 计算属性
  const isConfigured = computed(() => {
    return GITHUB_TOKEN && REPO_OWNER && REPO_NAME && ANALYTICS_ENABLED
  })
  
  const canMakeRequest = computed(() => {
    return isConfigured.value && isOnline.value && rateLimitRemaining.value > 0
  })
  
  /**
   * 创建 GitHub API 请求头
   */
  const createHeaders = () => {
    return {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
  
  /**
   * 处理 API 响应和错误
   */
  const handleResponse = async (response) => {
    // 更新速率限制信息
    rateLimitRemaining.value = parseInt(response.headers.get('X-RateLimit-Remaining') || '0')
    rateLimitReset.value = new Date(parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `GitHub API Error: ${response.status}`)
    }
    
    return response.json()
  }
  
  /**
   * 重试机制
   */
  const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
    let lastError = null
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (err) {
        lastError = err
        
        // 如果是速率限制错误，等待重置时间
        if (err.message.includes('rate limit') && rateLimitReset.value) {
          const waitTime = rateLimitReset.value.getTime() - Date.now()
          if (waitTime > 0 && waitTime < 3600000) { // 最多等待1小时
            await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, delay * Math.pow(2, i))))
            continue
          }
        }
        
        // 最后一次重试失败，或者是其他错误
        if (i === maxRetries) break
        
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
    
    throw lastError
  }
  
  /**
   * 获取或创建 Analytics 分类
   */
  const getAnalyticsCategory = async () => {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/discussions/categories`,
        {
          method: 'GET',
          headers: createHeaders()
        }
      )
      
      const categories = await handleResponse(response)
      const analyticsCategory = categories.find(cat => cat.name === DISCUSSIONS_CATEGORY)
      
      if (analyticsCategory) {
        return analyticsCategory.id
      }
      
      console.warn(`GitHub Discussions 分类 "${DISCUSSIONS_CATEGORY}" 不存在，请手动创建`)
      return null
    } catch (err) {
      console.error('获取 Discussions 分类失败:', err)
      return null
    }
  }
  
  /**
   * 搜索文章统计 Discussion
   */
  const findStatsDiscussion = async (postId, postTitle) => {
    try {
      const query = `repo:${REPO_OWNER}/${REPO_NAME} in:title "[BLOG-STATS] ${postTitle || postId}"`
      const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}&type=Discussions`,
        {
          method: 'GET',
          headers: createHeaders()
        }
      )
      
      const results = await handleResponse(response)
      return results.items?.[0] || null
    } catch (err) {
      console.error('搜索统计 Discussion 失败:', err)
      return null
    }
  }
  
  /**
   * 创建文章统计 Discussion
   */
  const createStatsDiscussion = async (postInfo) => {
    const categoryId = await getAnalyticsCategory()
    if (!categoryId) {
      throw new Error('Analytics 分类不存在')
    }
    
    const title = `📊 [BLOG-STATS] ${postInfo.title || postInfo.id}`
    const body = `---
BLOG_ID: ${postInfo.id}
TITLE: ${postInfo.title || ''}
CATEGORY: ${postInfo.category || ''}
TOTAL_VIEWS: 1
LAST_UPDATED: ${new Date().toISOString()}
CREATED_AT: ${new Date().toISOString()}
---

## 统计详情
- 📖 总阅读量: 1
- 📅 最后更新: ${new Date().toLocaleDateString()}
- 🏷️ 分类: ${postInfo.category || '未分类'}
- 🔗 文章链接: /blog/post/${postInfo.id}

## 更新日志
- ${new Date().toLocaleDateString()}: +1 阅读量 (创建)`
    
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/discussions`,
        {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify({
            title,
            body,
            category_id: categoryId
          })
        }
      )
      
      return await handleResponse(response)
    } catch (err) {
      console.error('创建统计 Discussion 失败:', err)
      throw err
    }
  }
  
  /**
   * 更新文章统计 Discussion
   */
  const updateStatsDiscussion = async (discussion, newViews) => {
    try {
      // 解析当前统计信息
      const currentBody = discussion.body
      const viewsMatch = currentBody.match(/TOTAL_VIEWS: (\d+)/)
      const currentViews = viewsMatch ? parseInt(viewsMatch[1]) : 0
      const totalViews = currentViews + newViews
      
      // 更新内容
      const updatedBody = currentBody
        .replace(/TOTAL_VIEWS: \d+/, `TOTAL_VIEWS: ${totalViews}`)
        .replace(/LAST_UPDATED: [^\n]+/, `LAST_UPDATED: ${new Date().toISOString()}`)
        .replace(/- 📖 总阅读量: \d+/, `- 📖 总阅读量: ${totalViews}`)
        .replace(/- 📅 最后更新: [^\n]+/, `- 📅 最后更新: ${new Date().toLocaleDateString()}`)
        + `\n- ${new Date().toLocaleDateString()}: +${newViews} 阅读量`
      
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/discussions/${discussion.number}`,
        {
          method: 'PATCH',
          headers: createHeaders(),
          body: JSON.stringify({
            body: updatedBody
          })
        }
      )
      
      return await handleResponse(response)
    } catch (err) {
      console.error('更新统计 Discussion 失败:', err)
      throw err
    }
  }
  
  /**
   * 增加文章阅读计数
   */
  const incrementReadCount = async (postInfo, count = 1) => {
    if (!canMakeRequest.value) {
      // 添加到离线队列
      pendingUpdates.value.push({
        type: 'increment',
        postInfo,
        count,
        timestamp: Date.now()
      })
      return { success: false, queued: true }
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      await withRetry(async () => {
        // 查找现有的统计 Discussion
        let discussion = await findStatsDiscussion(postInfo.id, postInfo.title)
        
        if (discussion) {
          // 更新现有 Discussion
          await updateStatsDiscussion(discussion, count)
        } else {
          // 创建新的 Discussion
          await createStatsDiscussion(postInfo)
        }
      })
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('增加阅读计数失败:', err)
      
      // 失败时添加到队列以供后续重试
      pendingUpdates.value.push({
        type: 'increment',
        postInfo,
        count,
        timestamp: Date.now()
      })
      
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 获取文章统计信息
   */
  const getPostStats = async (postId, postTitle) => {
    if (!canMakeRequest.value) {
      return null
    }
    
    try {
      const discussion = await findStatsDiscussion(postId, postTitle)
      if (!discussion) {
        return { views: 0, lastUpdated: null }
      }
      
      const viewsMatch = discussion.body.match(/TOTAL_VIEWS: (\d+)/)
      const updatedMatch = discussion.body.match(/LAST_UPDATED: ([^\n]+)/)
      
      return {
        views: viewsMatch ? parseInt(viewsMatch[1]) : 0,
        lastUpdated: updatedMatch ? new Date(updatedMatch[1]) : null,
        discussion
      }
    } catch (err) {
      console.error('获取文章统计失败:', err)
      return null
    }
  }
  
  /**
   * 获取热门文章排行
   */
  const getPopularPosts = async (limit = 10) => {
    if (!canMakeRequest.value) {
      return []
    }
    
    try {
      const query = `repo:${REPO_OWNER}/${REPO_NAME} in:title "[BLOG-STATS]"`
      const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}&type=Discussions&sort=comments&order=desc&per_page=${limit}`,
        {
          method: 'GET',
          headers: createHeaders()
        }
      )
      
      const results = await handleResponse(response)
      
      return results.items?.map(item => {
        const viewsMatch = item.body.match(/TOTAL_VIEWS: (\d+)/)
        const idMatch = item.body.match(/BLOG_ID: ([^\n]+)/)
        const titleMatch = item.body.match(/TITLE: ([^\n]+)/)
        const categoryMatch = item.body.match(/CATEGORY: ([^\n]+)/)
        
        return {
          id: idMatch?.[1] || '',
          title: titleMatch?.[1] || '',
          category: categoryMatch?.[1] || '',
          views: viewsMatch ? parseInt(viewsMatch[1]) : 0,
          discussion: item
        }
      }).filter(item => item.id) || []
    } catch (err) {
      console.error('获取热门文章失败:', err)
      return []
    }
  }
  
  /**
   * 批量同步待处理的统计数据
   */
  const syncPendingUpdates = async () => {
    if (!canMakeRequest.value || pendingUpdates.value.length === 0) {
      return { synced: 0, failed: 0 }
    }
    
    let synced = 0
    let failed = 0
    const updates = [...pendingUpdates.value]
    pendingUpdates.value = []
    
    for (const update of updates) {
      try {
        await incrementReadCount(update.postInfo, update.count)
        synced++
      } catch (err) {
        failed++
        // 重新加入队列
        pendingUpdates.value.push(update)
      }
    }
    
    return { synced, failed }
  }
  
  /**
   * 监听网络状态变化
   */
  const setupNetworkListener = () => {
    const handleOnline = () => {
      isOnline.value = true
      // 网络恢复时自动同步待处理的更新
      syncPendingUpdates()
    }
    
    const handleOffline = () => {
      isOnline.value = false
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }
  
  // 返回公共接口
  return {
    // 状态
    isLoading,
    error,
    isConfigured,
    canMakeRequest,
    rateLimitRemaining,
    rateLimitReset,
    pendingUpdates,
    isOnline,
    
    // 核心功能
    incrementReadCount,
    getPostStats,
    getPopularPosts,
    syncPendingUpdates,
    
    // 工具函数
    setupNetworkListener
  }
}

// 导出单例实例
let apiInstance = null

export function useGitHubAPISingleton() {
  if (!apiInstance) {
    apiInstance = useGitHubAPI()
  }
  return apiInstance
}