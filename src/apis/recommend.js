import request from '@/utils/request';

export default class RecommendServer {
  // 获取推荐信息
  static getRecommend() {
    return request.request({
      url: '/getRecommend',
    });
  }

  // 获取专辑
  static getAlbum(params) {
    return request.request({
      url: '/getAlbum',
      params,
    });
  }
}
