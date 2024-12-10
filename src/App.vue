<template>
  <PageLoader v-if="showLoader" @loadOver="loadOver"></PageLoader>
  <router-view class="content" @navigateTo="navigateTo" @activateMenu="activateMenu" @deactivateMenu="resetMenu"
    v-slot="{ Component, route }">
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <PageMenu v-if="showMenu" ref="menu" @changeMenu="navigateTo" />
</template>

<script>
// import { gsap, ScrollTrigger, ScrollSmoother } from "gsap";
import PageLoader from './components/PageLoader.vue';
import PageMenu from './components/PageMenu.vue';

export default {
  components: {
    PageLoader,
    PageMenu,
  },
  data() {
    return {
      showLoader: true,
      showMenu: false,
    };
  },
  mounted() {
    // Object fade-in & fade-out
    // ScrollTrigger.create({
    //   trigger: ".fade-element",
    //   start: "top center",
    //   end: "bottom center",
    //   onEnter: () => {
    //     gsap.to(".fade-element", {
    //       duration: 0.5,
    //       opacity: 1
    //     });
    //   },
    //   onLeave: () => {
    //     gsap.to(".fade-element", {
    //       duration: 0.5,
    //       opacity: 0
    //     });
    //   }
    // });
    // Smooth Scroll
    // gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // ScrollTrigger.normalizeScroll(true)

    // // create the smooth scroller FIRST!
    // // eslint-disable-next-line no-unused-vars
    // let smoother = ScrollSmoother.create({
    //   smooth: 2,
    //   effects: true,
    //   normalizeScroll: true
    // });
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
      this.$refs.menu.activateMenu(label);
    },
    resetMenu() {
      this.$refs.menu.resetMenu();
    },
  },
};
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
