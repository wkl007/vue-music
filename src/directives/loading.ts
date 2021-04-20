import { createApp, Directive, App } from 'vue'
import Loading from '@/components/base/loading/index.vue'
import { addClass, removeClass } from '@/utils/dom'

const relativeCls = 'g-relative'

const loadingDirective: Directive = {
  mounted (el, binding) {
    console.log(el, binding)
    const app = createApp(Loading)
    el.instance = app.mount(document.createElement('div'))
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  updated (el, binding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append (el: any): void {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) addClass(el, relativeCls)
  el.appendChild(el.instance.$el)
}

function remove (el: any): void {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

/**
 * loading 指令
 * @param app
 */
export function setupLoadingDirective (app: App<Element>): void {
  app.directive('loading', loadingDirective)
}

export default loadingDirective
