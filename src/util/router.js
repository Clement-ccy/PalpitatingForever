import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/NotFound.vue')
    },
    {
        path: '/',
        component: () => import('@/components/PortfolioPage.vue')
    },
    {
        path: '/portfolio',
        redirect:'/',
        component: () => import('@/components/PortfolioPage.vue')
    },
    {
        path: '/about',
        component: () => import('@/components/AboutPage.vue')
    },
    {
        path: '/blog',
        component: () => import('@/components/BlogPage.vue')
    },
    {
        path: '/contact',
        component: () => import('@/components/ContactPage.vue')
    },
    {
        path: '/styleguide',
        component: () => import('@/components/StyleGuide.vue')
    },
]

const router = createRouter({
    // eslint-disable-next-line no-unused-vars
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 }
      },
    history: createMemoryHistory(),
    routes,
})

export default router