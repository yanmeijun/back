import apiRequest from '@/router/apiAxios';
/**
 * 账号池
 * @param {*} param0
 */
// 获取-账号池列表
export const getPoolList = ({ Others: params, ...data }) => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/list',
    method: 'post',
    params,
    data,
    isList: true
  });
};

// 获取-根据唯一标识获取账号信息
export const getByUniqueCode = params => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/getByUniqueCode',
    method: 'get',
    params
  });
};

// 获取- 编辑账号-回显
export const getAccountInfo = params => {
  return apiRequest({
    url: `/newmedia-back/mediaAccountPool/${params.id}`,
    method: 'get',
    params: {}
  });
};

// 获取- 编辑账号-提交修改
export const putAccountInfo = data => {
  return apiRequest({
    url: `/newmedia-back/mediaAccountPool/update`,
    method: 'put',
    data
  });
};

// 导出
export const exportAccountList = params => {
  return apiRequest({
    url: `/newmedia-back/mediaAccountPool/export`,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  });
};

// 模糊查询账号--
export const getAccountList = params => {
  return apiRequest({
    url: `/cloud-common/customInfo/listByCustCode`,
    method: 'get',
    params,
    isList: true
  });
};

// 根据填报单位查询新媒体账号列表
export const getAccountListByCustId = params => {
  return apiRequest({
    url: `/newmedia-back/mediaAccountPool/listByCustId`,
    method: 'get',
    params,
    isList: true
  });
};

// 新媒体账号列表 - 详情
export const getPoolDetailList = params => {
  return apiRequest({
    url: `/newmedia-back/mediaAccountPool/getMediaArticleByUniqueCode`,
    method: 'get',
    params,
    isList: true
  });
};
