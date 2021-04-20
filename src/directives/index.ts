import type { App } from 'vue'
import { setupLoadingDirective } from './loading'

/**
 * 注册全局指令
 * @param app
 */
export function setupDirective (app: App<Element>): void {
  setupLoadingDirective(app)
}
