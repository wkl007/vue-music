<template>
  <div
    class="singer"
    v-loading="!singers.length"
  >
    <index-list
      :data="singers"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { IndexList } from '@/components'
import SingerServer from '@/api/singer'
import { SINGER_KEY } from '@/utils/constants'
import { saveSessionStorage } from '@/utils/cache'
import type { Singer } from '@/types/api/singer'

interface State {
  singers: Singer[];
  selectedSinger: Singer | undefined;
}

export default defineComponent({
  name: 'Singer',
  components: {
    IndexList
  },
  setup () {
    const state = reactive<State>({
      singers: [],
      selectedSinger: undefined
    })

    async function fetchData (): Promise<void> {
      const { singers } = await SingerServer.getSingerList()
      state.singers = singers
    }

    function selectSinger (singer: Singer): void {
      state.selectedSinger = singer
      cacheSinger(singer)
    }

    function cacheSinger (singer: Singer): void {
      saveSessionStorage(SINGER_KEY, singer)
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state)
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
