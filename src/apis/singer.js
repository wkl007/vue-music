import request from '@/utils/request';

export default class SingerServer {
  static getSingerList() {
    return request.request({
      url: '/getSingerList',
      method: 'get',
    });
  }

  static getSingerDetail(params) {
    return request.request({
      url: '/getSingerDetail',
      method: 'get',
      params,
    });
  }
}
