import type { Commit } from 'vuex'
import { PlayMode } from '@/utils/constants'

export interface State {
  /** 歌曲列表 */
  sequenceList: any[];
  /** 播放列表 */
  playList: any[];
  /** 播放状态 */
  playing: boolean;
  /** 播放模式 */
  playMode: PlayMode;
  /** 当前播放歌曲索引 */
  currentIndex: number;
  /** 全屏状态 */
  fullScreen: boolean;
  /** 收藏列表 */
  favoriteList: any[];
}

export interface CommitFunction {
  commit: Commit
}

export interface CommitStateFunction extends CommitFunction {
  state: State
}
