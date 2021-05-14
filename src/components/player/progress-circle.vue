<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProgressCircle',
  props: {
    /** 半径 */
    radius: {
      type: Number,
      default: 100
    },
    /** 进度 */
    progress: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    /** 周长 */
    const dashArray = ref(Math.PI * 100)
    /** 播放进度 线性负相关 */
    const dashOffset = computed(() => (1 - props.progress) * dashArray.value)

    return {
      dashArray,
      dashOffset
    }
  }
})
</script>

<style scoped lang="less">
.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: @color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: @color-theme;
    }
  }
}
</style>
