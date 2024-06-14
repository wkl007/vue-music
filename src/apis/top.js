import request from '@/utils/request';

export default class TopServer {
  static getTopList() {
    return request.request({
      url: '/getTopList',
      method: 'get',
    });
  }

  static getTopDetail(params) {
    return request.request({
      url: '/getTopDetail',
      method: 'get',
      params,
    });
  }
}
