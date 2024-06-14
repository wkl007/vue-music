import { createApp } from 'vue';
import { addClass, removeClass } from '@/utils/dom.js';

const relativeCls = 'g-relative';

/**
 * 创建指令
 * @param component
 */
export function createDirective(component) {
  const name = component.name;

  /** 添加 */
  function append(el) {
    const style = getComputedStyle(el);
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1)
      addClass(el, relativeCls);
    el.appendChild(el[name].instance.$el);
  }

  /** 移除 */
  function remove(el) {
    removeClass(el, relativeCls);
    el.removeChild(el[name].instance.$el);
  }

  return {
    mounted(el, binding) {
      const app = createApp(component);
      if (!el[name]) el[name] = {};
      el[name].instance = app.mount(document.createElement('div'));
      const title = binding.arg;
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title);
      }
      if (binding.value) {
        append(el);
      }
    },
    updated(el, binding) {
      const title = binding.arg;
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title);
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el);
      }
    },
  };
}
