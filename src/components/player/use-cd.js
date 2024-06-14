import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

export function useCd() {
  const store = useStore();
  const playing = computed(() => store.state.playing);

  const cdRef = ref();
  const cdImageRef = ref();

  const cdCls = computed(() => (playing.value ? 'playing' : ''));

  /** 同步旋转角度 */
  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    wrapper.style.transform =
      wrapperTransform === 'none'
        ? innerTransform
        : innerTransform.concat(' ', wrapperTransform);
  }

  watch(playing, (newPlaying) => {
    if (newPlaying) return;
    syncTransform(cdRef.value, cdImageRef.value);
  });

  return {
    cdCls,
    cdRef,
    cdImageRef,
  };
}
