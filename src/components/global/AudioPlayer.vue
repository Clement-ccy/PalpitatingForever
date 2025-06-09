<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useAudioStore } from "@/stores/audio";

// --- Store ---
const audioStore = useAudioStore();

// --- State Refs ---
const audioRef = ref(null); // Ref for the <audio> element
const isSeeking = ref(false); // Flag to prevent timeupdate during seek
// Lyrics State
const parsedLyrics = ref([]); // Array of { time: number, text: string }
const showLyrics = ref(true); // Control lyrics visibility, maybe toggle later
const currentLyricIndex = ref(-1);
const lyricsContainerRef = ref(null); // Ref for scrolling
// Playlist State
const isPlaylistVisible = ref(false); // State to toggle playlist visibility
// Player UI State
const isHovered = ref(false); // Track hover state for mini player
const expandLevel = ref(2); // Current display level: 1: only record, 2: record + lyrics, 3: full controls
const baseLevel = ref(1); // Base level when mouse leaves (set by user button)
const isFullscreen = ref(false); // Track fullscreen state
const fullscreenTab = ref("lyrics"); // 'lyrics' or 'details'

// Record rotation state
const totalRotation = ref(0);
const lastUpdateTime = ref(0);

// --- Computed Properties from Store ---
const currentTrack = computed(() => audioStore.currentTrack);
const isPlaying = computed(() => audioStore.isPlaying);
const currentTime = computed(() => audioStore.currentTime);
const duration = computed(() => audioStore.duration);
const currentVolume = computed(() => audioStore.volume);
const isMuted = computed(() => audioStore.isMuted);
const loopMode = computed(() => audioStore.loopMode);
const playlist = computed(() => audioStore.playlist);
const currentIndex = computed(() => audioStore.currentIndex);

// --- Computed Properties ---
const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

const currentLyric = computed(() => {
  if (
    currentLyricIndex.value >= 0 &&
    parsedLyrics.value[currentLyricIndex.value]
  ) {
    return parsedLyrics.value[currentLyricIndex.value].text;
  }
  // Return empty string when no track, let the template handle the message
  if (!audioStore.hasTrack) {
    return "";
  }
  return "暂无歌词";
});

const recordRotation = computed(() => {
  return `rotate(${totalRotation.value}deg)`;
});

// --- Helper Functions ---
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return "--:--";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update rotation based on time changes
function updateRotation() {
  if (isPlaying.value) {
    const now = performance.now();
    if (lastUpdateTime.value > 0) {
      const deltaTime = (now - lastUpdateTime.value) / 1000; // Convert to seconds
      totalRotation.value += deltaTime * 30; // 30 degrees per second
    }
    lastUpdateTime.value = now;
  } else {
    lastUpdateTime.value = 0;
  }
}

// Animation frame for smooth rotation
let animationId = null;
function startRotationAnimation() {
  if (animationId) return;

  function animate() {
    updateRotation();
    if (isPlaying.value) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(animate);
}

function stopRotationAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  lastUpdateTime.value = 0;
}

// --- Lyrics Parsing Logic ---
function parseLrc(lrcContent) {
  const lines = lrcContent.split("\n");
  const lyrics = [];
  const timeRegex = /\[(\d{2,}):(\d{2})(?:[.:](\d{2,3}))?\]/;
  for (const line of lines) {
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1], 10);
      const seconds = parseInt(timeMatch[2], 10);
      const milliseconds = timeMatch[3]
        ? parseInt(timeMatch[3].padEnd(3, "0"), 10)
        : 0;
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, "").trim();
      if (text || !lyrics.find((l) => l.time === time)) {
        // Keep lines even if text is empty for structure, avoid duplicates at same time
        lyrics.push({ time, text: text || "" }); // Store empty string if no text
      }
    }
  }
  lyrics.sort((a, b) => a.time - b.time);
  console.log("Parsed Lyrics:", lyrics);
  return lyrics;
}

