import apiRequest from '@/router/apiAxios';

// 获取-账号池列表
export const getPoolList = ({ ...data }) => {
  return apiRequest({
    url: '/cloud-website-back/websiteAccountPool/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 删除站点
export const deleteSite = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/updateStatus`,
    method: 'put',
    data
  });
};

// 更新网站是否渲染
export const updateIsFlag = params => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/updateIsFlag`,
    method: 'get',
    params
  });
};

// 查询关联客户
export const getAccountList = params => {
  return apiRequest({
    url: `/cloud-common/customInfo/listByCustCode`,
    method: 'get',
    params,
    isList: true
  });
};

// 根据网站ID查询网站详情
export const getWebsiteInfo = params => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/${params.id}`,
    method: 'get'
  });
};

// 创建网站标识码
export const createWebSiteCode = params => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/createWebSiteCode/${params.type}`,
    method: 'get'
  });
};

// 新增站点
export const addtWebsite = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/insertRetByDto`,
    method: 'post',
    data
  });
};

// 修改站点详情
export const updateWebsite = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/update`,
    method: 'put',
    data
  });
};

// export const downloadTemplate = params => {
//   return apiRequest({
//     url: `/cloud-website-back/websiteAccountPool/downloadTemplate`,
//     method: 'get',
//     params
//   });
// }
