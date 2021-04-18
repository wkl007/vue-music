import request from '@/utils/request'
import type { TopListResp } from '@/types/api/top'
import type { SingerDetailReq } from '@/types/api/singer'
import type { AlbumResp } from '@/types/api/recommend'

export default class TopServer {
  static getTopList (): Promise<TopListResp> {
    return request.request({
      url: '/getTopList',
      method: 'get'
    })
  }

  static getTopDetail (params: SingerDetailReq): Promise<AlbumResp> {
    return request.request({
      url: '/getTopDetail',
      method: 'get',
      params
    })
  }
}
