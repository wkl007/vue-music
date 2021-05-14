import { computed, ComputedRef, Ref, ref } from 'vue'
import type { Singers } from '@/types/api/singer'

interface Props {
  /** 歌手列表 */
  data: Singers[];
}

interface UseShortcut {
  /** scroll 实例 */
  scrollRef: Ref<HTMLDivElement>;
  /** 索引列表 */
  shortcutList: ComputedRef<string[]>;
  /** 滚动开始 */
  onShortcutTouchStart: (e: TouchEvent) => void;
  /** 滚动进行 */
  onShortcutTouchMove: (e: TouchEvent) => void;
}

interface Touch {
  /** 滚动索引 */
  anchorIndex?: number;
  /** 滚动开始纵坐标 */
  y1?: number;
  /** 滚动进行中纵坐标 */
  y2?: number;
}

export function useShortcut (props: Props, groupRef: Ref<HTMLDivElement>): UseShortcut {
  const ANCHOR_HEIGHT = 10 // 单个锚点高度
  const scrollRef = ref<HTMLDivElement>(document.createElement('div'))

  const shortcutList = computed(() => {
    return props.data.map(item => item.title)
  })

  const touch: Touch = {}

  /** 滚动开始 */
  function onShortcutTouchStart (e: TouchEvent): void {
    const anchorIndex = parseInt(<string>(e.target as HTMLElement).dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  /** 滚动进行 */
  function onShortcutTouchMove (e: TouchEvent): void {
    touch.y2 = e.touches[0].pageY
    let delta = 0
    let anchorIndex = 0
    if (touch.y1) delta = Math.ceil((touch.y2 - touch.y1) / ANCHOR_HEIGHT)
    if (touch.anchorIndex) anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  /** 滚动到具体元素 */
  function scrollTo (index: number): void {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll: any = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    scrollRef,
    shortcutList,

    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
