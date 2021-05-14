<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
      <div class="cd-wrapper">
        <div
          ref="cdRef"
          class="cd">
          <img
            ref="cdImageRef"
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSong.pic"
            alt=""
          >
        </div>
      </div>
      <div
        ref="sliderWrapperRef"
        class="slider-wrapper"
      >
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="item in playList"
            :key="item.id"
          >
            <h2 class="name">{{ item.name }}</h2>
            <p class="desc">{{ item.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle
          :radius="32"
          :progress="progress"
        >
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <play-list ref="playListRef"/>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import ProgressCircle from './progress-circle.vue'
import PlayList from './play-list.vue'
import { useCd } from './use-cd'
import { useMiniSlider } from './use-mini-slider'
import * as types from '@/store/mutationTypes'

export default defineComponent({
  name: 'MiniPlayer',
  components: {
    ProgressCircle,
    PlayList
  },
  props: {
    /** 播放进度 */
    progress: {
      type: Number,
      default: 0
    },
    /** 播放/暂停播放 */
    togglePlay: {
      type: Function,
      default: undefined
    }
  },
  setup () {
    const store = useStore()
    const playListRef = ref()

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playList = computed(() => store.state.playList)
    const miniPlayIcon = computed(() => playing.value ? 'icon-pause-mini' : 'icon-play-mini')

    const { cdCls, cdRef, cdImageRef } = useCd()
    const { sliderWrapperRef } = useMiniSlider()

    /** 显示全屏播放器 */
    function showNormalPlayer (): void {
      store.commit(types.SET_FULL_SCREEN, true)
    }

    /** 显示播放列表 */
    function showPlayList (): void {
      playListRef.value.show()
    }

    return {
      playListRef,
      fullScreen,
      currentSong,
      playing,
      playList,
      miniPlayIcon,
      cdCls,
      cdRef,
      cdImageRef,
      sliderWrapperRef,

      showNormalPlayer,
      showPlayList
    }
  }
})
</script>

<style scoped lang="less">
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 180;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background: @color-highlight-background;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .cd {
      width: 100%;
      height: 100%;

      img {
        border-radius: 50%;

        &.playing {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    line-height: 20px;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;

        .name {
          margin-bottom: 2px;
          color: @color-text;
          font-size: @font-size-medium;
          .text-overflow-hidden();
        }

        .desc {
          color: @color-text-d;
          font-size: @font-size-small;
          .text-overflow-hidden();
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;

    .icon-playlist {
      position: relative;
      top: -2px;
      color: @color-theme-d;
      font-size: 28px;
    }

    .icon-mini {
      position: absolute;
      top: 0;
      left: 0;
      color: @color-theme-d;
      font-size: 32px;
    }
  }

  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from,
  &.mini-leave-to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
</style>
