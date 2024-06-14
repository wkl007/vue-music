import {
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import * as types from '@/store/mutationTypes.js';

BScroll.use(Slide);

export function useMiniSlider() {
  const store = useStore();

  const sliderWrapperRef = ref();
  const slider = ref();

  const fullScreen = computed(() => store.state.fullScreen);
  const playList = computed(() => store.state.playList);
  const currentIndex = computed(() => store.state.currentIndex);

  const sliderShow = computed(() => !fullScreen.value && !!playList.value);

  onMounted(() => {
    let sliderVal;

    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
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
              loop: true,
            },
          });

          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit(types.SET_CURRENT_INDEX, pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    slider.value?.destroy();
  });

  onActivated(() => {
    slider.value?.enable();
    slider.value?.refresh();
  });

  onDeactivated(() => {
    slider.value?.disable();
  });

  return {
    slider,
    sliderWrapperRef,
  };
}
