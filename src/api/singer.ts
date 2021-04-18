import request from '@/utils/request'
import type { SingerDetailReq, SingerListResp } from '@/types/api/singer'
import type { AlbumResp } from '@/types/api/recommend'

export default class SingerServer {
  static getSingerList (): Promise<SingerListResp> {
    return request.request({
      url: '/getSingerList',
      method: 'get'
    })
  }

  static getSingerDetail (params: SingerDetailReq): Promise<AlbumResp> {
    return request.request({
      url: '/getSingerDetail',
      method: 'get',
      params
    })
  }
}
