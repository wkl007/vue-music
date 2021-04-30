<template>
  <div class="player">
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
      <div class="middle"></div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l"></span>
          <div class="progress-bar-wrapper">

          </div>
          <span class="time time-r"></span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { Song } from '@/types/api/recommend'
import { PlayMode } from '@/utils/constants'
import * as types from '@/store/mutationTypes'

export default defineComponent({
  name: 'Player',
  setup () {
    const state = reactive({
      audioRef: ref<HTMLAudioElement>(document.createElement('audio')),
      barRef: ref(null)
    })

    // vuex
    const store = useStore()
    const fullScreen = computed<boolean>(() => store.state.fullScreen)
    const playing = computed<boolean>(() => store.state.playing)
    const currentIndex = computed<number>(() => store.state.currentIndex)
    const playMode = computed<PlayMode>(() => store.state.playMode)
    const currentSong = computed<Song>(() => store.getters.currentSong)

    // computed
    const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play')

    /** 退出全屏 */
    function goBack (): void {
      store.commit(types.SET_FULL_SCREEN, false)
    }

    /** 播放/暂停 */
    function togglePlay (): void {
      store.commit(types.SET_PLAYING, !playing.value)
    }

    /** 播放器暂停 */
    function pause (): void {
      store.commit(types.SET_PLAYING, false)
    }

    /** 监听当前歌曲信息 */
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return
      const audioEl = state.audioRef
      audioEl.src = newSong.url
      audioEl.play()
      store.commit(types.SET_PLAYING, true)
    })

    /** 监听播放状态 */
    watch(playing, (newPlaying) => {
      const audioEl = state.audioRef
      if (newPlaying) {
        audioEl.play()
      } else {
        audioEl.pause()
      }
    })

    return {
      ...toRefs(state),
      fullScreen,
      currentSong,

      playIcon,

      goBack,
      togglePlay,
      pause
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
