import { computed } from 'vue';
import { useStore } from 'vuex';
import { remove, save } from '@/utils/array-store';
import { FAVORITE_KEY } from '@/utils/constants';
import * as types from '@/store/mutationTypes.js';

export function useFavorite() {
  const store = useStore();
  const favoriteList = computed(() => store.state.favoriteList);
  const maxLen = 100;

  /** 是否收藏 */
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => item.id === song.id) > -1;
  }

  /** 收藏图标 */
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
  }

  /** 收藏/取消收藏 */
  function toggleFavorite(song) {
    let list;
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare);
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen);
    }

    store.commit(types.SET_FAVORITE_LIST, list);

    function compare(item) {
      return item.id === song.id;
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
