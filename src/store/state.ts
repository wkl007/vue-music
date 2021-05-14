import { FAVORITE_KEY, PLAY_KEY, PlayMode, SEARCH_KEY } from '@/utils/constants'
import { loadStorage } from '@/utils/cache'
import type { State } from '@/types/store'
import type { Song } from '@/types/api/recommend'

const state: State = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PlayMode.SEQUENCE,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: loadStorage(FAVORITE_KEY, []) as Song[],
  searchHistory: loadStorage(SEARCH_KEY, []) as string[],
  playHistory: loadStorage(PLAY_KEY, []) as Song[]
}

export default state
