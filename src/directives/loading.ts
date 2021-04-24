import { App, Directive } from 'vue'
import Loading from '@/components/base/loading/index.vue'
import { createDirective } from '@/utils/create-directive'

const loadingDirective: Directive = createDirective(Loading)

/**
 * loading 指令
 * @param app
 */
export function setupLoadingDirective (app: App<Element>): void {
  app.directive('loading', loadingDirective)
}

export default loadingDirective
