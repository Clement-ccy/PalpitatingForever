<template>
  <div class="cover">
    <div class="cover-content-left">
      <img src="../assets/image/PF.png" alt="图片无法显示" style="height:100vh">
    </div>
    <div class="cover-content-right">
      <h1><span style="color: #D45145;">Chengye</span> Chen</h1>
      <hr />
      <p>Geeks of technology and art, daydreamers, weird designer</p>
      <p>own great proficiency in uiux, frontend development, 3d art</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { startSakura } from '@/js/falling-pieces';

onMounted(()=>{
  startSakura()
})
</script>

<style scoped>
.cover {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--c-text-selected);
  text-align: center;
}

.cover-content-left {
  animation: slideInFromLeft 1s ease-in-out;
}

.cover-content-right {
  margin-right: 8rem;
  animation: slideInFromRight 1s ease-in-out;
}

.cover-content-right p {
  color: rgba(0, 0, 0, 0.2);
}

.cover-content-right hr {
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  margin-inline-start: -0.5em;
  margin-inline-end: -0.5em;
  border-width: 2px;
  border-radius: 1px;
  border-bottom: none;
  border-right: none;
  color: var(--color-border);
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>