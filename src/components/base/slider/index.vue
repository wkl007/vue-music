<template>
  <div ref="rootRef" class="slider">
    <div class="slider-group">
      <div v-for="item in sliders" :key="item.id" class="slider-page">
        <a :href="item.link">
          <img :src="item.pic" alt="" />
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        v-for="(item, index) in sliders"
        :key="item.id"
        class="dot"
        :class="{ active: currentPageIndex === index }" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import useSlider from './use-slider.js';

export default defineComponent({
  name: 'Slider',
  props: {
    /** 歌手列表 */
    sliders: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const rootRef = ref();
    const { currentPageIndex } = useSlider(rootRef);

    return {
      rootRef,
      currentPageIndex,
    };
  },
});
</script>

<style scoped lang="less">
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots-wrapper {
    position: absolute;
    bottom: 12px;
    left: 50%;
    line-height: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      background: @color-text-l;
      border-radius: 50%;
      transform: translateZ(1px);

      &.active {
        width: 20px;
        background: @color-text-ll;
        border-radius: 5px;
      }
    }
  }
}
</style>
