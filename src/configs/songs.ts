import store from '@/store'
import { load, saveAll } from '@/utils/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/utils/constants'
import { processSongs } from '@/api/song'
import * as types from '@/store/mutationTypes'
import type { Song } from '@/types/api/recommend'

/**
 * 处理缓存歌曲链接
 * */
export function setupSongs (): void {
  const favoriteSongs = load<Song>(FAVORITE_KEY)
  if (favoriteSongs.length) {
    processSongs(favoriteSongs).then(songs => {
      store.commit(types.SET_FAVORITE_LIST, songs)
      saveAll(songs, FAVORITE_KEY)
    })
  }

  const historySongs = load<Song>(PLAY_KEY)
  if (historySongs.length) {
    processSongs(historySongs).then(songs => {
      store.commit(types.SET_PLAY_HISTORY, songs)
      saveAll(songs, PLAY_KEY)
    })
  }
}
