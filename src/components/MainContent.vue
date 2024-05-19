<template>
    <div>
      <div class="main-content" id="portfolio">
        <h2>Portfolio</h2>
        <!-- 瀑布流展示作品集 -->
      </div>
  
      <div class="main-content" id="about">
        <h2>About</h2>
        <!-- 关于页面内容 -->
      </div>
  
      <div class="main-content" id="blog">
        <h2>Blog</h2>
        <!-- 博客内容 -->
      </div>
  
      <div class="main-content" id="contact">
        <h2>Contact</h2>
        <!-- 联系信息 -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MainContent'
  }
  </script>
  
  <style scoped>
  /* 样式可以根据需要自行调整 */
  .main-content {
    padding: 50px;
    height: 200vh;
    
  }
  </style>