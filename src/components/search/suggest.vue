<template>
  <div
    ref="rootRef"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
    class="suggest">
    <ul class="suggest-list">
      <li v-if="singer" class="suggest-item" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        v-for="item in songs"
        :key="item.id"
        class="suggest-item"
        @click="selectSong(item)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ item.singer }}-{{ item.name }}</p>
        </div>
      </li>
      <li v-loading:[loadingText]="pullUpLoading" class="suggest-item"></li>
    </ul>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  toRefs,
  watch,
} from 'vue';
import { processSongs } from '@/apis/song';
import SearchServer from '@/apis/search';
import { usePullUpLoad } from './use-pull-up-load.js';

export default defineComponent({
  name: 'Suggest',
  props: {
    /** 搜素参数 */
    query: {
      type: String,
      default: '',
    },
    /** 显示歌手 */
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const state = reactive({
      singer: undefined,
      songs: [],
      hasMore: true,
      page: 1,
      loadingText: '',
      noResultText: '抱歉，暂无搜索结果',
      manualLoading: false,
    });

    const loading = computed(() => !state.singer && !state.songs.length);
    const noResult = computed(
      () => !state.singer && !state.songs.length && !state.hasMore,
    );
    const pullUpLoading = computed(() => isPullUpLoad.value && state.hasMore);
    const preventPullUpLoad = computed(
      () => loading.value || state.manualLoading,
    );

    // hooks
    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad({
      fetchData: searchMore,
      preventPullUpLoad,
    });

    /** 首次请求 */
    async function searchFirst() {
      if (!props.query) return;
      state.page = 1;
      state.songs = [];
      state.singer = undefined;
      state.hasMore = true;

      const { songs, singer, hasMore } = await SearchServer.search({
        query: props.query,
        page: state.page,
        showSinger: props.showSinger,
      });
      state.songs = await processSongs(songs);
      state.singer = singer;
      state.hasMore = hasMore;
      await nextTick();
      await makeItScrollable();
    }

    /** 请求更多 */
    async function searchMore() {
      if (!state.hasMore || !props.query) return;
      state.page++;
      const { songs, hasMore } = await SearchServer.search({
        query: props.query,
        page: state.page,
        showSinger: props.showSinger,
      });
      state.songs = state.songs.concat(await processSongs(songs));
      state.hasMore = hasMore;
      await nextTick();
      await makeItScrollable();
    }

    /** 手动控制加载 */
    async function makeItScrollable() {
      if (scroll.value && scroll.value.maxScrollY >= -1) {
        state.manualLoading = true;
        await searchMore();
        state.manualLoading = false;
      }
    }

    /** 选择歌手 */
    function selectSinger(singer) {
      emit('select-singer', singer);
    }

    /** 选择歌曲 */
    function selectSong(song) {
      emit('select-song', song);
    }

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) return;
        await searchFirst();
      },
    );

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
      selectSong,
    };
  },
});
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

        [class^='icon-'] {
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
