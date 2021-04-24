<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :loading="loading"
      :pic="pic"
      :title="title"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import { MusicList } from '@/components'
import SingerServer from '@/api/singer'
import type { Singer } from '@/types/api/singer'
import type { Song } from '@/types/api/recommend'
import { processSongs } from '@/api/song'

interface State {
  songs: Song[];
  loading: boolean;
}

export default defineComponent({
  name: 'SingerDetail',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object as PropType<Singer>,
      default: () => {}
    }
  },
  setup (props) {
    const state = reactive<State>({
      songs: [],
      loading: true
    })
    const pic = computed(() => props.singer?.pic)
    const title = computed(() => props.singer?.name)

    async function fetchData () {
      try {
        state.loading = true
        const res = await SingerServer.getSingerDetail({ mid: props.singer.mid })
        state.songs = await processSongs(res.songs)
        state.loading = false
      } catch (e) {}
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),
      pic,
      title
    }
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
