/**
 * 客户账号管理
 */
import apiRequest from '@/router/apiAxios';
// 客户账号-列表
export const getList = data => {
  return apiRequest({
    url: '/cloud-common/customInfo/list',
    method: 'post',
    data: data.data,
    params: data.params,
    isList: true
  });
};

// 客户账号-列表根据id集合
export const getListByIds = ids => {
  return apiRequest({
    url: '/cloud-common/customInfo/getByIdList',
    method: 'get',
    params: {
      idList: ids
    },
    isList: true
  });
};

// 客户账号-添加
export const add = data => {
  return apiRequest({
    url: '/cloud-common/customInfo/insert',
    method: 'post',
    data
  });
};

// 客户账号-获取单个
export const get = id => {
  return apiRequest({
    url: `/cloud-common/customInfo/${id}`,
    method: 'get'
  });
};

// 客户账号-修改
export const update = data => {
  return apiRequest({
    url: '/cloud-common/customInfo/update',
    method: 'put',
    data
  });
};

// 客户账号-修改密码
export const changePassword = params => {
  return apiRequest({
    url: '/cloud-common/customInfo/updateCustPassword',
    method: 'put',
    params
  });
};

// 客户账号-调整挂靠单位
export const changeAffiliatedUnit = data => {
  return apiRequest({
    url: '/cloud-common/customInfo/updateCustomParentRelationById',
    method: 'put',
    data
  });
};

// 客户账号-修改状态
export const updateStatus = data => {
  return apiRequest({
    url: '/cloud-common/customInfo/updateStatus',
    method: 'put',
    data
  });
};

/**
 * 获取客户自动编码
 * @param {*} type 0组织，1填报
 */
export const getCustomAutoCode = data => {
  let defaults = {
    type: 1
  };
  return apiRequest({
    url: '/cloud-common/customInfo/getNewCode',
    method: 'get',
    params: Object.assign({}, defaults, data)
  });
};

/**
 * 客户自动编码是否存在验证
 * @param {*} type 0组织，1填报
 */
export const customCodeIsExist = custCode => {
  return apiRequest({
    url: '/cloud-common/customInfo/getExistCode',
    method: 'get',
    params: {
      custCode
    }
  });
};

// 导出
export const exportData = params => {
  return apiRequest({
    url: `/cloud-common/customInfo/export`,
    method: 'get',
    params
  });
};
// 导出路径
export const exportDataUrl = '/cloud-common/customInfo/export';

// 新增组织单位
export const postInsertOrgByDto = data => {
  return apiRequest({
    url: `/cloud-common/customInfo/insertOrgByDto`,
    method: 'post',
    data
  });
};

// 获取客户列表-根据部门下的权限
export const getListByDeptsAuth = params => {
  return apiRequest({
    url: '/cloud-common/customInfo/getListByDeptId',
    params,
    isList: true
  });
};
