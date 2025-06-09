<template>
  <header class="the-header" :class="headerClasses">
    <div class="header-container">
      <!-- 左侧：访问者信息 -->
      <div class="header-left">
        <div class="visitor-info">
          <span class="visitor-location">{{ visitorLocation }}</span>
          <span class="separator">//</span>
          <span class="breathing-dot"></span>
          <span class="visitor-time">{{ visitorTime }}</span>
        </div>
      </div>

      <!-- 中间：LOGO和导航 -->
      <div class="header-center">
        <!-- 左侧导航 -->
        <nav class="nav-left" v-if="leftNavigation.length">
          <ul class="nav-list">
            <li
              v-for="item in leftNavigation"
              :key="item.path"
              class="nav-item"
            >
              <TransitionLink
                :to="item.path"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === item.path }"
              >
                {{ item.label }}
              </TransitionLink>
            </li>
          </ul>
        </nav>

        <!-- LOGO -->
        <div class="header-logo">
          <TransitionLink to="/" class="logo-link">
            <LogoSvg
              :size="40"
              :show-text="true"
              :show-icon="true"
              :text-color="'currentColor'"
              :icon-color="'currentColor'"
              logo-class="main-logo"
            />
          </TransitionLink>
        </div>

        <!-- 右侧导航 -->
        <nav class="nav-right" v-if="rightNavigation.length">
          <ul class="nav-list">
            <li
              v-for="item in rightNavigation"
              :key="item.path"
              class="nav-item"
            >
              <TransitionLink
                :to="item.path"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === item.path }"
              >
                {{ item.label }}
              </TransitionLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 右侧：工具栏 -->
      <div class="header-toolbar">
        <!-- 全屏按钮 -->
        <button 
          class="toolbar-button"
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏' : '进入全屏'"
          aria-label="全屏切换"
        >
          <span>{{ isFullscreen ? '📐' : '🔳' }}</span>
        </button>

        <!-- 主题切换按钮 -->
        <button 
          class="toolbar-button" 
          @click="toggleTheme" 
          :title="currentTheme === 'light' ? '切换至深色模式' : '切换至浅色模式'"
          aria-label="主题切换"
        >
          <span>{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
        </button>

        <!-- 搜索按钮 -->
        <button class="toolbar-button" @click="openSearch" aria-label="搜索">
          <span>🔍</span>
        </button>

        <!-- 随机文章按钮 -->
        <button class="toolbar-button" @click="goToRandomPost" aria-label="随机文章">
          <span>🎲</span>
        </button>

        <!-- 更多工具按钮 -->
        <button
          class="toolbar-button menu-toggle"
          :class="{ 'menu-toggle--active': isControlPanelOpen }"
          @click="toggleControlPanel"
          aria-label="更多工具"
        >
          <span>⚙️</span>
        </button>
      </div>
    </div>

    <!-- 桌面端控制面板 -->
    <div class="control-panel" :class="{ 'control-panel--open': isControlPanelOpen }">
      <div class="control-panel-content">
        <div class="control-section">
          <h4>快捷操作</h4>
          <ul class="control-list">
            <li><button @click="goToRandomPost">随机文章</button></li>
            <li><button @click="openSearch">全站搜索</button></li>
            <li><button @click="toggleTheme">切换主题</button></li>
            <li>
              <button @click="audioStore.togglePlayerVisibility">
                {{ audioStore.isPlayerVisible ? '隐藏音乐播放器' : '显示音乐播放器' }}
              </button>
            </li>
          </ul>
        </div>
        <div class="control-section">
          <h4>站点导航</h4>
          <ul class="control-list">
            <li v-for="item in allNavigation" :key="item.path">
              <TransitionLink :to="item.path" @click="closeControlPanel">
                {{ item.label }}
              </TransitionLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import TransitionLink from "@/components/common/TransitionLink.vue";
import LogoSvg from "@/components/common/LogoSvg.vue";
import { useAudioStore } from "@/stores/audio";

const route = useRoute();
const audioStore = useAudioStore();

// 响应式状态
const isScrolled = ref(false);
const isControlPanelOpen = ref(false);
const scrollY = ref(0);
const currentTheme = ref("light");
const isFullscreen = ref(false);
const visitorLocation = ref("获取中...");
const visitorTime = ref("");
const visitorTimezone = ref("");

// 导航配置
const navigationMap = {
  "/": [],
  "/blog": [
    { path: "/blog", label: "Index" },
    { path: "/blog/all", label: "All Posts" },
    { path: "/blog/about", label: "About" },
    { path: "/blog/links", label: "Links" },
    { path: "/blog/gear", label: "Gear" },
  ],
  "/plog": [
    { path: "/plog", label: "Index" },
    { path: "/plog/all", label: "All Photos" },
    { path: "/plog/inspire", label: "Inspire" },
  ],
  "/mlog": [
    { path: "/mlog", label: "Index" },
    { path: "/mlog/albums", label: "Albums" },
  ],
};

// 所有导航项目
const allNavigation = [
  { path: "/", label: "Home" },
  { path: "/blog", label: "Blog" },
  { path: "/plog", label: "Plog" },
  { path: "/mlog", label: "Mlog" },
];

// 计算导航分布（桌面端）
const leftNavigation = computed(() => {
  const current = currentNavigation.value;
  const half = Math.ceil(current.length / 2);
  return current.slice(0, half);
});

const rightNavigation = computed(() => {
  const current = currentNavigation.value;
  const half = Math.ceil(current.length / 2);
  return current.slice(half);
});

// 计算当前页面的导航
const currentNavigation = computed(() => {
  const currentPath = route.path;

  // 查找匹配的导航配置
  for (const [basePath, nav] of Object.entries(navigationMap)) {
    if (currentPath.startsWith(basePath) && basePath !== "/") {
      return nav;
    }
  }

  // 首页或未匹配时返回空数组
  return navigationMap[currentPath] || [];
});

// 页头样式类
const headerClasses = computed(() => {
  const classes = [];

  if (isScrolled.value) {
    classes.push("the-header--scrolled");
  }

  if (isControlPanelOpen.value) {
    classes.push("the-header--menu-open");
  }

  // PlogIndex 页面透明样式
  if (route.name === 'PlogIndex') {
    classes.push("the-header--transparent");
  }

  return classes;
});

// 滚动处理
const handleScroll = () => {
  scrollY.value = window.scrollY;
  isScrolled.value = scrollY.value > 50;
};

// 更新时间
const updateTime = () => {
  const now = visitorTimezone.value 
    ? new Date().toLocaleString('zh-CN', { timeZone: visitorTimezone.value })
    : new Date();
  
  const timeString = typeof now === 'string' 
    ? now.split(' ')[1] 
    : now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
  
  visitorTime.value = timeString;
};

// 获取访问者地理位置
const getVisitorLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.city && data.country_name) {
      visitorLocation.value = `${data.city}, ${data.country_name}`;
      visitorTimezone.value = data.timezone;
    } else {
      visitorLocation.value = "本地访问";
    }
  } catch (error) {
    visitorLocation.value = "本地访问";
    console.log('地理位置获取失败:', error);
  }
};

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(() => {
      console.log("全屏请求失败");
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    }).catch(() => {
      console.log("退出全屏失败");
    });
  }
};

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 桌面端控制面板
const toggleControlPanel = () => {
  isControlPanelOpen.value = !isControlPanelOpen.value;
  
  if (isControlPanelOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeControlPanel = () => {
  isControlPanelOpen.value = false;
  document.body.style.overflow = "";
};

// 功能函数
const openSearch = () => {
  console.log("打开搜索");
};

const goToRandomPost = () => {
  console.log("前往随机文章");
};

// 主题切换逻辑
const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  const newTheme = currentTheme.value === "light" ? "dark" : "light";
  setTheme(newTheme);
};

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
};

