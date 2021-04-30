import { useStore } from 'vuex'
import { computed, ComputedRef, reactive } from 'vue'
import { PlayMode } from '@/utils/constants'

interface UseMode {
  /** 图标 */
  modeIcon: ComputedRef<string>;
  /** 文本 */
  modeText: ComputedRef<string>;
  /** 切换模式 */
  changeMode: () => Promise<void>;
}

export function useMode (): UseMode {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    let icon = ''
    switch (playModeVal) {
      case PlayMode.SEQUENCE:
        icon = 'icon-sequence'
        break
      case PlayMode.RANDOM:
        icon = 'icon-random'
        break
      case PlayMode.LOOP:
        icon = 'icon-loop'
        break
    }
    return icon
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    let icon = ''
    switch (playModeVal) {
      case PlayMode.SEQUENCE:
        icon = '顺序播放'
        break
      case PlayMode.RANDOM:
        icon = '随机播放'
        break
      case PlayMode.LOOP:
        icon = '单曲循环'
        break
    }
    return icon
  })

  /** 切换模式 */
  async function changeMode (): Promise<void> {
    const mode = (playMode.value + 1) % 3
    await store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    modeText,

    changeMode
  }
}
