import type { App } from 'vue'
import { createLogger, createStore } from 'vuex'
import { NODE_ENV } from '@/utils/constants'

// 调试工具，开发环境使用，线上关闭
const debug = NODE_ENV !== 'production'

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: debug ? [createLogger()] : []
})

/**
 * vuex 配置
 * @param app
 */
export function setupStore (app: App<Element>): void {
  app.use(store)
}

export default store
