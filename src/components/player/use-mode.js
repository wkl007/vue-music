import { computed } from 'vue';
import { useStore } from 'vuex';
import { PlayMode } from '@/utils/constants';

export function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.playMode);

  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    let icon = '';
    switch (playModeVal) {
      case PlayMode.SEQUENCE:
        icon = 'icon-sequence';
        break;
      case PlayMode.RANDOM:
        icon = 'icon-random';
        break;
      case PlayMode.LOOP:
        icon = 'icon-loop';
        break;
    }
    return icon;
  });

  const modeText = computed(() => {
    const playModeVal = playMode.value;
    let icon = '';
    switch (playModeVal) {
      case PlayMode.SEQUENCE:
        icon = '顺序播放';
        break;
      case PlayMode.RANDOM:
        icon = '随机播放';
        break;
      case PlayMode.LOOP:
        icon = '单曲循环';
        break;
    }
    return icon;
  });

  /** 切换模式 */
  async function changeMode() {
    const mode = (playMode.value + 1) % 3;
    await store.dispatch('changeMode', mode);
  }

  return {
    modeIcon,
    modeText,

    changeMode,
  };
}
