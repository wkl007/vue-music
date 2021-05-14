import { PlayMode } from '@/utils/constants'
import * as types from './mutationTypes'
import type { Song } from '@/types/api/recommend'
import type { State } from '@/types/store'

const mutations = {
  [types.SET_PLAYING] (state: State, playing: boolean): void {
    state.playing = playing
  },
  [types.SET_SEQUENCE_LIST] (state: State, sequenceList: Song[]): void {
    state.sequenceList = sequenceList
  },
  [types.SET_PLAY_LIST] (state: State, playList: Song[]): void {
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
  [types.SET_FAVORITE_LIST] (state: State, favoriteList: Song[]): void {
    state.favoriteList = favoriteList
  },
  [types.ADD_SONG_LYRIC] (state: State, { song, lyric }: { song: Song, lyric: string }): Song | void {
    state.sequenceList.map(item => {
      if (item.mid === song.mid) item.lyric = lyric
      return item
    })
  },
  [types.SET_SEARCH_HISTORY] (state: State, searchHistory: string[]): void {
    state.searchHistory = searchHistory
  },
  [types.SET_PLAY_HISTORY] (state: State, playHistory: Song[]): void {
    state.playHistory = playHistory
  }
}

export default mutations
