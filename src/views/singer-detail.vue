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
import { useRoute, useRouter } from 'vue-router'
import { MusicList } from '@/components'
import SingerServer from '@/api/singer'
import type { Singer } from '@/types/api/singer'
import type { Song } from '@/types/api/recommend'
import { processSongs } from '@/api/song'
import { SINGER_KEY } from '@/utils/constants'
import { loadSessionStorage } from '@/utils/cache'

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
    const route = useRoute()
    const router = useRouter()
    const state = reactive<State>({
      songs: [],
      loading: true
    })

    const computedData = computed(() => {
      let result = null
      const singer = props.singer
      if (singer) {
        result = singer
      } else {
        const cached = loadSessionStorage(SINGER_KEY) as Singer
        if (cached && (cached.mid || String(cached.id)) === route.params.id) {
          result = cached
        }
      }
      return result
    })

    const pic = computed(() => computedData.value?.pic)

    const title = computed(() => (computedData.value?.name || computedData.value?.title))

    async function fetchData () {
      try {
        state.loading = true
        const res = await SingerServer.getSingerDetail({ mid: computedData.value?.mid as string })
        state.songs = await processSongs(res.songs)
        state.loading = false
      } catch (e) {}
    }

    onMounted(() => {
      if (!computedData.value) {
        const path = route.matched[0].path
        router.push({ path })
        return
      }
      fetchData()
    })

    return {
      ...toRefs(state),
      computedData,
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
