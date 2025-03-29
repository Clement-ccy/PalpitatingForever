<template>
  <main class="photograph">
    <!-- 左侧页面位置控制圆点组件 -->
    <div class="control-dots">
      <div
        v-for="(_, index) in pictureAlbums"
        :key="index"
        class="dot"
        :class="{ active: currentIndex === index }"
        @click="selectAlbum(index)"
      ></div>
    </div>
    <!-- 预览区域 -->
    <PhotoIntro />
    <section>
      
    </section>
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
      currentHoverIndex: null,
      pictureAlbums: [
        {
          name: "Cuffs of Mother",
          cover: "src/assets/images/adventure-bg0.jpg",
          type: "Scenery",
          location: "(Indians)",
          time: "2025.03.27",
        },
        {
          name: "The Verdon",
          cover: "src/assets/images/adventure-bg1.jpg",
          type: "Scenery",
          location: "(France)",
          time: "2025.03.27",
        },
        {
          name: "Gorge",
          cover: "src/assets/images/adventure-bg2.jpg",
          type: "Scenery",
          location: "(France)",
          time: "2025.03.27",
        },
        {
          name: "The Dolomites",
          cover: "src/assets/images/adventure-bg3.jpg",
          type: "Scenery",
          location: "(Reb)",
          time: "2025.03.27",
        },
      ],
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

/* .controls {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  display: flex;
  gap: 8px;
}

.controls a {
  display: block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.controls a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.controls a.disabled {
  opacity: 0.3;
  pointer-events: none;
} */

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
