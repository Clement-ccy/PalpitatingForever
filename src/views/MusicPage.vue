<template>
  <section class="music-container">
    <h1 class="page-title">Essential Albums</h1>
    <div class="album-grid">
      <div
        v-for="(album, index) in albums"
        :key="index"
        class="album-card neum-card"
        @click="handlePlay(album)"
      >
        <div class="cover-container">
          <img
            :src="`@/assets/images/${album.cover}`"
            :alt="album.title"
            class="album-cover"
          />
          <div class="score-badge">{{ album.score }}</div>
          <button class="play-button">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <div class="album-info">
          <h3 class="album-title">{{ album.title }}</h3>
          <div class="meta-container">
            <span class="artist">{{ album.artist }}</span>
            <span class="year">{{ album.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const albums = ref([
  {
    title: "Blue Weekend",
    artist: "Wolf Alice",
    year: 2021,
    score: 9.2,
    cover: "cover-1.jpg",
    label: "Dirty Hit",
  },
  {
    title: "Collapsed in Sunbeams",
    artist: "Arlo Parks",
    year: 2021,
    score: 8.8,
    cover: "cover-2.jpg",
    label: "Transgressive",
  },
  {
    title: "Promises",
    artist: "Floating Points",
    year: 2021,
    score: 9.0,
    cover: "cover-3.jpg",
    label: "Luaka Bop",
  },
  {
    title: "Hey What",
    artist: "Low",
    year: 2021,
    score: 8.5,
    cover: "cover-4.jpg",
    label: "Sub Pop",
  },
  {
    title: "Sometimes I Might Be Introvert",
    artist: "Little Simz",
    year: 2021,
    score: 9.3,
    cover: "cover-5.jpg",
    label: "Age 101",
  },
]);

const handlePlay = (album) => {
  console.log("Playing:", album.title);
  // 实际播放逻辑需要接入音频API
};
</script>

<style scoped>
.music-container {
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  width: 100%;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
}

.album-card {
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.album-card:hover {
  transform: translateY(-5px);
}

.cover-container {
  position: relative;
  aspect-ratio: 1;
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0px;
}

.score-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.play-button {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover .play-button {
  opacity: 1;
}

.album-info {
  padding: 1.2rem;
}

.album-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.meta-container {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .album-grid {
    grid-template-columns: 1fr;
  }
}
</style>
