<template>
  <div class="recommend">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider
              v-if="state.sliders.length"
              :sliders="state.sliders"
            />
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              class="item"
              v-for="item in state.albums"
              :key="item.id"
            >
              <div class="icon">
                <img
                  width="60"
                  height="60"
                  v-lazy="item.pic"
                  alt=""
                >
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { Slider, Scroll } from '@/components'
import type { RecommendResp } from '@/types/api/recommend'
import RecommendServer from '@/api/recommend'

export default defineComponent({
  name: 'Recommend',
  components: {
    Slider,
    Scroll
  },
  setup () {
    const state = reactive<RecommendResp>({
      sliders: [],
      albums: []
    })

    async function fetchData () {
      const { sliders, albums } = await RecommendServer.getRecommend()
      state.sliders = sliders
      state.albums = albums
    }

    onMounted(() => {
      fetchData()
    })

    return {
      state
    }
  }
})
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
        padding: 0 20px 20px 20px;

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
