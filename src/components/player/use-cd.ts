import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'

interface UseCd {
  /** 动画类名  */
  cdCls: ComputedRef<string>;
  /** 唱片容器 */
  cdRef: Ref<HTMLDivElement>;
  /** 唱片图片容器 */
  cdImageRef: Ref<HTMLDivElement>;
}

export function useCd (): UseCd {
  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdRef = ref<HTMLDivElement>(document.createElement('div'))
  const cdImageRef = ref<HTMLDivElement>(document.createElement('div'))

  const cdCls = computed(() => playing.value ? 'playing' : '')

  /** 同步旋转角度 */
  function syncTransform (wrapper: HTMLDivElement, inner: HTMLDivElement): void {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  watch(playing, (newPlaying) => {
    if (newPlaying) return
    syncTransform(cdRef.value, cdImageRef.value)
  })

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
