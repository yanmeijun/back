import apiRequest from '@/router/apiAxios';

// 查询列表
export const getStrategyList = data => {
  return apiRequest({
    url: '/cloud-common/msgStrategy/listByDto',
    method: 'post',
    data: data
  });
};

// 策略的启用停用
export const toggleStatus = data => {
  return apiRequest({
    url: '/cloud-common/msgStrategy/updateStatus',
    method: 'put',
    params: data
  });
};

// 删除策略
export const removeById = params => {
  return apiRequest({
    url: '/cloud-common/msgStrategy/removeById',
    method: 'put',
    params
  });
};

// 根据关键字查询填报单位
export const listByCustInfo = params => {
  return apiRequest({
    url: '/cloud-common/customInfo/listByCustInfo',
    method: 'get',
    params
  });
};

// 获取客户下关联的关联人员信息
export const getContactInfoList = params => {
  return apiRequest({
    url: `/cloud-common/customInfo/getContactInfoList/${params.custId}`,
    method: 'get',
    params
  });
};

// 根据组织单位查询填报单位（发生单位）列表
export const getFillUnitList = params => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/getFillUnitListOption`,
    method: 'get',
    params
  });
};

// 根据组织单位查询目前客户可以使用的发生单位类型
export const getFillType = params => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/getFillTypeOption`,
    method: 'get',
    params
  });
};

// 根据填报单位(系统报告时可以传组织单位)查询目前客户可以使用的产品策略监测项
export const getMonitorOption = params => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/getMonitorOption`,
    method: 'get',
    params
  });
};

// 创建策略
export const createStrategy = data => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/insert`,
    method: 'post',
    data
  });
};

// 查询详情
export const getStrategyDetail = params => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/${params.id}`,
    method: 'get',
    params
  });
};

// 修改策略
export const updateStrategy = data => {
  return apiRequest({
    url: `/cloud-common/msgStrategy/update`,
    method: 'post',
    data
  });
};
