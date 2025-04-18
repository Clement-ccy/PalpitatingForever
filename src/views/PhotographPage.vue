<template>
  <main class="photograph">
    <!-- 左侧页面位置控制圆点组件 -->
    <div class="control-dots">
      <div
        v-for="(_, index) in totalSections"
        :key="index"
        class="dot"
        :class="{ active: currentIndex === index }"
        @click="selectAlbum(index)"
      ></div>
    </div>
    <!-- 预览区域 -->
    <PhotoIntro
      ref="photoIntro"
      :picture-albums="pictureAlbums"
      @select-album="selectAlbum"
      @animation-complete="onAnimationComplete"
    />
    <PhotoWaterfall id="photoWaterfall" class="water-fall" ref="photoWaterfall" />
  </main>
</template>

<script>
import PhotoIntro from "@/components/PhotographPageComponents/PhotoIntro.vue";
import PhotoWaterfall from "@/components/PhotographPageComponents/PhotoWaterfall.vue"; // 导入 PhotoWaterfall
import { gsap } from "gsap"; // 导入 gsap
import { ScrollToPlugin } from "gsap/ScrollToPlugin"; // 导入 ScrollToPlugin

gsap.registerPlugin(ScrollToPlugin); // 注册插件

export default {
  components: {
    PhotoIntro,
    PhotoWaterfall, // 注册 PhotoWaterfall
  },
  data() {
    return {
      currentIndex: 0, // 当前 Page 索引
      isWaterfallActive: false, // 瀑布流是否激活
      isScrolling: false, // 防止滚动事件重复触发
      pictureAlbums: [
        {
          name: "Cuffs of Mother",
          cover: "./src/assets/images/adventure-bg0.jpg",
          type: "Scenery",
          location: "(Indians)",
          time: "2025.03.27",
        },
        {
          name: "The Verdon",
          cover: "./src/assets/images/adventure-bg1.jpg",
          type: "Scenery",
          location: "(France)",
          time: "2025.03.27",
        },
        {
          name: "Gorge",
          cover: "./src/assets/images/adventure-bg2.jpg",
          type: "Scenery",
          location: "(France)",
          time: "2025.03.27",
        },
        {
          name: "The Dolomites",
          cover: "./src/assets/images/adventure-bg3.jpg",
          type: "Scenery",
          location: "(Reb)",
          time: "2025.03.27",
        },
      ],
    };
  },
  computed: {
    // 计算总的“页面”数量，包括 PhotoIntro 的所有面板和瀑布流
    totalSections() {
      return this.pictureAlbums.length + 1; // +1 for waterfall
    },
  },
  mounted() {
    window.addEventListener("wheel", this.handleWheel, { passive: false });
  },
  beforeUnmount() {
    window.removeEventListener("wheel", this.handleWheel);
  },
  methods: {
    handleWheel(event) {
      event.preventDefault(); // 阻止默认滚动行为
      if (this.isScrolling) return;

      const delta = Math.sign(event.deltaY);
      const photoIntroComponent = this.$refs.photoIntro;

      if (!photoIntroComponent) return;

      const isLastIntroPanel = photoIntroComponent.currentIndex === this.pictureAlbums.length - 1;
      const isFirstIntroPanel = photoIntroComponent.currentIndex === 0;

      this.isScrolling = true;

      if (this.isWaterfallActive) {
        // 当前在瀑布流区域
        const targetWaterfall = this.$refs.photoWaterfall?.$el; // 获取瀑布流组件根元素
        if (!targetWaterfall) {
            this.isScrolling = false; // 如果找不到元素，解除锁定并返回
            return;
        }
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const waterfallTop = targetWaterfall.offsetTop;

        // 检查是否向上滚动 (delta < 0) 且窗口顶部接近或超过瀑布流顶部
        if (delta < 0 && currentScrollY <= waterfallTop + 5) { // 添加 5px 缓冲
           // 从瀑布流顶部向上滚动，切换回 PhotoIntro 最后一个面板
           this.isWaterfallActive = false;
           this.currentIndex = this.pictureAlbums.length - 1; // 更新父组件的 currentIndex
           photoIntroComponent.switchPanel(this.currentIndex); // 指示子组件切换, isScrolling 由 onAnimationComplete 处理
           // setTimeout(() => this.isScrolling = false, 1100); // 移除 setTimeout (由 onAnimationComplete 处理)
        } else {
          // 在瀑布流内部自由滚动，不需要特殊处理，解除锁定
          // 但由于 preventDefault，我们需要手动滚动
          window.scrollBy(0, event.deltaY);
          // 快速解除锁定允许连续滚动
           setTimeout(() => this.isScrolling = false, 10); // 增加延迟
        }
      } else {
        // 当前在 PhotoIntro 区域
        if (delta > 0 && isLastIntroPanel) {
          // 在最后一个 Intro 面板向下滚动，切换到瀑布流
          this.scrollToWaterfall(); // isScrolling 由 scrollToWaterfall 的 onComplete 处理
        } else if (delta < 0 && isFirstIntroPanel) {
           // 在第一个 Intro 面板向上滚动，不执行操作
           this.isScrolling = false; // 立刻解除锁定
        }
         else {
          // 在 Intro 面板之间切换
          const newIndex = photoIntroComponent.currentIndex + delta;
          // 让子组件处理内部切换，父组件仅更新状态
          photoIntroComponent.switchPanel(newIndex); // 指示子组件处理滚动和状态更新, isScrolling 由 onAnimationComplete 处理
          // 父组件也需要更新 currentIndex 以便圆点同步
          this.currentIndex = Math.max(0, Math.min(newIndex, this.pictureAlbums.length - 1));
        }
      }
    },

    selectAlbum(index) {
      if (this.isScrolling) return;
      this.isScrolling = true;

      if (index >= 0 && index < this.pictureAlbums.length) {
        // 点击的是 PhotoIntro 的圆点
        this.isWaterfallActive = false;
        this.currentIndex = index;
        if (this.$refs.photoIntro) {
          this.$refs.photoIntro.switchPanel(index); // 调用子组件的方法进行滚动, isScrolling 由 onAnimationComplete 处理
        }
      } else if (index === this.pictureAlbums.length) {
        // 点击的是瀑布流的圆点
        this.scrollToWaterfall(); // isScrolling 由 scrollToWaterfall 的 onComplete 处理
      } else {
         this.isScrolling = false; // 无效索引，直接解除
      }
    },

    scrollToWaterfall() {
      this.isWaterfallActive = true;
      this.currentIndex = this.pictureAlbums.length; // 更新索引表示瀑布流激活
      const target = this.$refs.photoWaterfall;
      if (target && target.$el) { // 确保 target 和 $el 都存在
        const targetOffsetTop = target.$el.offsetTop;
        console.log("Scrolling to waterfall at offsetTop:", targetOffsetTop); // 添加日志
        gsap.to(window, {
          duration: 1,
          ease: "power2.inOut",
          scrollTo: {
            y: targetOffsetTop, // 使用计算好的值
            autoKill: true, // 保持 true
          },
          onComplete: () => {
            this.isScrolling = false;
            console.log("Scroll to waterfall complete, scrolling unlocked.");
          }
        });
      } else {
         console.error("PhotoWaterfall ref or $el not found!"); // 添加错误日志
         this.isScrolling = false; // 如果目标不存在，立即解除锁定
      }
    },

    onAnimationComplete() { // 新增方法处理子组件动画完成事件
      this.isScrolling = false;
      console.log("Animation complete, scrolling unlocked.");
    },
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

.water-fall{
  position: relative;
  z-index: 1;
}
</style>
