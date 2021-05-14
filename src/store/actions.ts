import * as types from './mutationTypes'
import { PlayMode } from '@/utils/constants'
import { shuffle } from '@/utils'
import type { CommitFunction, CommitStateFunction, CommitStateGettersFunction } from '@/types/store'
import type { Song } from '@/types/api/recommend'

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
export function randomPlay ({ commit }: CommitFunction, list: Song[]): void {
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

/**
 * 添加歌曲
 * @param commit
 * @param state
 * @param song
 */
export function addSong ({ commit, state }: CommitStateFunction, song: Song): void {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playList, song)

  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

/**
 * 删除歌曲
 * @param commit
 * @param state
 * @param song
 */
export function removeSong ({ commit, state }: CommitStateFunction, song: Song): void {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) return

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playList.length) {
    commit(types.SET_PLAYING, false)
  }
}

/**
 * 清空歌曲
 * @param commit
 */
export function clearSongList ({ commit }: CommitFunction): void {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING, false)
}

function findIndex (list: Song[], song: Song): number {
  return list.findIndex(item => item.id === song.id)
}
