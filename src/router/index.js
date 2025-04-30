// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// --- Import View Components (Placeholders for now) ---
// We'll create these basic files soon to avoid import errors
const HomeView = () => import('@/views/HomeView.vue');
const BlogIndexView = () => import('@/views/blog/BlogIndexView.vue');
const BlogAllPostsCanvasView = () => import('@/views/blog/BlogAllPostsCanvasView.vue');
const BlogLinksView = () => import('@/views/blog/BlogLinksView.vue');
const BlogGearView = () => import('@/views/blog/BlogGearView.vue');
const BlogAboutView = () => import('@/views/blog/BlogAboutView.vue');
const BlogPostDetailView = () => import('@/views/blog/BlogPostDetailView.vue');
const PlogIndexView = () => import('@/views/plog/PlogIndexView.vue');
const PlogAllPhotosView = () => import('@/views/plog/PlogAllPhotosView.vue');
const PlogItemDetailView = () => import('@/views/plog/PlogItemDetailView.vue');
const MlogIndexView = () => import('@/views/mlog/MlogIndexView.vue');
const MlogAlbumListView = () => import('@/views/mlog/MlogAlbumListView.vue');
const MlogAlbumDetailView = () => import('@/views/mlog/MlogAlbumDetailView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/blog', name: 'BlogIndex', component: BlogIndexView },
  { path: '/blog/all', name: 'BlogAll', component: BlogAllPostsCanvasView },
  { path: '/blog/links', name: 'BlogLinks', component: BlogLinksView },
  { path: '/blog/gear', name: 'BlogGear', component: BlogGearView },
  { path: '/blog/about', name: 'BlogAbout', component: BlogAboutView },
  { path: '/blog/posts/:category/:slug', name: 'BlogPost', component: BlogPostDetailView, props: true }, // Pass route params as props
  { path: '/plog', name: 'PlogIndex', component: PlogIndexView },
  { path: '/plog/all', name: 'PlogAll', component: PlogAllPhotosView },
  { path: '/plog/item/:slug', name: 'PlogItem', component: PlogItemDetailView, props: true },
  { path: '/mlog', name: 'MlogIndex', component: MlogIndexView },
  { path: '/mlog/albums', name: 'MlogAlbums', component: MlogAlbumListView },
  { path: '/mlog/album/:slug', name: 'MlogAlbum', component: MlogAlbumDetailView, props: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use history mode
  routes,
  // Scroll behavior for smooth scrolling and resetting scroll position on navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
        // Scroll to anchor
        return {
            el: to.hash,
            behavior: 'smooth', // Use browser's smooth scroll for anchors
        }
    }
    else {
      // Scroll to top for new pages, unless meta field specifies otherwise
      if (to.meta.keepScrollPosition) {
          return {}
      }
      return { top: 0, behavior: 'smooth' }; // Smooth scroll to top
    }
  },
});

// --- Navigation Guards (for Loading Mask - Placeholder) ---
router.beforeEach((to, from, next) => {
  // TODO: Show LoadingMask component
  console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
  // Example: Use a store or event bus to control mask visibility
  // loadingStore.startLoading();
  next();
});

router.afterEach((to, _from) => { // Prefix 'from' with underscore
  // TODO: Hide LoadingMask component
  console.log(`Finished navigating to ${to.fullPath}`);
  // loadingStore.finishLoading();

  // Update document title (optional)
  // const baseTitle = 'PalpitatingForever';
  // document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
});

export default router;