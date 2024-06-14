import * as types from './mutationTypes.js';

const mutations = {
  [types.SET_PLAYING](state, playing) {
    state.playing = playing;
  },
  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  [types.SET_PLAY_LIST](state, playList) {
    state.playList = playList;
  },
  [types.SET_PLAY_MODE](state, playMode) {
    state.playMode = playMode;
  },
  [types.SET_CURRENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex;
  },
  [types.SET_FULL_SCREEN](state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  [types.SET_FAVORITE_LIST](state, favoriteList) {
    state.favoriteList = favoriteList;
  },
  [types.ADD_SONG_LYRIC](state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) item.lyric = lyric;
      return item;
    });
  },
  [types.SET_SEARCH_HISTORY](state, searchHistory) {
    state.searchHistory = searchHistory;
  },
  [types.SET_PLAY_HISTORY](state, playHistory) {
    state.playHistory = playHistory;
  },
};

export default mutations;
