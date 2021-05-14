import { setupLoadingDirective } from './loading'
import { setupNoResultDirective } from './no-result'
import type { App } from 'vue'

/**
 * 注册全局指令
 * @param app
 */
export function setupDirective (app: App<Element>): void {
  setupLoadingDirective(app)
  setupNoResultDirective(app)
}
