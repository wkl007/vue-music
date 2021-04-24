import { onActivated, onDeactivated, onMounted, onUnmounted, ref, Ref } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Position } from '@better-scroll/slide/dist/types/SlidePages'

BScroll.use(ObserveDOM)

interface Options {
  click: boolean;
  probeType: number
}

export default function useScroll (wrapperRef: Ref<HTMLDivElement>, options: Options, emit: any): Ref<BScrollConstructor | undefined> {
  const scroll = ref<BScrollConstructor | undefined>()

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos: Position) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  onActivated(() => {
    scroll.value?.enable()
    scroll.value?.refresh()
  })

  onDeactivated(() => {
    scroll.value?.disable()
  })

  return scroll
}
