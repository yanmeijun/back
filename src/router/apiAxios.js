import to from 'await-to-js';
import { Loading } from 'element-ui';
import request from '@/router/axios';

// const apiRequest = async ({ url, method = 'get', data, isList, isParams }) => {

let loading;
let loadingNum = 0;

function startLoading() {
  if (loadingNum === 0) {
    loading = Loading.service({
      lock: true,
      customClass: 'all-loading',
      text: '',
      spinner: '',
      background: 'rgba(255,255,255,.1)'
    });
  }
  //请求数量加1
  loadingNum++;
}
function endLoading() {
  //请求数量减1
  loadingNum--;
  if (loadingNum <= 0 && loading) {
    loading.close();
  }
}

/**
 * @name 根据request再次封装 ------ 永远正确值
 * @param url {url} 请求地址
 * @param method {method} 请求方式 get|post|put|delete
 * @param data {data} 请求参数
 * @param isList {isList} 返回值是否是数组结构数据【】
 * @param needLoading {needLoading} 是否需要全局loading default: true
 */
const apiRequest = async ({
  url,
  method = 'get',
  data = {},
  params = {},
  isList,
  isHits,
  needLoading = true,
  ...args
}) => {
  // let params = data;
  // let methods = ['post', 'put', 'patch'];
  let resData = {
    data: {},
    msg: '',
    code: 0
  };

  needLoading && startLoading();
  let [err, res] = await to(
    request({
      url,
      method,
      data,
      params,
      ...args
    })
  );
  endLoading();
  if (
    res &&
    res.data &&
    typeof res.data.code === 'string' &&
    res.data.code.length === 1
  ) {
    res.data.code = parseInt(res.data.code);
  }
  if (isList) {
    resData.data = [];
    resData.total = 0;
  }
  // 请求错误
  if (err) {
    resData.code = err.code;
    resData.msg = err.message;
    return resData;
  }
  let all = res.data;
  if (all instanceof ArrayBuffer) {
    // 下载-----------接口
    const fileName =
      res.headers['content-disposition'] &&
      res.headers['content-disposition'].match(/filename=(.*)/)[1];
    console.log(fileName);
    const blob = new Blob([all], { type: 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
      window.navigator.msSaveBlob(blob, decodeURI(fileName));
    } else {
      console.log(res.headers['content-type']);
      if (
        res.headers['content-type'] ===
          'application/octet-stream;charset=utf-8' ||
        res.headers['content-type'] === 'application/octet-stream' ||
        res.headers['content-type'] === 'APPLICATION/OCTET-STREAM' ||
        res.headers['content-type'] === 'application/.ms-excel;charset=utf-8' ||
        res.headers['content-type'] ===
          'application/x-download; charset=utf-8' ||
        res.headers['content-type'] ===
          'APPLICATION/OCTET-STREAM; charset=utf-8'
      ) {
        let url = window.URL.createObjectURL(blob);
        let down = document.createElement('a');
        // down.download = decodeURI(fileName);
        down.download = decodeURIComponent(escape(fileName));
        down.href = `${url}`;
        down.style.display = 'none';
        // 兼容：某些浏览器不支持HTML5的download属性
        if (typeof down.download === 'undefined') {
          down.setAttribute('target', '_blank');
        }
        // 触发点击
        document.body.appendChild(down);
        down.click();
        // 然后移除
        document.body.removeChild(down);
        // 释放blob URL地址
        window.URL.revokeObjectURL(url);
      } else {
        resData = {
          data: {},
          msg: '导出失败！',
          code: 1
        };
      }
    }
    return resData;
  }

  if (isList) {
    let records = [];
    let total = 0;
    if (isHits) {
      records = all.data.searchHits || [];
      total = all.data.totalHits || 0;
    } else {
      records = all.data.records || [];
      total = all.data.total || 0;
    }
    let { code = 0, msg = '' } = all;
    if (Array.isArray(all.data)) {
      resData.data = all.data;
    } else {
      resData.data = records;
    }
    resData.total = total;
    resData.msg = msg;
    resData.code = code;
  } else {
    if (
      (!all.data || all.data === 'null') &&
      typeof all.data !== 'number' &&
      typeof all.data !== 'boolean'
    ) {
      all.data = {};
    }
    resData = all;
  }
  // 正常请求
  return resData;
};

export default apiRequest;
