import apiRequest from '@/router/apiAxios';
/**
 * 错敏信息
 */
// 错敏信息-列表
export const getErrorList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteSensitiveDetail/listByDto',
    method: 'post',
    data,
    // isHits: true,
    isList: true
  });
};

// 错敏信息-错敏推荐
export const getErrorFilter = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteSensitiveDetail/advancedFilter',
    method: 'post',
    data,
    isList: true
  });
};

// 错敏信息 - 审核
export const getErrorSensitive = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteSensitiveDetail/auditChange',
    method: 'post',
    data
  });
};

// 错敏信息 - 客户信息模糊查询 【唯一标识/中文】
export const findByAccountNameOrUniqueCode = params => {
  return apiRequest({
    url: '/cloud-website-back/websiteAccountPool/findByAccountNameOrSiteCode',
    method: 'get',
    params
  });
};

/**
 * 信息泄密/隐私泄露
 */
// 列表
export const getDisclosureList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteInfoLeakage/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 审核
export const setDisclosure = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteInfoLeakage/auditChange',
    method: 'post',
    data
  });
};

/**
 * 关停域名/链接
 */
// 列表
export const getShutdownLinkList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteShutdownLink/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 审核
export const setShutdownLink = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteShutdownLink/auditChange',
    method: 'post',
    data
  });
};

/**
 * 篡改监测 - DNS
 */
// 列表
export const getTamperDNSList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteHomepageHarmful/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 审核
export const setTamperDNS = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteHomepageHarmful/auditChange',
    method: 'post',
    data
  });
};

/**
 * 篡改监测 - 页面
 */
// 列表
export const getTamperPageList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteTamperMonitor/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 审核
export const setTamperPage = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteTamperMonitor/auditChange',
    method: 'post',
    data
  });
};

/**
 * 外链暗链
 */
// 列表
export const getDarkLinkList = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteOuterdarkChain/listByDto',
    method: 'post',
    data,
    isList: true
  });
};

// 审核
export const setDarkLink = data => {
  return apiRequest({
    url: '/cloud-website-back/websiteOuterdarkChain/auditChange',
    method: 'post',
    data
  });
};
