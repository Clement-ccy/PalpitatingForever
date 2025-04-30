<template>
  <div class="control-panel">
    <!-- Toggle Button (Position fixed or placed in header) -->
    <button
      @click="togglePanel"
      class="control-panel-toggle"
      aria-label="打开控制面板"
    >
      <!-- Icon for menu/settings -->
      <span>⚙️</span>
    </button>

    <!-- Control Panel Overlay/Drawer -->
    <!-- REMOVED transition wrapper here -->
    <div
      class="control-panel-container"
      :class="{ 'is-open': isPanelOpen }"
      ref="panelRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="control-panel-title"
    >
      <div class="panel-header">
        <h3 id="control-panel-title">控制台</h3>
        <button
          @click="togglePanel"
          class="close-button"
          aria-label="关闭控制面板"
        >
          ×
        </button>
      </div>
      <nav class="panel-nav" aria-label="主导航">
        <router-link to="/" @click="isPanelOpen = false">主页</router-link>
        <router-link to="/blog" @click="isPanelOpen = false">博客</router-link>
        <router-link to="/plog" @click="isPanelOpen = false">摄影</router-link>
        <router-link to="/mlog" @click="isPanelOpen = false">音乐</router-link>
      </nav>
      <div class="panel-settings">
        <h4>设置</h4>
        <div class="setting-item">
          <span>外观</span>
          <button @click="toggleTheme">
            切换至 {{ currentTheme === "light" ? "深色" : "浅色" }}模式
          </button>
        </div>
        <!-- Add other settings here -->
      </div>
    </div>
    <!-- End Control Panel div -->

    <!-- Optional: Overlay when panel is open -->
    <div
      class="panel-overlay"
      :class="{ 'is-open': isPanelOpen }"
      @click="togglePanel"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isPanelOpen = ref(false);
const currentTheme = ref("light"); // Default theme

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute("data-theme", theme); // Set attribute on <html>
  localStorage.setItem("theme", theme); // Save preference
  // isPanelOpen.value = false; // Optionally close panel after selection
};

const toggleTheme = () => {
  const newTheme = currentTheme.value === "light" ? "dark" : "light";
  setTheme(newTheme);
};

// Load saved theme or detect system preference on mount
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme("dark");
  } else {
    setTheme("light"); // Default to light if no preference saved or detected
  }

  // Optional: Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e) => {
    // Only change if no theme explicitly saved by user
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  };
  mediaQuery.addEventListener("change", handleChange);

  // Cleanup listener on unmount
  onUnmounted(() => {
    mediaQuery.removeEventListener("change", handleChange);
  });
});

// Close panel if clicking outside (basic implementation - currently disabled)
const panelRef = ref(null);
// const handleClickOutside = (event) => { ... }; // Logic remains but listener is off

onMounted(() => {
  // document.addEventListener('click', handleClickOutside); // Disabled for now
});
onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside); // Disabled for now
});
</script>

<style scoped lang="scss">
@use "@/pf-ui/variables" as var;
@use "sass:color"; // Import the sass:color module

.control-panel {
  position: relative; // Relative to position the toggle button
  z-index: var.$z-index-navigation; // Below overlay, above content
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Align toggle button to the right
}

.control-panel-toggle {
  position: fixed; // Example positioning
  top: var.$space-xl;
  right: var.$space-xl;
  z-index: var.$z-index-navigation + 1; // Above navigation, below overlay
  background: var(--fill-primary);
  color: var(--text-primary);
  border: none;
  padding: var.$space-md;
  border-radius: var.$radius-full;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }

  // Theme-aware hover state using sass:color
  [data-theme="light"] &:hover {
    // Replace darken with color.adjust
    background: color.adjust(var.$light-fill-primary, $lightness: -5%);
  }
  [data-theme="dark"] &:hover {
    // Replace lighten with color.adjust
    background: color.adjust(var.$dark-fill-primary, $lightness: 5%);
  }

  span {
    // Style icon if needed
    display: block;
    font-size: 1.2rem; // Adjust icon size
  }
}

.panel-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); // Semi-transparent black
  z-index: var.$z-index-overlay; // Below panel, above content
  backdrop-filter: blur(4px); // Optional blur effect
  opacity: 0; // Start hidden
  pointer-events: none; // Prevent interaction when hidden
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  // Style for when the panel should be visibly open
  &.is-open {
    opacity: 1;
    pointer-events: auto; // Allow interaction when open
  }
}

.control-panel-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px; // Example width
  max-width: 90vw;
  height: 100vh;
  background-color: var(--bg-secondary); // Use secondary background
  color: var(--text-primary);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: var.$z-index-overlay + 1; // Above overlay
  padding: var.$space-xl;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); // Apply transition directly
  transform: translateX(100%); // Default closed state

  // Style for when the panel should be visibly open
  &.is-open {
    transform: translateX(0);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var.$space-xxl;
    h3 {
      margin: 0;
      font-size: var.$font-size-title3;
    } // Adjust heading size
    .close-button {
      background: none;
      border: none;
      font-size: 1.8rem; // Larger close icon
      line-height: 1;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var.$space-xs;
      &:hover {
        color: var(--text-primary);
      }
    }
  }

  .panel-nav {
    display: flex;
    flex-direction: column;
    gap: var.$space-md;
    margin-bottom: var.$space-xxl;
    a {
      text-decoration: none;
      color: var(--text-primary);
      padding: var.$space-sm var.$space-md;
      border-radius: var.$radius-sm;
      transition: background-color 0.2s ease, color 0.2s ease;
      font-size: var.$font-size-body;
      &:hover {
        background-color: var(--fill-primary);
        color: var(--accent-primary); // Use accent on hover
      }
      // Style active link
      &.router-link-exact-active {
        // Use exact active for better matching
        background-color: var(--accent-primary);
        color: var(
          --bg-primary
        ); // Use background color for text on active accent bg
        &:hover {
          color: var(--bg-primary); // Keep text color on hover for active
        }
      }
    }
  }

  .panel-settings {
    margin-top: auto; // Push settings to the bottom
    padding-top: var.$space-xl;
    border-top: 1px solid var(--separator-primary);
    h4 {
      margin-bottom: var.$space-lg;
      font-size: var.$font-size-subhead;
      color: var(--text-secondary);
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var.$space-md;
      span {
        font-size: var.$font-size-body;
      }
      button {
        // Basic button styling
        padding: var.$space-xs var.$space-md;
        border: 1px solid var(--separator-primary);
        background: var(--bg-primary);
        color: var(--accent-primary);
        border-radius: var.$radius-sm;
        cursor: pointer;
        font-size: var.$font-size-footnote;
        transition: border-color 0.2s ease, background-color 0.2s ease;
        &:hover {
          border-color: var(--accent-primary);
          background-color: var(--fill-primary);
        }
      }
    }
  }
}
</style>
