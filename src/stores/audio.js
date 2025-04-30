// src/stores/audio.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAudioStore = defineStore('audio', () => {
  // --- State ---
  const currentTrack = ref(null); // Holds the full track object { url, title, artist, cover, lyricsUrl, ... }
  const playlist = ref([]); // Array of track objects
  const currentIndex = ref(-1); // Index of current track in playlist
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(0.75);
  const isMuted = ref(false); // Optional: Mute state
  const loopMode = ref('none'); // 'none', 'track', 'playlist'

  // --- Getters (Computed) ---
  const hasTrack = computed(() => !!currentTrack.value);
  const canPlayNext = computed(() => currentIndex.value < playlist.value.length - 1);
  const canPlayPrev = computed(() => currentIndex.value > 0);

  // --- Actions ---
  function setPlaylist(tracks, startIndex = 0) {
    console.log('Setting playlist:', tracks);
    playlist.value = tracks || [];
    currentIndex.value = -1; // Reset index
    if (playlist.value.length > 0) {
      loadTrackByIndex(startIndex);
    } else {
      // Clear current track if playlist is empty
      clearCurrentTrack();
    }
  }

  function loadTrackByIndex(index) {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index;
      currentTrack.value = playlist.value[index];
      console.log('Loading track by index:', index, currentTrack.value);
      // Reset playback state for new track
      isPlaying.value = false;
      currentTime.value = 0;
      duration.value = 0;
      // The AudioPlayer component will watch currentTrack.value.url and update the <audio> src
    } else {
      console.warn(`Invalid index ${index} for playlist of length ${playlist.value.length}`);
      clearCurrentTrack();
    }
  }

  function playTrack(track) {
      // Check if track is already in playlist
      const existingIndex = playlist.value.findIndex(t => t.url === track.url); // Or use a unique ID
      if (existingIndex !== -1) {
          loadTrackByIndex(existingIndex);
      } else {
          // Add track to playlist (e.g., at the end) and play it
          playlist.value.push(track);
          loadTrackByIndex(playlist.value.length - 1);
      }
      // Signal intent to play - Player component will handle actual play()
      // We might need a separate state variable like 'playIntent' if needed
      // For now, the player will likely try to play when currentTrack changes if it wasn't paused manually.
      // Let's rely on the player component's logic for now.
  }

  function clearCurrentTrack() {
      currentTrack.value = null;
      isPlaying.value = false;
      currentTime.value = 0;
      duration.value = 0;
      currentIndex.value = -1;
  }

  function clearPlaylist() {
      playlist.value = [];
      clearCurrentTrack();
  }

  // Actions primarily called by the AudioPlayer component to sync state
  function setIsPlaying(playing) {
    isPlaying.value = playing;
  }

  function setCurrentTime(time) {
    currentTime.value = time;
  }

  function setDuration(dur) {
    duration.value = dur;
  }

  // Actions called by UI or player
  function setVolume(vol) {
    volume.value = Math.max(0, Math.min(1, vol)); // Clamp between 0 and 1
  }

  function toggleMute() {
      isMuted.value = !isMuted.value;
      // The player component will watch isMuted and set audioRef.muted
  }

  function setLoopMode(mode) { // 'none', 'track', 'playlist'
      if (['none', 'track', 'playlist'].includes(mode)) {
          loopMode.value = mode;
      } else {
          console.warn(`Invalid loop mode: ${mode}`);
      }
      // Player component will watch loopMode and set audioRef.loop if mode === 'track'
  }

  function nextTrack() {
      if (canPlayNext.value) {
          loadTrackByIndex(currentIndex.value + 1);
      } else if (loopMode.value === 'playlist' && playlist.value.length > 0) {
          loadTrackByIndex(0); // Loop back to start
      } else {
          // Stop playback or do nothing if at end and no loop
          isPlaying.value = false;
      }
  }

  function prevTrack() {
      if (canPlayPrev.value) {
          loadTrackByIndex(currentIndex.value - 1);
      } else if (loopMode.value === 'playlist' && playlist.value.length > 0) {
          loadTrackByIndex(playlist.value.length - 1); // Loop back to end
      }
      // If at the beginning and no loop, do nothing or maybe restart current track?
  }

  // --- Return state and actions ---
  return {
    // State
    currentTrack,
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    loopMode,
    // Getters
    hasTrack,
    canPlayNext,
    canPlayPrev,
    // Actions
    setPlaylist,
    loadTrackByIndex,
    playTrack,
    clearCurrentTrack,
    clearPlaylist,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleMute,
    setLoopMode,
    nextTrack,
    prevTrack,
  };
});