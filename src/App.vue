<template>
  <router-view @navigateTo="navigateTo" @activateMenu="activateMenu" @deactivateMenu="deactivateMenu" v-slot="{ Component, route }">
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
  <Menu v-if="showMenu" ref="menu" @changeMenu="navigateTo" />
</template>

<script>
export default {
  data() {
    return {
      showMenu: true,
    };
  },
  mounted() {
    // console.log("Menu component mounted");
    this.$router.push('/loading')
  },
  methods: {
    navigateTo(page) {
      this.$router.push(page);
    },
    activateMenu(label) {
      this.$refs.menu.activateMenu(label);
    },
    deactivateMenu() {
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
