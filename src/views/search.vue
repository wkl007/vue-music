<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"/>
    </div>
    <scroll
      ref="scrollRef"
      class="search-content"
      v-show="!query"
    >
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div
          class="search-history"
          v-show="searchHistory.length"
        >
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          />
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
        </div>
      </div>
    </scroll>
    <div
      class="search-result"
      v-show="query"
    >
      <suggest
        :query="query"
        @select-singer="selectSinger"
        @select-song="selectSong"
      />
    </div>
    <router-view v-slot="{Component}">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { SearchInput, Scroll, Suggest, SearchList, Confirm } from '@/components'
import { useSearchHistory } from '@/components/search/use-search-history'
import SearchServer from '@/api/search'
import { SINGER_KEY } from '@/utils/constants'
import { saveSessionStorage } from '@/utils/cache'
import type { HotKey } from '@/types/api/search'
import type { Singer } from '@/types/api/singer'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Song } from '@/types/api/recommend'

interface State {
  /** 搜索参数 */
  query: string;
  /** 热门搜索 */
  hotKeys: HotKey[];
  /** 选中的歌手 */
  selectedSinger: Singer | undefined;
  /** scroll 实例 */
  scrollRef: BScrollConstructor | undefined;
  /** confirm 实例 */
  confirmRef: any;
}

export default defineComponent({
  name: 'Search',
  components: {
    SearchInput,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },
  setup () {
    const router = useRouter()
    const store = useStore()

    const state = reactive<State>({
      query: '',
      hotKeys: [],
      selectedSinger: undefined,
      scrollRef: undefined,
      confirmRef: document.createElement('div')
    })

    const searchHistory = computed(() => store.state.searchHistory)

    // hooks
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    /** 获取热门搜索 */
    async function fetchHotKeys () {
      try {
        const { hotKeys } = await SearchServer.getHotKeys()
        state.hotKeys = hotKeys
      } catch (e) {}
    }

    /** 添加搜索参数 */
    function addQuery (query: string): void {
      state.query = query.trim()
    }

    /** 选中歌手 */
    function selectSinger (singer: Singer): void {
      saveSearch(state.query)
      state.selectedSinger = singer
      cacheSinger(singer)

      router.push({
        path: `/search/${singer.mid}`
      })
    }

    /** 选中歌曲 */
    function selectSong (song: Song): void {
      saveSearch(state.query)
      store.dispatch('addSong', song)
    }

    /** 缓存歌手 */
    function cacheSinger (singer: Singer): void {
      saveSessionStorage(SINGER_KEY, singer)
    }

    /** 显示删除弹框 */
    function showConfirm (): void {
      state.confirmRef.show()
    }

    /** 强制刷新 */
    function refreshScroll (): void {
      state.scrollRef?.scroll.refresh()
    }

    onMounted(() => {
      fetchHotKeys()
    })

    watch(
      () => state.query,
      async (newQuery) => {
        if (newQuery) return
        await nextTick()
        refreshScroll()
      }
    )

    return {
      ...toRefs(state),
      searchHistory,

      addQuery,
      selectSinger,
      selectSong,
      showConfirm,
      deleteSearch,
      clearSearch
    }
  }
})
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
      margin: 0 20px 20px 20px;

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
