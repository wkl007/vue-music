<template>
  <div v-loading="!singers.length" class="singer">
    <index-list :data="singers" @select="selectSinger" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { IndexList } from '@/components/index.js';
import SingerServer from '@/apis/singer';
import { SINGER_KEY } from '@/utils/constants';
import { saveSessionStorage } from '@/utils/cache';

export default defineComponent({
  name: 'Singer',
  components: {
    IndexList,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      singers: [],
      selectedSinger: undefined,
    });

    /** 获取数据 */
    async function fetchData() {
      const { singers } = await SingerServer.getSingerList();
      state.singers = singers;
    }

    /** 选择歌手 */
    function selectSinger(singer) {
      state.selectedSinger = singer;
      cacheSinger(singer);
      router.push({
        path: `/singer/${singer.mid}`,
      });
    }

    /** 缓存歌手 */
    function cacheSinger(singer) {
      saveSessionStorage(SINGER_KEY, singer);
    }

    onMounted(() => {
      fetchData();
    });

    return {
      ...toRefs(state),

      selectSinger,
    };
  },
});
</script>

<style scoped lang="less">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
