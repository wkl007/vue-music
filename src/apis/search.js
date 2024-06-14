import request from '@/utils/request';

export default class SearchServer {
  static getHotKeys() {
    return request.request({
      url: '/getHotKeys',
      method: 'get',
    });
  }

  static search(params) {
    return request.request({
      url: '/search',
      method: 'get',
      params,
    });
  }
}
