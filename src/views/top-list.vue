<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectTop(item)"
        >
          <div class="icon">
            <img
              width="100"
              height="100"
              v-lazy="item.pic"
              alt=""
            >
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song,index) in item.songList"
              :key="song.id"
            >
              <span>{{ index + 1 }}.</span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{Component}">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"/>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Scroll } from '@/components'
import { TOP_KEY } from '@/utils/constants'
import { saveSessionStorage } from '@/utils/cache'
import TopServer from '@/api/top'
import type { Top } from '@/types/api/top'

interface State {
  /** 排行榜列表 */
  topList: Top[];
  /** 选中的排行榜 */
  selectedTop: Top | undefined;
}

export default defineComponent({
  name: 'TopList',
  components: {
    Scroll
  },
  setup () {
    const router = useRouter()
    const state = reactive<State>({
      topList: [],
      selectedTop: undefined
    })

    const loading = computed(() => !state.topList.length)

    /** 获取数据 */
    async function fetchData () {
      const { topList } = await TopServer.getTopList()
      state.topList = topList
    }

    /** 选择排行榜 */
    function selectTop (top: Top): void {
      state.selectedTop = top
      cacheTop(top)
      router.push({
        path: `/top-list/${top.id}`
      })
    }

    /** 缓存排行榜 */
    function cacheTop (top: Top): void {
      saveSessionStorage(TOP_KEY, top)
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),
      loading,

      selectTop
    }
  }
})
</script>

<style scoped lang="less">
.top-list {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;

  .top-list-content {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      height: 100px;
      margin: 0 20px;
      padding-top: 20px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        height: 100px;
        padding: 0 20px;
        overflow: hidden;
        color: @color-text-d;
        font-size: @font-size-small;
        background: @color-highlight-background;

        .song {
          line-height: 26px;
          .text-overflow-hidden();
        }
      }
    }
  }
}
</style>
