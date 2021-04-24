import request from '@/utils/request'
import type { SingerDetailReq } from '@/types/api/singer'
import type { LyricResp, SongUrlReq, SongUrlResp } from '@/types/api/song'
import type { Song } from '@/types/api/recommend'

export default class SongServer {
  static getSongUrl (params: SongUrlReq): Promise<SongUrlResp> {
    return request.request({
      url: '/getSongsUrl',
      method: 'get',
      params
    })
  }

  static getLyric (params: SingerDetailReq): Promise<LyricResp> {
    return request.request({
      url: '/getLyric',
      method: 'get',
      params
    })
  }
}

/**
 * 处理获取歌曲地址
 * @param songs
 */
export function processSongs (songs: Song[]): Promise<Song[]> {
  if (!songs.length) return Promise.resolve(songs)
  return SongServer.getSongUrl({ mid: songs.map(song => song.mid) }).then(({ map }) => {
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => song.url?.indexOf('vkey') >= 0)
  })
}