async function fetchAndParseLyrics(url) {
  parsedLyrics.value = [];
  currentLyricIndex.value = -1;
  if (!url) {
    console.log("No lyrics URL provided.");
    return;
  }
  console.log("Fetching lyrics from:", url);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const lrcText = await response.text();
    parsedLyrics.value = parseLrc(lrcText);
  } catch (error) {
    console.error("Failed to fetch or parse lyrics:", error);
    parsedLyrics.value = [{ time: 0, text: "歌词加载失败" }];
  } finally {
    currentLyricIndex.value = -1;
  }
}

// --- UI Controls ---
function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
  // Return to base level when mouse leaves
  expandLevel.value = baseLevel.value;
}

function toggleBaseLevel() {
  // Cycle through base levels: 1 -> 2 -> 3 -> 1
  if (baseLevel.value === 1) {
    baseLevel.value = 2;
  } else if (baseLevel.value === 2) {
    baseLevel.value = 3;
  } else {
    baseLevel.value = 1;
  }

  // If not hovering, immediately apply the new base level
  if (!isHovered.value) {
    expandLevel.value = baseLevel.value;
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

function setFullscreenTab(tab) {
  fullscreenTab.value = tab;
}

// --- Playlist Controls ---
function togglePlaylist() {
  isPlaylistVisible.value = !isPlaylistVisible.value;
}

function playTrackFromList(index) {
  if (index === currentIndex.value) {
    // If clicking the current track, toggle play/pause
    togglePlayPause();
  } else {
    // Otherwise, load and play the new track
    audioStore.loadTrackByIndex(index);
    audioStore.setIsPlaying(true); // Start playing immediately
  }
  // Optionally close playlist after selection
  // isPlaylistVisible.value = false;
}

// --- Audio Element Event Handlers ---
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    console.log("Audio metadata loaded. Duration:", audioRef.value.duration);
    audioStore.setDuration(audioRef.value.duration);
    audioRef.value.volume = audioStore.volume;
    audioRef.value.muted = audioStore.isMuted;
    audioRef.value.loop = audioStore.loopMode === "track";
  }
};

const handleTimeUpdate = () => {
  if (audioRef.value && !isSeeking.value) {
    const newTime = audioRef.value.currentTime;
    audioStore.setCurrentTime(newTime);
    // Lyrics Sync Logic
    if (parsedLyrics.value.length > 0) {
      let newIndex = -1;
      for (let i = 0; i < parsedLyrics.value.length; i++) {
        if (parsedLyrics.value[i].time <= newTime) {
          newIndex = i;
        } else {
          break;
        }
      }
      if (newIndex !== currentLyricIndex.value) {
        currentLyricIndex.value = newIndex;
      }
    }
  }
};

const handleEnded = () => {
  console.log("Audio ended");
  audioStore.setIsPlaying(false);
  if (audioStore.loopMode === "track") {
    nextTick(() => {
      if (audioRef.value) {
        audioRef.value.currentTime = 0;
        audioRef.value
          .play()
          .catch((e) => console.error("Loop play failed:", e));
      }
    });
  } else if (audioStore.loopMode === "playlist") {
    audioStore.nextTrack();
  }
};

const handlePlay = () => {
  console.log("Audio playing");
  audioStore.setIsPlaying(true);
};
const handlePause = () => {
  console.log("Audio paused");
  audioStore.setIsPlaying(false);
};
const handleVolumeChangeOnElement = () => {
  if (audioRef.value && audioStore.volume !== audioRef.value.volume) {
    audioStore.setVolume(audioRef.value.volume);
  }
  if (audioRef.value && audioStore.isMuted !== audioRef.value.muted) {
    audioStore.toggleMute();
  }
};

// --- Playback Controls ---
const togglePlayPause = () => {
  if (!audioRef.value || !audioStore.currentTrack?.url) return;
  if (audioRef.value.paused) {
    audioRef.value.play().catch((error) => {
      console.error("Audio play failed:", error);
      audioStore.setIsPlaying(false);
    });
  } else {
    audioRef.value.pause();
  }
};

// --- Progress Bar Interaction ---
const progressBarRef = ref(null);
const fsProgressBarRef = ref(null);

