<script setup>
// Placeholder for 404 Not Found View
</script>

<template>
  <div class="container section not-found">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/">返回主页</router-link>
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var; // Import variables for use in scoped styles

.not-found {
  text-align: center;
  min-height: 60vh; // Ensure it takes some vertical space
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: var.$space-md;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: var.$space-xl;
  }

  a {
    // Add button-like styling if desired
    // Example:
    // padding: var.$space-sm var.$space-lg;
    // background-color: var(--accent-primary);
    // color: white;
    // border-radius: var.$radius-md;
    // transition: background-color 0.2s ease;
    // &:hover {
    //   background-color: darken(var.$light-accent-primary, 10%); // Adjust for dark mode too
    //   opacity: 1;
    // }
  }
}
</style>