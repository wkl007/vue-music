<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{'active':modelValue === index}"
      @click="switchItem(index)"
    >
      <span>{{ item }}</span>
    </li>
    <li class="active-bar" :style="activeStyle"></li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Switches',
  props: {
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const activeStyle = computed(() => {
      const x = 120 * props.modelValue
      return {
        transform: `translate3d(${x}px, 0, 0)`
      }
    })

    /** 选中某项 */
    function switchItem (index: number): void {
      emit('update:modelValue', index)
    }

    return {
      activeStyle,

      switchItem
    }
  }
})
</script>

<style scoped lang="less">
.switches {
  position: relative;
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid @color-highlight-background;
  border-radius: 5px;

  .switch-item {
    position: relative;
    z-index: 10;
    flex: 1;
    height: 30px;
    color: @color-text-d;
    font-size: @font-size-medium;
    line-height: 30px;
    text-align: center;

    &.active {
      color: @color-text;
    }
  }

  .active-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 30px;
    background: @color-highlight-background;
    border-radius: 5px;
    transition: transform 0.3s;
  }
}
</style>
