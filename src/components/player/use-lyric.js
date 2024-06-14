import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Lyric from 'lyric-parser';
import { processLyric } from '@/apis/song';
import * as types from '@/store/mutationTypes.js';

export function useLyric({ songReady, currentTime }) {
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);

  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  const pureMusicLyric = ref('');
  const playingLyric = ref('');
  const lyricScrollRef = ref();
  const lyricListRef = ref();

  /** 播放歌词 */
  function playLyric() {
    currentLyric.value?.seek(currentTime.value * 1000);
  }

  /** 暂停歌词 */
  function stopLyric() {
    currentLyric.value?.stop();
  }

  /** 处理歌词 */
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl) return;
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollComp?.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComp?.scroll.scrollTo(0, 0, 1000);
    }
  }

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) return;
    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;
    pureMusicLyric.value = '';
    playingLyric.value = '';

    const lyric = await processLyric(newSong);
    store.commit(types.ADD_SONG_LYRIC, { song: newSong, lyric });
    if (currentSong.value.lyric !== lyric) return;

    currentLyric.value = new Lyric(lyric, handleLyric);
    const hasLyric = currentLyric.value.lines.length;
    if (hasLyric) {
      if (songReady.value) playLyric();
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        '',
      );
    }
  });

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,

    playLyric,
    stopLyric,
  };
}
