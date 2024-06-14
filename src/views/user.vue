<template>
  <div v-no-result:[noResultText]="noResult" class="user">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches v-model="currentIndex" :items="['我喜欢的', '最近播放']" />
    </div>
    <div v-if="currentList.length" class="play-btn" @click="random">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <scroll v-if="currentIndex === 0" class="list-scroll">
        <div class="list-inner">
          <song-list :songs="favoriteList" @select="selectSong" />
        </div>
      </scroll>
      <scroll v-if="currentIndex === 1" class="list-scroll">
        <div class="list-inner">
          <song-list :songs="playHistory" @select="selectSong" />
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Scroll, SongList, Switches } from '@/components/index.js';

export default defineComponent({
  name: 'User',
  components: {
    Switches,
    Scroll,
    SongList,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      currentIndex: 0,
    });

    const favoriteList = computed(() => store.state.favoriteList);
    const playHistory = computed(() => store.state.playHistory);

    const noResult = computed(() =>
      state.currentIndex === 0
        ? !favoriteList.value.length
        : !playHistory.value.length,
    );
    const noResultText = computed(() =>
      state.currentIndex === 0 ? '暂无收藏歌曲' : '您还没有听过歌曲',
    );
    const currentList = computed(() =>
      state.currentIndex === 0 ? favoriteList.value : playHistory.value,
    );

    /** 返回上一页 */
    function back() {
      router.back();
    }

    /** 选中歌曲 */
    function selectSong({ song }) {
      store.dispatch('addSong', song);
    }

    /** 随机播放 */
    function random() {
      store.dispatch('randomPlay', currentList.value);
    }

    return {
      ...toRefs(state),
      noResult,
      noResultText,
      currentList,
      favoriteList,
      playHistory,

      back,
      selectSong,
      random,
    };
  },
});
</script>

<style scoped lang="less">
.user {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: @color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      color: @color-theme;
      font-size: @font-size-large-x;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    margin: 0 auto;
    padding: 7px 0;
    color: @color-text-l;
    font-size: 0;
    text-align: center;
    border: 1px solid @color-text-l;
    border-radius: 100px;

    .icon-play {
      display: inline-block;
      margin-right: 6px;
      font-size: @font-size-medium-x;
      vertical-align: middle;
    }

    .text {
      display: inline-block;
      font-size: @font-size-small;
      vertical-align: middle;
    }
  }

  .list-wrapper {
    position: absolute;
    top: 110px;
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
}
</style>
