import type { App } from 'vue'
import { setupLoadingDirective } from './loading'
import { setupNoResultDirective } from './no-result'

/**
 * 注册全局指令
 * @param app
 */
export function setupDirective (app: App<Element>): void {
  setupLoadingDirective(app)
  setupNoResultDirective(app)
}
