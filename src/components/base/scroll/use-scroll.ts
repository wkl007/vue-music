import { onActivated, onDeactivated, onMounted, onUnmounted, ref, Ref } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Position } from '@better-scroll/slide/dist/types/SlidePages'

BScroll.use(ObserveDOM)

interface Options {
  /** 派发点击事件 */
  click: boolean;
  /**
   *  决定是否派发 scroll 事件，对页面的性能有影响
   *  1. probeType 为 0，在任何时候都不派发 scroll 事件，
   *  2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
   *  3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
   *  4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
   * */
  probeType: number
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useScroll (wrapperRef: Ref<HTMLDivElement>, options: Options, emit: any): Ref<BScrollConstructor | undefined> {
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
