<template>
  <PageLoader v-if="showLoader" @loadOver="loadOver"></PageLoader>
  <PageHeader></PageHeader>
  <router-view class="content" @navigateTo="navigateTo" @activateMenu="activateMenu" @deactivateMenu="deactivateMenu"
    v-slot="{ Component, route }">
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <PageFooter></PageFooter>
  <PageMenu v-if="showMenu" ref="menu" @changeMenu="navigateTo" />
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import PageFooter from './components/commonComponents/PageFooter.vue';
import PageHeader from './components/commonComponents/PageHeader.vue';
import PageLoader from './components/commonComponents/PageLoader.vue';
import PageMenu from './components/commonComponents/PageMenu.vue';

export default {
  components: {
    PageLoader,
    PageHeader,
    PageMenu,
    PageFooter,
  },
  watch: {
    $route(to, from) {
      console.log('路由变化了');
      console.log('当前页面路由：' + to.path);
      console.log('上一个路由：' + from.path);
      // 等待 DOM 更新
      this.$nextTick(() => {
        // 双保险同步
        window.dispatchEvent(new Event('resize'))
        window.dispatchEvent(new Event('scroll'))
        // 关键性能优化
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true)
        })
      })
    }
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
      // use this.$nextTick to use $refs.xxx.method after DOM Created
      this.$nextTick(() => {
        this.$refs.menu.activateMenu(label);
      })
    },
    deactivateMenu() {
      this.$nextTick(() => {
        this.$refs.menu.deactivateMenu();
      })
    },
  },
};
</script>

<style></style>
