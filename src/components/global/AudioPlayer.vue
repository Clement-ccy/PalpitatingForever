<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useAudioStore } from '@/stores/audio'; // Import the store

// --- Store ---
const audioStore = useAudioStore();

// --- State Refs ---
const audioRef = ref(null); // Ref for the <audio> element
const isSeeking = ref(false); // Flag to prevent timeupdate during seek

// --- Computed Properties from Store ---
const currentTrack = computed(() => audioStore.currentTrack);
const isPlaying = computed(() => audioStore.isPlaying);
const currentTime = computed(() => audioStore.currentTime);
const duration = computed(() => audioStore.duration);
const currentVolume = computed(() => audioStore.volume); // Renamed for clarity in template binding
const isMuted = computed(() => audioStore.isMuted);
const loopMode = computed(() => audioStore.loopMode);

// --- Computed Properties ---
const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));
const progressPercent = computed(() => {
  // Prevent division by zero or NaN issues
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// --- Helper Functions ---
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) { // Added checks for NaN/Infinity
      return '--:--';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Audio Element Event Handlers ---
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    console.log("Audio metadata loaded. Duration:", audioRef.value.duration);
    audioStore.setDuration(audioRef.value.duration);
    // Set initial volume and muted state from store
    audioRef.value.volume = audioStore.volume;
    audioRef.value.muted = audioStore.isMuted;
    // Set loop based on store
    audioRef.value.loop = audioStore.loopMode === 'track';
  }
};

const handleTimeUpdate = () => {
    if (audioRef.value && !isSeeking.value) {
        audioStore.setCurrentTime(audioRef.value.currentTime);
        // TODO: Add lyrics sync logic here
    }
};

const handleEnded = () => {
  console.log("Audio ended");
  audioStore.setIsPlaying(false);
  if (audioStore.loopMode === 'track') {
      // If looping track, reset time and play again
      audioRef.value.currentTime = 0;
      audioRef.value.play().catch(e => console.error("Loop play failed:", e));
  } else if (audioStore.loopMode === 'playlist') {
      // If looping playlist, call nextTrack action
      audioStore.nextTrack();
      // Store action will set isPlaying potentially, need watcher to play
  }
  // If loopMode is 'none', playback stops naturally.
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
    // Sync store if volume changed externally (e.g., browser controls)
    if (audioRef.value && audioStore.volume !== audioRef.value.volume) {
        audioStore.setVolume(audioRef.value.volume);
    }
    if (audioRef.value && audioStore.isMuted !== audioRef.value.muted) {
        // This might be tricky, maybe just rely on our UI toggle?
        // audioStore.isMuted = audioRef.value.muted;
    }
};


// --- Playback Controls ---
const togglePlayPause = () => {
    if (!audioRef.value || !audioStore.currentTrack?.url) {
        console.warn("Toggle play: No audio ref or track URL");
        return;
    }

    if (audioRef.value.paused) {
        console.log("Attempting to play...");
        audioRef.value.play().catch(error => {
            console.error("Audio play failed:", error);
            audioStore.setIsPlaying(false); // Ensure state is correct on failure
        });
    } else {
        console.log("Attempting to pause...");
        audioRef.value.pause();
    }
    // State is updated via handlePlay/handlePause events
};

// --- Progress Bar Interaction ---
const progressBarRef = ref(null); // Ref for the container

const handleSeek = (event) => {
    if (!audioRef.value || !audioStore.duration || !progressBarRef.value) return;
    const rect = progressBarRef.value.getBoundingClientRect();
    // Calculate click position relative to the progress bar
    const clickX = event.clientX - rect.left;
    const barWidth = rect.width;
    // Ensure position is within bounds [0, 1]
    const clickPosition = Math.max(0, Math.min(1, clickX / barWidth));
    const newTime = clickPosition * audioStore.duration;

    console.log(`Seeking to: ${newTime.toFixed(2)}s (${(clickPosition * 100).toFixed(1)}%)`);

    // Update audio element time directly
    audioRef.value.currentTime = newTime;
    // Update store time immediately for UI responsiveness
    audioStore.setCurrentTime(newTime);
};


