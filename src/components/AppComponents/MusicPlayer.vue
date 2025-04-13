<template>
  <div class="music-player" :class="{
    'is-playing': isPlaying,
    'is-pinned': isPinned,
    'is-fullscreen': isFullscreen,
  }" @click="openFullscreen" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 小状态的旋转cd -->
    <div class="cd-container">
      <img :src="coverUrl" alt="Album Cover" class="album-cover" @click.stop="openFullscreen" /> <!-- 点击封面也全屏 -->
    </div>
    <!-- 控制区域 -->
    <div class="controls" v-show="isExpanded || isPinned">
      <button class="control-btn play-pause-btn" @click.stop="togglePlay">
        {{ isPlaying ? "⏸️" : "▶️" }}
        <!-- 播放/暂停图标 -->
      </button>
      <!-- 播放/暂停按钮 -->
      <div class="progress-bar-container">
        <input type="range" class="progress-bar" :value="currentTime" :max="duration || 100" @input="handleSeek"
          @click.stop />
        <!-- 实际进度条 -->
      </div>
      <button class="control-btn pin-btn" :class="{ active: isPinned }" @click.stop="togglePin">
        📌
      </button>
      <!-- Pin 按钮 -->
    </div>


    <!-- 全屏视图 -->
    <div class="fullscreen-view" v-if="isFullscreen">
      <div class="fullscreen-view-header">
        <div>播放器风格选择器</div>
        <h1>全屏音乐播放器</h1>
        <button class="close-fullscreen-btn" @click.stop="closeFullscreen">
          ❌
        </button>
      </div>

      <div class="fullscreen-view-body">

        <div class="fullscreen-view-body-left">
          <img :src="currentSong.cover" alt="Album Cover" class="fullscreen-cover" />
        </div>

        <div class="fullscreen-view-body-right">
          <h2>{{ currentSong.title }}</h2>
          <p>{{ currentSong.artist }}</p>
          <div class="lyrics-container" ref="lyricsContainerRef">
            <!-- 添加 ref -->
            <p v-for="(line, index) in lyrics" :key="index"
              :class="{ 'active-lyric': isCurrentLyric(line.time, index) }" class="lyric-line">
              <span class="original-lyric">{{ line.original }}</span>
              <br />
              <span v-if="showTranslation && line.translation" class="translation-lyric">{{ line.translation }}</span>
            </p>
          </div>
        </div>
      </div>



      <!-- Fullscreen Controls -->
      <div class="fullscreen-controls">
        <!-- Top Row: Progress Bar -->
        <div class="fullscreen-progress-container">
          <input type="range" class="fullscreen-progress-bar" :value="currentTime" :max="duration || 100"
            @input="handleSeek" />
          <!-- TODO: Add time display -->
        </div>
        <!-- Middle Row: Main Controls -->
        <div class="main-controls">
          <div class="volume-control">
            <span>🔊</span>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="volume"
              @input="handleVolumeChange" />
          </div>
          <div>
            <button class="fs-control-btn mode-btn" @click.stop="togglePlaybackMode">
              <!-- Icons for playback mode -->
              <span v-if="playbackMode === 'list-loop'">🔁</span>
              <span v-else-if="playbackMode === 'single-loop'">🔂</span>
              <span v-else>🔀</span>
            </button>
            <button class="fs-control-btn prev-btn" @click.stop="playPrevious">
              ⏮️
            </button>
            <button class="fs-control-btn play-pause-btn-fs" @click.stop="togglePlay">
              {{ isPlaying ? "⏸️" : "▶️" }}
            </button>
            <button class="fs-control-btn next-btn" @click.stop="playNext">
              ⏭️
            </button>
            <button class="fs-control-btn playlist-btn" @click.stop="togglePlaylist">
              ☰
            </button>
          </div>
          <button class="fs-control-btn translation-btn" @click.stop="toggleTranslation"
            :class="{ active: showTranslation }">
            译
          </button>
        </div>
      </div>

      <!-- Playlist View -->
      <div class="playlist-view" v-if="showPlaylist">
        <button class="close-playlist-btn" @click.stop="togglePlaylist">
          ❌
        </button>
        <h3>播放列表</h3>
        <ul>
          <li v-for="(song, index) in songList" :key="song.id" @click="playSong(index)"
            :class="{ 'active-song': index === currentSongIndex }">
            {{ song.title }} - {{ song.artist }}
          </li>
        </ul>
      </div>
    </div>
    <!-- Hidden Audio Element -->
    <audio ref="audioRef" :src="currentSong.src" preload="metadata"></audio>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from "vue"; // 导入 computed

