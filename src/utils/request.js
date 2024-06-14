import axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_URL } from '@/utils/constants';

axiosRetry(axios, { retries: 5 });

const request = axios.create({
  baseURL: API_URL,
  timeout: 6000,
});

// http请求拦截器
request.interceptors.request.use(requestHandler, errorHandler);

// http响应拦截器
request.interceptors.response.use(responseHandler, errorHandler);

/**
 * 请求拦截方法
 * @param config
 */
function requestHandler(config) {
  return config;
}

/**
 * 响应拦截方法
 * @param response
 */
function responseHandler(response) {
  const { code, result } = response.data;
  if (code === 0) {
    return result;
  } else {
    return response.data;
  }
}

/**
 * 异常处理方法
 * @param err
 */
function errorHandler(err) {
  return Promise.reject(err);
}

export default request;
