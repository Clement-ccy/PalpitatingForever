// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// --- Import View Components ---
const HomeView = () => import('@/views/HomeView.vue');
const BlogIndexView = () => import('@/views/blog/BlogIndexView.vue');
const BlogAllPostsCanvasView = () => import('@/views/blog/BlogAllPostsCanvasView.vue');
const BlogLinksView = () => import('@/views/blog/BlogLinksView.vue');
const BlogGearView = () => import('@/views/blog/BlogGearView.vue');
const BlogAboutView = () => import('@/views/blog/BlogAboutView.vue');
const BlogAnalyticsView = () => import('@/views/blog/BlogAnalyticsView.vue');
const BlogPostDetailView = () => import('@/views/blog/BlogPostDetailView.vue');
const PlogIndexView = () => import('@/views/plog/PlogIndexView.vue');
const PlogAllPhotosView = () => import('@/views/plog/PlogAllPhotosView.vue');
const PlogInspireView = () => import('@/views/plog/PlogInspireView.vue');
const PlogItemDetailView = () => import('@/views/plog/PlogItemDetailView.vue'); // This component will handle both route types
const MlogIndexView = () => import('@/views/mlog/MlogIndexView.vue');
const MlogAlbumListView = () => import('@/views/mlog/MlogAlbumListView.vue');
const MlogAlbumDetailView = () => import('@/views/mlog/MlogAlbumDetailView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  // Test Routes

  // Blog Routes
  { path: '/blog', name: 'BlogIndex', component: BlogIndexView },
  { path: '/blog/all', name: 'BlogAll', component: BlogAllPostsCanvasView },
  { path: '/blog/links', name: 'BlogLinks', component: BlogLinksView },
  { path: '/blog/gear', name: 'BlogGear', component: BlogGearView },
  { path: '/blog/about', name: 'BlogAbout', component: BlogAboutView },
  { path: '/blog/analytics', name: 'BlogAnalytics', component: BlogAnalyticsView },
  {
    path: '/blog/post/:id',
    name: 'BlogPostDetail',
    component: BlogPostDetailView,
    props: true
  },
  {
    path: '/blog/posts/:category/:slug', // Note: Blog still uses category/slug for SEO version
    name: 'BlogPostBySlug',
    component: BlogPostDetailView,
    props: true
  },
  // Plog Routes
  { path: '/plog', name: 'PlogIndex', component: PlogIndexView },
  { path: '/plog/all', name: 'PlogAll', component: PlogAllPhotosView },
  { path: '/plog/inspire', name: 'PlogInspire', component: PlogInspireView },
  {
    path: '/plog/item/:id', // Changed from :slug to :id for consistency from PhotoWaterfall
    name: 'PlogItemById', // New distinct name for ID-based route
    component: PlogItemDetailView,
    props: true // Pass 'id' as prop
  },
  {
    path: '/plog/:slug', // SEO-friendly route using the new slug
    name: 'PlogItemBySlug', // Distinct name for slug-based route
    component: PlogItemDetailView,
    props: true // Pass 'slug' as prop
  },
  
  // Mlog Routes
  { path: '/mlog', name: 'MlogIndex', component: MlogIndexView },
  { path: '/mlog/albums', name: 'MlogAlbums', component: MlogAlbumListView },
  { path: '/mlog/album/:slug', name: 'MlogAlbum', component: MlogAlbumDetailView, props: true },
  // General Routes
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        }
    }
    else {
      if (to.meta.keepScrollPosition) {
          return {}
      }
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// --- Navigation Guards ---
router.beforeEach((to, from, next) => {
  console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
  next();
});

router.afterEach((to, _from) => {
  console.log(`Finished navigating to ${to.fullPath}`);
});

export default router;