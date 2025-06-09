<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import plogsData from '@/data/plogs.json';

const router = useRouter();

const hoveredIndex = ref(null);
const selectedImageSrc = ref(null); // For lightbox

function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const TALL_THRESHOLD_RATIO = 1.4;
const WIDE_THRESHOLD_RATIO = 1.4;
const BIG_AREA_THRESHOLD = 180000;
const BIG_MIN_SIDE_THRESHOLD = 300;

const MAX_BIG_PERCENTAGE = 0.15;
const MAX_TALL_PERCENTAGE = 0.25;
const MAX_WIDE_PERCENTAGE = 0.25;
const REPEAT_SPECIAL_DOWNGRADE_CHANCE = 0.8;

let bigCount = 0;
let tallCount = 0;
let wideCount = 0;

const allPlogImages = ref([]);

const processPlogData = () => {
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
              title: plog.title || '无标题',
              plogId: plog.id,
              plogSlug: plog.slug,
              caption: block.image.caption?.map(rt => rt.plain_text).join('') || '',
              width: 0,
              height: 0,
              sizeClass: '',
              isLoading: true,
            });
          }
        }
      });
    }
  });
  allPlogImages.value = shuffleArray(extractedImages);
};

async function loadImageAndClassify(item, previousSpecialClass, totalItems) {
  return new Promise((resolve) => {
    if (!item.src) {
      item.isLoading = false;
      item.sizeClass = 'normal';
      resolve('normal');
      return;
    }
    const img = new Image();
    img.onload = () => {
      item.width = img.naturalWidth;
      item.height = img.naturalHeight;
      item.isLoading = false;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      let determinedClass = 'normal';

      if (w === 0 || h === 0) {
        item.sizeClass = 'normal';
        resolve('normal');
        return;
      }

      const aspectRatio = w / h;
      const area = w * h;

      if (w > BIG_MIN_SIDE_THRESHOLD && h > BIG_MIN_SIDE_THRESHOLD && area > BIG_AREA_THRESHOLD) {
        determinedClass = 'big';
      } else if (h / w > TALL_THRESHOLD_RATIO) {
        determinedClass = 'tall';
      } else if (aspectRatio > WIDE_THRESHOLD_RATIO) {
        determinedClass = 'wide';
      }

      let finalClass = determinedClass;

      if (determinedClass !== 'normal' && determinedClass === previousSpecialClass && Math.random() < REPEAT_SPECIAL_DOWNGRADE_CHANCE) {
        if (determinedClass === 'big') {
            if (aspectRatio > WIDE_THRESHOLD_RATIO && (wideCount / totalItems < MAX_WIDE_PERCENTAGE) && previousSpecialClass !== 'wide') {
                finalClass = 'wide';
            } else if (h / w > TALL_THRESHOLD_RATIO && (tallCount / totalItems < MAX_TALL_PERCENTAGE) && previousSpecialClass !== 'tall') {
                finalClass = 'tall';
            } else {
                finalClass = 'normal';
            }
        } else {
            finalClass = 'normal';
        }
      } else {
        if (determinedClass === 'big' && (bigCount / totalItems >= MAX_BIG_PERCENTAGE)) {
          if (aspectRatio > WIDE_THRESHOLD_RATIO && (wideCount / totalItems < MAX_WIDE_PERCENTAGE)) {
            finalClass = 'wide';
          } else if (h / w > TALL_THRESHOLD_RATIO && (tallCount / totalItems < MAX_TALL_PERCENTAGE)) {
            finalClass = 'tall';
          } else {
            finalClass = 'normal';
          }
        } else if (determinedClass === 'tall' && (tallCount / totalItems >= MAX_TALL_PERCENTAGE)) {
          finalClass = 'normal';
        } else if (determinedClass === 'wide' && (wideCount / totalItems >= MAX_WIDE_PERCENTAGE)) {
          finalClass = 'normal';
        }
      }

      if (finalClass === 'big') bigCount++;
      else if (finalClass === 'tall') tallCount++;
      else if (finalClass === 'wide') wideCount++;

      item.sizeClass = finalClass;
      resolve(finalClass);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${item.src}`);
      item.isLoading = false;
      item.sizeClass = 'normal';
      resolve('normal');
    };
    img.src = item.src;
  });
}

onMounted(async () => {
  processPlogData();
  bigCount = 0;
  tallCount = 0;
  wideCount = 0;

  const imagesToProcess = allPlogImages.value;
  const totalImageItems = imagesToProcess.length;
  if (totalImageItems === 0) return;

  let previousItemFinalClass = null;

  for (const item of imagesToProcess) {
    const currentItemFinalClass = await loadImageAndClassify(item, previousItemFinalClass, totalImageItems);
    if (currentItemFinalClass !== 'normal') {
      previousItemFinalClass = currentItemFinalClass;
    } else {
      previousItemFinalClass = null;
    }
  }
  allPlogImages.value = [...imagesToProcess];
});

const items = computed(() => allPlogImages.value);

const handleMouseEnter = (index) => {
  hoveredIndex.value = index;
};

const handleMouseLeave = () => {
  hoveredIndex.value = null;
};

const getImageClass = (item) => {
  return item.sizeClass || 'normal';
};

const openLightbox = (imageSrc) => {
  selectedImageSrc.value = imageSrc;
};

const closeLightbox = () => {
  selectedImageSrc.value = null;
};

const navigateToPlogDetail = (item) => {
  if (item.plogSlug) {
    router.push({ name: 'PlogItemBySlug', params: { slug: item.plogSlug } });
  } else if (item.plogId) {
    router.push({ name: 'PlogItemById', params: { id: item.plogId } });
  } else {
    console.warn("Cannot navigate, Plog item has no slug or ID:", item);
  }
  closeLightbox();
};

</script>

<template>
  <div class="photo-waterfall-container">
    <div class="grid-wrapper">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :class="[
          getImageClass(item),
          { 'hovered': index === hoveredIndex, 'dimmed': hoveredIndex !== null && index !== hoveredIndex }
        ]"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
        @click="openLightbox(item.src)"
      >
        <img v-if="item.src && !item.isLoading" :src="item.src" :alt="item.alt" loading="lazy" />
        <div v-else-if="item.isLoading" class="placeholder-image loading">...</div>
        <div v-else class="placeholder-image error">!</div>
        <div class="overlay-info">
          <h3>{{ item.title }}</h3>
          <p v-if="item.caption" class="overlay-caption">{{ item.caption }}</p>
          <button @click.stop="navigateToPlogDetail(item)" class="details-button">查看详情</button>
        </div>
      </div>
    </div>

    <!-- Lightbox Overlay -->
    <div v-if="selectedImageSrc" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <img :src="selectedImageSrc" alt="Enlarged Plog Image" />
        <button @click="closeLightbox" class="close-button">&times;</button>
        <button
            v-if="items.find(i => i.src === selectedImageSrc)"
            @click="navigateToPlogDetail(items.find(i => i.src === selectedImageSrc))"
            class="lightbox-details-button">
            查看原 Plog 页面
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.photo-waterfall-container {
  position: relative;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--fill-secondary);
    color: var(--text-tertiary);
    font-size: 2rem;
    border-radius: var(--radius-sm);
}
.placeholder-image.loading {
    color: var(--text-placeholder);
}
.placeholder-image.error {
    background-color: var(--fill-error-bg);
    color: var(--color-error);
}

.grid-wrapper {
	display: grid;
	grid-gap: 15px;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	grid-auto-rows: 200px;
    grid-auto-flow: dense;
    padding: var(--space-lg);
    transition: all 0.3s ease;
}

.grid-wrapper > div {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: var(--radius-md);
    transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    background-color: var(--fill-tertiary);
}

.grid-wrapper > div > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-md);
    transition: transform 0.3s ease;
}

.grid-wrapper > div.hovered {
    transform: scale(1.02);
    opacity: 1;
    filter: brightness(1);
    z-index: 10;
}

.grid-wrapper > div.dimmed {
    opacity: 0.85;
    filter: brightness(0.9);
}

.overlay-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: var(--space-md);
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 60px;
}

.grid-wrapper > div.hovered .overlay-info {
    opacity: 1;
    transform: translateY(0);
}

.overlay-info h3 {
    margin: 0 0 var(--space-xxs) 0;
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-semibold);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.overlay-info p {
    margin: 0;
    font-size: var(--font-size-footnote);
    opacity: 0.9;
    white-space: normal;
    overflow-wrap: break-word;
}
.overlay-caption {
    margin-top: var(--space-xxs);
    font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: var(--space-xs);
}

.details-button {
  align-self: flex-start;
  margin-top: var(--space-xs);
  padding: var(--space-xxs) var(--space-xs);
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  opacity: 0.8;

  &:hover {
    background-color: rgba(var(--bg-primary-rgb, 255 255 255), 0.3);
    border-color: rgba(var(--text-on-overlay-rgb, 255 255 255), 0.8);
    opacity: 1;
  }
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-modal);
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 100%;
    max-height: calc(90vh - 80px);
    object-fit: contain;
    border-radius: var(--radius-md);
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
  }
}

.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10;
}
.lightbox-details-button {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: background-color 0.2s ease;

  &:hover {
    color: var(--accent-primary);
    background-color: var(--bg-glass);
  }
}

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

</style>