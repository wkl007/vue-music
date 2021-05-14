import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import(/* webpackChunkName: "recommend" */ '@/views/recommend.vue'),
    children: [
      {
        path: '/recommend/:id',
        name: 'Album',
        component: () => import(/* webpackChunkName: "album" */ '@/views/album.vue')
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import(/* webpackChunkName: "singer" */ '@/views/singer.vue'),
    children: [
      {
        path: '/singer/:id',
        name: 'SingerDetail',
        component: () => import(/* webpackChunkName: "singer-detail" */ '@/views/singer-detail.vue')
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: () => import(/* webpackChunkName: "top-list" */ '@/views/top-list.vue'),
    children: [
      {
        path: '/top-list/:id',
        name: 'TopDetail',
        component: () => import(/* webpackChunkName: "top-detail" */ '@/views/top-detail.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '@/views/search.vue'),
    children: [
      {
        path: '/search/:id',
        component: () => import(/* webpackChunkName: "singer-detail" */ '@/views/singer-detail.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    components: {
      user: () => import(/* webpackChunkName: "user" */ '@/views/user.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * vue-router 配置
 * @param app
 */
export function setupRouter (app: App<Element>): void {
  app.use(router)
}

export default router
