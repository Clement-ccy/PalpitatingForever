import { createWebHistory, createRouter } from "vue-router";

const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: "/",
    redirect: "/whatido",
  },
  {
    path: "/whatido",
    component: () => import("@/views/WhatIDoPage.vue"),
    meta: {
      menuPosition: 0,
    },
  },
  {
    path: "/whoiam",
    component: () => import("@/views/WhoIAmPage.vue"),
    meta: {
      menuPosition: 1,
    },
  },
  {
    path: "/blog",
    component: () => import("@/views/BlogPage.vue"),
    meta: {
      menuPosition: 2,
    },
  },
  {
    path: "/photograph",
    component: () => import("@/views/PhotographPage.vue"),
    meta: {
      menuPosition: 3,
    },
  },
  {
    path: "/music",
    component: () => import("@/views/MusicPage.vue"),
    meta: {
      menuPosition: 4,
    },
  },
  {
    path: "/blog/:id",
    component: () => import("@/views/PostPage.vue"),
  },
  {
    path: "/styleguide",
    component: () => import("@/views/StyleGuide.vue"),
  },
  {
    path: "/test",
    component: () => import("@/views/TempPage.vue"),
  },
];

const router = createRouter({
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
  history: createWebHistory(),
  // history: createMemoryHistory(),
  routes,
});
router.afterEach((to, from) => {
  const toPath = to.path;
  const fromPath = from.path;
  const toPosition = to.meta?.menuPosition;
  const fromPosition = from.meta?.menuPosition;

  // 检查 PostPage 过渡
  const isEnteringPost = /^\/blog\/\w+$/.test(toPath) === '/blog'; // Use \w+ for potentially non-numeric IDs
  const isLeavingPost = /^\/blog\/\w+$/.test(fromPath) === '/blog';

  if (isEnteringPost) {
    to.meta.transition = 'slide-up';
  } else if (isLeavingPost) {
    // 过渡效果通常应用于进入的组件，所以这里仍然设置 to.meta
    // App.vue 中的 <router-view> 需要根据这个 meta 来应用正确的离开动画
    // 通常 <transition> 组件会处理 enter 和 leave
    to.meta.transition = 'slide-down';
  } else if (typeof toPosition === 'number' && typeof fromPosition === 'number') {
    // 检查主菜单过渡
    if (toPosition > fromPosition) {
      to.meta.transition = 'slide-left';
    } else if (toPosition < fromPosition) {
      to.meta.transition = 'slide-right';
    } else {
      // 相同位置，可能是刷新或内部链接？
      to.meta.transition = 'fade'; // 默认淡入淡出
    }
  } else {
    // 其他情况的默认过渡 (例如，初始加载, /styleguide, /test)
    to.meta.transition = 'fade';
  }
  // console.log(`Transition from ${fromPath} to ${toPath}: ${to.meta.transition}`); // 可选的调试信息
});

export default router;
