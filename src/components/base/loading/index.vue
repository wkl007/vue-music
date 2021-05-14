<template>
  <div class="loading">
    <div class="loading-content">
      <img
        width="24"
        height="24"
        :src="images.loading"
        alt=""
      >
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from 'vue'
import images from '@/assets/images'

export default defineComponent({
  name: 'Loading',
  setup () {
    const state = reactive({
      title: '正在载入...',
      images: inject('images', images)
    })

    /** 设置标题 */
    function setTitle (title: string) {
      state.title = title
    }

    return {
      ...toRefs(state),

      setTitle
    }
  }
})
</script>

<style scoped lang="less">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      color: @color-text-l;
      font-size: @font-size-small;
      line-height: 20px;
    }
  }
}
</style>
