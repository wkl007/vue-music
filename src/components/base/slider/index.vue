<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic" alt="">
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item,index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import useSlider from './use-slider'
import type { Slider } from '@/types/api/recommend'

export default defineComponent({
  name: 'Slider',
  props: {
    /** 歌手列表 */
    sliders: {
      type: Array as PropType<Slider[]>,
      default: () => []
    }
  },
  setup () {
    const rootRef = ref<HTMLDivElement>(document.createElement('div'))
    const { currentPageIndex } = useSlider(rootRef)

    return {
      rootRef,
      currentPageIndex
    }
  }
})
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
