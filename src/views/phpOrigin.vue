<template>
  <main class="photograph">
    <!-- 左侧页面位置控制圆点组件 -->
    <div class="control-dots">
      <div
        v-for="(_, index) in pictureAlbums"
        :key="index"
        class="dot"
        :class="{ active: currentIndex === index }"
        @click="scrollToTarget(index)"
      ></div>
    </div>
    <!-- 预览区域 -->
    <PhotoIntro />
    <section></section>
  </main>
</template>

<script>
import PhotoIntro from "@/components/PhotographPageComponents/PhotoIntro.vue";

export default {
  components: {
    PhotoIntro,
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
};
</script>

<style scoped>
.photograph {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: "Arial", sans-serif;
}

.control-dots {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 100;
  mix-blend-mode: difference;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .dot.active::after {
    content: "";
    position: absolute;
    left: -3.5px;
    top: -3.5px;
    width: 18px;
    height: 18px;
    border: 1px solid white;
    border-radius: 50%;
  }
}
</style>
