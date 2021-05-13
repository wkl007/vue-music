import { save, remove, clear } from '@/utils/array-store'
import { SEARCH_KEY } from '@/utils/constants'
import { useStore } from 'vuex'
import * as types from '@/store/mutationTypes'
import { Song } from '@/types/api/recommend'

interface UseSearchHistory {
  saveSearch: (query: string) => void;
  deleteSearch: (query: string) => void;
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
