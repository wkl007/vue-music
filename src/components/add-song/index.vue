<template>
  <teleport to="body">
    <transition name="slide">
      <div v-show="visible" class="add-song">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <switches v-model="currentIndex" :items="['最近播放', '搜索历史']" />
          <div class="list-wrapper">
            <scroll
              v-if="currentIndex === 0"
              ref="scrollRef"
              class="list-scroll">
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @select="selectSongBySongList" />
              </div>
            </scroll>
            <scroll
              v-if="currentIndex === 1"
              ref="scrollRef"
              class="list-scroll">
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery" />
              </div>
            </scroll>
          </div>
        </div>
        <div v-show="query" class="search-result">
          <suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest" />
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
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
import { useStore } from 'vuex';
import SearchInput from '../search/search-input.vue';
import Suggest from '../search/suggest.vue';
import Scroll from '../base/scroll/index.vue';
import SongList from '../base/song-list/index.vue';
import SearchList from '../base/search-list/index.vue';
import Message from '../base/message/index.vue';
import Switches from '../base/switches/index.vue';
import { useSearchHistory } from '../search/use-search-history.js';

export default defineComponent({
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Scroll,
    SongList,
    SearchList,
    Message,
    Switches,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      visible: false,
      query: '',
      currentIndex: 0,
      scrollRef: undefined,
      messageRef: document.createElement('div'),
    });

    const searchHistory = computed(() => store.state.searchHistory);
    const playHistory = computed(() => store.state.playHistory);

    // hooks
    const { saveSearch } = useSearchHistory();

    /** 显示 */
    async function show() {
      state.visible = true;
      await nextTick();
      refreshScroll();
    }

    /** 隐藏 */
    function hide() {
      state.visible = false;
    }

    /** 强制刷新 */
    function refreshScroll() {
      state.scrollRef?.scroll.refresh();
    }

    /** 添加搜索参数 */
    function addQuery(query) {
      state.query = query.trim();
    }

    /** 歌曲列表点击 */
    function selectSongBySongList({ song }) {
      addSong(song);
    }

    /** 建议列表点击 */
    function selectSongBySuggest(song) {
      addSong(song);
      saveSearch(state.query);
    }

    /** 添加歌曲 */
    function addSong(song) {
      store.dispatch('addSong', song);
      showMessage();
    }

    /** 显示 message */
    function showMessage() {
      state.messageRef.show();
    }

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
      playHistory,

      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
    };
  },
});
</script>

<style scoped lang="less">
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 300;
  width: 100%;
  background: @color-background;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      color: @color-text;
      font-size: @font-size-large;
      line-height: 44px;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        color: @color-theme;
        font-size: 20px;
      }
    }
  }

  .search-input-wrapper {
    margin: 20px;
  }

  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  padding: 18px 0;
  font-size: 0;
  text-align: center;

  .icon-ok {
    margin-right: 4px;
    color: @color-theme;
    font-size: @font-size-medium;
  }

  .text {
    color: @color-text;
    font-size: @font-size-medium;
  }
}
</style>
