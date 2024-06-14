import BScroll from '@better-scroll/core';
import PullUp from '@better-scroll/pull-up';
import ObserveDOM from '@better-scroll/observe-dom';
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';

BScroll.use(PullUp);
BScroll.use(ObserveDOM);

export function usePullUpLoad({ fetchData, preventPullUpLoad }) {
  const rootRef = ref();
  const scroll = ref();
  const isPullUpLoad = ref(false);

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true,
    }));

    scrollVal.on('pullingUp', pullingUpHandler);

    /** 监听事件 */
    async function pullingUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp();
        return;
      }
      isPullUpLoad.value = true;
      await fetchData();
      scrollVal.finishPullUp();
      scrollVal.refresh();
      isPullUpLoad.value = false;
    }
  });

  onUnmounted(() => {
    scroll.value?.destroy();
  });

  onActivated(() => {
    scroll.value?.enable();
    scroll.value?.refresh();
  });

  onDeactivated(() => {
    scroll.value?.disable();
  });

  return {
    scroll,
    rootRef,
    isPullUpLoad,
  };
}
