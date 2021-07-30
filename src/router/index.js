import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/views/layout/index.vue'

// 动态路由
// 1 管理员 0 普通用户 -1 未登录
export const dynamicRoutes  = [
  {
    path: '/',
    meta: { roles: [1] },
    component: layout,
    name: 'newslist',
    children: [{
      path: '/',
      name: 'newslist',
      component: () => import('@/views/newslist.vue')
    }]
  },
  {
    path: '/remarkmanage',
    meta: { roles: [1] },
    component: layout,
    name: 'remarkmanage',
    children: [{
      path: '/remarkmanage',
      name: 'remarkmanage',
      component: () => import('@/views/remarkmanage.vue')
    }]
  },
  {
    path: '/usermanage',
    meta: { roles: [1] },
    component: layout,
    name: 'usermanage',
    children: [{
      path: '/usermanage',
      name: 'usermanage',
      component: () => import('@/views/usermanage.vue')
    }]
  },
  {
    path: '/upload',
    meta: { roles: [1] },
    component: layout,
    name: 'upload',
    children: [{
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/upload.vue')
    }]
  }
]

// 组合路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router