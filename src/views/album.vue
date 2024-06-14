<template>
  <div class="album">
    <music-list :songs="songs" :loading="loading" :pic="pic" :title="title" />
  </div>
</template>

<script>
import RecommendServer from '@/apis/recommend';
import { ALBUM_KEY } from '@/utils/constants';
import { createDetailComponent } from '@/utils/create-detail-component';

export default createDetailComponent(
  'Album',
  ALBUM_KEY,
  RecommendServer.getAlbum,
);
</script>

<style scoped lang="less">
.album {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: @color-background;
}
</style>
