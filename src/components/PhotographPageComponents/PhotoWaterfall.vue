<template>
  <section class="photo-waterfall">
    <div class="grid-wrapper">
      <!-- 图片项 -->
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[getImageClass(item), { 'hovered': index === hoveredIndex, 'dimmed': hoveredIndex !== null && index !== hoveredIndex }]"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
      >
        <img :src="item.src" :alt="item.alt" />
        <div class="overlay-info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.alt }}</p> <!-- 使用 alt 作为简介 -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PhotoWaterfall",
  props: {
    initialItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 使用更多样化的占位符尺寸
      items: [
        { src: "https://placeholder.im/250x200?text=Normal+1", alt: "Normal 1", title: "Normal 1" },
        { src: "https://placeholder.im/250x380?text=Tall+1", alt: "Tall 1", title: "Tall 1" }, // tall
        { src: "https://placeholder.im/510x200?text=Wide+1", alt: "Wide 1", title: "Wide 1" }, // wide
        { src: "https://placeholder.im/510x410?text=Big+1", alt: "Big 1", title: "Big 1" },     // big
        { src: "https://placeholder.im/250x210?text=Normal+2", alt: "Normal 2", title: "Normal 2" },
        { src: "https://placeholder.im/250x400?text=Tall+2", alt: "Tall 2", title: "Tall 2" }, // tall
        { src: "https://placeholder.im/250x190?text=Normal+3", alt: "Normal 3", title: "Normal 3" },
        { src: "https://placeholder.im/520x420?text=Big+2", alt: "Big 2", title: "Big 2" },     // big
        { src: "https://placeholder.im/500x200?text=Wide+2", alt: "Wide 2", title: "Wide 2" }, // wide
        { src: "https://placeholder.im/250x390?text=Tall+3", alt: "Tall 3", title: "Tall 3" }, // tall
        { src: "https://placeholder.im/250x205?text=Normal+4", alt: "Normal 4", title: "Normal 4" },
        { src: "https://placeholder.im/530x200?text=Wide+3", alt: "Wide 3", title: "Wide 3" }, // wide
      ],
      hoveredIndex: null, // 跟踪悬停项的索引
    };
  },
  mounted() {
    if (this.initialItems.length > 0) {
      this.items = this.initialItems;
    }
    // 注意：如果使用真实图片，需要在此处或获取数据后
    // 异步加载图片并获取其 naturalWidth 和 naturalHeight 来判断类别
  },
  methods: {
    getImageClass(item) {
      // 尝试从占位符 URL 解析尺寸
      const match = item.src.match(/placeholder\.im\/(\d+)x(\d+)/);
      if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);

        // 定义判断阈值 (可调整)
        const tallThreshold = 1.4;
        const wideThreshold = 1.4;
        const bigThreshold = 400; // 假设宽高都大于此值为 big

        if (width > bigThreshold && height > bigThreshold) {
          return 'big';
        } else if (height / width > tallThreshold) {
          return 'tall';
        } else if (width / height > wideThreshold) {
          return 'wide';
        }
      }
      // 默认或无法解析时返回 normal
      // 注意：在实际应用中，需要更可靠的方法获取图片尺寸
      // 例如：在图片加载后 (onload 事件) 获取 naturalWidth/naturalHeight
      return 'normal'; // 默认返回 'normal' 或空字符串 ''
    },
    handleMouseEnter(index) {
      this.hoveredIndex = index;
    },
    handleMouseLeave() {
      this.hoveredIndex = null;
    }
  }
};
</script>

<style scoped>
/* Base styles */
img {
  max-width: 100%;
  height: auto;
  display: block; /* 确保图片是块级元素 */
}

/* Main CSS */
.grid-wrapper {
	display: grid;
	grid-gap: 10px;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	grid-auto-rows: 200px; /* 行高基准 */
  grid-auto-flow: dense;
  padding: 15px;
  transition: all 0.3s ease; /* 为容器添加过渡效果 */
}

.grid-wrapper > div {
  position: relative; /* 为绝对定位的 overlay 提供容器 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease; /* 添加过渡 */
  cursor: pointer; /* 添加手型光标 */
}

.grid-wrapper > div > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease; /* 图片本身的过渡（如果需要） */
}

/* Hover Effects */
.grid-wrapper > div.hovered {
  transform: scale(1.01); /* 放大 */
  opacity: 1;
  filter: brightness(1);
  z-index: 10; /* 确保在最前面 */
}

.grid-wrapper > div.dimmed {
  opacity: 0.9; /* 变暗 */
  filter: brightness(0.9); /* 降低亮度 */
  /* transform: scale(0.99); 缩小 */
}

/* Overlay Info */
.overlay-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
  color: white;
  padding: 10px;
  box-sizing: border-box;
  opacity: 0; /* 默认隐藏 */
  transform: translateY(100%); /* 从下方滑入 */
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-bottom-left-radius: 5px; /* 匹配容器圆角 */
  border-bottom-right-radius: 5px;
}

.grid-wrapper > div.hovered .overlay-info {
  opacity: 1; /* 悬停时显示 */
  transform: translateY(0); /* 滑入到位 */
}

.overlay-info h3 {
  margin: 0 0 5px 0;
  font-size: 1em;
  font-weight: bold;
}

.overlay-info p {
  margin: 0;
  font-size: 0.85em;
}


/* Grid spanning classes */
.grid-wrapper .wide {
	grid-column: span 2;
}
.grid-wrapper .tall {
	grid-row: span 2;
}
.grid-wrapper .big {
	grid-column: span 2;
	grid-row: span 2;
}

/* 可选：添加一些基础样式 */
.photo-waterfall {
  padding-left: 6rem;
  padding-right: 6rem;
  background: var(--c-background-dark);
  padding-bottom: 0;
  color: white; /* 如果需要文字颜色 */
  min-height: 100vh; /* 保持最小高度 */
}

/* 移除旧的响应式查询，因为 grid 本身具有响应性 */
/* 如果需要更精细的控制，可以重新添加 */

</style>
