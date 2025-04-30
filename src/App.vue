<script setup>
// Import global components
import ControlPanel from '@/components/global/ControlPanel.vue';
import AudioPlayer from '@/components/global/AudioPlayer.vue'; // Uncomment AudioPlayer
// import TheHeader from '@/components/layout/TheHeader.vue';
// import TheFooter from '@/components/layout/TheFooter.vue';

// Import base styles
import '@/pf-ui/pf-ui.scss'; // Assuming pf-ui.scss is the main entry point

// Smooth scrolling initialization (if using Lenis)
import { onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';

let lenis;
const initSmoothScroll = () => {
  lenis = new Lenis({
    // Options: https://github.com/studio-freight/lenis
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false, // Disable for touch devices for native feel
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

onMounted(() => {
  initSmoothScroll();
});

onUnmounted(() => {
  if (lenis) {
    lenis.destroy(); // Clean up Lenis instance
  }
});

</script>

<template>
  <div id="app-container">
    <!-- Optional Global Header -->
    <!-- <TheHeader /> -->

    <!-- Global Control Panel -->
    <ControlPanel />

    <main id="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <!-- Use route.fullPath as key for proper transitions on param changes -->
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <!-- Optional Global Footer -->
    <!-- <TheFooter /> -->

    <!-- Global Audio Player (Positioning handled via CSS) -->
    <AudioPlayer /> <!-- Uncomment AudioPlayer -->
  </div>
</template>

<style lang="scss">
/* Base styles for the app container and transitions */
#app-container {
  /* Basic reset or global layout styles can go here */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
