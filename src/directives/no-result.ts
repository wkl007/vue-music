import { App, Directive } from 'vue'
import NoResult from '@/components/base/no-result/index.vue'
import { createDirective } from '@/utils/create-directive'

const noResultDirective: Directive = createDirective(NoResult)

/**
 * no-result 指令
 * @param app
 */
export function setupNoResultDirective (app: App<Element>): void {
  app.directive('no-result', noResultDirective)
}

export default noResultDirective
