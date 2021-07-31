import apiRequest from '@/router/apiAxios';

// 辅助/公用类接口
// 写入./common.js

// 订单列表
export const getOrderList = ({ Others: params, ...data }) => {
  return apiRequest({
    url: '/cloud-common/order/listByDto',
    method: 'post',
    data,
    params,
    isList: true
  });
};

// 订单详情-信息
export const getOrderInfo = params => {
  return apiRequest({
    url: `/cloud-common/order/${params.id}`,
    method: 'get',
    params
  });
};
// 订单详情-任务列表
export const getOrderTaskList = ({ Others: params, ...data }) => {
  return apiRequest({
    url: `/cloud-common/orderTask/listByDto`,
    method: 'post',
    data,
    params,
    isList: true
  });
};
// 订单详情-新增任务 - 第一步 创建账号
export const postAddOrderTask = data => {
  return apiRequest({
    url: `/cloud-common/orderTask/insertRetByDto`,
    method: 'post',
    data
  });
};
// 订单详情-新增任务-查询
export const postListByTaskAndCustom = (data = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/listByTaskAndCustom',
    method: 'post',
    data,
    isList: true
  });
};
// 订单详情-新增任务 - 第二步 提交账号列表
export const postInsertMediaTaskDetail = (data = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaTaskDetail/insertBatch',
    method: 'post',
    data
  });
};
// 订单详情-更新任务
export const putOrderTask = data => {
  return apiRequest({
    url: `/cloud-common/orderTask/update`,
    method: 'put',
    data
  });
};
// 订单详情- 第二步 更新账号列表
export const putUpdateBatch = (data = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaTaskDetail/updateBatch',
    method: 'put',
    data
  });
};
// 订单详情-删除任务
export const putDelTaskId = params => {
  return apiRequest({
    url: `/cloud-common/orderTask/updateStatus`,
    method: 'put',
    params
  });
};

// 任务详情-信息
export const getOrderTaskInfo = params => {
  return apiRequest({
    url: `/cloud-common/orderTask/${params.id}`,
    method: 'get',
    params
  });
};

// 任务详情-列表
export const getOrderTaskDetailList = ({ Others: params, ...data }) => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskDetail/listByDto`,
    method: 'post',
    data,
    params,
    isList: true
  });
};
// 任务详情-修改监检查果
export const putOrderTaskDetailResult = data => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskDetail/updateCheckResultByDto`,
    method: 'put',
    data
  });
};

// 任务详情-查询全部订单结果
export const getTaskResult = ({ id, ...params }) => {
  return apiRequest({
    url: `newmedia-back/mediaTaskDetail/getResultByTaskId/${id}`,
    method: 'get',
    params
  });
};
