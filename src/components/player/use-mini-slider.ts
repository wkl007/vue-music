import { computed, nextTick, onActivated, onDeactivated, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import * as types from '@/store/mutationTypes'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Page } from '@better-scroll/slide/dist/types/SlidePages'

BScroll.use(Slide)

interface UseMiniSlider {
  /** slider 实例 */
  slider: Ref<BScrollConstructor | undefined>;
  /** slider dom 实例 */
  sliderWrapperRef: Ref<HTMLDivElement>;
}

export function useMiniSlider (): UseMiniSlider {
  const store = useStore()

  const sliderWrapperRef = ref(document.createElement('div'))
  const slider = ref<BScrollConstructor | undefined>()

  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => !fullScreen.value && !!playList.value)

  onMounted(() => {
    let sliderVal: BScrollConstructor

    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })

          sliderVal.on('slidePageChanged', ({ pageX }: Page) => {
            store.commit(types.SET_CURRENT_INDEX, pageX)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
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
    sliderWrapperRef
  }
}
