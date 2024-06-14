import { computed, onMounted, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MusicList } from '@/components/index.js';
import { processSongs } from '@/apis/song';
import { loadSessionStorage } from '@/utils/cache';

export function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      /** 歌手信息 */
      data: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const state = reactive({
        songs: [],
        loading: true,
      });

      const computedData = computed(() => {
        let result = null;
        const data = props.data;
        if (data) {
          result = data;
        } else {
          const cached = loadSessionStorage(key);
          if (cached && (cached.mid || String(cached.id)) === route.params.id) {
            result = cached;
          }
        }
        return result;
      });

      const pic = computed(() => computedData.value?.pic);

      const title = computed(
        () => computedData.value?.name || computedData.value?.title,
      );

      /** 获取数据 */
      async function fetchData() {
        try {
          state.loading = true;
          const res = await fetch(
            name === 'Album' || name === 'TopDetail'
              ? { id: computedData.value?.id }
              : { mid: computedData.value?.mid },
          );
          state.songs = await processSongs(res.songs);
          state.loading = false;
        } catch (e) {}
      }

      onMounted(async () => {
        if (!computedData.value) {
          const path = route.matched[0].path;
          await router.push({ path });
          return;
        }
        await fetchData();
      });

      return {
        ...toRefs(state),
        computedData,
        pic,
        title,
      };
    },
  };
}
