import { useStore } from 'vuex';
import { clear, remove, save } from '@/utils/array-store';
import { SEARCH_KEY } from '@/utils/constants';
import * as types from '@/store/mutationTypes.js';

export function useSearchHistory() {
  const store = useStore();
  const maxLen = 200;

  function saveSearch(query) {
    const searchHistory = save(
      query,
      SEARCH_KEY,
      (item) => item === query,
      maxLen,
    );
    store.commit(types.SET_SEARCH_HISTORY, searchHistory);
  }

  function deleteSearch(query) {
    const searchHistory = remove(SEARCH_KEY, (item) => item === query);
    store.commit(types.SET_SEARCH_HISTORY, searchHistory);
  }

  function clearSearch() {
    const searchHistory = clear(SEARCH_KEY);
    store.commit(types.SET_SEARCH_HISTORY, searchHistory);
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  };
}
