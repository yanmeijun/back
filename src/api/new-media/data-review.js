/**
 * 错敏信息
 */
import apiRequest from '@/router/apiAxios';

// 错敏信息-列表
export const getErrorList = data => {
  return apiRequest({
    url: '/newmedia-back/mediaSensitiveDetail/listByDto',
    method: 'post',
    data,
    // isHits: true,
    isList: true
  });
};

// 错敏信息-错敏推荐
export const getErrorFilter = data => {
  return apiRequest({
    url: '/newmedia-back/mediaSensitiveDetail/advancedFilter',
    method: 'post',
    data,
    isList: true
  });
};

// 错敏信息 - 审核
export const getErrorSensitive = data => {
  return apiRequest({
    url: '/newmedia-back/mediaSensitiveDetail/auditChange',
    method: 'post',
    data
  });
};

// 错敏信息 - 客户信息模糊查询 【唯一标识/中文】
export const findByAccountNameOrUniqueCode = params => {
  return apiRequest({
    url: '/newmedia-back/mediaAccountPool/findByAccountNameOrUniqueCode',
    method: 'get',
    params
  });
};