// --- LRC Parser (with Translation Support) ---
function parseLRC(lrcContent) {
  const lines = lrcContent.split("\n");
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/; // mm:ss.xx or mm:ss.xxx
  const lyricsMap = new Map(); // time -> { original: string | null, translation: string | null }

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, "0"), 10); // Pad to 3 digits for consistency
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, "").trim();

      if (text) {
        if (!lyricsMap.has(time)) {
          // First time seeing this timestamp, assume it's the original lyric
          lyricsMap.set(time, { original: text, translation: null });
        } else {
          const entry = lyricsMap.get(time);
          // Second time seeing this timestamp, assume it's the translation
          // Only set translation if it hasn't been set yet for this timestamp
          if (entry.translation === null) {
            entry.translation = text;
          }
          // Ignore any further lines for the same timestamp
        }
      }
    }
  }

  // Convert map to sorted array
  const sortedTimes = Array.from(lyricsMap.keys()).sort((a, b) => a - b);
  const finalLyrics = sortedTimes.map((time) => {
    const entry = lyricsMap.get(time);
    return {
      time,
      original: entry.original, // Original should always exist if entry exists
      translation: entry.translation, // Keep translation null if not found
    };
  });

  // Filter out entries where original text might somehow be empty (shouldn't happen with new logic but good safeguard)
  return finalLyrics.filter((line) => line.original);
}
// --- End LRC Parser ---

// --- Song List ---
const songList = ref([
  {
    id: "1123", // Use filename as ID
    title: "君に聴かせたかった歌",
    artist: "H△G",
    cover: "src/assets/images/cover.jpeg", // Placeholder
    audioSrc: new URL("../../assets/musics/sources/1123.mp3", import.meta.url)
      .href,
    lrcPath: new URL("../../assets/musics/lyrics/1123.lrc", import.meta.url)
      .href,
  },
  {
    id: "yokan",
    title: "予感",
    artist: "羊文学",
    cover: "src/assets/images/cover-2.jpg", // Placeholder - use another image
    audioSrc: new URL(
      "../../assets/musics/sources/予感 - 羊文学.mp3",
      import.meta.url
    ).href,
    lrcPath: new URL(
      "../../assets/musics/lyrics/予感 - 羊文学.lrc",
      import.meta.url
    ).href,
  },
]);

// Refs for DOM elements
const lyricsContainerRef = ref(null);
const audioRef = ref(null);

// State
const currentSongIndex = ref(0); // Index of the current song in songList
const isPlaying = ref(false);
const isExpanded = ref(false);
const isPinned = ref(false);
const isFullscreen = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const lyrics = ref([]); // Current song lyrics
const volume = ref(0.75); // Default volume (0 to 1)
const playbackMode = ref("list-loop"); // 'list-loop', 'single-loop', 'random'
const showPlaylist = ref(false); // Controls playlist visibility
const showTranslation = ref(true); // State for translation toggle, default to true

// Computed property for the current song object
const currentSong = computed(
  () => songList.value[currentSongIndex.value] || {}
);
// Computed property for the cover URL used by the small player
const coverUrl = computed(
  () => currentSong.value.cover || "src/assets/images/placeholder-1.svg"
);

