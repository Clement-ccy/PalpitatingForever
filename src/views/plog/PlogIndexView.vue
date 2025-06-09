<template>
  <div class="plog-index-view">
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
            <button class="cta-button" @click="viewAlbumDetail(album.id)">查看详情</button>
          </div>
          <span class="tint"></span>
          <div class="picture-album-background">
            <img :src="album.cover" :alt="album.name"/>
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
          @click="switchToAlbum(index)">
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
        <div class="selector" :style="selectorStyle">
          <span>探索</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default {
  name: 'PlogIndexView',
  setup() {
    const router = useRouter();
    
    // 响应式数据
    const currentIndex = ref(0);
    const currentHoverIndex = ref(null);
    const isScrolling = ref(false);
    
    // 示例数据 - 实际项目中应该从 API 获取
    const pictureAlbums = reactive([
      {
        id: 1,
        name: '春日樱花',
        type: '风景摄影',
        location: '东京',
        time: '2024年春',
        cover: '/src/assets/images/cover-1.jpg'
      },
      {
        id: 2,
        name: '夏日海滨',
        type: '人文摄影',
        location: '冲绳',
        time: '2024年夏',
        cover: '/src/assets/images/cover-2.jpg'
      },
      {
        id: 3,
        name: '秋叶满山',
        type: '风景摄影',
        location: '京都',
        time: '2024年秋',
        cover: '/src/assets/images/cover-3.jpg'
      },
      {
        id: 4,
        name: '冬雪纷飞',
        type: '艺术摄影',
        location: '北海道',
        time: '2024年冬',
        cover: '/src/assets/images/cover-4.jpg'
      }
    ]);

    // 计算属性
    const selectorStyle = computed(() => {
      const targetIndex = currentHoverIndex.value ?? currentIndex.value;
      return {
        width: `${100 / pictureAlbums.length}%`,
        left: `${(targetIndex * 100) / pictureAlbums.length}%`,
        transition: currentHoverIndex.value
          ? "all 0.3s ease"
          : "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      };
    });

    // 方法
    const handleHover = (index) => {
      currentHoverIndex.value = index;
    };

    const switchToAlbum = (index) => {
      if (isScrolling.value || index === currentIndex.value) return;

      console.log('Switching to album:', index);
      
      isScrolling.value = true;
      currentIndex.value = index;

      // 计算目标位置：每个面板高度为 100vh
      const targetPosition = index * window.innerHeight;
      const container = document.querySelector('.plog-index-view');
      
      console.log('Target position:', targetPosition, 'Current scroll:', container?.scrollTop || 0);

      if (container) {
        gsap.to(container, {
          duration: 1.2,
          ease: "power2.inOut",
          scrollTop: targetPosition,
          onComplete: () => {
            console.log('Scroll animation complete, final position:', container.scrollTop);
            isScrolling.value = false;
          }
        });
      } else {
        isScrolling.value = false;
      }
    };

    const viewAlbumDetail = (albumId) => {
      router.push({ name: 'PlogItemDetail', params: { id: albumId } });
    };

    const initScrollTriggers = () => {
      const container = document.querySelector('.plog-index-view');
      const sections = gsap.utils.toArray(".panel");

      if (!container) return;

      // 为每个面板创建视差效果
      sections.forEach((panel, index) => {
        gsap.to(panel, {
          yPercent: 100,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
            scroller: container,
          },
        });
      });

      // 监听容器滚动来更新当前索引
      const updateIndex = () => {
        if (!isScrolling.value) {
          const scrollProgress = container.scrollTop / window.innerHeight;
          const newIndex = Math.round(scrollProgress);
          if (newIndex >= 0 && newIndex < pictureAlbums.length && newIndex !== currentIndex.value) {
            currentIndex.value = newIndex;
            console.log('Index updated to:', newIndex, 'scroll position:', container.scrollTop);
          }
        }
      };

      container.addEventListener('scroll', updateIndex);
      
      // 清理函数
      return () => {
        container.removeEventListener('scroll', updateIndex);
      };
    };

    // 滚轮控制
    let isWheelLocked = false;
    const handleWheel = (event) => {
      event.preventDefault();
      
      if (isScrolling.value || isWheelLocked) return;
      
      // 锁定滚轮，防止快速触发
      isWheelLocked = true;
      
      const threshold = 50;
      if (Math.abs(event.deltaY) >= threshold) {
        const direction = event.deltaY > 0 ? 1 : -1;
        const newIndex = currentIndex.value + direction;
        
        console.log('Wheel event:', {
          currentIndex: currentIndex.value,
          direction,
          newIndex,
          totalAlbums: pictureAlbums.length
        });
        
        if (newIndex >= 0 && newIndex < pictureAlbums.length) {
          switchToAlbum(newIndex);
        } else {
          // 如果超出范围，立即解锁
          isWheelLocked = false;
        }
      } else {
        // 如果没有达到阈值，立即解锁
        isWheelLocked = false;
      }
      
      // 解锁滚轮
      if (isWheelLocked) {
        setTimeout(() => {
          isWheelLocked = false;
        }, 1200);
      }
    };

    // 禁用/启用 Lenis
    const disableLenis = () => {
      if (window.lenis) {
        window.lenis.stop();
      }
    };

    const enableLenis = () => {
      if (window.lenis) {
        window.lenis.start();
      }
    };

    // 生命周期
    let cleanupScrollTriggers = null;
    
    onMounted(() => {
      cleanupScrollTriggers = initScrollTriggers();
      // 禁用 Lenis 平滑滚动
      disableLenis();
      // 添加滚轮事件监听
      window.addEventListener('wheel', handleWheel, { passive: false });
      
      // 确保初始位置正确
      setTimeout(() => {
        const container = document.querySelector('.plog-index-view');
        if (container) {
          container.scrollTop = 0;
        }
      }, 100);
    });

    onBeforeUnmount(() => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (cleanupScrollTriggers) {
        cleanupScrollTriggers();
      }
      // 移除滚轮事件监听
      window.removeEventListener('wheel', handleWheel);
      // 重新启用 Lenis
      enableLenis();
    });

    return {
      currentIndex,
      currentHoverIndex,
      isScrolling,
      pictureAlbums,
      selectorStyle,
      handleHover,
      switchToAlbum,
      viewAlbumDetail
    };
  }
};
</script>

