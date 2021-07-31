import apiRequest from '@/router/apiAxios';

// 辅助/公用类接口
// 获取-组织单位树
export const getCustomerTree = (params = {}) => {
  return apiRequest({
    url: '/cloud-common/customInfo/getCustomInfoTree',
    method: 'get',
    params,
    isList: true,
    needLoading: false
  });
};
// 获取-客户组织单位树
export const getCustomInfoByOrg = (params = {}) => {
  return apiRequest({
    url: '/cloud-common/customInfo/getCustomInfoByOrg',
    method: 'get',
    params
  });
};
// 提交-添加任务和客户关系列表
export const postInsertTaskCustomRelation = (data = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/insertTaskCustomRelation',
    method: 'post',
    data
  });
};

// 编辑任务+查询任务+客户关系列表
export const getTaskCustomRelation = (params = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/getTaskCustomRelation',
    method: 'get',
    params
  });
};

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
    url: '/newmedia-back/mediaAccountPool/addNewMediaAccount',
    method: 'get',
    params
  });
};
