<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="item in songs"
        :key="item.id"
        @click="selectSong(item)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{ item.singer }}-{{ item.name }}
          </p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
import { Singer } from '@/types/api/singer'
import { Song } from '@/types/api/recommend'
import { processSongs } from '@/api/song'
import SearchServer from '@/api/search'
import { usePullUpLoad } from './use-pull-up-load'

interface State {
  singer: Singer | undefined;
  songs: Song[];
  hasMore: boolean;
  page: number;
  loadingText: string;
  noResultText: string;
  manualLoading: boolean;
}

export default defineComponent({
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup (props, { emit }) {
    const state = reactive<State>({
      singer: undefined,
      songs: [],
      hasMore: true,
      page: 1,
      loadingText: '',
      noResultText: '抱歉，暂无搜索结果',
      manualLoading: false
    })

    const loading = computed(() => !state.singer && !state.songs.length)
    const noResult = computed(() => !state.singer && !state.songs.length && !state.hasMore)
    const pullUpLoading = computed(() => isPullUpLoad.value && state.hasMore)
    const preventPullUpLoad = computed(() => loading.value || state.manualLoading)

    // hooks
    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad({ fetchData: searchMore, preventPullUpLoad })

    async function searchFirst (): Promise<void> {
      if (!props.query) return
      state.page = 1
      state.songs = []
      state.singer = undefined
      state.hasMore = true

      const { songs, singer, hasMore } = await SearchServer.search({
        query: props.query,
        page: state.page,
        showSinger: props.showSinger
      })
      state.songs = await processSongs(songs)
      state.singer = singer
      state.hasMore = hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore (): Promise<void> {
      if (!state.hasMore || !props.query) return
      state.page++
      const { songs, hasMore } = await SearchServer.search({
        query: props.query,
        page: state.page,
        showSinger: props.showSinger
      })
      state.songs = state.songs.concat(await processSongs(songs))
      state.hasMore = hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable (): Promise<void> {
      if (scroll.value && scroll.value.maxScrollY >= -1) {
        state.manualLoading = true
        await searchMore()
        state.manualLoading = false
      }
    }

    function selectSinger (singer: Singer): void {
      emit('select-singer', singer)
    }

    function selectSong (song: Song): void {
      emit('select-song', song)
    }

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) return
        await searchFirst()
      }
    )

    return {
      ...toRefs(state),
      loading,
      noResult,
      pullUpLoading,
      preventPullUpLoad,
      isPullUpLoad,
      rootRef,
      scroll,

      selectSinger,
      selectSong
    }
  }
})
</script>

<style scoped lang="less">
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          color: @color-text-d;
          font-size: 14px;
        }
      }

      .name {
        flex: 1;
        overflow: hidden;
        color: @color-text-d;
        font-size: @font-size-medium;

        .text {
          .text-overflow-hidden();
        }
      }
    }
  }
}
</style>
