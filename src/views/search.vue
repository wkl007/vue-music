<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query" />
    </div>
    <scroll v-show="!query" ref="scrollRef" class="search-content">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              v-for="item in hotKeys"
              :key="item.id"
              class="item"
              @click="addQuery(item.key)">
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div v-show="searchHistory.length" class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch" />
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch" />
        </div>
      </div>
    </scroll>
    <div v-show="query" class="search-result">
      <suggest
        :query="query"
        @select-singer="selectSinger"
        @select-song="selectSong" />
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  Confirm,
  Scroll,
  SearchInput,
  SearchList,
  Suggest,
} from '@/components/index.js';
import { useSearchHistory } from '@/components/search/use-search-history.js';
import SearchServer from '@/apis/search';
import { SINGER_KEY } from '@/utils/constants';
import { saveSessionStorage } from '@/utils/cache';

export default defineComponent({
  name: 'Search',
  components: {
    SearchInput,
    Scroll,
    Suggest,
    SearchList,
    Confirm,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      query: '',
      hotKeys: [],
      selectedSinger: undefined,
      scrollRef: undefined,
      confirmRef: document.createElement('div'),
    });

    const searchHistory = computed(() => store.state.searchHistory);

    // hooks
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();

    /** 获取热门搜索 */
    async function fetchHotKeys() {
      try {
        const { hotKeys } = await SearchServer.getHotKeys();
        state.hotKeys = hotKeys;
      } catch (e) {}
    }

    /** 添加搜索参数 */
    function addQuery(query) {
      state.query = query.trim();
    }

    /** 选中歌手 */
    function selectSinger(singer) {
      saveSearch(state.query);
      state.selectedSinger = singer;
      cacheSinger(singer);

      router.push({
        path: `/search/${singer.mid}`,
      });
    }

    /** 选中歌曲 */
    function selectSong(song) {
      saveSearch(state.query);
      store.dispatch('addSong', song);
    }

    /** 缓存歌手 */
    function cacheSinger(singer) {
      saveSessionStorage(SINGER_KEY, singer);
    }

    /** 显示删除弹框 */
    function showConfirm() {
      state.confirmRef.show();
    }

    /** 强制刷新 */
    function refreshScroll() {
      state.scrollRef?.scroll.refresh();
    }

    onMounted(() => {
      fetchHotKeys();
    });

    watch(
      () => state.query,
      async (newQuery) => {
        if (newQuery) return;
        await nextTick();
        refreshScroll();
      },
    );

    return {
      ...toRefs(state),
      searchHistory,

      addQuery,
      selectSinger,
      selectSong,
      showConfirm,
      deleteSearch,
      clearSearch,
    };
  },
});
</script>

<style scoped lang="less">
.search {
  position: fixed;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .hot-keys {
      margin: 0 20px 20px;

      .title {
        margin-bottom: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }

      .item {
        display: inline-block;
        margin: 0 20px 10px 0;
        padding: 5px 10px;
        color: @color-text-d;
        font-size: @font-size-medium;
        background: @color-highlight-background;
        border-radius: 6px;
      }
    }

    .search-history {
      position: relative;
      margin: 0 20px;

      .title {
        display: flex;
        align-items: center;
        height: 40px;
        color: @color-text-l;
        font-size: @font-size-medium;

        .text {
          flex: 1;
        }

        .clear {
          .extend-click();

          .icon-clear {
            color: @color-text-d;
            font-size: @font-size-medium;
          }
        }
      }
    }
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
