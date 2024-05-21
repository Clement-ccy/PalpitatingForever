export const routes = [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/components/NotFound.vue')
    },
    {
        path: '/',
        name: 'Portfolio',
        component: () => import('@/components/PortfolioPage.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/components/AboutPage.vue')
    },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('@/components/BlogPage.vue')
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('@/components/ContactPage.vue')
    },
]