// --- Load Song Function ---
const loadSong = async (index) => {
  if (index < 0 || index >= songList.value.length) {
    console.error("Invalid song index");
    return;
  }
  currentSongIndex.value = index;
  const song = songList.value[index];
  lyrics.value = []; // Clear previous lyrics
  currentTime.value = 0; // Reset time
  duration.value = 0; // Reset duration
  isPlaying.value = false; // Stop playback

  // Update audio source (important to trigger reload)
  if (audioRef.value) {
    audioRef.value.src = song.audioSrc;
    audioRef.value.load(); // Force reload
    audioRef.value.volume = volume.value; // Apply current volume
  }

  // Fetch and parse new LRC
  try {
    const response = await fetch(song.lrcPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const lrcContent = await response.text();
    lyrics.value = parseLRC(lrcContent);
  } catch (error) {
    console.error(`Failed to fetch/parse LRC for ${song.title}:`, error);
  }
};

// --- Playback Mode Logic ---
const togglePlaybackMode = () => {
  const modes = ["list-loop", "single-loop", "random"];
  const currentIndex = modes.indexOf(playbackMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  playbackMode.value = modes[nextIndex];
  // Apply loop attribute if needed
  if (audioRef.value) {
    audioRef.value.loop = playbackMode.value === "single-loop";
  }
};

// --- Playlist Logic ---
const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value;
};

const playSong = (index) => {
  loadSong(index);
  // Optionally start playing immediately
  // nextTick(() => togglePlay()); // Needs careful handling if already playing
  showPlaylist.value = false; // Hide playlist after selection
};

// --- Navigation Logic ---
const playNext = () => {
  let nextIndex;
  if (playbackMode.value === "random") {
    nextIndex = Math.floor(Math.random() * songList.value.length);
    // Avoid playing the same song twice in a row in random mode
    if (nextIndex === currentSongIndex.value && songList.value.length > 1) {
      nextIndex = (currentSongIndex.value + 1) % songList.value.length; // Simple fallback
    }
  } else {
    // list-loop or single-loop (handled by 'ended' event or loop attribute)
    nextIndex = (currentSongIndex.value + 1) % songList.value.length;
  }
  loadSong(nextIndex);
  // Start playing next song automatically
  nextTick(() => {
    if (audioRef.value && audioRef.value.paused) {
      togglePlay();
    }
  });
};

const playPrevious = () => {
  let prevIndex;
  if (playbackMode.value === "random") {
    // Random mode: just pick another random song for previous? Or go back linearly?
    // Let's go back linearly for simplicity in random mode's 'previous' action
    prevIndex =
      (currentSongIndex.value - 1 + songList.value.length) %
      songList.value.length;
  } else {
    prevIndex =
      (currentSongIndex.value - 1 + songList.value.length) %
      songList.value.length;
  }
  loadSong(prevIndex);
  // Start playing previous song automatically
  nextTick(() => {
    if (audioRef.value && audioRef.value.paused) {
      togglePlay();
    }
  });
};

// --- Volume Control ---
const handleVolumeChange = (event) => {
  if (audioRef.value) {
    const newVolume = parseFloat(event.target.value);
    audioRef.value.volume = newVolume;
    volume.value = newVolume;
  }
};

// --- Audio Control Logic ---
const togglePlay = () => {
  if (!audioRef.value) return;
  if (audioRef.value.paused) {
    audioRef.value.play().catch((e) => console.error("Audio play failed:", e));
  } else {
    audioRef.value.pause();
  }
};

// --- Audio Event Handlers ---
const onAudioPlay = () => {
  isPlaying.value = true;
};
const onAudioPause = () => {
  isPlaying.value = false;
};
const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
};
const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
    // Apply loop attribute based on initial mode
    audioRef.value.loop = playbackMode.value === "single-loop";
  }
};
// Handle song ending based on playback mode
const onAudioEnded = () => {
  if (playbackMode.value === "list-loop") {
    playNext();
  } else if (playbackMode.value === "random") {
    playNext(); // Random mode also plays next (which picks randomly)
  }
  // 'single-loop' is handled by the audio element's loop attribute
};

const handleMouseEnter = () => {
  isExpanded.value = true;
};

const handleMouseLeave = () => {
  // 如果没有被 pin 住，则收起
  if (!isPinned.value) {
    isExpanded.value = false;
  }
};

const togglePin = () => {
  isPinned.value = !isPinned.value;
  // 如果取消固定且鼠标不在元素上，则收起
  if (!isPinned.value && !isExpanded.value) {
    // Note: isExpanded might need re-evaluation if mouse isn't currently over
    // For simplicity now, we assume if unpinned, it should try to collapse
    // A more robust solution might involve checking mouse position directly
    isExpanded.value = false; // Force check collapse state
  } else if (isPinned.value) {
    isExpanded.value = true; // Ensure it stays expanded when pinned
  }
};

