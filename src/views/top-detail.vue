<template>
  <div class="top-detail">
    <music-list
      :songs="songs"
      :loading="loading"
      :pic="pic"
      :title="title"
      rank />
  </div>
</template>

<script>
import TopServer from '@/apis/top';
import { TOP_KEY } from '@/utils/constants';
import { createDetailComponent } from '@/utils/create-detail-component';

export default createDetailComponent(
  'TopDetail',
  TOP_KEY,
  TopServer.getTopDetail,
);
</script>

<style scoped lang="less">
.top-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: @color-background;
}
</style>
