/**
 * 网站监测-报告管理
 */
import apiRequest from '@/router/apiAxios';

// 任务统计数量
export const getStatistics = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskReport/getStatistics`,
    method: 'post',
    data
  });
};

// 获取列表
export const getList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskReport/listPageByDto`,
    method: 'post',
    data,
    isList: true
  });
};

// 获取报告列表根据任务
export const getReportListByTask = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteReportStore/listPageByDto',
    method: 'post',
    data
  });
};

// 网站生成报告（单个/批量）
export const produceReportByDto = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteReportStore/produceReportByDto',
    method: 'put',
    data
  });
};
