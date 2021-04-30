import type { CommitFunction, CommitStateGettersFunction } from '@/types/store'
import type { Song } from '@/types/api/recommend'
import { PlayMode } from '@/utils/constants'
import * as types from './mutationTypes'
import { shuffle } from '@/utils'

/**
 * 顺序播放
 * @param commit
 * @param list
 * @param index
 */
export function selectPlay ({ commit }: CommitFunction, { list, index }: { list: Song[], index: number }): void {
  commit(types.SET_PLAY_MODE, PlayMode.SEQUENCE)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
}

/**
 * 循环播放
 * @param commit
 * @param list
 */
export function randomPlay ({ commit }: CommitFunction, { list }: { list: Song[] }): void {
  commit(types.SET_PLAY_MODE, PlayMode.RANDOM)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
}

/**
 * 播放模式修改
 * @param commit
 * @param state
 * @param getters
 * @param mode
 */
export function changeMode ({ commit, state, getters }: CommitStateGettersFunction, mode: PlayMode): void {
  const currentId = getters.currentSong.id
  if (mode === PlayMode.RANDOM) {
    commit(types.SET_PLAY_LIST, shuffle(state.sequenceList))
  } else {
    commit(types.SET_PLAY_LIST, state.sequenceList)
  }
  const index = state.playList.findIndex(song => song.id === currentId)

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_MODE, mode)
}
