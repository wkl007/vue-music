import Loading from '@/components/base/loading/index.vue'
import { createDirective } from '@/utils/create-directive'
import type { App, Directive } from 'vue'

const loadingDirective: Directive = createDirective(Loading)

/**
 * loading 指令
 * @param app
 */
export function setupLoadingDirective (app: App<Element>): void {
  app.directive('loading', loadingDirective)
}

export default loadingDirective
