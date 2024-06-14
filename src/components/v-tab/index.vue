<template>
  <div class="tab">
    <router-link
      v-for="item in tabList"
      :key="item.path"
      class="tab-item"
      :to="item.path">
      <span class="tab-link">
        {{ item.name }}
      </span>
    </router-link>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

const tabList = [
  {
    name: '推荐',
    path: '/recommend',
  },
  {
    name: '歌手',
    path: '/singer',
  },
  {
    name: '排行',
    path: '/top-list',
  },
  {
    name: '搜索',
    path: '/search',
  },
];

export default defineComponent({
  name: 'VTab',
  setup() {
    return {
      tabList,
    };
  },
});
</script>

<style scoped lang="less">
.tab {
  display: flex;
  height: 44px;
  font-size: @font-size-medium;
  line-height: 44px;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: @color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: @color-theme;
        border-bottom: 2px solid @color-theme;
      }
    }
  }
}
</style>
