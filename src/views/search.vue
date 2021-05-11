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
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { SearchInput, Scroll, Suggest } from '@/components'
import SearchServer from '@/api/search'
import type { HotKey } from '@/types/api/search'
import { Singer } from '@/types/api/singer'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

interface State {
  query: string;
  hotKeys: HotKey[];
  selectedSinger: Singer | undefined;
  scrollRef: BScrollConstructor | undefined;
  confirmRef: any;
}

export default defineComponent({
  name: 'Search',
  components: {
    SearchInput,
    Scroll,
    Suggest
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

    async function fetchHotKeys () {
      try {
        const { hotKeys } = await SearchServer.getHotKeys()
        state.hotKeys = hotKeys
      } catch (e) {}
    }

    function addQuery (query: string): void {
      state.query = query
    }

    onMounted(() => {
      fetchHotKeys()
    })

    return {
      ...toRefs(state),
      searchHistory,

      addQuery
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
