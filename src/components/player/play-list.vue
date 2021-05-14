<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="play-list"
        v-show="visible&&playList.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click="changeMode"
              ></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll
            ref="scrollRef"
            class="list-content"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
              <li
                class="item"
                v-for="item in sequenceList"
                :key="item.id"
                @click="selectItem(item)"
              >
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text">{{ item.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(item)">
                  <i :class="getFavoriteIcon(item)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(item)"
                  :class="{'disable':removing}"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />
        <add-song ref="addSongRef"/>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { promiseTimeout } from '@vueuse/core'
import Scroll from '@/components/wrap-scroll/index'
import Confirm from '@/components/base/confirm/index.vue'
import AddSong from '@/components/add-song/index.vue'
import { useMode } from './use-mode'
import { useFavorite } from './use-favorite'
import * as types from '@/store/mutationTypes'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Song } from '@/types/api/recommend'

interface State {
  /** scroll 实例 */
  scrollRef: BScrollConstructor | undefined;
  /** 列表实例 */
  listRef: any;
  /** confirm 实例 */
  confirmRef: any;
  /** addSong 实例 */
  addSongRef: any;
  /** 显示播放列表 */
  visible: boolean;
  /** 正在删除标识 */
  removing: boolean;
}

export default defineComponent({
  name: 'PlayList',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup () {
    const store = useStore()
    const state = reactive<State>({
      scrollRef: undefined,
      listRef: document.createElement('div'),
      confirmRef: document.createElement('div'),
      addSongRef: document.createElement('div'),
      visible: false,
      removing: false
    })

    const playList = computed<Song[]>(() => store.state.playList)
    const sequenceList = computed<Song[]>(() => store.state.sequenceList)
    const currentSong = computed<Song>(() => store.getters.currentSong)

    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    /** 显示 */
    async function show (): Promise<void> {
      state.visible = true

      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    /** 隐藏 */
    function hide (): void {
      state.visible = false
    }

    /** 当前播放 icon */
    function getCurrentIcon (song: Song): string | void {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    /** 刷新 */
    function refreshScroll () {
      state.scrollRef?.scroll.refresh()
    }

    /** 滚动到当前播放位置 */
    function scrollToCurrent () {
      const index = sequenceList.value.findIndex(item => currentSong.value.id === item.id)
      if (index === -1) return
      const target = state.listRef.$el.children[index]
      state.scrollRef?.scroll.scrollToElement(target, 300)
    }

    /** 选中某项歌曲 */
    function selectItem (song: Song): void {
      const index = playList.value.findIndex(item => song.id === item.id)

      store.commit(types.SET_CURRENT_INDEX, index)
      store.commit(types.SET_PLAYING, true)
    }

    /** 移除歌曲 */
    async function removeSong (song: Song): Promise<void> {
      if (state.removing) return
      state.removing = true
      await store.dispatch('removeSong', song)
      if (!playList.value.length) hide()
      await promiseTimeout(300)
      state.removing = false
    }

    /** 显示确认弹框 */
    function showConfirm (): void {
      state.confirmRef.show()
    }

    /** 清空播放列表  */
    function confirmClear (): void {
      store.dispatch('clearSongList')
      hide()
    }

    /** 添加歌曲 */
    function showAddSong () {
      state.addSongRef.show()
    }

    /** 监听当前歌曲 */
    watch(currentSong, async (newSong) => {
      if (!state.visible || !newSong.id) return
      await nextTick()
      scrollToCurrent()
    })

    return {
      ...toRefs(state),
      playList,
      sequenceList,

      modeIcon,
      modeText,
      changeMode,

      getFavoriteIcon,
      toggleFavorite,

      show,
      hide,
      getCurrentIcon,
      selectItem,
      removeSong,
      showConfirm,
      confirmClear,
      showAddSong
    }
  }
})
</script>

<style scoped lang="less">
.play-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background-color: @color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 210;
    width: 100%;
    background-color: @color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          color: @color-theme-d;
          font-size: 24px;
        }

        .text {
          flex: 1;
          color: @color-text-l;
          font-size: @font-size-medium;
        }

        .clear {
          .extend-click();

          .icon-clear {
            color: @color-text-d;
            font-size: @font-size-medium;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          color: @color-theme-d;
          font-size: @font-size-small;
        }

        .text {
          flex: 1;
          color: @color-text-d;
          font-size: @font-size-medium;
          .text-overflow-hidden();
        }

        .favorite {
          margin-right: 15px;
          color: @color-theme;
          font-size: @font-size-small;
          .extend-click();

          .icon-favorite {
            color: @color-sub-theme;
          }
        }

        .delete {
          color: @color-theme;
          font-size: @font-size-small;
          .extend-click();

          &.disable {
            color: @color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        color: @color-text-l;
        border: 1px solid @color-text-l;
        border-radius: 100px;

        .icon-add {
          margin-right: 5px;
          font-size: @font-size-small-s;
        }

        .text {
          font-size: @font-size-small;
        }
      }
    }

    .list-footer {
      color: @color-text-l;
      font-size: @font-size-medium-x;
      line-height: 50px;
      text-align: center;
      background: @color-background;
    }
  }
}
</style>