const openFullscreen = () => {
  // 点击组件任何非特定按钮区域即可全屏
  isFullscreen.value = true;
  // 进入全屏时，隐藏小部件的展开/固定状态
  isExpanded.value = false;
  isPinned.value = false;
};

const closeFullscreen = () => {
  isFullscreen.value = false;
};

// 判断是否为当前歌词行
const isCurrentLyric = (lineTime, index) => {
  const nextLineTime = lyrics.value[index + 1]?.time ?? Infinity;
  return currentTime.value >= lineTime && currentTime.value < nextLineTime;
};

// 歌词滚动逻辑
// eslint-disable-next-line no-unused-vars
watch([currentTime, isFullscreen], async ([_newTime, fullscreenActive]) => {
  // 使用 _newTime 忽略未使用的参数
  if (!fullscreenActive || !lyricsContainerRef.value) return; // 只在全屏且容器存在时执行

  await nextTick(); // 等待 DOM 更新

  const container = lyricsContainerRef.value;
  const activeLyricElement = container.querySelector(".active-lyric");

  if (activeLyricElement) {
    // 使用 scrollIntoView 将当前歌词滚动到中间，恢复平滑滚动
    activeLyricElement.scrollIntoView({
      behavior: "smooth", // 平滑滚动
      block: "center", // 垂直居中对齐
    });
  }
});

// --- Lifecycle Hooks ---
onMounted(() => {
  loadSong(currentSongIndex.value); // Load initial song

  const audio = audioRef.value;
  if (audio) {
    audio.addEventListener("play", onAudioPlay);
    audio.addEventListener("pause", onAudioPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onAudioEnded); // Add ended listener
  }
});

onUnmounted(() => {
  // Clean up event listeners when component unmounts
  const audio = audioRef.value;
  if (audio) {
    audio.removeEventListener("play", onAudioPlay);
    audio.removeEventListener("pause", onAudioPause);
    audio.removeEventListener("timeupdate", onTimeUpdate);
    audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    audio.removeEventListener("ended", onAudioEnded); // Remove ended listener
  }
});

// 处理进度条拖动
const handleSeek = (event) => {
  if (!audioRef.value) return;
  const seekTime = parseFloat(event.target.value);
  audioRef.value.currentTime = seekTime;
  currentTime.value = seekTime; // Optionally update currentTime immediately for responsiveness
};

// --- Translation Toggle ---
const toggleTranslation = () => {
  showTranslation.value = !showTranslation.value;
};
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 80px;
  /* 初始光盘大小 */
  height: 80px;
  border-radius: 40px;
  /* 圆角 */
  background-color: #333;
  /* 光盘背景色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  /* 为后续展开动画准备 */
  z-index: 1000;
  /* 确保在顶层 */
  overflow: hidden;
  /* 隐藏超出部分 */
  display: flex;
  /* 使用 flex 布局 */
  align-items: center;
  padding: 0 5px;
  /* 左右留点空隙 */
}

.cd-container {
  min-width: 70px;
  /* 固定 CD 区域大小 */
  height: 70px;
  width: 70px;
  /* 光盘大小 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* 保持圆形 */
  overflow: hidden;
  /* 确保封面是圆的 */
  margin-right: 10px;
  /* 与控件的间距 */
  flex-shrink: 0;
  /* 防止 CD 区域被压缩 */
}

.album-cover {
  width: 90%;
  /* 封面略小于光盘 */
  height: 90%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #111;
  /* 光盘边缘效果 */
}

/* 播放时旋转 */
.music-player.is-playing .cd-container,
.music-player.is-playing .fullscreen-cover {
  animation: rotate 10s linear infinite;
  /* 启用动画 */
}

/* 展开后的样式 */
.music-player:hover,
.music-player.is-pinned {
  /* 悬停或固定时展开 */
  width: 300px;
  /* 展开后的宽度 */
}

.controls {
  display: flex;
  align-items: center;
  width: 100%;
  opacity: 0;
  /* 默认隐藏 */
  transition: opacity 0.3s ease 0.1s;
  /* 延迟显示，配合宽度过渡 */
  overflow: hidden;
  /* 防止内容溢出 */
  white-space: nowrap;
  /* 防止控件换行 */
}

