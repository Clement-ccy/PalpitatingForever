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
      belongsTo: "profile",
      menuPosition: 0,
    },
  },
  {
    path: "/whoiam",
    component: () => import("@/views/WhoIAmPage.vue"),
    meta: {
      belongsTo: "profile",
      menuPosition: 1,
    },
  },
  {
    path: "/blog",
    component: () => import("@/views/BlogPage.vue"),
    meta: {
      belongsTo: "blog",
      menuPosition: 0,
    },
  },
  {
    path: "/photograph",
    component: () => import("@/views/PhotographPage.vue"),
    meta: {
      belongsTo: "blog",
      menuPosition: 1,
    },
  },
  {
    path: "/music",
    component: () => import("@/views/MusicPage.vue"),
    meta: {
      belongsTo: "blog",
      menuPosition: 2,
    },
  },
  {
    path: "/styleguide",
    component: () => import("@/views/StyleGuide.vue"),
  },
  {
    path: "/blog/:id",
    component: () => import("@/views/PostPage.vue"),
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
  // const toDepth = to.path.split('/').length
  // const fromDepth = from.path.split('/').length
  to.meta.transition =
    to.meta.belongsTo === from.meta.belongsTo
      ? "turn-over"
      : to.meta.menuPosition < from.meta.menuPosition
      ? "slide-right"
      : "slide-left";
});

export default router;
