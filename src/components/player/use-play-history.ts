import { useStore } from 'vuex'
import { PLAY_KEY } from '@/utils/constants'
import * as types from '@/store/mutationTypes'
import { Song } from '@/types/api/recommend'
import { save } from '@/utils/array-store'

interface UsePlayHistory {
  savePlay: (song: Song) => void;
}

export function usePlayHistory (): UsePlayHistory {
  const store = useStore()

  const maxLen = 200

  function savePlay (song: Song): void {
    const songs = save(song, PLAY_KEY, item => item.id === song.id, maxLen)
    store.commit(types.SET_PLAY_HISTORY, songs)
  }

  return {
    savePlay
  }
}
