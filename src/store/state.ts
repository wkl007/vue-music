import type { State } from '@/types/store'
import type { Song } from '@/types/api/recommend'
import { FAVORITE_KEY, PlayMode } from '@/utils/constants'
import { loadStorage } from '@/utils/cache'

const state: State = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PlayMode.SEQUENCE,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: loadStorage(FAVORITE_KEY, []) as Song[]
}

export default state
