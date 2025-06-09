// src/composables/useTheme.js
import { ref, readonly, onMounted, watch } from 'vue'

// 主题类型
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// 响应式主题状态
const currentTheme = ref(THEMES.AUTO)
const isDarkMode = ref(false)

export function useTheme() {
  // 获取系统偏好
  const getSystemPreference = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 更新 DOM 的 data-theme 属性
  const updateDOMTheme = (theme) => {
    if (typeof document === 'undefined') return
    
    const html = document.documentElement
    
    if (theme === THEMES.AUTO) {
      // 自动模式：移除 data-theme 属性，让 CSS 媒体查询生效
      html.removeAttribute('data-theme')
      isDarkMode.value = getSystemPreference()
    } else {
      // 手动模式：设置 data-theme 属性
      html.setAttribute('data-theme', theme)
      isDarkMode.value = theme === THEMES.DARK
    }
  }

  // 设置主题
  const setTheme = (theme) => {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Using auto mode.`)
      theme = THEMES.AUTO
    }
    
    currentTheme.value = theme
    updateDOMTheme(theme)
    
    // 保存到 localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pf-theme', theme)
    }
  }

  // 切换主题
  const toggleTheme = () => {
    switch (currentTheme.value) {
      case THEMES.LIGHT:
        setTheme(THEMES.DARK)
        break
      case THEMES.DARK:
        setTheme(THEMES.AUTO)
        break
      case THEMES.AUTO:
      default:
        setTheme(THEMES.LIGHT)
        break
    }
  }

  // 获取主题显示名称
  const getThemeDisplayName = (theme = currentTheme.value) => {
    switch (theme) {
      case THEMES.LIGHT:
        return '浅色模式'
      case THEMES.DARK:
        return '深色模式'
      case THEMES.AUTO:
        return '跟随系统'
      default:
        return '未知'
    }
  }

  // 获取主题图标
  const getThemeIcon = (theme = currentTheme.value) => {
    switch (theme) {
      case THEMES.LIGHT:
        return '☀️'
      case THEMES.DARK:
        return '🌙'
      case THEMES.AUTO:
        return '🔄'
      default:
        return '❓'
    }
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e) => {
      if (currentTheme.value === THEMES.AUTO) {
        isDarkMode.value = e.matches
      }
    }

    // 添加监听器
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // 返回清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }

  // 从 localStorage 加载保存的主题
  const loadSavedTheme = () => {
    if (typeof localStorage === 'undefined') return THEMES.AUTO
    
    const saved = localStorage.getItem('pf-theme')
    return Object.values(THEMES).includes(saved) ? saved : THEMES.AUTO
  }

  // 初始化主题
  const initTheme = () => {
    const savedTheme = loadSavedTheme()
    setTheme(savedTheme)
    
    // 设置系统主题监听器
    const cleanup = setupSystemThemeListener()
    
    // 如果在客户端环境，返回清理函数
    return cleanup
  }

  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    updateDOMTheme(newTheme)
  })

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
  })

  return {
    // 状态
    currentTheme: readonly(currentTheme),
    isDarkMode: readonly(isDarkMode),
    
    // 方法
    setTheme,
    toggleTheme,
    getThemeDisplayName,
    getThemeIcon,
    initTheme,
    
    // 常量
    THEMES
  }
}

// 创建全局主题实例
export const globalTheme = useTheme()

// 默认导出
export default useTheme