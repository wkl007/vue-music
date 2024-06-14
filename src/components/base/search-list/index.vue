<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        v-for="item in searches"
        :key="item"
        class="search-item"
        @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span v-if="showDelete" class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchList',
  props: {
    /** 搜索列表 */
    searches: {
      type: Array,
      default: () => [],
    },
    /** 显示删除图标 */
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select', 'delete'],
  setup(props, { emit }) {
    /** 选中某项 */
    function selectItem(song) {
      emit('select', song);
    }

    /** 删除某项 */
    function deleteItem(song) {
      emit('delete', song);
    }

    return {
      selectItem,
      deleteItem,
    };
  },
});
</script>

<style scoped lang="less">
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    .text {
      flex: 1;
      color: @color-text-l;
    }

    .icon {
      .extend-click();

      .icon-delete {
        color: @color-text-d;
        font-size: @font-size-small;
      }
    }
  }
}
</style>
