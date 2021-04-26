import { CommitFunction } from '@/types/store'
import { PlayMode } from '@/utils/constants'
import * as types from './mutationTypes'
import { shuffle } from '@/utils'

/**
 * 顺序播放
 * @param commit
 * @param list
 * @param index
 */
export function selectPlay ({ commit }: CommitFunction, { list, index }: { list: any[], index: number }): void {
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
export function randomPlay ({ commit }: CommitFunction, { list }: { list: any[] }): void {
  commit(types.SET_PLAY_MODE, PlayMode.RANDOM)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
}
