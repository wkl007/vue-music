const { VUE_APP_API_URL } = process.env

export const NODE_ENV: string = process.env.NODE_ENV // 环境变量

export const API_URL: string = VUE_APP_API_URL // 接口 url

export const SINGER_KEY = '__singer__'

export const FAVORITE_KEY = '__favorite__'

export const ALBUM_KEY = '__album__'

export const TOP_KEY = '__top__'

export const SEARCH_KEY = '__search__'

export const PLAY_KEY = '__play__'

export enum PlayMode {
  /** 顺序播放 */
  SEQUENCE,
  /** 循环播放 */
  LOOP,
  /** 随机播放 */
  RANDOM
}