const createSeekHandler = (targetRef) => (event) => {
  if (!audioRef.value || !audioStore.duration || !targetRef.value) return;
  const rect = targetRef.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const barWidth = rect.width;
  const clickPosition = Math.max(0, Math.min(1, clickX / barWidth));
  const newTime = clickPosition * audioStore.duration;
  console.log(
    `Seeking to: ${newTime.toFixed(2)}s (${(clickPosition * 100).toFixed(1)}%)`
  );
  audioRef.value.currentTime = newTime;
  audioStore.setCurrentTime(newTime);
};

const createMouseDownHandler = (targetRef) => (event) => {
  if (!audioStore.hasTrack) return;
  isSeeking.value = true;
  const seekHandler = createSeekHandler(targetRef);
  seekHandler(event);

  const onMouseMove = (event) => {
    if (isSeeking.value) seekHandler(event);
  };
  const onMouseUp = () => {
    if (isSeeking.value) {
      isSeeking.value = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      console.log("Seek end");
    }
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const handleSeek = createSeekHandler(progressBarRef);
const onMouseDown = createMouseDownHandler(progressBarRef);
const fsOnMouseDown = createMouseDownHandler(fsProgressBarRef);

// --- Volume Control ---
const handleVolumeSliderInput = (event) => {
  if (!audioRef.value) return;
  const newVolume = Math.max(0, Math.min(1, parseFloat(event.target.value)));
  audioStore.setVolume(newVolume);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  setTimeout(() => {
    expandLevel.value = 1;
  }, 1000); // Delay to collapse to level 1 after mount
});
onUnmounted(() => {
  stopRotationAnimation();
});

// --- Watchers ---
watch(
  () => audioStore.currentTrack?.url,
  (newUrl, oldUrl) => {
    console.log("Watcher: Track URL changed from", oldUrl, "to", newUrl);
    if (audioRef.value && newUrl && audioRef.value.src !== newUrl) {
      audioRef.value.src = newUrl;
      audioRef.value.load();
      isSeeking.value = false;
      // Reset rotation when track changes
      totalRotation.value = 0;
      lastUpdateTime.value = 0;
      if (audioStore.isPlaying) {
        nextTick(() => {
          audioRef.value?.play().catch((e) => {
            console.error("Autoplay failed after track change:", e);
            audioStore.setIsPlaying(false);
          });
        });
      }
    } else if (audioRef.value && !newUrl) {
      audioRef.value.removeAttribute("src");
      audioRef.value.load();
      audioStore.setDuration(0);
      audioStore.setCurrentTime(0);
      totalRotation.value = 0;
      lastUpdateTime.value = 0;
    }
  },
  { immediate: true }
);

watch(
  () => audioStore.currentTrack?.lyricsUrl,
  (newLyricsUrl) => {
    fetchAndParseLyrics(newLyricsUrl);
  },
  { immediate: true }
);

watch(
  () => audioStore.volume,
  (newVolume) => {
    if (audioRef.value && audioRef.value.volume !== newVolume) {
      audioRef.value.volume = newVolume;
    }
  }
);

watch(
  () => audioStore.isMuted,
  (newMuted) => {
    if (audioRef.value && audioRef.value.muted !== newMuted) {
      audioRef.value.muted = newMuted;
    }
  }
);

watch(
  () => audioStore.loopMode,
  (newMode) => {
    if (audioRef.value) {
      audioRef.value.loop = newMode === "track";
    }
  }
);

watch(
  () => audioStore.isPlaying,
  (shouldPlay) => {
    if (!audioRef.value) return;
    if (shouldPlay && audioRef.value.paused) {
      audioRef.value.play().catch((e) => {
        console.error("Play triggered by store watcher failed:", e);
        audioStore.setIsPlaying(false);
      });
    } else if (!shouldPlay && !audioRef.value.paused) {
      audioRef.value.pause();
    }

    // Handle rotation animation
    if (shouldPlay) {
      startRotationAnimation();
    } else {
      stopRotationAnimation();
    }
  }
);

watch(currentLyricIndex, (newIndex) => {
  if (newIndex >= 0 && lyricsContainerRef.value) {
    const activeElement =
      lyricsContainerRef.value.querySelector(".active-lyric");
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

// Watch hover state to expand controls
watch(isHovered, (hovered) => {
  if (hovered) {
    expandLevel.value = 3; // Always go to level 3 on hover
  } else {
    expandLevel.value = baseLevel.value; // Return to base level on leave
  }
});

// Auto set base level when has track changes (but only if it's currently at default)
watch(
  () => audioStore.hasTrack,
  (hasTrack) => {
    // Only auto-adjust base level if it's at the default and not hovering
    if (baseLevel.value === 2 && !isHovered.value) {
      const newBaseLevel = hasTrack ? 2 : 1;
      baseLevel.value = newBaseLevel;
      expandLevel.value = newBaseLevel;
    }
  }
);
</script>

<template>
  <!-- Audio Element -->
  <audio
    ref="audioRef"
    @loadedmetadata="handleLoadedMetadata"
    @timeupdate="handleTimeUpdate"
    @ended="handleEnded"
    @play="handlePlay"
    @pause="handlePause"
    @volumechange="handleVolumeChangeOnElement"
    preload="metadata"
    style="display: none"
  ></audio>

  <!-- Mini Player Widget -->
  <div
    class="audio-player-widget"
    v-show="audioStore.isPlayerVisible && !isFullscreen"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="widget-container" :class="`level-${expandLevel}`">
      <!-- Main Content Row -->
      <div class="main-content">
        <!-- Vinyl Record -->
        <div class="vinyl-record" @click="togglePlayPause">
          <div class="record-disc" :style="{ transform: recordRotation }">
            <div class="record-hole"></div>
            <img
              v-if="currentTrack?.cover"
              :src="currentTrack.cover"
              :alt="currentTrack.title"
              class="record-image"
            />
            <!-- Default record display when no track -->
            <div v-else class="default-record">
              <span class="music-note">♪</span>
            </div>
          </div>

          <!-- Play/Pause Overlay -->
          <div class="play-overlay" v-if="!isPlaying">
            <span class="play-icon">▶</span>
          </div>

          <!-- Fullscreen Button on Hover -->
          <div
            class="fullscreen-button"
            v-if="isHovered"
            @click.stop="toggleFullscreen"
          >
            <span>⛶</span>
          </div>
        </div>

        <!-- Current Lyric (Level 2+) -->
        <div class="current-lyric-display" v-show="expandLevel >= 2">
          {{ currentLyric || (audioStore.hasTrack ? '♪ 暂无歌词 ♪' : '♪欢 迎 使 用 音乐播放器 ♪') }}
        </div>
      </div>

      <!-- Expanded Controls (Level 3) -->
      <div class="expanded-controls" :class="{ visible: expandLevel >= 3 }">
        <div class="controls-header">
          <div class="track-info">
            <div class="title">{{ currentTrack?.title || "---" }}</div>
            <div class="artist">{{ currentTrack?.artist || "---" }}</div>
          </div>
          <button
            class="level-button"
            @click="toggleBaseLevel"
            :title="`基础级别: ${baseLevel} (悬浮时: 3级)`"
          >
            <span v-if="baseLevel === 1">①</span>
            <span v-if="baseLevel === 2">②</span>
            <span v-if="baseLevel === 3">③</span>
          </button>
        </div>

        <div class="progress-section">
          <span class="time-current">{{ formattedCurrentTime }}</span>
          <div
            ref="progressBarRef"
            class="progress-bar-container"
            @mousedown="onMouseDown"
          >
            <div
              class="progress-bar"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
          <span class="time-duration">{{ formattedDuration }}</span>
        </div>

        <div class="controls-row">
          <button
            @click="audioStore.prevTrack"
            :disabled="
              !audioStore.canPlayPrev && audioStore.loopMode !== 'playlist'
            "
            class="control-btn"
          >
            ⏮
          </button>
          <button @click="togglePlayPause" class="control-btn play-btn">
            <span v-if="isPlaying">❚❚</span>
            <span v-else>▶</span>
          </button>
          <button
            @click="audioStore.nextTrack"
            :disabled="
              !audioStore.canPlayNext && audioStore.loopMode !== 'playlist'
            "
            class="control-btn"
          >
            ⏭
          </button>

          <button
            @click="
              audioStore.setLoopMode(
                audioStore.loopMode === 'none'
                  ? 'playlist'
                  : audioStore.loopMode === 'playlist'
                  ? 'track'
                  : 'none'
              )
            "
            class="control-btn loop-btn"
            :class="`loop-${audioStore.loopMode}`"
          >
            <span v-if="audioStore.loopMode === 'none'">🚫</span>
            <span v-if="audioStore.loopMode === 'playlist'">🔁</span>
            <span v-if="audioStore.loopMode === 'track'">🔂</span>
          </button>

          <button @click="audioStore.toggleMute()" class="control-btn">
            <span v-if="isMuted">🔇</span>
            <span v-else>🔊</span>
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="currentVolume"
            @input="handleVolumeSliderInput"
            class="volume-slider"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Fullscreen Player -->
  <div class="fullscreen-player" v-show="isFullscreen">
    <!-- Header -->
    <div class="fullscreen-header">
      <div class="logo-section">
        <!-- 您可以在这里添加您的 Icon -->
        <span class="app-name">PalpitatingForever</span>
      </div>
      <button class="close-fullscreen" @click="toggleFullscreen">✕</button>
    </div>

    <!-- Main Content -->
    <div class="fullscreen-main">
      <!-- Left Half - Large Vinyl -->
      <div class="fullscreen-vinyl">
        <div class="large-record" :style="{ transform: recordRotation }">
          <div class="large-record-hole"></div>
          <img
            v-if="currentTrack?.cover"
            :src="currentTrack.cover"
            :alt="currentTrack.title"
            class="large-record-image"
          />
        </div>
      </div>

      <!-- Right Half -->
      <div class="fullscreen-right">
        <!-- Song Info -->
        <div class="song-info">
          <h2 class="fs-title">{{ currentTrack?.title || "---" }}</h2>
          <h3 class="fs-artist">{{ currentTrack?.artist || "---" }}</h3>
        </div>

        <!-- Tabs -->
        <div class="fullscreen-tabs">
          <button
            class="tab-button"
            :class="{ active: fullscreenTab === 'lyrics' }"
            @click="setFullscreenTab('lyrics')"
          >
            歌词
          </button>
          <button
            class="tab-button"
            :class="{ active: fullscreenTab === 'details' }"
            @click="setFullscreenTab('details')"
          >
            详情
          </button>
        </div>

        <!-- Content Area -->
        <div class="fullscreen-content-area">
          <!-- Lyrics Tab -->
          <div v-if="fullscreenTab === 'lyrics'" class="lyrics-content">
            <div ref="lyricsContainerRef" class="fullscreen-lyrics">
              <div class="lyrics-padding"></div>
              <p
                v-for="(line, index) in parsedLyrics"
                :key="line.time + '-' + index"
                :class="{ 'active-lyric': index === currentLyricIndex }"
              >
                {{ line.text || "&nbsp;" }}
              </p>
              <div class="lyrics-padding"></div>
            </div>
          </div>

          <!-- Details Tab -->
          <div v-if="fullscreenTab === 'details'" class="details-content">
            <div class="detail-item">
              <span class="detail-label">标题:</span>
              <span class="detail-value">{{
                currentTrack?.title || "---"
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">艺术家:</span>
              <span class="detail-value">{{
                currentTrack?.artist || "---"
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">时长:</span>
              <span class="detail-value">{{ formattedDuration }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">循环模式:</span>
              <span class="detail-value">
                <span v-if="audioStore.loopMode === 'none'">不循环</span>
                <span v-if="audioStore.loopMode === 'playlist'">列表循环</span>
                <span v-if="audioStore.loopMode === 'track'">单曲循环</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div class="fullscreen-bottom">
      <!-- Progress Bar -->
      <div class="fullscreen-progress">
        <span class="fs-time-current">{{ formattedCurrentTime }}</span>
        <div
          ref="fsProgressBarRef"
          class="fs-progress-bar-container"
          @mousedown="fsOnMouseDown"
        >
          <div
            class="fs-progress-bar"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <span class="fs-time-duration">{{ formattedDuration }}</span>
      </div>

      <!-- Control Buttons -->
      <div class="fullscreen-controls">
        <button
          @click="audioStore.prevTrack"
          :disabled="
            !audioStore.canPlayPrev && audioStore.loopMode !== 'playlist'
          "
          class="fs-control-btn"
        >
          ⏮
        </button>
        <button @click="togglePlayPause" class="fs-control-btn fs-play-btn">
          <span v-if="isPlaying">❚❚</span>
          <span v-else>▶</span>
        </button>
        <button
          @click="audioStore.nextTrack"
          :disabled="
            !audioStore.canPlayNext && audioStore.loopMode !== 'playlist'
          "
          class="fs-control-btn"
        >
          ⏭
        </button>

        <div class="control-separator"></div>

        <button
          @click="
            audioStore.setLoopMode(
              audioStore.loopMode === 'none'
                ? 'playlist'
                : audioStore.loopMode === 'playlist'
                ? 'track'
                : 'none'
            )
          "
          class="fs-control-btn loop-btn"
          :class="`loop-${audioStore.loopMode}`"
        >
          <span v-if="audioStore.loopMode === 'none'">🚫</span>
          <span v-if="audioStore.loopMode === 'playlist'">🔁</span>
          <span v-if="audioStore.loopMode === 'track'">🔂</span>
        </button>

        <button @click="audioStore.toggleMute()" class="fs-control-btn">
          <span v-if="isMuted">🔇</span>
          <span v-else>🔊</span>
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="currentVolume"
          @input="handleVolumeSliderInput"
          class="fs-volume-slider"
        />

        <button
          @click="togglePlaylist"
          class="fs-control-btn"
          :class="{ active: isPlaylistVisible }"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- Playlist Sidebar -->
    <div class="playlist-sidebar" :class="{ visible: isPlaylistVisible }">
      <div class="playlist-header">
        <h4>播放列表</h4>
        <button @click="togglePlaylist" class="close-playlist">✕</button>
      </div>
      <ul class="playlist-list">
        <li
          v-for="(track, index) in playlist"
          :key="track.id || index"
          @click="playTrackFromList(index)"
          :class="{ 'current-track': index === currentIndex }"
        >
          <span class="playlist-index">{{ index + 1 }}.</span>
          <span class="playlist-title">{{ track.title }}</span>
        </li>
        <li v-if="!playlist || playlist.length === 0" class="no-playlist">
          播放列表为空
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Mini Player Widget
.audio-player-widget {
  position: fixed;
  bottom: var(--space-lg);
  left: var(--space-lg);
  z-index: var(--z-index-overlay);
  transition: all 0.3s ease;
  min-height: 200px; // Ensure enough height to include expanded controls area
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.widget-container {
  background: var(--bg-glass);
  backdrop-filter: blur(12px) saturate(180%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--separator-primary);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible; // Allow absolute positioned children to show
  position: relative; // Establish positioning context
  
  // Dynamic gap based on actual visible content
  &.level-1 {
    gap: 0;
  }
  
  &.level-2 {
    gap: var(--space-md);
  }
  
  &.level-3 {
    gap: var(--space-md);
  }

  // Main content row
  .main-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  // Level-specific widths with smoother transitions
  &.level-1 {
    width: calc(60px + var(--space-md) * 2);

    .main-content {
      width: 60px;
    }
  }

  &.level-2 {
    width: 280px;

    .main-content {
      width: calc(280px - var(--space-md) * 2);
    }
  }

  &.level-3 {
    width: 320px;

    .main-content {
      width: calc(320px - var(--space-md) * 2);
    }
  }
}

// Vinyl Record
.vinyl-record {
  position: relative;
  width: 60px;
  height: 60px;
  cursor: pointer;
  flex-shrink: 0;

  .record-disc {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #1a1a1a 20%, #333 40%, #1a1a1a 60%);
    border-radius: 50%;
    border: 2px solid #444;
    position: relative;
    overflow: hidden;
    transition: transform 0.05s linear;

    .record-hole {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: #000;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }

    .record-image {
      position: absolute;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 80%;
      border-radius: 50%;
      object-fit: cover;
      z-index: 1;
    }

    .default-record {
      position: absolute;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 80%;
      border-radius: 50%;
      background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;

      .music-note {
        font-size: 24px;
        color: white;
        opacity: 0.8;
      }
    }
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;

    .play-icon {
      color: white;
      font-size: 18px;
    }
  }

  .fullscreen-button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: var(--accent-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
    color: white;
    font-size: 12px;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

// Current Lyric Display
.current-lyric-display {
  flex-grow: 1;
  font-size: var(--font-size-caption1);
  color: var(--text-primary);
  line-height: var(--line-height-normal);
  text-align: center;
  padding: 0 var(--space-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;
  transform: translateX(0) scale(1);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 200px;

  // Smooth hide animation for level 1
  .level-1 & {
    opacity: 0;
    transform: translateX(30px) scale(0.8);
    max-width: 0;
    padding: 0;
    margin: 0;
  }
}

// Expanded Controls
.expanded-controls {
  position: absolute;
  bottom: calc(100% + var(--space-sm));
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--bg-glass);
  backdrop-filter: blur(12px) saturate(180%);
  border-radius: var(--radius-md);
  border: 1px solid var(--separator-primary);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  padding: 0;
  margin: 0;
  transform: scaleY(0) translateY(10px);
  transform-origin: bottom;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  
  &.visible {
    max-height: 200px;
    opacity: 1;
    padding: var(--space-md);
    transform: scaleY(1) translateY(0);
    pointer-events: auto;
  }

  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-sm);

    .track-info {
      flex-grow: 1;

      .title {
        font-size: var(--font-size-subhead);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .artist {
        font-size: var(--font-size-caption1);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .level-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      min-width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--accent-primary);
        background: var(--fill-primary);
      }

      span {
        font-weight: var(--font-weight-semibold);
        line-height: 1;
      }
    }
  }

  .progress-section {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);

    .time-current,
    .time-duration {
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
      min-width: 35px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .progress-bar-container {
      flex-grow: 1;
      height: 4px;
      background-color: var(--fill-tertiary);
      border-radius: var(--radius-full);
      cursor: pointer;
      overflow: hidden;
      position: relative;

      .progress-bar {
        height: 100%;
        background-color: var(--accent-primary);
        border-radius: var(--radius-full);
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        transition: width 0.1s linear;
      }
    }
  }

  .controls-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);

    .control-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        background: var(--fill-primary);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &.play-btn {
        color: var(--text-primary);
        font-size: 16px;
      }

      &.loop-btn {
        &.loop-playlist,
        &.loop-track {
          color: var(--accent-primary);
        }
      }
    }

    .volume-slider {
      width: 60px;
      height: 3px;
      cursor: pointer;
      appearance: none;
      background: var(--fill-tertiary);
      border-radius: var(--radius-full);
      outline: none;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background: var(--text-primary);
        border-radius: 50%;
        cursor: pointer;
      }

      &::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: var(--text-primary);
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }
    }
  }
}

// Fullscreen Player
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  z-index: calc(var(--z-index-overlay) + 10);
  display: flex;
  flex-direction: column;
}

// Fullscreen Header
.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--separator-primary);
  height: 60px;
  flex-shrink: 0;

  .logo-section {
    .app-name {
      font-size: var(--font-size-title3);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }
  }

  .close-fullscreen {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 1.5rem;
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-primary);
    }
  }
}

// Fullscreen Main Content
.fullscreen-main {
  flex: 1;
  display: flex;
  overflow: hidden;

  .fullscreen-vinyl {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);

    .large-record {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, #1a1a1a 20%, #333 40%, #1a1a1a 60%);
      border-radius: 50%;
      border: 4px solid #444;
      position: relative;
      overflow: hidden;
      transition: transform 0.05s linear;

      .large-record-hole {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 24px;
        height: 24px;
        background: #000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
      }

      .large-record-image {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        border-radius: 50%;
        object-fit: cover;
        z-index: 1;
      }
    }
  }

  .fullscreen-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-xl);

    .song-info {
      margin-bottom: var(--space-lg);

      .fs-title {
        font-size: var(--font-size-title1);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--space-xs) 0;
      }

      .fs-artist {
        font-size: var(--font-size-title3);
        font-weight: var(--font-weight-medium);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .fullscreen-tabs {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);

      .tab-button {
        background: none;
        border: none;
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        cursor: pointer;
        color: var(--text-secondary);
        font-size: var(--font-size-subhead);
        transition: all 0.2s ease;

        &:hover {
          background: var(--fill-primary);
          color: var(--text-primary);
        }

        &.active {
          background: var(--accent-primary);
          color: white;
        }
      }
    }

    .fullscreen-content-area {
      flex: 1;
      overflow: hidden;

      .lyrics-content {
        height: 100%;

        .fullscreen-lyrics {
          height: 100%;
          overflow-y: auto;
          text-align: center;

          .lyrics-padding {
            height: 30vh;
          }

          p {
            margin: 0 0 var(--space-md) 0;
            font-size: var(--font-size-title3);
            line-height: var(--line-height-loose);
            color: var(--text-secondary);
            transition: all 0.3s ease;

            &.active-lyric {
              color: var(--accent-primary);
              font-weight: var(--font-weight-medium);
              transform: scale(1.1);
            }
          }
        }
      }

      .details-content {
        .detail-item {
          display: flex;
          margin-bottom: var(--space-lg);

          .detail-label {
            min-width: 80px;
            color: var(--text-secondary);
            font-weight: var(--font-weight-medium);
          }

          .detail-value {
            color: var(--text-primary);
            font-size: var(--font-size-subhead);
          }
        }
      }
    }
  }
}

