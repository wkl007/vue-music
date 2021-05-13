<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input
            v-model="query"
            placeholder="搜索歌曲"
          />
        </div>
        <div v-show="!query">
          <switches
            :items="['最近播放','搜索历史']"
            v-model="currentIndex"
          />
          <div class="list-wrapper">
            <scroll
              ref="scrollRef"
              class="list-scroll"
              v-if="currentIndex===0"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @select="selectSongBySongList"
                />
              </div>
            </scroll>
            <scroll
              ref="scrollRef"
              class="list-scroll"
              v-if="currentIndex===1"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                />
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          />
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

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '../search/search-input.vue'
import Suggest from '../search/suggest.vue'
import Scroll from '../base/scroll/index.vue'
import SongList from '../base/song-list/index.vue'
import SearchList from '../base/search-list/index.vue'
import Message from '../base/message/index.vue'
import Switches from '../base/switches/index.vue'
import { useSearchHistory } from '../search/use-search-history'
import { Song } from '@/types/api/recommend'

export default defineComponent({
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Scroll,
    SongList,
    SearchList,
    Message,
    Switches
  },
  setup () {
    const store = useStore()
    const state = reactive({
      visible: false,
      query: '',
      currentIndex: 0,
      scrollRef: document.createElement('div'),
      messageRef: document.createElement('div')
    })

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    // hooks
    const { saveSearch } = useSearchHistory()

    async function show () {
      state.visible = true
      await nextTick()
      refreshScroll()
    }

    function hide () {
      state.visible = false
    }

    function refreshScroll () {
      state.scrollRef.scroll.refresh()
    }

    function addQuery (query: string): void {
      state.query = query.trim()
    }

    function selectSongBySongList ({ song }: { song: Song }) {
      addSong(song)
    }

    function selectSongBySuggest (song: Song) {
      addSong(song)
      saveSearch(state.query)
    }

    function addSong (song: Song): void {
      store.dispatch('addSong', song)
      showMessage()
    }

    function showMessage (): void {
      state.messageRef.show()
    }

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
      playHistory,

      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest
    }
  }
})
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
