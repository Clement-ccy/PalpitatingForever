<template>
  <Teleport to="body">
    <div
      v-show="isVisible"
      class="page-transition-mask"
      :class="transitionClasses"
      :style="maskStyles"
    >
      <div
        v-for="(stripe, index) in stripes"
        :key="index"
        class="transition-stripe"
        :style="getStripeStyle(index)"
      ></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  stripeCount: {
    type: Number,
    default: 20
  },
  stripeColor: {
    type: String,
    default: '#000000'
  }
})

const isVisible = ref(false)
const isEntering = ref(false)
const isExiting = ref(false)
const transitionDuration = ref(600)

// 生成条纹数组
const stripes = computed(() => {
  return Array.from({ length: props.stripeCount }, (_, index) => ({
    index,
    delay: index * (transitionDuration.value / 2 / props.stripeCount)
  }))
})

// 计算蒙版样式
const maskStyles = computed(() => ({
  '--stripe-count': props.stripeCount,
  '--transition-duration': `${transitionDuration.value}ms`,
  '--stripe-color': props.stripeColor,
  '--stripe-animation-duration': `${transitionDuration.value / 2}ms`
}))

// 计算过渡类名
const transitionClasses = computed(() => ({
  'is-entering': isEntering.value,
  'is-exiting': isExiting.value
}))

// 获取每个条纹的样式
const getStripeStyle = (index) => {
  const height = 100 / props.stripeCount
  const delay = index * (transitionDuration.value / 2 / props.stripeCount)
  const exitDelay = (props.stripeCount - 1 - index) * (transitionDuration.value / 2 / props.stripeCount)
  
  return {
    top: `${index * height}%`,
    height: `${height}%`,
    '--enter-delay': `${delay}ms`,
    '--exit-delay': `${exitDelay}ms`,
    animationDuration: `${transitionDuration.value / 2}ms`
  }
}

// 处理过渡开始
const handleTransitionStart = (event) => {
  const { duration = 600 } = event.detail || {}
  transitionDuration.value = duration
  
  isVisible.value = true
  isEntering.value = true
  isExiting.value = false
}

// 处理过渡退场
const handleTransitionExit = () => {
  isEntering.value = false
  isExiting.value = true
}

// 重置过渡状态
const handleTransitionReset = () => {
  setTimeout(() => {
    isVisible.value = false
    isEntering.value = false
    isExiting.value = false
  }, 100)
}

onMounted(() => {
  window.addEventListener('page-transition-start', handleTransitionStart)
  window.addEventListener('page-transition-exit', handleTransitionExit)
  window.addEventListener('page-transition-reset', handleTransitionReset)
})

onUnmounted(() => {
  window.removeEventListener('page-transition-start', handleTransitionStart)
  window.removeEventListener('page-transition-exit', handleTransitionExit)
  window.removeEventListener('page-transition-reset', handleTransitionReset)
})
</script>

<style lang="scss" scoped>
.page-transition-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.transition-stripe {
  position: absolute;
  left: 0;
  width: 100%;
  background-color: var(--stripe-color);
  transform-origin: top;
  transform: scaleY(0);
  
  .page-transition-mask.is-entering & {
    animation: stripe-enter var(--stripe-animation-duration) ease-out forwards;
    animation-delay: var(--enter-delay);
  }
  
  .page-transition-mask.is-exiting & {
    animation: stripe-exit var(--stripe-animation-duration) ease-out forwards;
    animation-delay: var(--exit-delay);
    transform: scaleY(1);
  }
}

@keyframes stripe-enter {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

@keyframes stripe-exit {
  0% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
</style>