<style scoped>
.plog-index-view {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.recent-preview {
  padding: 0;

  .panels {
    width: 100%;
    height: calc(100vh * v-bind('pictureAlbums.length'));
    position: relative;

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
          color: var(--textNormal);
        }

        .main-title {
          color: var(--textNormal);
          font-size: 4.5vw;
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 3rem;
          letter-spacing: -0.03em;
        }

        .cta-button {
          background: transparent;
          border: 1px solid var(--textNormal);
          color: var(--textNormal);
          padding: 1rem 3rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 4rem;
          border-radius: 4px;
        }

        .cta-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
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
        color: var(--textNormal);
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
    background: rgba(255, 255, 255, 0.25);
    z-index: 100;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

    .picture-album-item {
      padding: 1.5rem;
      width: 100%;
      display: flex;
      flex-direction: row;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s forwards;
      animation-delay: var(--delay);
      cursor: pointer;

      .item-container {
        position: relative;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-height: fit-content;
        gap: 1rem;

        .picture-album-cover {
          overflow: hidden;
          height: 70px;
          aspect-ratio: 4/3;
          border-radius: 6px;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
        }

        .information-group {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          max-height: fit-content;
          justify-content: space-between;
          color: var(--textNormal);

          .picture-album-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
          }

          .picture-album-type {
            font-size: 0.7rem;
            opacity: 0.8;
            margin-bottom: 0.25rem;
          }

          .picture-album-location {
            font-size: 0.7rem;
            opacity: 0.7;
            margin-bottom: 0.25rem;
          }

          .picture-album-time {
            font-size: 0.7rem;
            opacity: 0.6;
          }
        }
      }

      .item-container::after {
        content: "";
        position: absolute;
        bottom: -1rem;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover .item-container {
        .picture-album-cover img {
          transform: scale(1.05);
        }
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
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--textNormal);
      opacity: 0.7;

      span {
        position: absolute;
        bottom: 20%;
      }
    }
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recent-preview {
    .panels .panel .clip {
      width: 90vw;
      
      .main-title {
        font-size: 8vw;
      }
      
      .serial-number {
        font-size: 6rem;
      }
    }
    
    .picture-album-preview {
      width: 95vw;
      grid-template-columns: repeat(2, 1fr);
      height: 25vh;
      
      .picture-album-item {
        padding: 1rem;
        
        .item-container {
          flex-direction: column;
          gap: 0.5rem;
          
          .picture-album-cover {
            height: 50px;
          }
          
          .information-group {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
}
</style>