.music-player:hover .controls,
.music-player.is-pinned .controls {
  opacity: 1;
  /* 展开时显示 */
}

.control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
}

.progress-bar-container {
  flex-grow: 1;
  /* 占据剩余空间 */
  margin: 0 10px;
}

.progress-bar {
  width: 100%;
  cursor: pointer;
}

.pin-btn.active {
  color: #ffcc00;
  /* 固定时的颜色 */
}

/* 全屏样式 */
.music-player.is-fullscreen {
  width: 100vw;
  /* 视口宽度 */
  height: 100vh;
  /* 视口高度 */
  bottom: 0;
  left: 0;
  border-radius: 0;
  /* 取消圆角 */
  background-color: rgba(0, 0, 0, 0.9);
  /* 半透明背景 */
  cursor: default;
  /* 恢复默认光标 */
  padding: 0;
  /* 移除内边距 */
  display: block;
  /* 切换回块级布局 */
}

/* 全屏时隐藏小部件的 CD 和控制条 */
.music-player.is-fullscreen .cd-container,
.music-player.is-fullscreen .controls {
  display: none;
}

.fullscreen-view {
  position: relative;
  width: 100%;
  height: 100vh;
  color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

.fullscreen-view-header {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  margin-bottom: 20px;
  margin-top: 20px;
  z-index: 1;

  .close-fullscreen-btn {
    position: relative;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
}

.fullscreen-view-body {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 15vh 6rem;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.fullscreen-view-body-left {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
}

.fullscreen-view-body-right {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  width: 50%;
  height: 100%;
}

.lyrics-container {
  position: relative;
  margin-top: 20px;
  height: 60vh;
  /* Removed */
  flex-grow: 0;
  /* Added */
  width: 100%;
  /* 示例宽度 */
  overflow-y: auto;
  /* 允许滚动 */
  border: 1px solid #555;
  padding: 25vh 10px;
  /* Adjusted padding */
  text-align: center;
}

/* 隐藏容器滚动条 */
.lyrics-container::-webkit-scrollbar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  width: 0 !important;
}

.lyric-line {
  padding: 8px 0;
  transition: color 0.3s ease, font-size 0.3s ease;
  color: #aaa;
  /* 非当前歌词颜色 */
  font-size: 16px;
}

.active-lyric {
  color: #fff;
  /* 当前歌词颜色 */
  font-weight: bold;
  font-size: 18px;
}

.fullscreen-cover {
  width: 200px;
  /* 全屏封面大小 */
  height: 200px;
  border-radius: 50%;
  /* 可以是方形或圆角 */
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Fullscreen Controls Styles */
.fullscreen-controls {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1;
  /* Spacing between rows */
}

.fullscreen-progress-container {
  width: 100%;
}

.fullscreen-progress-bar {
  width: 100%;
  cursor: pointer;
  /* Add custom styling for the progress bar track and thumb if desired */
}

.main-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  /* Spacing between main buttons */
}

.fs-control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  /* Larger buttons for fullscreen */
  cursor: pointer;
  padding: 10px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.fs-control-btn:hover {
  opacity: 1;
}

.play-pause-btn-fs {
  font-size: 36px;
  /* Make play/pause button larger */
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 100px;
  /* Adjust width as needed */
  cursor: pointer;
}

/* Playlist View Styles */
.playlist-view {
  position: absolute;
  bottom: 0;
  right: 0;
  /* Position on the right */
  width: 300px;
  /* Adjust width */
  height: 70%;
  /* Adjust height */
  background-color: rgba(20, 20, 20, 0.95);
  border-left: 1px solid #444;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
  padding: 20px;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 1100;
  /* Ensure it's above other fullscreen elements */
  animation: slideInRight 0.3s ease forwards;
}

.close-playlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
}

.close-playlist-btn:hover {
  color: white;
}

.playlist-view h3 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.playlist-view ul {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  /* Allow scrolling */
  flex-grow: 1;
}

.playlist-view li {
  padding: 10px 5px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  transition: background-color 0.2s ease;
}

.playlist-view li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.playlist-view li.active-song {
  color: #ffcc00;
  /* Highlight current song */
  font-weight: bold;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