const onMouseDown = (event) => {
    if (!audioStore.hasTrack) return; // Don't allow seeking if no track
    isSeeking.value = true;
    handleSeek(event); // Seek immediately on mousedown
    // Add listeners to window to handle dragging outside the bar
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event) => {
    if (isSeeking.value) {
        handleSeek(event); // Update seek position while dragging
    }
};

const onMouseUp = () => {
    if (isSeeking.value) {
        isSeeking.value = false;
        // Remove window listeners
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        console.log("Seek end");
    }
};

// --- Volume Control ---
const handleVolumeSliderInput = (event) => {
    if (!audioRef.value) return;
    const newVolume = Math.max(0, Math.min(1, parseFloat(event.target.value))); // Clamp value
    audioStore.setVolume(newVolume);
    // Watcher below will update audioRef.volume
};

// --- Lifecycle Hooks (for cleanup) ---
onUnmounted(() => {
    // Clean up global listeners if mouseup didn't fire (e.g., user switched tabs)
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
});

// --- Watchers for Store State -> Audio Element ---
watch(() => audioStore.currentTrack?.url, (newUrl, oldUrl) => {
    console.log("Watcher: Track URL changed from", oldUrl, "to", newUrl);
    if (audioRef.value && newUrl && audioRef.value.src !== newUrl) {
        console.log("Watcher: Updating audio src");
        audioRef.value.src = newUrl;
        audioRef.value.load(); // Important to load the new source
        // Reset component-level seeking flag on track change
        isSeeking.value = false;
        // If the store intends to play, try playing after a tick
        if (audioStore.isPlaying) {
             nextTick(() => {
                 console.log("Watcher: Attempting to play new track because store isPlaying=true");
                 audioRef.value?.play().catch(e => {
                     console.error("Autoplay failed after track change:", e);
                     // If autoplay fails, sync store back to paused state
                     audioStore.setIsPlaying(false);
                 });
             });
        }
    } else if (audioRef.value && !newUrl) {
        // Clear src if track is cleared in store
        console.log("Watcher: Clearing audio src");
        audioRef.value.removeAttribute('src');
        audioRef.value.load(); // Important to clear buffer
        audioStore.setDuration(0); // Reset duration in store
        audioStore.setCurrentTime(0); // Reset time in store
    }
}, { immediate: true }); // Run immediately to set initial src if store already has a track

watch(() => audioStore.volume, (newVolume) => {
    if (audioRef.value && audioRef.value.volume !== newVolume) {
        console.log("Watcher: Setting audio volume to", newVolume);
        audioRef.value.volume = newVolume;
    }
});

watch(() => audioStore.isMuted, (newMuted) => {
    if (audioRef.value && audioRef.value.muted !== newMuted) {
        console.log("Watcher: Setting audio muted state to", newMuted);
        audioRef.value.muted = newMuted;
    }
});

watch(() => audioStore.loopMode, (newMode) => {
    if (audioRef.value) {
        const shouldLoop = newMode === 'track';
        if (audioRef.value.loop !== shouldLoop) {
            console.log("Watcher: Setting audio loop to", shouldLoop);
            audioRef.value.loop = shouldLoop;
        }
    }
});

// Watcher to handle play/pause triggered from the store (e.g., after next/prev)
watch(() => audioStore.isPlaying, (shouldPlay) => {
    if (!audioRef.value) return;
    console.log("Watcher: isPlaying changed to", shouldPlay);
    if (shouldPlay && audioRef.value.paused) {
        console.log("Watcher: Store wants play, attempting play...");
        audioRef.value.play().catch(e => {
            console.error("Play triggered by store watcher failed:", e);
            audioStore.setIsPlaying(false); // Sync back if failed
        });
    } else if (!shouldPlay && !audioRef.value.paused) {
        console.log("Watcher: Store wants pause, pausing...");
        audioRef.value.pause();
    }
});


