<template>
  <teleport to="body">
    <transition name="slide-down">
      <div v-show="visible" class="message" @click="hide">
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Message',
  props: {
    /** 显示时间 */
    delay: {
      type: Number,
      default: 2000,
    },
  },
  setup(props) {
    const visible = ref(false);
    let timer = 0;

    /** 显示 */
    function show() {
      visible.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        hide();
      }, props.delay);
    }

    /** 隐藏 */
    function hide() {
      clearTimeout(timer);
      visible.value = false;
    }

    return {
      visible,

      show,
      hide,
    };
  },
});
</script>

<style scoped lang="less">
.message {
  position: fixed;
  top: 0;
  z-index: 400;
  width: 100%;
  background: @color-dialog-background;

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
