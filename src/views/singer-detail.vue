<template>
  <div class="singer-detail">

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'
import SingerServer from '@/api/singer'
import type { Singer } from '@/types/api/singer'
import { processSongs } from '@/api/song'

export default defineComponent({
  name: 'SingerDetail',
  props: {
    singer: {
      type: Object as PropType<Singer>,
      default: () => {}
    }
  },
  setup (props) {
    async function fetchData () {
      try {
        const res = await SingerServer.getSingerDetail({ mid: props.singer.mid })
        const songs = await processSongs(res.songs)
        console.log(songs)
      } catch (e) {

      }
    }

    onMounted(() => {
      fetchData()
    })
  }
})
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
