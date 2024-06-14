<template>
  <div ref="progressBarRef" class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div ref="progressRef" class="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';

const progressBtnWidth = 16;

export default defineComponent({
  name: 'ProgressBar',
  props: {
    /** 进度 */
    progress: {
      type: Number,
      default: 0,
    },
  },
  emits: ['progress-changing', 'progress-changed'],
  setup(props, { emit }) {
    const progressBarRef = ref();
    const progressRef = ref();
    const offset = ref(0);

    const touch = {
      x1: 0,
      beginWidth: 0,
    };

    const progressStyle = computed(() => `width:${offset.value}px`);
    const btnStyle = computed(
      () => `transform:translate3d(${offset.value}px,0,0)`,
    );

    /** 设置偏移量 */
    function setOffset(progress) {
      const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
      offset.value = barWidth * progress;
    }

    /** 开始拖动 */
    function onTouchStart(e) {
      touch.x1 = e.touches[0].pageX;
      touch.beginWidth = progressRef.value.clientWidth;
    }

    /** 正在拖动 */
    function onTouchMove(e) {
      const delta = e.touches[0].pageX - touch.x1;
      const tempWidth = touch.beginWidth + delta;
      const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
      offset.value = barWidth * progress;
      emit('progress-changing', progress);
    }

    /** 结束拖动 */
    function onTouchEnd(e) {
      const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
      const progress = progressRef.value.clientWidth / barWidth;
      emit('progress-changed', progress);
    }

    /** 点击 */
    function onClick(e) {
      const rect = progressBarRef.value.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
      const progress = offsetWidth / barWidth;
      emit('progress-changed', progress);
    }

    watch(
      () => props.progress,
      (newProgress) => {
        setOffset(newProgress);
      },
    );

    return {
      progressBarRef,
      progressRef,
      progressStyle,
      btnStyle,

      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick,
      setOffset,
    };
  },
});
</script>

<style scoped lang="less">
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgb(0 0 0 / 30%);

    .progress {
      position: absolute;
      height: 100%;
      background: @color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      top: -13px;
      left: -8px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: @color-theme;
        border: 3px solid @color-text;
        border-radius: 50%;
      }
    }
  }
}
</style>
