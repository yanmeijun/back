/**
 * 录入报告相关-targetType（业务类型）
 * 0-1    单项否决-严重问题
 * 0-8    单项否决-首页不更新
 * 0-12   单项否决-互动回应差
 * 0-15   单项否决-服务不实用
 * 0-135  单项否决-栏目不更新
 * 0-136  单项否决-空白栏目
 * 0-137  单项否决-站点无法访问
 *
 * 1-19   扣分指标-发布解读
 * 1-49   扣分指标-办事服务
 * 1-62   扣分指标-互动交流
 * 1-139  扣分指标-功能设计
 *
 * 2-104  加分指标-信息发布
 * 2-112  加分指标-办事服务
 * 2-121  加分指标-互动交流
 * 2-128  加分指标-功能设计
 * 2-140  加分指标-创新发展
 */

/**
 * 机器数据相关-targetType（业务类型）
 * 0  空白栏目
 * 1  栏目不更新
 * 2  页面标签
 * 3  链接不可用
 * 4  严重表述错误-错敏信息
 * 5  泄露国家秘密
 * 6  发布或链接反动、暴力、色情内容
 * 7  DNS监测
 * 8  关停域名链接
 * 9  页面篡改
 */

import apiRequest from '@/router/apiAxios';

// 条件保存
export const paramsSave = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTaskDetail/inputProblem`,
    method: 'post',
    data
  });
};

/**
 * 通用-查询列表
 * 以指标区分
 * @param {*} data
 * @returns
 */
export const getList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/page`,
    method: 'post',
    data,
    isList: true
  });
};

/**
 * 通用-录入添加
 * 以指标区分
 * @param {*} data
 * @returns
 */
export const inputAdd = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/save`,
    method: 'post',
    data
  });
};

/**
 * 通用-录入删除
 * @param {Array} urlGroups 组数据标识
 * @returns
 */
export const inputDel = urlGroups => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateStatusByUrlGroup`,
    method: 'put',
    params: {
      urlGroups,
      status: 1 // 1删除，0正常，默认1
    }
  });
};

/**
 * 通用-录入修改
 * 以指标区分
 * @param {*} data
 * @returns
 */
export const inputEdit = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateByUrlGroup`,
    method: 'put',
    data
  });
};

/**
 * 通用-根据父级获取问题列表
 * 以指标区分
 * @param {*} pid 父级id：一级时为指标编码
 * @returns
 */
export const getQuestionTypeByPid = pid => {
  return apiRequest({
    url: `/cloud-website-back/questionType/getQuestionType/${pid}`,
    method: 'get'
  });
};

/**
 * 机器数据-通用-是否纳入报告|是否单否
 * @param {*} data
 * @returns
 */
export const updateIsJoin = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateIsJoin`,
    method: 'post',
    data
  });
};

/**
 * 单项否决/严重问题 -- 严重表述错误-错敏信息查询
 * 以指标区分
 * @param {*} data
 * @returns
 */
export const getWebsiteSensitiveDetail = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteSensitiveDetail/listByDto`,
    method: 'post',
    data,
    isList: true
  });
};

/**
 * 单项否决/严重问题 -- 泄漏国家机密
 * 以指标区分
 * @param {*} data
 * @returns
 */
export const getWebsiteInfoLeakage = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteInfoLeakage/listByDto`,
    method: 'post',
    data,
    isList: true
  });
};

/**
 * 单项否决/严重问题 -- 发布或链接反动、暴力、色情内容查询
 * @param {*} data
 * @returns
 */
export const getWebsiteOuterdarkChain = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteOuterdarkChain/listByDto`,
    method: 'post',
    data,
    isList: true
  });
};
/**
 * 单项否决/严重问题 -- DNS篡改监测
 * @param {*} data
 * @returns
 */
export const getWebsiteHomepageHarmful = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteHomepageHarmful/listByDto`,
    method: 'post',
    data,
    isList: true
  });
};
/**
 * 单项否决/严重问题 -- 页面篡改监测
 * @param {*} data
 * @returns
 */
export const getWebsiteTamperMonitor = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteTamperMonitor/listByDto`,
    method: 'post',
    data,
    isList: true
  });
};

/**
 * 机器数据-站点无法访问
 * 以指标区分
 * @param {*} params
 * @returns
 */
export const getConnectionHomeInfo = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getConnectionHomeInfo`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-首页不更新
 * 以指标区分
 */
export const getHomeUpdate = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getHomeUpdate`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      function(data) {
        let ret = '';
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
      }
    ]
  });
};
/**
 * 机器数据-首页不更新-编辑
 * 以指标区分
 */
export const updateHomeUpdateByDto = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateHomeUpdateByDto`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-空白栏目
 * @param {*} data
 * @returns
 */
export const getBlankChannelList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getBlankChannelList`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-栏目不更新
 * @param {*} data
 * @returns
 */
export const getChannelUpdateList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getChannelUpdateList`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-可用性系统监测
 * @param {*} data
 * @returns
 */
export const getLinkUnavailabilityList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getLinkUnavailabilityList`,
    method: 'post',
    data
  });
};
/**
 * 机器数据-可用性系统监测批量删除|恢复
 * @param {*} data
 * @returns
 */
export const updateLinkUnavailability = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateLinkUnavailability`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-页面标签系统监测
 * @param {*} data
 * @returns
 */
export const getPageTagList = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getPageTagList`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-ipv6系统监测
 * @param {*} data
 * @returns
 */
export const getIpv6 = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/getIpv6`,
    method: 'post',
    data
  });
};

/**
 * 机器数据-ipv6系统监测-编辑
 * @param {*} data
 * @returns
 */
export const updateIpv6ByDto = data => {
  return apiRequest({
    url: `/cloud-website-back/websiteReportQuestion/updateIpv6ByDto`,
    method: 'post',
    data
  });
};

/**
 * 报告-计分服务(含计分|报告项数值)
 * @param {*} data
 * @returns
 */
export const reportCalculate = data => {
  return apiRequest({
    url: `/cloud-report/calculateScores/calculate`,
    method: 'post',
    data
  });
};
/**
 * 报告-计分（仅计分）
 * @param {*} data
 * @returns
 */
export const getCalculate = data => {
  return apiRequest({
    url: `/cloud-report/calculateScores/getCalculate`,
    method: 'post',
    data
  });
};
