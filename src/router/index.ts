import type { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

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
        component: () => import(/* webpackChunkName: "singerDetail" */ '@/views/singer-detail.vue')
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: () => import(/* webpackChunkName: "topList" */ '@/views/top-list.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '@/views/search.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user.vue')
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