// --- Mock loading a track via store action for testing (REMOVE LATER) ---
onMounted(() => {
    // Only load mock data if no track is currently set in the store
    if (!audioStore.currentTrack) {
        console.log("AudioPlayer Mounted: No track in store, loading mock track.");
        audioStore.setPlaylist([{ // Use setPlaylist to also populate playlist
            url: '/src/assets/musics/sources/1123.mp3',
            title: '1123 (Store Test)',
            artist: 'Example Artist',
            cover: '/src/assets/images/cover-1.jpg',
            lyricsUrl: '/src/assets/musics/lyrics/1123.lrc'
        }], 0); // Load the first track
        // Don't auto-play, let user click
        audioStore.setIsPlaying(false);
    } else {
        console.log("AudioPlayer Mounted: Store already has a track.");
        // Ensure audio element reflects current store state if component remounts
        if (audioRef.value) {
            audioRef.value.volume = audioStore.volume;
            audioRef.value.muted = audioStore.isMuted;
            audioRef.value.loop = audioStore.loopMode === 'track';
            // Don't try to set currentTime here, let timeupdate handle it
        }
    }
});

</script>

<template>
  <div class="audio-player" v-show="audioStore.hasTrack"> <!-- Show based on store getter -->
    <audio
      ref="audioRef"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @play="handlePlay"
      @pause="handlePause"
      @volumechange="handleVolumeChangeOnElement"
      preload="metadata"
    ></audio>

    <div class="player-controls">
      <!-- TODO: Add Prev Track Button -->
      <button @click="audioStore.prevTrack" :disabled="!audioStore.canPlayPrev && audioStore.loopMode !== 'playlist'" aria-label="Previous Track" class="skip-btn">⏮</button>

      <button @click="togglePlayPause" class="play-pause-btn" :aria-label="isPlaying ? 'Pause' : 'Play'">
        <span v-if="isPlaying">❚❚</span> <!-- Pause Icon -->
        <span v-else>▶</span>   <!-- Play Icon -->
      </button>

      <!-- TODO: Add Next Track Button -->
      <button @click="audioStore.nextTrack" :disabled="!audioStore.canPlayNext && audioStore.loopMode !== 'playlist'" aria-label="Next Track" class="skip-btn">⏭</button>


      <div class="track-info">
          <span class="title" :title="currentTrack?.title">{{ currentTrack?.title || '---' }}</span>
          <span class="artist" :title="currentTrack?.artist">{{ currentTrack?.artist || '---' }}</span>
      </div>

      <div class="time-progress">
        <span class="current-time">{{ formattedCurrentTime }}</span>
        <div
          ref="progressBarRef"
          class="progress-bar-container"
          @mousedown="onMouseDown"
         >
          <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
        </div>
        <span class="duration">{{ formattedDuration }}</span>
      </div>

      <!-- TODO: Add Loop Toggle Button -->
      <button @click="audioStore.setLoopMode(audioStore.loopMode === 'none' ? 'playlist' : audioStore.loopMode === 'playlist' ? 'track' : 'none')" class="loop-btn" :aria-label="`Loop Mode: ${audioStore.loopMode}`" :class="`loop-${audioStore.loopMode}`">
          <span v-if="audioStore.loopMode === 'none'">🚫</span>
          <span v-if="audioStore.loopMode === 'playlist'">🔁</span>
          <span v-if="audioStore.loopMode === 'track'">🔂</span>
      </button>

      <div class="volume-control">
         <!-- TODO: Add Mute Toggle Button -->
         <button @click="audioStore.toggleMute()" class="mute-btn" :aria-label="isMuted ? 'Unmute' : 'Mute'">
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
          aria-label="Volume"
        /> <!-- Changed event handler -->
      </div>
    </div>

    <!-- TODO: Add lyrics display area -->
    <!-- <div class="lyrics-display"></div> -->
  </div>
</template>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;

