import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 全局状态
const isTransitioning = ref(false)

// 执行带蒙版的页面过渡 - 需要在组件内部调用
export function createNavigateWithTransition() {
  const router = useRouter()
  
  return async function navigateWithTransition(to, duration = 600) {
    if (isTransitioning.value) {
      console.warn('过渡正在进行中，跳过新的过渡请求')
      return
    }
    
    isTransitioning.value = true
    
    try {
      // 触发蒙版入场
      window.dispatchEvent(new CustomEvent('page-transition-start', {
        detail: { duration }
      }))
      
      // 等待蒙版覆盖屏幕
      await new Promise(resolve => setTimeout(resolve, duration / 2))
      
      // 执行路由切换
      await router.push(to)
      
      // 触发蒙版退场
      window.dispatchEvent(new CustomEvent('page-transition-exit'))
      
      // 等待完全结束
      await new Promise(resolve => setTimeout(resolve, duration / 2))
      
    } catch (error) {
      console.error('页面过渡失败:', error)
    } finally {
      isTransitioning.value = false
      
      // 重置状态
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('page-transition-reset'))
      }, 100)
    }
  }
}

export function usePageTransition() {
  const navigateWithTransition = createNavigateWithTransition()
  
  return {
    isTransitioning,
    navigateWithTransition
  }
}