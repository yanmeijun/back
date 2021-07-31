import apiRequest from '@/router/apiAxios';

// 辅助/公用类接口
// 写入./common.js

// 栏目监测列表
export const getColumnList = ({ Others: params, ...data }) => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/page',
    method: 'post',
    data,
    isList: true
  });
};

//是否连通
export const connentResultApi = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/updateConnectResult',
    method: 'put',
    params
  });
};

//是否渲染
export const updateIsRenderApi = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/updateIsRender',
    method: 'put',
    params
  });
};

//删除
export const updateStatusApi = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/updateStatus',
    method: 'put',
    params
  });
};

//网站标识码
export const listBySiteCodeApi = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteAccountPool/listBySiteCode',
    method: 'get',
    params
  });
};

//检验栏目地址是否存在
export const checkChannelAddressApi = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/checkChannelAddress',
    method: 'get',
    params
  });
};

//根据网站编码查询在库中是否存在
export const checkSiteCodeApi = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteAccountPool/checkWebsiteAccount',
    method: 'post',
    data
  });
};
