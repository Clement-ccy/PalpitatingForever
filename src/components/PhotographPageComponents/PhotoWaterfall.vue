<template>
  <section class="photo-waterfall">
    <div class="waterfall-grid">
      <!-- 瀑布流图片项 -->
      <div v-for="(item, index) in items" :key="index" class="waterfall-item">
        <img :src="item.src" :alt="item.alt" />
        <p>{{ item.title }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PhotoWaterfall",
  props: {
    // 未来可以从父组件接收图片数据
    initialItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 暂时使用一些占位数据
      items: [
        { src: "https://placeholder.im/300x400?text=Image+1", alt: "Image 1", title: "Waterfall Image 1" },
        { src: "https://placeholder.im/300x500?text=Image+2", alt: "Image 2", title: "Waterfall Image 2" },
        { src: "https://placeholder.im/300x350?text=Image+3", alt: "Image 3", title: "Waterfall Image 3" },
        { src: "https://placeholder.im/300x450?text=Image+4", alt: "Image 4", title: "Waterfall Image 4" },
        { src: "https://placeholder.im/300x400?text=Image+5", alt: "Image 5", title: "Waterfall Image 5" },
        { src: "https://placeholder.im/300x550?text=Image+6", alt: "Image 6", title: "Waterfall Image 6" },
        { src: "https://placeholder.im/300x300?text=Image+7", alt: "Image 7", title: "Waterfall Image 7" },
        { src: "https://placeholder.im/300x420?text=Image+8", alt: "Image 8", title: "Waterfall Image 8" },
      ],
    };
  },
  mounted() {
    if (this.initialItems.length > 0) {
      this.items = this.initialItems;
    }
  },
};
</script>

<style scoped>
.photo-waterfall {
  background: var(--c-background-dark); /* 深色背景以区分 */
  color: white;
  min-height: 100vh; /* 确保有足够高度滚动 */
}

.photo-waterfall h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.waterfall-grid {
  column-count: 3; /* 基础瀑布流列数 */
  column-gap: 1rem;
}

.waterfall-item {
  break-inside: avoid; /* 防止元素在列中断开 */
  margin-bottom: 1rem;
  display: inline-block; /* 需要 inline-block 或 block */
  width: 100%; /* 确保项目宽度正确 */
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.waterfall-item img {
  width: 100%;
  height: auto;
  display: block;
}

.waterfall-item p {
  padding: 0.8rem;
  font-size: 0.9rem;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .waterfall-grid {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .waterfall-grid {
    column-count: 1;
  }
  .photo-waterfall {
    padding: 3rem 1rem;
  }
}
</style>