import { onActivated, onDeactivated, onMounted, onUnmounted, ref, Ref } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Page } from '@better-scroll/slide/dist/types/SlidePages'

BScroll.use(Slide)

interface UseSlider {
  /** slider 实例 */
  slider: Ref<BScrollConstructor | undefined>;
  /** 当前项 */
  currentPageIndex: Ref<number>
}

export default function useSlider (wrapperRef: Ref<HTMLDivElement>): UseSlider {
  const slider = ref<BScrollConstructor | undefined>()
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })

    sliderVal.on('slideWillChange', (page: Page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value?.destroy()
  })

  onActivated(() => {
    slider.value?.enable()
    slider.value?.refresh()
  })

  onDeactivated(() => {
    slider.value?.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
