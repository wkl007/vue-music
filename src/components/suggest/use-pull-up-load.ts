import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, ComputedRef, Ref } from 'vue'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

interface Props {
  /** 请求方法 */
  fetchData: () => void;
  /**  */
  preventPullUpLoad: ComputedRef<boolean>;
}

interface UsePullUpLoad {
  /** 滚动根元素实例 */
  rootRef: Ref<HTMLDivElement>;
  /** BS 实例 */
  scroll: Ref<BScrollConstructor | undefined>;
  /** 是否正在请求数据 */
  isPullUpLoad: Ref<boolean>;
}

export function usePullUpLoad ({ fetchData, preventPullUpLoad }: Props): UsePullUpLoad {
  const rootRef = ref<HTMLDivElement>(document.createElement('div'))
  const scroll = ref<BScrollConstructor | undefined>()
  const isPullUpLoad = ref<boolean>(false)

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })

    scrollVal.on('pullingUp', pullingUpHandler)

    /** 监听事件 */
    async function pullingUpHandler () {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await fetchData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
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

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
