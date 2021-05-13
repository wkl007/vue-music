import type { Commit } from 'vuex'
import type { Song } from '@/types/api/recommend'
import { PlayMode } from '@/utils/constants'

export interface State {
  /** 歌曲列表 */
  sequenceList: Song[];
  /** 播放列表 */
  playList: Song[];
  /** 播放状态 */
  playing: boolean;
  /** 播放模式 */
  playMode: PlayMode;
  /** 当前播放歌曲索引 */
  currentIndex: number;
  /** 全屏状态 */
  fullScreen: boolean;
  /** 收藏列表 */
  favoriteList: Song[];
  /** 搜索历史列表 */
  searchHistory: string[];
  /** 播放历史列表 */
  playHistory: Song[];
}

export interface Getters {
  currentSong: Song;
}

export interface CommitFunction {
  commit: Commit;
}

export interface CommitStateFunction extends CommitFunction {
  state: State;
}

export interface CommitStateGettersFunction extends CommitStateFunction {
  getters: Getters;
}
