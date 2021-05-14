<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
      type="text"
    >
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clear"
    ></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface State {
  /** 输入框实例 */
  inputRef: HTMLInputElement;
  /** 搜索参数 */
  query: string;
}

export default defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索歌曲，歌手'
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const state = reactive<State>({
      inputRef: document.createElement('input'),
      query: props.modelValue
    })

    /** 清空 */
    function clear () {
      state.query = ''
    }

    watch(
      () => state.query,
      useDebounceFn((newQuery) => {
        emit('update:modelValue', newQuery.trim())
      }, 300)
    )

    watch(
      () => props.modelValue,
      (newModelValue) => {
        state.query = newModelValue
      }
    )

    return {
      ...toRefs(state),

      clear
    }
  }
})
</script>

<style scoped lang="less">
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 6px;
  background: @color-highlight-background;
  border-radius: 6px;

  .icon-search {
    color: @color-text-d;
    font-size: 24px;
  }

  .input-inner {
    flex: 1;
    margin: 0 5px;
    color: @color-text;
    font-size: @font-size-medium;
    line-height: 18px;
    background: @color-highlight-background;
    outline: 0;

    &::placeholder {
      color: @color-text-d;
    }
  }

  .icon-dismiss {
    color: @color-text-d;
    font-size: 16px;
  }
}
</style>
