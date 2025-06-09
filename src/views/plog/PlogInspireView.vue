<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import plogsData from '@/data/plogs.json';

// 响应式状态
const images = ref([]);
const isLoading = ref(true);
const galleryRef = ref(null);
const isDragging = ref(false);
const galleryTransform = ref({ x: 0, y: 0 });
const lastMousePos = ref({ x: 0, y: 0 });
const mousePos = ref({ x: 0, y: 0 });
const isInGallery = ref(false);

// 固定随机种子，确保每次加载相同的布局
const RANDOM_SEED = 12345;
let randomIndex = 0;

// 伪随机数生成器（使用固定种子）
function seededRandom() {
  const x = Math.sin(RANDOM_SEED + randomIndex++) * 10000;
  return x - Math.floor(x);
}

// 响应式计算图片配置
const imageConfig = computed(() => {
  const isDesktop = window.innerWidth > 991;
  const isTablet = window.innerWidth > 767;
  
  if (isDesktop) {
    return {
      targetCount: 41,
      containerWidth: 3000, // 大容器宽度用于拖动
      containerHeight: 2000,
      gridColumns: 7,
      gridRows: 6,
      baseImageSize: 280, // 基础图片尺寸
      maxRandomOffset: 40, // 最大随机偏移
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  } else if (isTablet) {
    return {
      targetCount: 24,
      containerWidth: 2200,
      containerHeight: 1600,
      gridColumns: 6,
      gridRows: 4,
      baseImageSize: 220,
      maxRandomOffset: 30,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  } else {
    return {
      targetCount: 15,
      containerWidth: 1600,
      containerHeight: 1200,
      gridColumns: 5,
      gridRows: 3,
      baseImageSize: 180,
      maxRandomOffset: 20,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  }
});

// 提取图片数据并生成网格布局
const extractImagesWithLayout = () => {
  const extractedImages = [];
  
  plogsData.forEach(plog => {
    if (plog.blocks && Array.isArray(plog.blocks)) {
      plog.blocks.forEach(block => {
        if (block.type === 'image' && block.image) {
          const imageUrl = block.image.file?.url || block.image.external?.url;
          if (imageUrl) {
            extractedImages.push({
              id: block.id,
              src: imageUrl,
              alt: plog.title || 'Plog Image',
              title: plog.title,
              plogId: plog.id,
              plogSlug: plog.slug
            });
          }
        }
      });
    }
  });
  
  // 使用固定种子打乱图片顺序
  randomIndex = 0;
  for (let i = extractedImages.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [extractedImages[i], extractedImages[j]] = [extractedImages[j], extractedImages[i]];
  }
  
  const selectedImages = extractedImages.slice(0, imageConfig.value.targetCount);
  const config = imageConfig.value;
  
  // 计算网格布局
  const cellWidth = config.containerWidth / config.gridColumns;
  const cellHeight = config.containerHeight / config.gridRows;
  
  // 为每张图片生成基于网格的布局
  return selectedImages.map((image, index) => {
    // 计算网格位置
    const gridX = index % config.gridColumns;
    const gridY = Math.floor(index / config.gridColumns);
    
    // 基础网格位置
    const baseX = gridX * cellWidth + cellWidth / 2;
    const baseY = gridY * cellHeight + cellHeight / 2;
    
    // 添加随机偏移
    const offsetX = (seededRandom() - 0.5) * 2 * config.maxRandomOffset;
    const offsetY = (seededRandom() - 0.5) * 2 * config.maxRandomOffset;
    
    // 最终位置
    const finalX = baseX + offsetX;
    const finalY = baseY + offsetY;
    
    // 随机尺寸变化（保持较大尺寸）
    const sizeVariation = 0.9 + seededRandom() * 1; // 0.9x - 1.9x
    const imageSize = config.baseImageSize * sizeVariation;
    
    // 随机旋转
    const rotation = (seededRandom() - 0.5) * 60; // ±15度
    
    return {
      ...image,
      style: {
        position: 'absolute',
        left: `${finalX - imageSize / 2}px`,
        top: `${finalY - imageSize / 2}px`,
        width: `${imageSize}px`,
        height: 'auto', // 保持原始比例
        transform: `rotate(${rotation}deg)`,
        zIndex: index + 1,
        objectFit: 'cover',
        maxWidth: 'none'
      }
    };
  });
};

// 处理鼠标按下开始拖动
const handleMouseDown = (event) => {
  if (!isInGallery.value) return;
  
  isDragging.value = true;
  lastMousePos.value = { x: event.clientX, y: event.clientY };
  document.body.style.cursor = 'grabbing';
  event.preventDefault();
};

// 处理鼠标移动拖动
const handleMouseMove = (event) => {
  mousePos.value = { x: event.clientX, y: event.clientY };
  
  if (!isDragging.value) return;
  
  const deltaX = event.clientX - lastMousePos.value.x;
  const deltaY = event.clientY - lastMousePos.value.y;
  
  const newX = galleryTransform.value.x + deltaX;
  const newY = galleryTransform.value.y + deltaY;
  
  // 计算边界限制
  const config = imageConfig.value;
  const maxX = 0;
  const minX = config.viewportWidth - config.containerWidth;
  const maxY = 0;
  const minY = config.viewportHeight - config.containerHeight;
  
  // 应用边界限制
  galleryTransform.value.x = Math.max(minX, Math.min(maxX, newX));
  galleryTransform.value.y = Math.max(minY, Math.min(maxY, newY));
  
  lastMousePos.value = { x: event.clientX, y: event.clientY };
};

// 处理鼠标松开停止拖动
const handleMouseUp = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
};

// 处理进入gallery区域
const handleGalleryEnter = () => {
  isInGallery.value = true;
  document.body.style.cursor = 'grab';
};

// 处理离开gallery区域
const handleGalleryLeave = () => {
  isInGallery.value = false;
  document.body.style.cursor = '';
};

// 处理图片点击
const handleImageClick = (imageData, event) => {
  if (isDragging.value) {
    event.preventDefault();
    return;
  }
  
  console.log('Clicked image:', imageData);
  
  if (imageData.plogSlug) {
    console.log(`Would navigate to: /plog/${imageData.plogSlug}`);
  } else if (imageData.plogId) {
    console.log(`Would navigate to: /plog/item/${imageData.plogId}`);
  }
};

// 初始化
const initialize = async () => {
  isLoading.value = true;
  
  try {
    await nextTick();
    images.value = extractImagesWithLayout();
    
    // 模拟加载时间
    await new Promise(resolve => setTimeout(resolve, 800));
  } catch (error) {
    console.error('Failed to initialize:', error);
  } finally {
    isLoading.value = false;
  }
};

// 响应式处理
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    images.value = extractImagesWithLayout();
  }, 300);
};

