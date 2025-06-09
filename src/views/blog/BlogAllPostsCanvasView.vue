<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import blogsData from '@/data/blogs.json';

// Konva Stage dimensions and state
const stageWidth = ref(window.innerWidth);
const stageHeight = ref(window.innerHeight - 60);
const stageScale = ref(1);
const stageX = ref(0);
const stageY = ref(0);
const lastPointerPosition = ref(null);
const loadedImages = ref({});

// Define font families in variables
const defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Get router instance
const router = useRouter();

// Konva configuration object
const stageConfig = computed(() => ({
  width: stageWidth.value,
  height: stageHeight.value,
  draggable: true,
  scaleX: stageScale.value,
  scaleY: stageScale.value,
  x: stageX.value,
  y: stageY.value,
}));

// Blog post nodes data - Increase height further for tags
const blogNodes = ref(
  blogsData
    .filter(blog => blog.status === '发布 (Published)' || blog.status === '需更新 (Needs Update)')
    .map((blog, index) => ({
      id: blog.id,
      x: Math.random() * (stageWidth.value * 0.8) + (stageWidth.value * 0.1),
      y: Math.random() * (stageHeight.value * 0.8) + (stageHeight.value * 0.1),
      width: 200,
      height: 200, // Increased height again for tags
      title: blog.title || '无标题',
      cover: blog.coverImage?.url || '/src/assets/images/placeholder-1.svg',
      date: blog.publishDate?.start || '',
      tags: blog.tags || [], // Ensure tags is an array
      draggable: true,
    }))
);

// --- Image Loading ---
function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("Image URL is empty"));
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

async function loadBlogImages() {
    console.log("Loading blog images...");
    const promises = blogNodes.value.map(async (node) => {
        if (node.cover && !(node.cover in loadedImages.value)) {
            loadedImages.value[node.cover] = undefined;
            try {
                const img = await loadImage(node.cover);
                loadedImages.value[node.cover] = img;
            } catch (error) {
                console.error(`Failed to load image ${node.cover}:`, error);
                loadedImages.value[node.cover] = null;
            }
        } else if (!node.cover) {
             loadedImages.value[node.cover] = null;
        }
    });
    await Promise.allSettled(promises);
    console.log("Image loading complete.");
}


// --- Event Handlers ---
const handleResize = () => {
  stageWidth.value = window.innerWidth;
  const playerHeight = document.querySelector('.audio-player')?.clientHeight || 0;
  const headerHeight = 0;
  stageHeight.value = window.innerHeight - playerHeight - headerHeight;
};

const handleStageDragEnd = (e) => {
    stageX.value = e.target.x();
    stageY.value = e.target.y();
};

const handleWheel = (e) => {
  e.evt.preventDefault();
  const stage = e.target.getStage();
  if (!stage) return;
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();
  if (!pointer) return;
  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };
  const direction = e.evt.deltaY > 0 ? -1 : 1;
  const scaleBy = 1.1;
  let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const minScale = 0.1;
  const maxScale = 3.0;
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  stageScale.value = newScale;
  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stageX.value = newPos.x;
  stageY.value = newPos.y;
};

const handleNodeDragStart = (e) => {
    e.cancelBubble = true;
};

const handleNodeDragEnd = (e, node) => {
    const index = blogNodes.value.findIndex(n => n.id === node.id);
    if (index !== -1) {
        blogNodes.value[index].x = e.target.x();
        blogNodes.value[index].y = e.target.y();
    }
    e.cancelBubble = true;
};

const handleNodeClick = (node) => {
    console.log("Navigating to blog post:", node.title, "ID:", node.id);
    router.push({ name: 'BlogPostDetail', params: { id: node.id } });
};

