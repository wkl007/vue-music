<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        class="search-item"
        v-for="item in searches"
        :key="item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span
          class="icon"
          v-if="showDelete"
          @click.stop="deleteItem(item)"
        >
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Song } from '@/types/api/recommend'

export default defineComponent({
  name: 'SearchList',
  props: {
    searches: {
      type: Array as PropType<Song[]>,
      default: () => []
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select', 'delete'],
  setup (props, { emit }) {
    function selectItem (song: Song): void {
      emit('select', song)
    }

    function deleteItem (song: Song): void {
      emit('delete', song)
    }

    return {
      selectItem,
      deleteItem
    }
  }
})
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
