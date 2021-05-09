import { useStore } from 'vuex'
import { computed, ref, Ref, watch } from 'vue'
import Lyric from 'lyric-parser'
import { processLyric } from '@/api/song'
import * as types from '@/store/mutationTypes'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'

interface Props {
  /** 可以播放 */
  songReady: Ref<boolean>;
  /** 当前播放时间 */
  currentTime: Ref<number>;
}

interface UseLyric {
  /** 当前歌词实例 */
  currentLyric: Ref<Lyric | null>;
  /** 当前播放行号 */
  currentLineNum: Ref<number>;
  /** 纯音乐歌词 */
  pureMusicLyric: Ref<string>;
  /** 当前播放歌词 */
  playingLyric: Ref<string>;
  /** 滚动组件实例 */
  lyricScrollRef: Ref<BScrollConstructor | undefined>;
  /** 列表 DOM 实例 */
  lyricListRef: Ref<HTMLDivElement>;
  /** 播放歌词 */
  playLyric: () => void;
  /** 暂停歌词 */
  stopLyric: () => void;
}

export function useLyric ({ songReady, currentTime }: Props): UseLyric {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const currentLyric = ref<Lyric | null>(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref<BScrollConstructor | undefined>()
  const lyricListRef = ref<HTMLDivElement>(document.createElement('div'))

  /** 播放歌词 */
  function playLyric (): void {
    currentLyric.value?.seek(currentTime.value * 1000)
  }

  /** 暂停歌词 */
  function stopLyric (): void {
    currentLyric.value?.stop()
  }

  /** 处理歌词 */
  function handleLyric ({ lineNum, txt }: { lineNum: number; txt: string }): void {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) return
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp?.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp?.scroll.scrollTo(0, 0, 1000)
    }
  }

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) return
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await processLyric(newSong)
    store.commit(types.ADD_SONG_LYRIC, { song: newSong, lyric })
    if (currentSong.value.lyric !== lyric) return

    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) playLyric()
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,

    playLyric,
    stopLyric
  }
}
