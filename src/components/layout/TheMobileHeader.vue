<template>
  <header class="the-mobile-header" :class="headerClasses">
    <div class="header-container">
      <!-- 左侧：汉堡菜单 -->
      <div class="header-left">
        <button
          class="mobile-menu-button"
          :class="{ 'mobile-menu-button--active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="菜单"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- 中间：LOGO -->
      <div class="header-center">
        <div class="header-logo">
          <TransitionLink to="/" class="logo-link">
            <LogoSvg
              :size="32"
              :show-text="false"
              :show-icon="true"
              :text-color="'currentColor'"
              :icon-color="'currentColor'"
              logo-class="mobile-logo"
            />
          </TransitionLink>
        </div>
      </div>

      <!-- 右侧：快捷工具 -->
      <div class="header-toolbar">
        <button class="toolbar-button" @click="openSearch" aria-label="搜索">
          <span>🔍</span>
        </button>
        <button 
          class="toolbar-button" 
          @click="toggleTheme" 
          aria-label="主题切换"
        >
          <span>{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ 'mobile-menu--open': isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <!-- 访问者信息 -->
        <div class="mobile-visitor-info">
          <span class="visitor-location">{{ visitorLocation }}</span>
          <span class="separator">//</span>
          <span class="breathing-dot"></span>
          <span class="visitor-time">{{ visitorTime }}</span>
        </div>

        <!-- 主导航 -->
        <nav class="mobile-nav">
          <ul class="mobile-nav-list">
            <li v-for="item in allNavigation" :key="item.path" class="mobile-nav-item">
              <TransitionLink
                :to="item.path"
                class="mobile-nav-link"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </TransitionLink>
            </li>
          </ul>
        </nav>

        <!-- 快捷操作 -->
        <div class="mobile-actions">
          <button class="mobile-action-button" @click="goToRandomPost">
            <span>🎲</span>
            <span>随机文章</span>
          </button>
          <button class="mobile-action-button" @click="toggleFullscreen">
            <span>{{ isFullscreen ? '📐' : '🔳' }}</span>
            <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
          </button>
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

const route = useRoute();

// 响应式状态
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const scrollY = ref(0);
const currentTheme = ref("light");
const isFullscreen = ref(false);
const visitorLocation = ref("获取中...");
const visitorTime = ref("");
const visitorTimezone = ref("");

// 导航配置
const allNavigation = [
  { path: "/", label: "Home" },
  { path: "/blog", label: "Blog" },
  { path: "/plog", label: "Plog" },
  { path: "/mlog", label: "Mlog" },
];

// 页头样式类
const headerClasses = computed(() => {
  const classes = [];

  if (isScrolled.value) {
    classes.push("the-mobile-header--scrolled");
  }

  if (isMobileMenuOpen.value) {
    classes.push("the-mobile-header--menu-open");
  }

  // PlogIndex 页面透明样式
  if (route.name === 'PlogIndex') {
    classes.push("the-mobile-header--transparent");
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

// 移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
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
.the-mobile-header {
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
    
    .mobile-logo,
    .toolbar-button {
      color: white;
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

  @media (max-width: 576px) {
    padding: 0 var(--space-xs);
  }
}

.header-left {
  flex: 1;
}

.mobile-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;

  .hamburger-line {
    width: 20px;
    height: 2px;
    background: var(--text-primary);
    transition: all var(--transition-duration-fast);
  }

  &--active {
    .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .hamburger-line:nth-child(2) {
      opacity: 0;
    }
    .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;

  &:hover {
    .mobile-logo {
      transform: scale(1.1);
    }
  }
}

.mobile-logo {
  transition: transform var(--transition-duration-fast);
  color: var(--text-primary);
}

.header-toolbar {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  flex: 1;
  justify-content: flex-end;
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
}

// 移动端菜单
.mobile-menu {
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
    max-height: 100vh;
  }

  .mobile-menu-content {
    padding: var(--space-lg);
  }

  .mobile-visitor-info {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--font-size-caption);
    color: var(--text-secondary);
    font-family: 'Monaco', 'Menlo', monospace;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--separator-glass);

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

  .mobile-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mobile-nav-item {
    margin-bottom: var(--space-sm);
  }

  .mobile-nav-link {
    display: block;
    padding: var(--space-md);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--font-size-callout);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-duration-fast);

    &:hover {
      background: var(--fill-secondary);
    }
  }

  .mobile-actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-lg);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--separator-glass);
  }

  .mobile-action-button {
    flex: 1;
    background: var(--fill-secondary);
    border: none;
    border-radius: var(--radius-md);
    padding: var(--space-md);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    color: var(--text-primary);
    font-size: var(--font-size-caption);
    transition: background-color var(--transition-duration-fast);

    &:hover {
      background: var(--fill-tertiary);
    }

    span:first-child {
      font-size: 1.2rem;
    }
  }
}
</style>