// 生命周期
onMounted(() => {
  // 初始化
  handleScroll();
  initTheme();
  getVisitorLocation();
  updateTime();

  // 事件监听
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", (e) => {
    if (e.key === "F11") {
      e.preventDefault();
      toggleFullscreen();
    }
  });
  document.addEventListener("fullscreenchange", handleFullscreenChange);

  // 每秒更新时间
  const timeInterval = setInterval(updateTime, 1000);

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.body.style.overflow = "";
    clearInterval(timeInterval);
  });
});
</script>

<style lang="scss" scoped>
.the-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-navigation);

  // 玻璃拟态效果
  background: var(--bg-glass);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);

  border-bottom: 1px solid var(--separator-glass);
  transition: var(--global-transition);

  // 滚动状态
  &--scrolled {
    background: var(--bg-glass-strong);
    box-shadow: var(--shadow-glass);
  }

  // 透明状态（用于 PlogIndex 页面）
  &--transparent {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .main-logo,
    .nav-link,
    .toolbar-button,
    .visitor-info {
      color: white;
    }
    
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .toolbar-button:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.header-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 992px) {
    padding: 0 var(--space-md);
  }
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.visitor-info {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-caption1);
  color: var(--text-secondary);

  .separator {
    color: var(--accent-primary);
    font-weight: bold;
  }

  .breathing-dot {
    width: 4px;
    height: 4px;
    background: var(--accent-primary);
    border-radius: 50%;
    animation: breathing 2s ease-in-out infinite;
    margin: 0 2px;
  }
}

@keyframes breathing {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.header-center {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: 2;
  justify-content: center;
}

.header-logo {
  flex-shrink: 0;
}

.nav-left,
.nav-right {
  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--space-sm);
  }
}

.header-toolbar {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  &:hover {
    .main-logo {
      transform: scale(1.05);
    }
  }
}

.main-logo {
  transition: transform var(--transition-duration-fast);
  color: var(--text-primary);
}

.nav-link {
  display: block;
  padding: var(--space-sm) var(--space-lg);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-callout);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-duration-fast);
  text-wrap: nowrap;

  &:hover {
    color: var(--text-primary);
    background: var(--fill-secondary);
  }

  &--active {
    color: var(--accent-primary);
    background: var(--accent-hover);
  }
}

.toolbar-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
  font-size: 1.2rem;
  transition: transform var(--transition-duration-fast);
  color: var(--text-primary);

  &:hover {
    transform: scale(1.1);
    color: var(--accent-primary);
  }

  &.menu-toggle--active {
    color: var(--accent-primary);
  }
}

// 桌面端控制面板
.control-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-glass-strong);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--separator-glass);
  
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-duration-normal);

  &--open {
    max-height: 200px;
  }

  .control-panel-content {
    display: flex;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--space-lg) var(--space-lg);
    gap: var(--space-xxl);
  }

  .control-section {
    flex: 1;

    h4 {
      margin: 0 0 var(--space-sm) 0;
      font-size: var(--font-size-caption);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .control-list {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        margin-bottom: var(--space-xs);
      }

      button,
      a {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-primary);
        text-decoration: none;
        font-size: var(--font-size-callout);
        padding: var(--space-xs) 0;
        transition: color var(--transition-duration-fast);

        &:hover {
          color: var(--accent-primary);
        }
      }
    }
  }
}
</style>
