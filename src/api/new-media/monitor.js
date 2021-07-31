import apiRequest from '@/router/apiAxios';

// 辅助/公用类接口
// 写入./common.js

// 监测状态

// export const getOrderList = ({ Others: params, ...data }) => {
//   return apiRequest({
//     url: '/cloud-common/order/listByDto',
//     method: 'post',
//     data,
//     params,
//     isList: true
//   });
// };

// 查询 - 所有报告结果 - 合格|不合格
export const getCustomInfo = params => {
  return apiRequest({
    url: `/newmedia-back/customInfo/listByCustId/${params.id}`,
    method: 'get',
    params
  });
};

// 查询 - 信息
export const getTaskInfo = params => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskDetail/${params.id}`,
    method: 'get',
    params
  });
};

// 查询 - 所有报告结果 - 合格|不合格
export const postResultItem = data => {
  return apiRequest({
    url: '/newmedia-back/mediaReportDetail/getOneByDto',
    method: 'post',
    data
  });
};

// 修改-报告结果 - 合格|不合格
export const putResultItem = ({ id, ...params }) => {
  return apiRequest({
    url: `newmedia-back/mediaReportDetail/updateCheckResult/${id}`,
    method: 'put',
    params
  });
};

// 互动回应问题-其他问题 => 列表
export const postQuestionList = data => {
  return apiRequest({
    url: '/newmedia-back/reportQuestion/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 添加/修改问题
export const addOrEditQuestion = data => {
  return apiRequest({
    url: '/newmedia-back/reportQuestion/save',
    method: 'put',
    data
  });
};

// 内容发布情况 - 信息
export const getContentReleaseByParams = params => {
  return apiRequest({
    url: '/newmedia-back/accountDetails/getContentReleaseByParams',
    method: 'get',
    params
  });
};

// 内容发布情况 - 折线图
export const getChartData = params => {
  return apiRequest({
    url: '/newmedia-back/accountDetails/getContentReleaseChartByParams',
    method: 'get',
    params,
    isList: true
  });
};

// 严重表述错误列表
export const sensitiveListByDto = ({ Others: params, ...data }) => {
  return apiRequest({
    url: '/newmedia-back/accountDetails/sensitiveListByDto',
    method: 'post',
    data,
    params,
    isList: true
  });
};

// 泄漏国家机密列表
export const disclosureListByDto = ({ Others: params, ...data }) => {
  return apiRequest({
    url: '/newmedia-back/accountDetails/disclosureListByDto',
    method: 'post',
    data,
    params,
    isList: true
  });
};

// 是否加入报告
export const putJoinReport = data => {
  return apiRequest({
    url: '/newmedia-back/reportQuestionRelation/updateIsJoinByDto',
    method: 'put',
    data
  });
};

// 删除问题
export const delQuestion = params => {
  return apiRequest({
    url: '/newmedia-back/reportQuestion/updateDelFlagById',
    method: 'put',
    params
  });
};
