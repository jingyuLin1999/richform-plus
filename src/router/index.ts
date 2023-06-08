import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
    {
        path: '/form-design',
        name: 'richform',
        component: () => import('@/examples/richform.vue')
    },
    {
        path: '/',
        name: 'form-design',
        component: () => import('@/examples/form-design.vue')
    },
    {
        path: '/deep-values',
        name: 'deep-values',
        component: () => import('@/examples/deep-values.vue')
    },
]

const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;