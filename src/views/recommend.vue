<template>
  <div v-loading="loading" class="recommend">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders" />
          </div>
        </div>
        <div class="recommend-list">
          <h1 v-show="!loading" class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              :key="item.id"
              class="item"
              @click="selectAlbum(item)">
              <div class="icon">
                <img v-lazy="item.pic" width="60" height="60" alt="" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { Scroll, Slider } from '@/components/index.js';
import { ALBUM_KEY } from '@/utils/constants';
import { saveSessionStorage } from '@/utils/cache';
import RecommendServer from '@/apis/recommend';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Recommend',
  components: {
    Slider,
    Scroll,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      sliders: [],
      albums: [],
      selectedAlbum: undefined,
    });

    const loading = computed(
      () => !state.sliders.length && !state.albums.length,
    );

    /** 获取数据 */
    async function fetchData() {
      const { sliders, albums } = await RecommendServer.getRecommend();
      state.sliders = sliders;
      state.albums = albums;
    }

    /** 选择专辑 */
    function selectAlbum(album) {
      state.selectedAlbum = album;
      cacheAlbum(album);
      router.push({
        path: `/recommend/${album.id}`,
      });
    }

    /** 缓存专辑 */
    function cacheAlbum(album) {
      saveSessionStorage(ALBUM_KEY, album);
    }

    onMounted(() => {
      fetchData();
    });

    return {
      ...toRefs(state),
      loading,

      selectAlbum,
    };
  },
});
</script>

<style scoped lang="less">
.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: scroll;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        color: @color-theme;
        font-size: @font-size-medium;
        line-height: 65px;
        text-align: center;
      }

      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          font-size: @font-size-medium;
          line-height: 20px;
        }

        .name {
          margin-bottom: 10px;
          color: @color-text;
        }

        .title {
          color: @color-text-d;
        }
      }
    }
  }
}
</style>
