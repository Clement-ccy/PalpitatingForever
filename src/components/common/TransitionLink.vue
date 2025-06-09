<template>
  <component
    :is="tag"
    class="transition-link"
    :class="{ 'is-transitioning': isTransitioning }"
    v-bind="linkAttrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  tag: {
    type: String,
    default: 'a'
  },
  duration: {
    type: Number,
    default: 600
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const router = useRouter()
const route = useRoute()
const { isTransitioning, navigateWithTransition } = usePageTransition()

// 计算链接属性
const linkAttrs = computed(() => {
  if (props.tag === 'a') {
    return {
      href: typeof props.to === 'string' ? props.to : router.resolve(props.to).href
    }
  }
  return {}
})

// 处理点击事件
const handleClick = async (event) => {
  emit('click', event)
  
  if (props.disabled || isTransitioning.value) {
    event.preventDefault()
    return
  }
  
  // 阻止默认导航行为
  event.preventDefault()
  
  // 检查是否为当前路由
  const targetPath = typeof props.to === 'string' ? props.to : router.resolve(props.to).fullPath
  const currentPath = route.fullPath
  
  if (currentPath === targetPath) {
    return
  }
  
  try {
    // 执行带过渡的导航
    await navigateWithTransition(props.to, props.duration)
  } catch (error) {
    console.error('过渡导航失败:', error)
    // 如果过渡失败，执行普通导航
    await router.push(props.to)
  }
}
</script>

<style lang="scss" scoped>
.transition-link {
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &.is-transitioning {
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>