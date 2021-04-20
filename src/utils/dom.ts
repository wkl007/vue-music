export function addClass (el: HTMLElement, className: string): void {
  if (!el.classList.contains(className)) el.classList.add(className)
}

export function removeClass (el: HTMLElement, className: string): void {
  el.classList.remove(className)
}
