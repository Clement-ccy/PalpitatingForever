import { createMemoryHistory, createRouter } from 'vue-router'
import NotFound from '@/components/NotFound.vue'
import TempPage from '@/views/TempPage.vue'
import LoadingPage from '@/views/LoadingPage.vue'
// import WhatIDoPage from '@/views/WhatIDoPage.vue'
import WhoIAmPage from '@/views/WhoIAmPage.vue'
import BlogPage from '@/views/BlogPage.vue'
import StyleGuide from '@/components/StyleGuide.vue'


const routes = [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
        // component: () => import('@/components/NotFound.vue')
    },
    {
        path: '/',
        redirect: '/whatido',
    },
    {
        path: '/loading',
        component: LoadingPage
        // component: () => import('@/views/LoadingPage.vue')
    },
    {
        path: '/whatido',
        component: TempPage,
        menuPosition: 0
        // component: () => import('@/views/TempPage.vue')
    },
    {
        path: '/whoiam',
        component: WhoIAmPage,
        menuPosition: 1
        // component: () => import('@/views/WhoIAmPage.vue')
    },
    {
        path: '/blog',
        component: BlogPage,
        menuPosition: 2
        // component: () => import('@/views/BlogPage.vue')
    },
    {
        path: '/styleguide',
        component: StyleGuide
        // component: () => import('@/components/StyleGuide.vue')
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
router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})


export default router