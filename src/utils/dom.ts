/**
 * 添加类名
 * @param el
 * @param className
 */
export function addClass (el: HTMLElement, className: string): void {
  if (!el.classList.contains(className)) el.classList.add(className)
}

/**
 * 移除类名
 * @param el
 * @param className
 */
export function removeClass (el: HTMLElement, className: string): void {
  el.classList.remove(className)
}
