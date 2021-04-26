import type { State } from '@/types/store'
import { PlayMode } from '@/utils/constants'

const state: State = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PlayMode.SEQUENCE,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: []
}

export default state
