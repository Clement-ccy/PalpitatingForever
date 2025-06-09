<script setup>
// Import data and store
import mlogsData from '@/data/mlogs.json';
import { useAudioStore } from '@/stores/audio';
import { computed } from 'vue';

const audioStore = useAudioStore();

// Prepare track data for the store (ensure necessary fields are mapped)
const tracks = computed(() => {
    return mlogsData.map(track => ({
        id: track.id, // Keep ID for potential key usage
        url: track.audioFile?.url, // Use optional chaining
        title: track.title || '未知标题',
        // Derive artist: Find first performer/vocalist role, fallback if needed
        // Remove parentheses content like (Vocalist)
        artist: track.roles?.find(role => role.includes('演唱者') || role.includes('演奏者'))?.replace(/\s*\(.*\)\s*/, '') || '未知艺术家',
        cover: track.artwork?.url || '/src/assets/images/placeholder-1.svg', // Fallback cover
        lyricsUrl: track.lyricsFile?.url, // Optional lyrics URL
        // Add any other relevant data needed by the player or UI
    })).filter(track => track.url); // Filter out tracks without an audio URL
});

// Function to handle playing a track from the list
const playTrack = (index) => {
    // Set the entire list as the playlist and start playing from the selected index
    console.log(`Playing track at index ${index}`);
    audioStore.setPlaylist(tracks.value, index);
    // Signal intent to play immediately
    audioStore.setIsPlaying(true);
};

// Computed property to check if a track is the *currently loaded* track in the store
const isTrackLoaded = (track) => {
    return audioStore.currentTrack?.id === track.id;
};

// Computed property to check if the *currently loaded* track is playing
const isCurrentTrackPlaying = computed(() => {
    return audioStore.isPlaying;
});


</script>

<template>
  <div class="container section mlog-index">
    <h1>音乐 | Mlog</h1>
    <p>这里记录着我的音乐创作与探索。</p>
    <!-- <router-link to="/mlog/albums">查看专辑列表</router-link> -->

    <div class="track-list">
        <div v-for="(track, index) in tracks" :key="track.id || index" class="track-item" :class="{ 'is-loaded': isTrackLoaded(track) }">
            <img :src="track.cover" alt="Artwork" class="track-cover" loading="lazy">
            <div class="track-details">
                <span class="track-title">{{ track.title }}</span>
                <span class="track-artist">{{ track.artist }}</span>
            </div>
            <!-- Use a single button, toggle icon based on loaded/playing state -->
            <button @click="playTrack(index)" class="play-button" :aria-label="(isTrackLoaded(track) && isCurrentTrackPlaying) ? 'Pause' : 'Play ' + track.title">
                <span v-if="isTrackLoaded(track) && isCurrentTrackPlaying">❚❚</span> <!-- Pause Icon -->
                <span v-else>▶</span>   <!-- Play Icon -->
            </button>
        </div>
        <div v-if="tracks.length === 0" class="no-tracks">
            暂无音乐。请检查 Notion 数据或 fetch 脚本。
        </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.mlog-index {
    // Add padding or other layout styles for the view container
    padding-bottom: calc(var(--space-xxxxl) * 2 + 60px); // Add padding to avoid overlap with player
}

.track-list {
    margin-top: var(--space-xxl);
    display: grid;
    gap: var(--space-lg);
}

.track-item {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-md);
    background-color: var(--bg-secondary);
    border: 1px solid transparent; // Placeholder for loaded state border
    border-radius: var(--radius-md);
    transition: background-color 0.2s ease, border-color 0.2s ease;
    cursor: default; // Default cursor for the item itself

    &:hover {
        background-color: var(--fill-primary);
    }

    // Style for the currently loaded track
    &.is-loaded {
        // Use CSS variable for accent color to respect theme changes
        border-color: var(--accent-primary);
        // Use rgba with CSS variable for background - requires browser support
        // Fallback might be needed if older browser support is critical
        background-color: var(--accent-hover); // Use predefined hover color
        // Fallback or alternative:
        // background-color: var(--fill-primary); // Or use fill color
    }
}

.track-cover {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    background-color: var(--separator-primary); // Placeholder bg color
}

.track-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; // Prevent overflow
}

.track-title {
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.play-button {
    background: none;
    border: 1px solid var(--separator-primary);
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0; // Remove padding, use width/height
    width: 36px; // Fixed size
    height: 36px; // Fixed size
    border-radius: var(--radius-full);
    line-height: 34px; // Adjust for border
    text-align: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
        color: var(--text-primary);
        border-color: var(--accent-primary);
    }

    // Active style for the loaded track's button
    .track-item.is-loaded & {
        color: var(--accent-primary);
        border-color: var(--accent-primary);
    }
}

.no-tracks {
    grid-column: 1 / -1; // Span full width if grid
    text-align: center;
    color: var(--text-secondary);
    padding: var(--space-xxl);
    font-style: italic;
}
</style>