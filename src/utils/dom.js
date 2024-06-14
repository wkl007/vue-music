/**
 * 添加类名
 * @param el
 * @param className
 */
export function addClass(el, className) {
  if (!el.classList.contains(className)) el.classList.add(className);
}

/**
 * 移除类名
 * @param el
 * @param className
 */
export function removeClass(el, className) {
  el.classList.remove(className);
}
