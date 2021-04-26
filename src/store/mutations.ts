import type { State } from '@/types/store'
import { PlayMode } from '@/utils/constants'
import * as types from './mutationTypes'

const mutations = {
  [types.SET_PLAYING] (state: State, playing: boolean): void {
    state.playing = playing
  },
  [types.SET_SEQUENCE_LIST] (state: State, sequenceList: any[]): void {
    state.sequenceList = sequenceList
  },
  [types.SET_PLAY_LIST] (state: State, playList: any[]): void {
    state.playList = playList
  },
  [types.SET_PLAY_MODE] (state: State, playMode: PlayMode): void {
    state.playMode = playMode
  },
  [types.SET_CURRENT_INDEX] (state: State, currentIndex: number): void {
    state.currentIndex = currentIndex
  },
  [types.SET_FULL_SCREEN] (state: State, fullScreen: boolean): void {
    state.fullScreen = fullScreen
  },
  [types.SET_FAVORITE_LIST] (state: State, favoriteList: any[]): void {
    state.favoriteList = favoriteList
  }
}

export default mutations
