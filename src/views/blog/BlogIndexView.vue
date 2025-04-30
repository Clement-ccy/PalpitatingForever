<script setup>
// Placeholder for Blog Index View
</script>

<template>
  <div class="container section">
    <h1>博客 (Blog Index)</h1>
    <p>这里是博客板块的入口。</p>
    <nav>
      <router-link to="/blog/all">所有文章 (画布)</router-link> |
      <router-link to="/blog/links">友情链接</router-link> |
      <router-link to="/blog/gear">我的装备</router-link> |
      <router-link to="/blog/about">关于本站</router-link>
    </nav>
    <!-- Recent posts or featured content can go here -->
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

nav {
  margin-top: var.$space-xl;
  a {
    margin-right: var.$space-md;
  }
}
</style>