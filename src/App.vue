<template>
  <PageLoader v-if="showLoader" @loadOver="loadOver"></PageLoader>
  <!-- <PageHeader></PageHeader> -->
  <router-view
    class="content"
    @navigateTo="navigateTo"
    @activateMenu="activateMenu"
    @deactivateMenu="deactivateMenu"
    v-slot="{ Component, route }"
  >
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <!-- <PageFooter></PageFooter> -->
  <PageMenu
    v-if="showMenu && menuType === 'profile'"
    ref="menu"
    @changeMenu="navigateTo"
  />
  <BlogMenu v-if="showMenu && menuType === 'blog'" />
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
// import Lenis from "lenis";

import PageFooter from "./components/commonComponents/PageFooter.vue";
import PageHeader from "./components/commonComponents/PageHeader.vue";
import PageLoader from "./components/commonComponents/PageLoader.vue";
import PageMenu from "./components/commonComponents/PageMenu.vue";
import BlogMenu from "./components/commonComponents/BlogMenu.vue";

export default {
  components: {
    PageLoader,
    PageHeader,
    PageMenu,
    PageFooter,
    BlogMenu,
  },
  watch: {
    $route(to, from) {
      console.log("当前页面路由：" + to.path);
      console.log("页面菜单位置：" + to.meta.belongsTo);
      console.log("上一个路由：" + from.path);
      this.menuType = to.meta.belongsTo;
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

<style></style>
