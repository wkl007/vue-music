import { Component, createApp, Directive } from 'vue'
import { addClass, removeClass } from '@/utils/dom'

const relativeCls = 'g-relative'

/**
 * 创建指令
 * @param component
 */
export function createDirective (component: Component): Directive {
  const name = component.name as string

  /** 添加 */
  function append (el: any): void {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) addClass(el, relativeCls)
    el.appendChild(el[name].instance.$el)
  }

  /** 移除 */
  function remove (el: any): void {
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted (el, binding) {
      const app = createApp(component)
      if (!el[name]) el[name] = {}
      el[name].instance = app.mount(document.createElement('div'))
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated (el, binding) {
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
