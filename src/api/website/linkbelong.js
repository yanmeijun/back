/**
 * 链接归属
 */
import apiRequest from '@/router/apiAxios';

// 链接归属列表
export const getLinkBelongList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteLinkBelong/listPageByDto`,
    method: 'post',
    data
  });
};

// 删除 修改
export const updateLinkBelongStatus = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteLinkBelong/updateByDto`,
    method: 'put',
    data
  });
};

// 新增
export const insertLinkBelong = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteLinkBelong/insertByDto`,
    method: 'post',
    data
  });
};
