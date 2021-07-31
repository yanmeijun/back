import apiRequest from '@/router/apiAxios';
// 下载Excel
export const getFile = ({ url }) => {
  return apiRequest({
    url,
    method: 'get',
    responseType: 'arraybuffer'
  });
};

// 导入Excel
export const importFile = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/addChannelPoint',
    method: 'get',
    params
  });
};