// --- Lifecycle Hooks ---
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  loadBlogImages();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <div class="blog-canvas-view">
    <v-stage
      :config="stageConfig"
      @wheel="handleWheel"
      @dragend="handleStageDragEnd"
      class="konva-stage"
    >
      <v-layer>
        <!-- Background Rect -->
        <v-rect
            :config="{
                x: -stageWidth * 5,
                y: -stageHeight * 5,
                width: stageWidth * 10,
                height: stageHeight * 10,
                fill: '#f0f0f0'
            }"
        />

        <!-- Blog Post Nodes -->
        <v-group
          v-for="node in blogNodes"
          :key="node.id"
          :config="{
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height, // Use updated height
            draggable: node.draggable,
            opacity: 0.95
          }"
          @dragstart="handleNodeDragStart"
          @dragend="(e) => handleNodeDragEnd(e, node)"
          @click="() => handleNodeClick(node)"
          @tap="() => handleNodeClick(node)"
          @mouseenter="e => { e.target.opacity(1); e.target.getStage().container().style.cursor = 'pointer'; }"
          @mouseleave="e => { e.target.opacity(0.95); e.target.getStage().container().style.cursor = 'grab'; }"
        >
          <!-- Card Background -->
          <v-rect
            :config="{
              width: node.width,
              height: node.height, // Use updated height
              fill: 'white',
              cornerRadius: 8,
              shadowColor: 'black',
              shadowBlur: 10,
              shadowOpacity: 0.2,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            }"
          />

          <!-- Cover Image -->
          <v-image
            v-if="loadedImages[node.cover] !== null && loadedImages[node.cover] !== undefined"
            :config="{
              image: loadedImages[node.cover],
              x: 0,
              y: 0,
              width: node.width,
              height: 100,
              cornerRadius: [8, 8, 0, 0],
              listening: false,
            }"
          />
          <!-- Placeholder -->
          <v-rect
              v-else
              :config="{
                  x: 0,
                  y: 0,
                  width: node.width,
                  height: 100,
                  fill: '#e0e0e0',
                  cornerRadius: [8, 8, 0, 0],
                  listening: false,
              }"
          />
          <!-- Loading Indicator -->
          <v-text
              v-if="loadedImages[node.cover] === undefined"
               :config="{
                  text: '...',
                  fontSize: 12,
                  fill: '#999',
                  width: node.width,
                  height: 100,
                  align: 'center',
                  verticalAlign: 'middle',
                  listening: false,
               }"
          />

          <!-- Blog Post Title -->
          <v-text
            :config="{
              text: node.title,
              fontSize: 16,
              fontFamily: defaultFontFamily,
              fill: '#333',
              padding: 10,
              x: 0,
              y: 105, // Position below image
              width: node.width - 20,
              wrap: 'word',
              ellipsis: true,
              align: 'left',
              listening: false,
            }"
          />

          <!-- Blog Post Tags -->
          <v-text
            v-if="node.tags && node.tags.length > 0"
            :config="{
              text: node.tags.join(', '), // Join tags with comma
              fontSize: 10,
              fontFamily: defaultFontFamily,
              fill: '#666', // Slightly darker than date
              padding: 10,
              x: 0,
              y: 145, // Position below title, adjust as needed
              width: node.width - 20,
              wrap: 'word', // Allow tags to wrap
              ellipsis: true, // Add ellipsis if too long
              align: 'left',
              listening: false,
            }"
          />

           <!-- Blog Post Date -->
          <v-text
            :config="{
              text: node.date,
              fontSize: 10,
              fontFamily: defaultFontFamily,
              fill: '#888',
              padding: 10,
              x: 0,
              y: node.height - 25, // Position near bottom
              width: node.width - 20,
              align: 'left',
              listening: false,
            }"
          />

        </v-group>
      </v-layer>
    </v-stage>

    <!-- UI Controls (Optional) -->
    <!-- ... -->
  </div>
</template>

<style scoped lang="scss">
.blog-canvas-view {
  width: 100%;
  height: calc(100vh);
  overflow: hidden;
  position: relative;
  background-color: var(--bg-canvas, #e8e8e8);
}

.konva-stage {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}

.canvas-controls {
  position: absolute;
  bottom: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  gap: var(--space-md);
  background-color: var(--bg-glass);
  backdrop-filter: blur(5px);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.canvas-controls button {
  padding: var(--space-xs) var(--space-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--separator-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
  &:hover {
    background-color: var(--fill-primary);
  }
}
</style>