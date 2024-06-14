import { createLogger, createStore } from 'vuex';
import { isDev } from '@/utils/constants';
import state from './state.js';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations.js';

// 调试工具，开发环境使用，线上关闭
const debug = isDev;

const store = createStore({
  state,
  mutations,
  getters,
  actions,
  plugins: debug ? [createLogger()] : [],
  strict: debug,
});

/**
 * vuex 配置
 * @param app
 */
export function setupStore(app) {
  app.use(store);
}

export default store;
