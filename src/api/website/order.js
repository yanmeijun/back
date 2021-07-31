import apiRequest from '@/router/apiAxios';

// 订单详情-添加任务
export const addTask = data => {
  return apiRequest({
    url: `/cloud-common/orderTask/insertBatchByDto`,
    method: 'post',
    data
  });
};

// 订单详情-根据任务ID查询任务详情
export const getTaskInfo = params => {
  return apiRequest({
    url: `/cloud-common/orderTask/getWebsiteById/${params.id}`,
    method: 'get'
  });
};

// 订单详情-删除任务
export const putDelTaskId = params => {
  return apiRequest({
    url: `/cloud-common/orderTask/updateStatusByIds`,
    method: 'put',
    params
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

// 任务详情-查询任务详细列表
export const searchTaskList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/listPageByDto`,
    method: 'post',
    data,
    isList: true
  });
};

// 任务详情-获取任务完成情况和检查结果
export const getCompleteByTaskId = id => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/getCompleteByTaskId/${id}`,
    method: 'get'
  });
};

// 任务详情信息-获取
export const getTaskDetailInfo = id => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/${id}`,
    method: 'get'
  });
};

// 任务详情信息-修改
export const editTaskDetail = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/updateByDto`,
    method: 'put',
    data
  });
};

// 查询站点历史任务
export const getHistoryTaskList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/siteHistoryTask`,
    method: 'post',
    data
  });
};

// 根据订单任务ID查询报告完成数量
export const getReportFinishNum = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/getReportFinishNumByDto`,
    method: 'post',
    data
  });
};

// 订单详情-新增任务-选择站点-根据填报单位获取网站
export const getSiteListbyCustId = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/listByCustIds`,
    method: 'post',
    data
  });
};

// 订单详情-新增任务-根据站点id获取站点详情
export const getSiteTablebySiteId = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteAccountPool/listTreeSelectedByDto`,
    method: 'post',
    data
  });
};

// 订单详情-编辑任务-根据任务id获取站点列表
export const getSiteTablebyTaskId = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/listSelectedByDto`,
    method: 'post',
    data
  });
};

// 订单详情-修改任务
export const updateTask = data => {
  return apiRequest({
    url: `/cloud-common/orderTask/updateWebsite`,
    method: 'put',
    data
  });
};
