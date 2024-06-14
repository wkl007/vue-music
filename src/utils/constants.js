const { VITE_API_URL } = import.meta.env;

export const isDev = import.meta.env.DEV;

export const isProd = import.meta.env.PROD;

export const API_URL = VITE_API_URL; // 接口 url

export const SINGER_KEY = '__singer__';

export const FAVORITE_KEY = '__favorite__';

export const ALBUM_KEY = '__album__';

export const TOP_KEY = '__top__';

export const SEARCH_KEY = '__search__';

export const PLAY_KEY = '__play__';

export const PlayMode = {
  /** 顺序播放 */
  SEQUENCE: 1,
  /** 循环播放 */
  LOOP: 2,
  /** 随机播放 */
  RANDOM: 3,
};
