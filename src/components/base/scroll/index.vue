<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useScroll } from '@/components/base/scroll/use-scroll.js';

export default defineComponent({
  name: 'Scroll',
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      default: 0,
    },
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const rootRef = ref();
    const scroll = useScroll(rootRef, props, emit);

    return {
      rootRef,
      scroll,
    };
  },
});
</script>
