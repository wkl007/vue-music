<template>
  <div class="tab">
    <router-link
      class="tab-item"
      v-for="item in tabList"
      :key="item.path"
      :to="item.path"
    >
      <span class="tab-link">
        {{ item.name }}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface TabItem {
  name: string;
  path: string;
}

const tabList: TabItem[] = [
  {
    name: '推荐',
    path: '/recommend'
  },
  {
    name: '歌手',
    path: '/singer'
  },
  {
    name: '排行',
    path: '/top-list'
  },
  {
    name: '搜索',
    path: '/search'
  }
]

export default defineComponent({
  name: 'VTab',
  setup () {
    return {
      tabList
    }
  }
})
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