// Fullscreen Bottom Controls
.fullscreen-bottom {
  flex-shrink: 0;
  padding: var(--space-lg) var(--space-xl);
  border-top: 1px solid var(--separator-primary);
  background: var(--bg-secondary);

  .fullscreen-progress {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);

    .fs-time-current,
    .fs-time-duration {
      font-size: var(--font-size-subhead);
      color: var(--text-secondary);
      min-width: 45px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .fs-progress-bar-container {
      flex: 1;
      height: 6px;
      background-color: var(--fill-tertiary);
      border-radius: var(--radius-full);
      cursor: pointer;
      overflow: hidden;
      position: relative;

      .fs-progress-bar {
        height: 100%;
        background-color: var(--accent-primary);
        border-radius: var(--radius-full);
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        transition: width 0.1s linear;
      }
    }
  }

  .fullscreen-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);

    .fs-control-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      font-size: 1.5rem;
      padding: var(--space-md);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;

      &:hover {
        color: var(--accent-primary);
        background: var(--fill-primary);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &.fs-play-btn {
        font-size: 2rem;
        color: var(--accent-primary);
      }

      &.loop-btn {
        &.loop-playlist,
        &.loop-track {
          color: var(--accent-primary);
        }
      }

      &.active {
        color: var(--accent-primary);
      }
    }

    .control-separator {
      width: 1px;
      height: 30px;
      background: var(--separator-primary);
      margin: 0 var(--space-sm);
    }

    .fs-volume-slider {
      width: 100px;
      height: 4px;
      cursor: pointer;
      appearance: none;
      background: var(--fill-tertiary);
      border-radius: var(--radius-full);
      outline: none;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--text-primary);
        border-radius: 50%;
        cursor: pointer;
      }

      &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--text-primary);
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }
    }
  }
}

// Playlist Sidebar
.playlist-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid var(--separator-primary);
  transition: transform 0.3s ease;
  z-index: calc(var(--z-index-overlay) + 11);
  display: flex;
  flex-direction: column;

  &.visible {
    transform: translateX(-350px);
  }

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg) var(--space-xl);
    border-bottom: 1px solid var(--separator-primary);

    h4 {
      margin: 0;
      font-size: var(--font-size-title3);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .close-playlist {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 1.2rem;
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        background: var(--fill-primary);
      }
    }
  }

  .playlist-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: var(--space-md) var(--space-xl);
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      font-size: var(--font-size-subhead);
      border-bottom: 1px solid var(--separator-secondary);

      &:hover {
        background: var(--fill-primary);
      }

      &.current-track {
        background: var(--accent-primary);
        color: white;
        font-weight: var(--font-weight-medium);
      }

      .playlist-index {
        margin-right: var(--space-md);
        color: var(--text-secondary);
        min-width: 2em;
        text-align: right;
      }

      .playlist-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .no-playlist {
      color: var(--text-secondary);
      font-style: italic;
      text-align: center;
      padding: var(--space-xl);
    }
  }
}
</style>
