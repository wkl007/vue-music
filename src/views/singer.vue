<template>
  <div
    class="singer"
    v-loading="!singers.length"
  >
    <index-list
      :data="singers"
      @select="selectSinger"
    />
    <router-view v-slot="{Component}">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { IndexList } from '@/components'
import SingerServer from '@/api/singer'
import { SINGER_KEY } from '@/utils/constants'
import { saveSessionStorage } from '@/utils/cache'
import type { Singer, Singers } from '@/types/api/singer'

interface State {
  singers: Singers[];
  selectedSinger: Singer | undefined;
}

export default defineComponent({
  name: 'Singer',
  components: {
    IndexList
  },
  setup () {
    const router = useRouter()
    const state = reactive<State>({
      singers: [],
      selectedSinger: undefined
    })

    /** 获取数据 */
    async function fetchData (): Promise<void> {
      const { singers } = await SingerServer.getSingerList()
      state.singers = singers
    }

    /** 选择歌手 */
    function selectSinger (singer: Singer): void {
      state.selectedSinger = singer
      cacheSinger(singer)
      router.push({
        path: `/singer/${singer.mid}`
      })
    }

    /** 缓存歌手 */
    function cacheSinger (singer: Singer): void {
      saveSessionStorage(SINGER_KEY, singer)
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),

      selectSinger
    }
  }
})
</script>

<style scoped lang="less">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
