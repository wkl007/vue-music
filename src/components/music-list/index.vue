<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div ref="bgImageRef" class="bg-image" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle" />
    </div>
    <scroll
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      class="list"
      :style="scrollStyle"
      :probe-type="3"
      @scroll="onScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem" />
      </div>
    </scroll>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Scroll from '../wrap-scroll/index.js';
import SongList from '../base/song-list/index.vue';

const RESERVED_HEIGHT = 40; // 顶部高度

export default defineComponent({
  name: 'MusicList',
  components: {
    Scroll,
    SongList,
  },
  props: {
    /** 歌曲列表 */
    songs: {
      type: Array,
      default: () => [],
    },
    /** 标题 */
    title: {
      type: String,
      default: '',
    },
    /** 头图 */
    pic: {
      type: String,
      default: '',
    },
    /** 加载状态 */
    loading: {
      type: Boolean,
      default: false,
    },
    /** 无歌曲文案 */
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲',
    },
    /** 是否排行榜 */
    rank: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
      bgImageRef: document.createElement('div'),
      noResult: computed(() => !props.loading && !props.songs.length),
    });
    const playList = computed(() => store.state.playList);

    /** 头图样式 */
    const bgImageStyle = computed(() => {
      const scrollY = state.scrollY;
      let zIndex = 0;
      let paddingTop = '70%';
      let height = '0';
      let translateZ = 0;

      if (scrollY > state.maxTranslateY) {
        zIndex = 10;
        paddingTop = 0;
        height = `${RESERVED_HEIGHT}px`;
        translateZ = 1;
      }

      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / state.imageHeight);
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${props.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
      };
    });

    /** 播放按钮样式 */
    const playBtnStyle = computed(() => {
      let display = '';
      if (state.scrollY >= state.maxTranslateY) display = 'none';
      return {
        display,
      };
    });

    /** 滚动组件样式 */
    const scrollStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '0';
      return {
        top: `${state.imageHeight}px`,
        bottom,
      };
    });

    /** 毛玻璃样式 */
    const filterStyle = computed(() => {
      let blur = 0;
      const scrollY = state.scrollY;
      const imageHeight = state.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(state.maxTranslateY / imageHeight, scrollY / imageHeight) *
          20;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    });

    /** 返回 */
    function goBack() {
      router.back();
    }

    /** 随机播放 */
    function random() {
      store.dispatch('randomPlay', { list: props.songs });
    }

    /** 监听滚动 */
    function onScroll(pos) {
      state.scrollY = -pos.y;
    }

    /** 歌曲选择 */
    function selectItem({ song, index }) {
      store.dispatch('selectPlay', { list: props.songs, index });
    }

    onMounted(() => {
      state.imageHeight = state.bgImageRef.clientHeight;
      state.maxTranslateY = state.imageHeight - RESERVED_HEIGHT;
    });

    return {
      ...toRefs(state),
      bgImageStyle,
      playBtnStyle,
      scrollStyle,
      filterStyle,

      goBack,
      onScroll,
      random,
      selectItem,
    };
  },
});
</script>

<style scoped lang="less">
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      color: @color-theme;
      font-size: @font-size-large-x;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 20;
    width: 80%;
    color: @color-text;
    font-size: @font-size-large;
    line-height: 40px;
    text-align: center;
    transform: translateZ(2px);
    .text-overflow-hidden();
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    transform-origin: top;

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        margin: 0 auto;
        padding: 7px 0;
        color: @color-theme;
        font-size: 0;
        text-align: center;
        border: 1px solid @color-theme;
        border-radius: 100px;
      }

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

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(7 17 27 / 40%);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    z-index: 0;
    width: 100%;

    .song-list-wrapper {
      padding: 20px 30px;
      background: @color-background;
    }
  }
}
</style>
