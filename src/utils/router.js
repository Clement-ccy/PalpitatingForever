import { createWebHistory, createRouter } from "vue-router";
// import { createMemoryHistory, createRouter } from 'vue-router'
import NotFound from "@/views/NotFound.vue";
import TempPage from "@/views/TempPage.vue";
import WhatIDoPage from "@/views/WhatIDoPage.vue";
import WhoIAmPage from "@/views/WhoIAmPage.vue";
import BlogPage from "@/views/BlogPage.vue";
import StyleGuide from "@/views/StyleGuide.vue";
import PostPage from "@/views/PostPage.vue";
import PhotographPage from "@/views/PhotographPage.vue";
import MusicPage from "@/views/MusicPage.vue";

const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    // component: () => import('@/components/NotFound.vue')
  },
  {
    path: "/",
    redirect: "/whatido",
  },
  {
    path: "/whatido",
    component: WhatIDoPage,
    meta: {
      belongsTo: "profile",
      menuPosition: 0,
    },
    // component: () => import('@/views/TempPage.vue')
  },
  {
    path: "/whoiam",
    component: WhoIAmPage,
    meta: {
      belongsTo: "profile",
      menuPosition: 1,
    },
    // component: () => import('@/views/WhoIAmPage.vue')
  },
  {
    path: "/blog",
    component: BlogPage,
    meta: {
      belongsTo: "blog",
      menuPosition: 0,
    },
    // component: () => import('@/views/BlogPage.vue')
  },
  {
    path: "/photograph",
    component: PhotographPage,
    meta: {
      belongsTo: "blog",
      menuPosition: 1,
    },
    // component: () => import('@/views/BlogPage.vue')
  },
  {
    path: "/music",
    component: MusicPage,
    meta: {
      belongsTo: "blog",
      menuPosition: 2,
    },
    // component: () => import('@/views/BlogPage.vue')
  },
  {
    path: "/styleguide",
    component: StyleGuide,
    // component: () => import('@/components/StyleGuide.vue')
  },
  {
    path: "/blogs/:id",
    component: PostPage,
  },
  {
    path: "/test",
    component: TempPage,
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
