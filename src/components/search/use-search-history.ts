import { useStore } from 'vuex'
import { clear, remove, save } from '@/utils/array-store'
import { SEARCH_KEY } from '@/utils/constants'
import * as types from '@/store/mutationTypes'

interface UseSearchHistory {
  /** 保存搜索历史 */
  saveSearch: (query: string) => void;
  /** 删除搜索历史 */
  deleteSearch: (query: string) => void;
  /** 清空搜索历史 */
  clearSearch: () => void;
}

export function useSearchHistory (): UseSearchHistory {
  const store = useStore()
  const maxLen = 200

  function saveSearch (query: string): void {
    const searchHistory = save(query, SEARCH_KEY, item => item === query, maxLen)
    store.commit(types.SET_SEARCH_HISTORY, searchHistory)
  }

  function deleteSearch (query: string): void {
    const searchHistory = remove(SEARCH_KEY, item => item === query)
    store.commit(types.SET_SEARCH_HISTORY, searchHistory)
  }

  function clearSearch (): void {
    const searchHistory = clear(SEARCH_KEY)
    store.commit(types.SET_SEARCH_HISTORY, searchHistory)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
