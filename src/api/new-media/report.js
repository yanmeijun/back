import apiRequest from '@/router/apiAxios';

// 报告相关接口
// -- 任务详情  生成报告 - 获取报告数量
export const getReportNumByParams = (params = {}) => {
  return apiRequest({
    url: '/newmedia-back/mediaTaskReport/getReportNumByParams',
    method: 'get',
    params
  });
};

// -- 任务详情  生成报告 - 获取最近结果
export const getResultTimesByParams = (params = {}) => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/getResultTimesByParams`,
    method: 'get',
    params
  });
};

// -- 任务详情  生成报告 - 确认提交
export const postReport = (data = {}) => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/saveByDto`,
    method: 'post',
    data
  });
};

// -- 添加任务 -- 修改报告 - 任务数据范围
export const updateByTaskId = (data = {}) => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/updateByTaskId`,
    method: 'put',
    data
  });
};

// -- 报告列表 - 任务统计数量
export const getReportTaskNum = (params = {}) => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/getStatisticsTaskReport`,
    method: 'get',
    params
  });
};

// -- 报告列表
export const getReportList = params => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/listByParms`,
    method: 'get',
    params,
    isList: true
  });
};

// -- 报告列表 - 下载列表
export const getReportTaskIdList = ({ reportId, ...params }) => {
  return apiRequest({
    url: `/newmedia-back/reportStore/listByReportId/${reportId}`,
    method: 'get',
    params,
    isList: true
  });
};

// -- 报告列表 - 删除报表
export const delReportTaskId = params => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/updateStatusByIds`,
    method: 'put',
    params
  });
};
// -- 报告 - 是否人工|系统
export const getTaskReportByParms = params => {
  return apiRequest({
    url: `/newmedia-back/mediaTaskReport/getTaskReportByParms`,
    method: 'get',
    params
  });
};
