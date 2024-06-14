<template>
  <div class="no-result">
    <div class="no-result-content">
      <div class="icon"></div>
      <p class="text">{{ title }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NoResult',
  setup() {
    const title = ref('抱歉，没有结果');

    /** 设置标题 */
    function setTitle(str) {
      title.value = str;
    }

    return {
      title,

      setTitle,
    };
  },
});
</script>

<style scoped lang="less">
.no-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .no-result-content {
    text-align: center;

    .icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      background-size: 86px 90px;
      .bg-image('no-result');
    }

    .text {
      margin-top: 30px;
      color: @color-text-d;
      font-size: @font-size-medium;
    }
  }
}
</style>
