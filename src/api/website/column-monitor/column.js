import apiRequest from '@/router/apiAxios';
// 栏目监测-修改
export const update = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteChannelPoint/update',
    method: 'put',
    data
  });
};

// 栏目监测-添加
export const insertRetByDto = data => {
  return apiRequest({
    url: '/cloud-website-back//websiteChannelPoint/insert',
    method: 'post',
    data
  });
};
