import type { App } from 'vue'
import lazyPlugin from 'vue3-lazy'
import images from '@/assets/images'

/**
 * vue3-lazy 配置
 * @param app
 */
export function setupLazy (app: App<Element>): void {
  app.use(lazyPlugin, {
    loading: images.default
  })
}
