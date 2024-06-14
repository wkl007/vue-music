import {
  FAVORITE_KEY,
  PLAY_KEY,
  PlayMode,
  SEARCH_KEY,
} from '@/utils/constants';
import { loadStorage } from '@/utils/cache';

const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PlayMode.SEQUENCE,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: loadStorage(FAVORITE_KEY, []),
  searchHistory: loadStorage(SEARCH_KEY, []),
  playHistory: loadStorage(PLAY_KEY, []),
};

export default state;
