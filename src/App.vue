<template>
  <PageLoader v-if="showLoader" @loadOver="loadOver"></PageLoader>
  <PageHeader></PageHeader>
  <router-view
    class="router-content"
    @navigateTo="navigateTo"
    @activateMenu="activateMenu"
    @deactivateMenu="deactivateMenu"
    v-slot="{ Component, route }"
  >
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <!-- 添加 @enter 和 @leave 钩子来控制动画时机 -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <PageFooter></PageFooter>
  <PageMenu
    v-if="showMenu"
    ref="menu"
    @changeMenu="navigateTo"
  />
  <!-- <BlogMenu v-if="showMenu && menuType === 'blog'" /> -->
  <MusicPlayer></MusicPlayer>
  <ThemeController /> <!-- Add the theme controller component -->
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
// import Lenis from "lenis";

import PageFooter from "@/components/AppComponents/PageFooter.vue";
import PageHeader from "./components/AppComponents/PageHeader.vue";
import PageLoader from "./components/AppComponents/PageLoader.vue";
import PageMenu from "./components/AppComponents/PageMenu.vue";
import BlogMenu from "./components/AppComponents/BlogMenu.vue";
import MusicPlayer from "./components/AppComponents/MusicPlayer.vue";
import ThemeController from "./components/AppComponents/ThemeController.vue"; // Import the new component

export default {
  components: {
    PageLoader,
    PageHeader,
    PageMenu,
    PageFooter,
    BlogMenu,
    MusicPlayer,
    ThemeController, // Register the new component
  },
  watch: {
    $route(to, from) {
      console.log("当前页面路由：" + to.path);
      console.log("页面菜单位置：" + to.meta.belongsTo);
      console.log("上一个路由：" + from.path);
      // this.menuType = to.meta.belongsTo;
      // 等待 DOM 更新
      this.$nextTick(() => {
        // 双保险同步
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
        // 关键性能优化
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      });
    },
  },
  data() {
    return {
      showLoader: true,
      showMenu: false,
      menuType: "profile",
    };
  },
  mounted() {
    // Initialize Lenis
    // const lenis = new Lenis({
    //   autoRaf: true,
    // });
    // Listen for the scroll event and log the event data
    // lenis.on("scroll", () => {
    //   // ScrollTrigger.update
    //   // console.log(e);
    // });
    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    // gsap.ticker.add((time) => {
    //   lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    // });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    // gsap.ticker.lagSmoothing(0);
  },
  methods: {
    // Loader Visibility Setting
    loadOver() {
      this.showLoader = false;
      this.setMenuState(true);
    },
    // Global Router Push
    navigateTo(page) {
      this.$router.push(page);
    },
    // Menu State & Animation
    setMenuState(state) {
      this.showMenu = state;
    },
    activateMenu(label) {
      // use this.$nextTick to use $refs.xxx.method after DOM Created
      this.$nextTick(() => {
        this.$refs.menu.activateMenu(label);
      });
    },
    deactivateMenu() {
      this.$nextTick(() => {
        this.$refs.menu.deactivateMenu();
      });
    },
  },
};
</script>

<style>
/* Global Transition Styles */
.router-content {
  /* position: relative; */
  /* width: 100vh; */
  /* overflow: hidden; */
}

/* Fade Transition (Default) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Up Transition (Entering PostPage) */
.slide-up-enter-active {
  transition: transform 0.5s;
}
.slide-up-leave-active {
  transition: transform 0.5s;
  /* Keep the leaving element in place while the new one slides up */
  position: absolute; /* Ensure it stays in flow */
}
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
   /* The leaving element doesn't move, it's covered */
  transform: translateY(0);
}


/* Slide Down Transition (Leaving PostPage) */
/* Note: Leave transitions apply to the element *leaving* the view. */
/* The 'slide-down' name is applied to the *entering* component (BlogPage) */
/* when coming *from* PostPage. We need CSS for when BlogPage enters */
/* with the 'slide-down' transition name. */
.slide-down-enter-active {
  transition: transform 0.5s;
   /* Keep the entering element (BlogPage) in place */
  position: absolute;
}
.slide-down-leave-active {
  transition: transform 0.5s;
}
.slide-down-enter-from {
  /* Entering element (BlogPage) starts in its final position */
  transform: translateY(0);
}
.slide-down-leave-to {
  /* Leaving element (PostPage) slides down */
  transform: translateY(100%);
}


/* Slide Left Transition (Moving to the right in menu) */
.slide-left-enter-active {
  transition: transform 0.5s;
}
.slide-left-leave-active {
  transition: transform 0.5s;
  position: absolute; /* Keep leaving element in flow */
}
.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-50%);
}

/* Slide Right Transition (Moving to the left in menu) */
.slide-right-enter-active {
  transition: transform 0.5s;
}
.slide-right-leave-active {
  transition: transform 0.5s;
  position: absolute; /* Keep leaving element in flow */
}
.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-leave-to {
  transform: translateX(50%);
}

</style>
