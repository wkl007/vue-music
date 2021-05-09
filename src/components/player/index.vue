<template>
  <div
    class="player"
    v-show="playList.length"
  >
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic" alt="">
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"/>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
      >
        <div
          class="middle-l"
          :style="middleLStyle"
        >
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img
                ref="cdImageRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
                alt=""
              >
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <scroll
          class="middle-r"
          ref="lyricScrollRef"
          :style="middleRStyle"
        >
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{'current':currentLineNum===index}"
                v-for="(item,index) in currentLyric.lines"
                :key="index"
              >
                {{ item.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span
            class="dot"
            :class="currentShow==='cd'?'active':''"
          />
          <span
            class="dot"
            :class="currentShow==='lyric'?'active':''"
          />
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            />
          </div>
          <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 迷你播放器 -->
    <mini-player
      :progress="progress"
      :toggle-play="togglePlay"
    />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { Scroll } from '@/components'
import ProgressBar from './progress-bar.vue'
import MiniPlayer from './mini-player.vue'
import { Song } from '@/types/api/recommend'
import { PlayMode } from '@/utils/constants'
import * as types from '@/store/mutationTypes'
import { useMode } from './use-mode'
import { useFavorite } from './use-favorite'
import { useCd } from './use-cd'
import { useLyric } from './use-lyric'
import { useMiddleInteractive } from './use-middle-interactive'
import { formatTime } from '@/utils'

interface State {
  /** audio 实例 */
  audioRef: HTMLAudioElement;
  /** 进度条示例 */
  barRef: HTMLDivElement | any;
  /** 可以播放 */
  songReady: boolean;
  /** 当前播放时间 */
  currentTime: number;
}

export default defineComponent({
  name: 'Player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup () {
    const state = reactive<State>({
      audioRef: document.createElement('audio'),
      barRef: document.createElement('div'),
      songReady: false,
      currentTime: 0
    })
    let progressChanging = false

    // vuex
    const store = useStore()
    const fullScreen = computed<boolean>(() => store.state.fullScreen)
    const playing = computed<boolean>(() => store.state.playing)
    const currentIndex = computed<number>(() => store.state.currentIndex)
    const playMode = computed<PlayMode>(() => store.state.playMode)
    const currentSong = computed<Song>(() => store.getters.currentSong)
    const playList = computed<Song[]>(() => store.state.playList)

    // computed
    const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play')
    const disableCls = computed(() => state.songReady ? '' : 'disable')
    const progress = computed(() => state.currentTime / currentSong.value.duration)

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { songReady, currentTime } = toRefs(state)
    const { currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricScrollRef, lyricListRef, playLyric, stopLyric } = useLyric({ songReady, currentTime })
    const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()

    /** 退出全屏 */
    function goBack (): void {
      store.commit(types.SET_FULL_SCREEN, false)
    }

    /** 播放/暂停 */
    function togglePlay (): void {
      if (!state.songReady) return
      store.commit(types.SET_PLAYING, !playing.value)
    }

    /** 上一首 */
    function prev (): void {
      const list = playList.value
      if (!list.length || !state.songReady) return
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit(types.SET_CURRENT_INDEX, index)
      }
      if (!playing.value) {
        store.commit(types.SET_PLAYING, true)
      }
    }

    /** 下一首 */
    function next (): void {
      const list = playList.value
      if (!list.length || !state.songReady) return
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit(types.SET_CURRENT_INDEX, index)
      }
      if (!playing.value) {
        store.commit(types.SET_PLAYING, true)
      }
    }

    /** 循环播放 */
    function loop (): void {
      const audioEl = state.audioRef
      audioEl.currentTime = 0
      audioEl.play()
      store.commit(types.SET_PLAYING, true)
    }

    /** 播放器暂停 */
    function pause (): void {
      store.commit(types.SET_PLAYING, false)
    }

    /** 音频可以播放 */
    function ready (): void {
      if (state.songReady) return
      state.songReady = true
      playLyric()
    }

    /** 加载错误 */
    function error (): void {
      state.songReady = true
    }

    /** 更新时间 */
    function updateTime (): void {
      if (progressChanging) return
      state.currentTime = state.audioRef.currentTime
    }

    /** 播放结束 */
    function end (): void {
      state.currentTime = 0
      if (playMode.value === PlayMode.LOOP) {
        loop()
      } else {
        next()
      }
    }

    /** 进度条拖动 */
    function onProgressChanging (progress: number): void {
      progressChanging = true
      state.currentTime = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }

    /** 进度条拖动结束 */
    function onProgressChanged (progress: number): void {
      progressChanging = false
      state.audioRef.currentTime = state.currentTime = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit(types.SET_PLAYING, true)
      }
      playLyric()
    }

    /** 监听当前歌曲信息 */
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return
      state.currentTime = 0
      state.songReady = false
      const audioEl = state.audioRef
      audioEl.src = newSong.url
      audioEl.play()
      store.commit(types.SET_PLAYING, true)
    })

    /** 监听播放状态 */
    watch(playing, (newPlaying) => {
      if (!state.songReady) return
      const audioEl = state.audioRef
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    /** 监听全屏状态设置进度条 */
    watch(fullScreen, async (newFullScreen) => {
      if (!newFullScreen) return
      await nextTick()
      state.barRef.setOffset(progress.value)
    })

    return {
      ...toRefs(state),
      fullScreen,
      playList,
      currentSong,
      modeIcon,

      playIcon,
      disableCls,
      progress,

      cdCls,
      cdRef,
      cdImageRef,

      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,

      currentShow,
      middleLStyle,
      middleRStyle,

      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      end,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    }
  }
})
</script>

<style scoped lang="less">
.player {
  .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 150;
    background: @color-background;

    .background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        color: @color-theme;
        font-size: @font-size-large-x;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        color: @color-text;
        font-size: @font-size-large;
        line-height: 40px;
        text-align: center;
        .text-overflow-hidden();
      }

      .subtitle {
        color: @color-text;
        font-size: @font-size-medium;
        line-height: 20px;
        text-align: center;
      }
    }

    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      font-size: 0;
      white-space: nowrap;

      .middle-l {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 0;
        padding-top: 80%;
        vertical-align: top;

        .cd-wrapper {
          position: absolute;
          top: 0;
          left: 10%;
          box-sizing: border-box;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              top: 0;
              left: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            color: @color-text-l;
            font-size: @font-size-medium;
            line-height: 20px;
          }
        }
      }

      .middle-r {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        vertical-align: top;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            color: @color-text-l;
            font-size: @font-size-medium;
            line-height: 32px;

            &.current {
              color: @color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            color: @color-text-l;
            font-size: @font-size-medium;
            line-height: 32px;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        font-size: 0;
        text-align: center;

        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          vertical-align: middle;
          background: @color-text-l;
          border-radius: 50%;

          &.active {
            width: 20px;
            background: @color-text-ll;
            border-radius: 5px;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          flex: 0 0 40px;
          width: 40px;
          color: @color-text;
          font-size: @font-size-small;
          line-height: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: @color-theme;

          &.disable {
            color: @color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: @color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
