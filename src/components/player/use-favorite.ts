import { computed } from 'vue'
import { useStore } from 'vuex'
import { remove, save } from '@/utils/array-store'
import { FAVORITE_KEY } from '@/utils/constants'
import type { Song } from '@/types/api/recommend'
import * as types from '@/store/mutationTypes'

interface UseFavorite {
  /** 收藏图标 */
  getFavoriteIcon: (song: Song) => string;
  /** 收藏/取消收藏 */
  toggleFavorite: (song: Song) => void;
}

export function useFavorite (): UseFavorite {
  const store = useStore()
  const favoriteList = computed<Song[]>(() => store.state.favoriteList)
  const maxLen = 100

  /** 是否收藏 */
  function isFavorite (song: Song): boolean {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }

  /** 收藏图标 */
  function getFavoriteIcon (song: Song): string {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  /** 收藏/取消收藏 */
  function toggleFavorite (song: Song): void {
    let list: Song[]
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }

    store.commit(types.SET_FAVORITE_LIST, list)

    function compare (item: Song) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
