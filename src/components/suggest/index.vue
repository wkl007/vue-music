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
      <li class="suggest-item"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { Singer } from '@/types/api/singer'
import { Song } from '@/types/api/recommend'
import SearchServer from '@/api/search'

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
    // const pullUpLoading=computed(()=>)
    const preventPullUpLoad = computed(() => loading.value || state.manualLoading)

    return {
      ...toRefs(state),
      loading,
      noResult,
      preventPullUpLoad
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
