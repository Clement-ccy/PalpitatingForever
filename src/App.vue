<template>
  <PageLoader v-if="showLoader" @loadOver="loadOver"></PageLoader>
  <PageHeader></PageHeader>
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
import PageHeader from './components/commonComponents/PageHeader.vue';
import PageLoader from './components/commonComponents/PageLoader.vue';
import PageMenu from './components/commonComponents/PageMenu.vue';

export default {
  components: {
    PageLoader,
    PageHeader,
    PageMenu,
  },
  data() {
    return {
      showLoader: true,
      showMenu: false,
    };
  },
  mounted() {
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

<style>
</style>
