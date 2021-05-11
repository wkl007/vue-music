import { computed, onMounted, PropType, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MusicList } from '@/components'
import type { Singer } from '@/types/api/singer'
import type { Album, AlbumResp, Song } from '@/types/api/recommend'
import { processSongs } from '@/api/song'
import { loadSessionStorage } from '@/utils/cache'

interface State {
  songs: Song[];
  loading: boolean;
}

export function createDetailComponent (name: string, key: string, fetch: (params: any) => Promise<AlbumResp>): any {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: {
        type: Object as PropType<Singer>,
        default: () => {}
      }
    },
    setup (props: any) {
      const route = useRoute()
      const router = useRouter()
      const state = reactive<State>({
        songs: [],
        loading: true
      })

      const computedData = computed(() => {
        let result = null
        const data = props.data
        if (data) {
          result = data
        } else {
          const cached = loadSessionStorage(key) as Singer | Album
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
          const res = await fetch((name === 'Album' || name === 'TopDetail') ? { id: computedData.value?.id } : { mid: computedData.value?.mid })
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
  }
}
