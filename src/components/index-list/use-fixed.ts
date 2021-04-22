import { computed, ComputedRef, CSSProperties, nextTick, Ref, ref, watch } from 'vue'
import type { Singer } from '@/types/api/singer'
import type { Position } from '@better-scroll/slide/dist/types/SlidePages'

interface Props {
  data: Singer[];
}

interface UseFixed {
  groupRef: Ref<HTMLDivElement>;
  fixedTitle: ComputedRef<string>;
  fixedStyle: ComputedRef<CSSProperties>;
  currentIndex: Ref<number>;
  onScroll: (pos: Position) => void;
}

export function useFixed (props: Props): UseFixed {
  const TITLE_HEIGHT = 30
  const groupRef = ref<HTMLDivElement>(document.createElement('div'))
  const listHeights = ref<number[]>([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return ''
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  watch(() => props.data, async () => {
    // DOM 更新后获取高度
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  // 计算每个组的高度
  function calculate (): void {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  // 滚动监听
  function onScroll (pos: Position): void {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    fixedTitle,
    fixedStyle,
    currentIndex,

    onScroll
  }
}
