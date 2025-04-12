<template>
  <!-- 预览区域 -->
  <section class="recent-preview">
    <!-- 图片容器 -->
    <div class="panels">
      <div v-for="(album, index) in pictureAlbums" :key="index" class="panel"
        :class="['panel-' + index, { active: currentIndex === index }]" :id="'panel-' + index">
        <div class="clip">
          <div class="serial-number">0{{ index + 1 }}</div>
          <h1 class="main-title">
            {{ album.name }}<br />
            {{ album.time }}
          </h1>
          <button class="cta-button" @click="scrollToPanel">Learn More</button>
        </div>
        <span class="tint"></span>
        <div class="picture-album-background">
          <img :src="album.cover" :alt="album.name" />
        </div>
        <span class="note">
          <span class="activeSlide">{{ index + 1 }}</span> /
          <span class="slideTotal">{{ pictureAlbums.length }}</span>
        </span>
      </div>
    </div>

    <div class="picture-album-preview">
      <div v-for="(pictureAlbum, index) in pictureAlbums" :key="index" class="picture-album-item"
        :style="{ '--delay': index * 0.1 + 's' }" @mouseenter="handleHover(index)" @mouseleave="handleHover(null)"
        @click="emitSelectAlbum(index)">
        <div class="item-container" :class="{ active: currentIndex === index }">
          <div class="picture-album-cover">
            <img :src="pictureAlbum.cover" :alt="pictureAlbum.name" />
          </div>
          <div class="information-group">
            <div class="picture-album-name">{{ pictureAlbum.name }}</div>
            <div class="picture-album-type">{{ pictureAlbum.type }}</div>
            <div class="picture-album-location">
              {{ pictureAlbum.location }}
            </div>
            <div class="picture-album-time">{{ pictureAlbum.time }}</div>
          </div>
        </div>
      </div>
      <div class="selector" :style="selectorStyle">Explode</div>
    </div>
  </section>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default {
  props: { // 添加 props 定义
    pictureAlbums: {
      type: Array,
      required: true,
      default: () => [] // 提供一个默认值以防万一，虽然 required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      currentHoverIndex: null,
      isScrolling: false,
    };
  },
  mounted() {
    this.initScrollTriggers();
  },
  beforeUnmount() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  },
  computed: {
    selectorStyle() {
      const targetIndex = this.currentHoverIndex ?? this.currentIndex;
      return {
        width: `${100 / this.pictureAlbums.length}%`,
        left: `${(targetIndex * 100) / this.pictureAlbums.length}%`,
        transition: this.currentHoverIndex
          ? "all 0.3s ease"
          : "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      };
    },
  },
  methods: {
    handleHover(index) {
      this.currentHoverIndex = index;
    },
    emitSelectAlbum(index) { // 新增方法用于触发事件
      this.$emit('select-album', index);
    },
    switchPanel(newIndex) { // 此方法现在由父组件调用
      // 边界检查由父组件完成，这里直接使用传入的 newIndex
      if (this.isScrolling) return; // 防止重复触发或在动画中触发(newIndex === this.currentIndex ||)

      this.isScrolling = true;
      this.currentIndex = newIndex; // 更新内部状态以驱动UI

      // 使用 GSAP 滚动到目标面板
      const target = document.querySelector(`#panel-${newIndex}`); // 确保 ID 选择器正确
      if (!target) {
        console.error(`Panel with id #panel-${newIndex} not found.`);
        this.isScrolling = false;
        return;
      }
      const targetPosition = target.offsetTop; // 获取目标面板的顶部位置

      gsap.to(window, {
        duration: 1, // 动画持续时间
        ease: "power2.inOut", // 缓动效果
        scrollTo: {
          y: targetPosition, // 滚动到目标位置
          autoKill: true, // 自动终止冲突的滚动动画
        },
        onComplete: () => {
          this.isScrolling = false; // 动画完成后解除滚动锁定
          this.$emit('animation-complete'); // 触发动画完成事件
        },
        onInterrupt: () => {
          // 如果动画被中断（例如用户快速滚动），也需要考虑解除锁定
          // 但为了防止与父组件的 isScrolling 冲突，暂时不在子组件处理中断
          // this.isScrolling = false;
        }
      });
    },
    initScrollTriggers() {
      // 这个方法设置的是每个 panel 内部元素的视差滚动效果，与主滚动切换逻辑关系不大，可以保留
      const sections = gsap.utils.toArray(".panel");

      sections.forEach((panel) => {
        gsap.to(panel, {
          yPercent: 100,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
  },
};
</script>

<style>
.recent-preview {
  padding: 0;

  .panels {
    width: 100%;

    .panel {
      width: 100%;
      height: 100vh;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .clip {
        position: absolute;
        width: 70vw;
        text-align: left;
        z-index: 2;

        .serial-number {
          font-size: 10rem;
          letter-spacing: -0.02em;
          opacity: 0.6;
        }

        .main-title {
          font-size: 4.5vw;
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 3rem;
          letter-spacing: -0.03em;
        }

        .cta-button {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 1rem 3rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 4rem;
        }

        .cta-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .tint {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
      }

      .picture-album-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .note {
        position: absolute;
        bottom: 48px;
        right: 120px;
        font-size: 18px;
        opacity: 0.8;
      }
    }
  }

  .picture-album-preview {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 70vw;
    height: 20vh;
    border-radius: 1rem 1rem 0 0;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #ffffff41;
    z-index: 1;

    .picture-album-item {
      padding: 1.5rem;
      width: 100%;
      display: flex;
      flex-direction: row;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s forwards;
      animation-delay: var(--delay);

      .item-container {
        position: relative;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-height: fit-content;

        .picture-album-cover {
          overflow: hidden;
          height: 70%;
          aspect-ratio: 4/3;

          img {
            width: 100%;
            height: 100%;
            -o-object-fit: cover;
            object-fit: cover;
          }
        }

        .information-group {
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          max-height: fit-content;
        }
      }

      .item-container::after {
        content: "";
        position: absolute;
        bottom: -1rem;
        left: 0;
        right: 0;
        height: 1px;
        background: white;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
    }

    .item-container.active::after,
    .picture-album-item:hover .item-container::after {
      transform: scaleX(1);
    }

    .selector {
      position: absolute;
      bottom: 0;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1rem 1rem 0 0;
      z-index: -1;
      transition-property: left, width;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
    }
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