.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  // Use variables for background and text for theme consistency
  background-color: rgba(#1c1c1e, 0.85); // Use hex from $dark-bg-secondary with desired alpha
  backdrop-filter: blur(12px) saturate(180%); // Apple-like blur
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  color: var(--dark-text-primary); // Use dark theme text color
  padding: var.$space-md var.$space-lg;
  z-index: var.$z-index-overlay; // High z-index
  border-top: 1px solid var.$dark-separator; // Use the $dark-separator variable directly
  box-shadow: 0 -2px 15px rgba(0,0,0,0.25);
  transition: transform 0.3s ease-out; // For potential hiding animation

  // Example: Hide player if no track (using v-show keeps element in DOM)
  // &.v-enter-from, &.v-leave-to {
  //   transform: translateY(100%);
  // }
}

.player-controls {
  display: flex;
  align-items: center;
  gap: var.$space-md; // Reduced gap slightly
  max-width: 1200px; // Limit width on large screens
  margin: 0 auto; // Center controls
  height: 40px; // Consistent height
}

.play-pause-btn, .skip-btn, .loop-btn, .mute-btn {
  background: none;
  border: none;
  color: var(--dark-text-secondary); // Use secondary color for less emphasis
  font-size: 1.5rem; // Slightly smaller icons
  cursor: pointer;
  padding: 0 var.$space-xs;
  line-height: 1;
  transition: color 0.2s ease;
  &:hover {
    color: var(--dark-text-primary); // Highlight on hover
  }
   &:disabled {
       opacity: 0.4;
       cursor: not-allowed;
   }
}
.play-pause-btn {
    font-size: 1.8rem; // Keep play/pause larger
    color: var(--dark-text-primary); // Keep play/pause primary
     &:hover {
        color: var(--dark-accent-primary);
    }
}
.loop-btn {
    &.loop-playlist, &.loop-track {
        color: var(--dark-accent-primary); // Indicate active loop mode
         &:hover {
             color: lighten(var.$dark-accent-primary, 15%);
         }
    }
}


.track-info {
    display: flex;
    flex-direction: column;
    justify-content: center; // Center text vertically
    min-width: 100px; // Prevent shrinking too much
    max-width: 250px; // Prevent growing too large
    overflow: hidden; // Hide overflow
    margin: 0 var.$space-sm; // Add some margin
    .title {
        font-weight: var.$font-weight-medium;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .artist {
        font-size: var.$font-size-caption1;
        color: var(--dark-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.time-progress {
  flex-grow: 1; // Take up remaining space
  display: flex;
  align-items: center;
  gap: var.$space-md;
  min-width: 150px; // Ensure progress bar has some minimum space
}

.current-time, .duration {
  font-size: var.$font-size-caption1;
  color: var(--dark-text-secondary);
  min-width: 35px; // Prevent layout shifts
  text-align: center;
  font-variant-numeric: tabular-nums; // Keep numbers aligned
}

.progress-bar-container {
  flex-grow: 1;
  height: 6px;
  background-color: rgba(#ffffff, 0.1); // Use a light color with low alpha for the track
  border-radius: var.$radius-full;
  cursor: pointer;
  overflow: hidden; // Ensure progress bar stays within bounds
  position: relative; // For absolute positioning of progress bar
}

.progress-bar {
  height: 100%;
  background-color: var(--dark-accent-primary);
  border-radius: var.$radius-full;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; // Prevent interaction with the progress itself
  transition: width 0.1s linear; // Smooth progress update (optional)
}

.volume-control {
  display: flex;
  align-items: center;
  gap: var.$space-sm;
}

.volume-slider {
  width: 80px; // Adjust width
  height: 4px;
  cursor: pointer;
  appearance: none; // Override default look
  background: rgba(#ffffff, 0.1); // Use same as progress bar track
  border-radius: var.$radius-full;
  outline: none;
  transition: background 0.2s ease;

  // --- Slider Thumb Styling (Browser-specific) ---
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--dark-text-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: var(--dark-text-primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: background 0.2s ease;
  }

  // Hover effect on thumb (might need JS or focus state)
  // &:hover::-webkit-slider-thumb { background: var(--dark-accent-primary); }
  // &:hover::-moz-range-thumb { background: var(--dark-accent-primary); }
}

// TODO: Add styles for lyrics display
</style>