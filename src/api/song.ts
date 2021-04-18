import request from '@/utils/request'
import type { SingerDetailReq } from '@/types/api/singer'
import type { LyricResp, SongUrlResp } from '@/types/api/song'

export default class SongServer {
  static getSongUrl (params: SingerDetailReq): Promise<SongUrlResp> {
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