// 生命周期
onMounted(async () => {
  await initialize();
  
  // 全局事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('resize', handleResize);
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
});
</script>

<template>
  <div class="plog-inspire-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading inspired gallery...</div>
      </div>
    </div>

    <!-- Gallery Section -->
    <section v-else class="gallery-component">
      <div 
        ref="galleryRef"
        class="gallery-inner"
        :class="{ 'is-dragging': isDragging }"
        :style="{
          width: imageConfig.containerWidth + 'px',
          height: imageConfig.containerHeight + 'px',
          transform: `translate(${galleryTransform.x}px, ${galleryTransform.y}px)`
        }"
        @mousedown="handleMouseDown"
        @mouseenter="handleGalleryEnter"
        @mouseleave="handleGalleryLeave"
      >
        <img
          v-for="(image, index) in images"
          :key="image.id"
          :src="image.src"
          :alt="image.alt"
          :loading="index < 12 ? 'eager' : 'lazy'"
          :style="image.style"
          class="gallery-image"
          :class="`gallery-image--${index + 1}`"
          @click="(e) => handleImageClick(image, e)"
          draggable="false"
        />
      </div>

      <!-- Gallery Overlay -->
      <div 
        class="gallery-overlay"
        :class="{ 'is-dragging': isDragging }"
      ></div>

      <!-- Custom Cursor -->
      <div 
        v-if="isInGallery"
        class="gallery-cursor"
        :class="{ 'is-dragging': isDragging }"
        :style="{
          left: mousePos.x + 'px',
          top: mousePos.y + 'px'
        }"
      >
        <span class="gallery-cursor-inner">
          <span class="gallery-cursor-text">Drag</span>
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.plog-inspire-view {
  max-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  user-select: none;
}

// Loading State
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: var(--text-primary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--stroke-tertiary);
  border-top: 2px solid var(--text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-sm);
}

.loading-text {
  font-size: var(--font-size-footnote);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.5px;
  opacity: 0.8;
}

// Gallery Component
.gallery-component {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.gallery-inner {
  position: relative;
  transition: transform 0.1s ease-out;
  will-change: transform;
  
  &.is-dragging {
    transition: none;
  }
}

.gallery-image {
  object-fit: cover;
  border: none;
  transition: none;
  will-change: transform;
  pointer-events: auto;
  box-shadow: none;
  border-radius: 0;
}

// Gallery Overlay (差色效果)
.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  background: #fff;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &.is-dragging {
    opacity: 1;
  }
}

// Custom Cursor (与 overlay 反向的差色效果)
.gallery-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
}

.gallery-cursor-inner {
  position: relative;
  display: inline-block;
  width: 128px;
  height: 128px;
  background: #fff;
  border-radius: 64px;
  font-size: var(--font-size-footnote);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.gallery-cursor-text {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
}

// 移动端优化
@media (max-width: 991px) {
  .gallery-cursor {
    display: none;
  }
  
  .gallery-component {
    touch-action: pan-x pan-y;
  }
}

// 动画
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>