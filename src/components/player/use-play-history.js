import { useStore } from 'vuex';
import { PLAY_KEY } from '@/utils/constants';
import * as types from '@/store/mutationTypes.js';
import { save } from '@/utils/array-store';

export function usePlayHistory() {
  const store = useStore();

  const maxLen = 200;

  function savePlay(song) {
    const songs = save(song, PLAY_KEY, (item) => item.id === song.id, maxLen);
    store.commit(types.SET_PLAY_HISTORY, songs);
  }

  return {
    savePlay,
  };
}
