<template>
  <div class="singer-detail">
    <music-list :songs="songs" :loading="loading" :pic="pic" :title="title" />
  </div>
</template>

<script>
import SingerServer from '@/apis/singer';
import { SINGER_KEY } from '@/utils/constants';
import { createDetailComponent } from '@/utils/create-detail-component';

export default createDetailComponent(
  'SingerDetail',
  SINGER_KEY,
  SingerServer.getSingerDetail,
);
</script>

<style scoped lang="less">
.singer-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: @color-background;
}
</style>
