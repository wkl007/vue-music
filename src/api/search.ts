import request from '@/utils/request'
import type { HotKeyResp, SearchReq, SearchResp } from '@/types/api/search'

export default class SearchServer {
  static getHotKeys (): Promise<HotKeyResp> {
    return request.request({
      url: '/getHotKeys',
      method: 'get'
    })
  }

  static search (params: SearchReq): Promise<SearchResp> {
    return request.request({
      url: '/search',
      method: 'get',
      params
    })
  }
}
