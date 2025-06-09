<script setup>
// Import layout components
import TheHeader from '@/components/layout/TheHeader.vue';
import TheMobileHeader from '@/components/layout/TheMobileHeader.vue';
import TheFooter from '@/components/layout/TheFooter.vue';
import PageWrapper from '@/components/layout/PageWrapper.vue';

// Import global components
import AudioPlayer from '@/components/global/AudioPlayer.vue';
import PageTransitionMask from '@/components/global/PageTransitionMask.vue';

// Import base styles
import '@/pf-ui/pf-ui.scss';

// Smooth scrolling initialization (if using Lenis)
import { ref, onMounted, onUnmounted} from 'vue';
import Lenis from 'lenis';

// 响应式状态
const isMobile = ref(false);

// 检查移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

let lenis;
const initSmoothScroll = () => {
  lenis = new Lenis({
    // Options: https://github.com/studio-freight/lenis
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false, // Disable for touch devices for native feel
    touchMultiplier: 2,
  });

  // 将 Lenis 实例挂载到 window 对象上，方便其他组件访问
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

onMounted(() => {
  initSmoothScroll();
  checkMobile();
  
  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  if (lenis) {
    lenis.destroy(); // Clean up Lenis instance
  }
  
  // 清理事件监听
  window.removeEventListener('resize', checkMobile);
});

</script>

<template>
  <div id="app-container">
    <!-- 根据屏幕尺寸条件渲染不同的 Header -->
    <TheHeader v-if="!isMobile" />
    <TheMobileHeader v-else />

    <PageWrapper>
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <!-- Use route.fullPath as key for proper transitions on param changes -->
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </PageWrapper>

    <!-- Global Footer -->
    <TheFooter />

    <!-- Global Audio Player (Positioning handled via CSS) -->
    <AudioPlayer />
    
    <!-- Global Page Transition Mask -->
    <PageTransitionMask
      :stripe-count="30"
      stripe-color="#000000"
    />
    
  </div>
</template>

<style lang="scss">
/* Base styles for the app container and transitions */
#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px; // 为固定页头留出空间
  
  @media (max-width: 768px) {
    padding-top: 70px; // 移动端页头高度
  }
  
  // PlogIndex 页面全屏显示，移除顶部边距
  &:has(.page-plogindex.page-wrapper--fullscreen) {
    padding-top: 0;
  }
}

#main-content {
  flex-grow: 1; // Ensure main content takes available space
}

/* Basic Page Transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Add more sophisticated transitions using GSAP later */

/* Import global styles defined in pf-ui */
/* @import '@/pf-ui/pf-ui.scss'; // Already imported in script setup is better for HMR */

</style>
