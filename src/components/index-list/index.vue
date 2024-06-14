<template>
  <scroll ref="scrollRef" class="index-list" :probe-type="3" @scroll="onScroll">
    <ul ref="groupRef">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="onItemClick(item)">
            <img v-lazy="item.pic" class="avatar" alt="" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div v-show="fixedTitle" class="fixed" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent>
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          class="item"
          :data-index="index"
          :class="{ current: currentIndex === index }">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import { defineComponent } from 'vue';
import Scroll from '@/components/wrap-scroll/index.js';
import { useFixed } from './use-fixed.js';
import { useShortcut } from './use-shortcut.js';

export default defineComponent({
  name: 'IndexList',
  components: {
    Scroll,
  },
  props: {
    /** 歌手列表 */
    data: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } =
      useFixed(props);
    const {
      shortcutList,
      scrollRef,
      onShortcutTouchStart,
      onShortcutTouchMove,
    } = useShortcut(props, groupRef);

    /** 歌手点击事件 */
    function onItemClick(item) {
      emit('select', item);
    }

    return {
      groupRef,
      fixedTitle,
      fixedStyle,
      currentIndex,
      shortcutList,
      scrollRef,

      onScroll,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onItemClick,
    };
  },
});
</script>

<style scoped lang="less">
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @color-background;

  .group {
    padding-bottom: 30px;

    .title {
      height: 30px;
      padding-left: 20px;
      color: @color-text-l;
      font-size: @font-size-small;
      line-height: 30px;
      background: @color-highlight-background;
    }

    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      padding-left: 20px;
      color: @color-text-l;
      font-size: @font-size-small;
      line-height: 30px;
      background: @color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    top: 50%;
    right: 4px;
    width: 20px;
    padding: 20px 0;
    font-family: Helvetica, serif;
    text-align: center;
    background: @color-background-d;
    border-radius: 10px;
    transform: translateY(-50%);

    .item {
      padding: 3px;
      color: @color-text-l;
      font-size: @font-size-small;
      line-height: 1;

      &.current {
        color: @color-theme;
      }
    }
  }
}
</style>
