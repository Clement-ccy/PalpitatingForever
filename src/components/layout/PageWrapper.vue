<template>
  <div :class="pageClasses">
    <div :class="contentClasses">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Props
const props = defineProps({
  // 是否为全屏页面（无内边距）
  fullscreen: {
    type: Boolean,
    default: false,
  },
  // 自定义最大宽度
  maxWidth: {
    type: String,
    default: null,
  },
  // 是否禁用默认内边距
  noPadding: {
    type: Boolean,
    default: false,
  },
  // 自定义背景
  background: {
    type: String,
    default: null,
  },
});

// 页面特定类名
const pageClasses = computed(() => {
  const classes = ["page-wrapper"];

  // 根据路由名称添加页面特定类名
  if (route.name) {
    classes.push(`page-${route.name.toLowerCase()}`);
  }

  // 根据路径添加类名
  const pathSegments = route.path.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    classes.push(`section-${pathSegments[0]}`);
  }

  // 全屏页面检测
  const fullscreenPages = ["BlogAll", "PlogAll", "PlogIndex"];
  const isFullscreenPage =
    props.fullscreen || fullscreenPages.includes(route.name);

  if (isFullscreenPage) {
    classes.push("page-wrapper--fullscreen");
  }

  // 特殊页面类名
  if (route.name === "Home") {
    classes.push("page-wrapper--home");
  }

  if (
    route.path.includes("/post/") ||
    route.path.includes("/item/") ||
    route.path.includes("/album/")
  ) {
    classes.push("page-wrapper--detail");
  }

  return classes;
});

// 内容区域类名
const contentClasses = computed(() => {
  const classes = ["page-content"];

  if (props.noPadding) {
    classes.push("page-content--no-padding");
  }

  return classes;
});

// 内容区域样式
const contentStyles = computed(() => {
  const styles = {};

  if (props.maxWidth) {
    styles.maxWidth = props.maxWidth;
  }

  if (props.background) {
    styles.background = props.background;
  }

  return styles;
});
</script>

<style lang="scss" scoped>
.page-wrapper {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  flex-direction: column;

  // 响应式调整
  @media (max-width: 768px) {
    min-height: calc(100vh - 70px - 50px); // 移动端尺寸
  }

  // 首页特殊处理
  &--home {
    min-height: calc(100vh - var(--header-height));
  }

  // 全屏页面
  &--fullscreen {
    min-height: 100vh;

    .page-content {
      padding: 0;
      max-width: none;
    }
  }

  // 详情页面
  &--detail {
    .page-content {
      max-width: 800px; // 详情页面使用较小的最大宽度
    }
  }
}

.page-content {
  flex: 1;
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--space-xxl) var(--space-xl);

  // 响应式内边距
  @media (max-width: 992px) {
    padding: var(--space-xl) var(--space-lg);
  }

  @media (max-width: 768px) {
    padding: var(--space-lg) var(--space-md);
  }

  @media (max-width: 576px) {
    padding: var(--space-md) var(--space-sm);
  }

  // 无内边距变体
  &--no-padding {
    padding: 0;
  }
}

// 页面特定样式
.section-blog {
  .page-content {
    // Blog 页面特定样式
  }
}

.section-plog {
  .page-content {
    // Plog 页面特定样式
  }

  &.page-wrapper--fullscreen {
    // Plog 全屏页面样式
    background: #000;
  }
}

.section-mlog {
  .page-content {
    // Mlog 页面特定样式
  }
}

// 具体页面样式
.page-home {
  // 首页样式
}

.page-blogindex {
  // Blog 首页样式
}

.page-blogall {
  // Blog 全部文章页面样式
  background: #f8f9fa;

  @media (prefers-color-scheme: dark) {
    background: #1c1c1e;
  }
}

.page-blogpostdetail {
  // Blog 文章详情页样式
  .page-content {
    // 文章内容的特殊样式
    line-height: var(--line-height-loose);
  }
}

.page-plogindex {
  // Plog 首页样式 - 全屏显示
  &.page-wrapper--fullscreen {
    background: #000;
    
    .page-content {
      padding: 0;
      max-width: none;
      height: 100vh;
    }
  }
}

.page-plogall {
  // Plog 全部照片页面样式
  background: #000;

  .page-content {
    background: transparent;
  }
}

.page-plogitemdetail {
  // Plog 项目详情页样式
  background: #000;
  color: #fff;
}

.page-mlogindex {
  // Mlog 首页样式
}

.page-mlogalbumlist {
  // Mlog 专辑列表页样式
}

.page-mlogalbumdetail {
  // Mlog 专辑详情页样式
  .page-content {
    max-width: 1000px; // 专辑详情页面较宽
  }
}

// 过渡动画增强
.page-wrapper {
  // 为页面切换动画提供基础
  transition: opacity var(--transition-duration-normal) ease;
}

// 辅助类
.page-content {
  // 内容区域的额外辅助样式

  // 当需要网格布局时
  &--grid {
    display: grid;
    gap: var(--space-xl);
  }

  // 当需要 flexbox 布局时
  &--flex {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  // 居中内容
  &--centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>
