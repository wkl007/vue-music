import request from '@/utils/request'
import type { AlbumReq, AlbumResp, RecommendResp } from '@/types/api/recommend'

export default class RecommendServer {
  // 获取推荐信息
  static getRecommend (): Promise<RecommendResp> {
    return request.request({
      url: '/getRecommend'
    })
  }

  // 获取专辑
  static getAlbum (params: AlbumReq): Promise<AlbumResp> {
    return request.request({
      url: '/getAlbum',
      params
    })
  }
}
