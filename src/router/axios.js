/* eslint-disable */
import qs from 'qs';
import { serialize } from '@/util/util';
import { getStore } from '../util/store';
import NProgress from 'nprogress'; // progress bar
import errorCode from '@/const/errorCode';
import router from '@/router/router';
import { Message } from 'element-ui';
import 'nprogress/nprogress.css';
import store from '@/store'; // progress bar style

axios.defaults.timeout = 10 * 60 * 1000;
// 返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});

// HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    NProgress.start(); // start progress bar
    const isToken = (config.headers || {}).isToken === false;
    const met = ['post', 'put', 'patch'];
    let token = store.getters.access_token;
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token; // token
    }
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    // headers中配置serialize为true开启序列化
    if (
      met.indexOf(config.method.toLocaleLowerCase()) > -1 &&
      config.headers.serialize
    ) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }
    if (config.method.toLocaleLowerCase() === 'get') {
      // config.paramsSerializer = function(params) {
      //   return qs.stringify(params, { arrayFormat: 'repeat' });
      // };
      // config.params = qs.stringify(config.params, { arrayFormat: 'repeat' });
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axios.interceptors.response.use(
  res => {
    NProgress.done();
    const status = Number(res.status) || 200;
    const message = res.data.msg || errorCode[status] || errorCode['default'];
    if (status === 401) {
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' });
      });
      return;
    }

    if (status !== 200 || res.data.code === 1) {
      // Message({
      //   message: message,
      //   type: 'error'
      // });
      return Promise.reject({ message, code: status });
    }
    return res;
  },
  error => {
    NProgress.done();
    return Promise.reject({
      message: new Error(error),
      code: new Error(error)
    });
  }
);

export default axios;
