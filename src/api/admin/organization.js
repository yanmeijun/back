/**
 * 组织架构
 */
import apiRequest from '@/router/apiAxios';

// tree树结构--列表
export const getTreeList = params => {
  return apiRequest({
    url: '/admin/dept/tree',
    method: 'get',
    params,
    isList: true
  });
};

// tree树结构--根据id查询
export const getDeptId = ({ id }) => {
  return apiRequest({
    url: `/admin/dept/${id}`,
    method: 'get',
    params: {}
  });
};

// tree树结构--部门名称是否存在
export const hasDept = ({ name }) => {
  return apiRequest({
    url: `/admin/dept/details/${name}`,
    method: 'get',
    params: {},
    isList: true
  });
};

// tree树结构--添加部门
export const createDept = data => {
  return apiRequest({
    url: `/admin/dept`,
    method: 'post',
    data
  });
};

// tree树结构--部门更新
export const updateDept = data => {
  return apiRequest({
    url: `/admin/dept`,
    method: 'put',
    data
  });
};

// tree树结构-- 删除部门
export const delDept = ({ id }) => {
  return apiRequest({
    url: `/admin/dept/${id}`,
    method: 'delete',
    params: {}
  });
};

// 批量调整部门
export const updateUserDept = params => {
  return apiRequest({
    url: `/admin/user/updateUserBatchWithDept`,
    method: 'PUT',
    params
  });
};

// 用户-列表
export const getUserList = params => {
  return apiRequest({
    url: '/admin/user/page',
    method: 'get',
    params,
    isList: true
  });
};

// 角色-列表
export const getRoleList = params => {
  return apiRequest({
    url: '/admin/role/list',
    method: 'get',
    params,
    isList: true
  });
};

// 角色-用户信息
export const getUserInfo = params => {
  return apiRequest({
    url: `/admin/user/${params.id}`,
    method: 'get',
    params: {}
  });
};

// 角色-用户名-去重
export const getCheckUsername = params => {
  return apiRequest({
    url: `/admin/user/details/${params.username}`,
    method: 'get',
    params: {}
  });
};

// 添加成员
export const addUser = data => {
  return apiRequest({
    url: `/admin/user`,
    method: 'post',
    data
  });
};

// 编辑成员
export const updateUser = data => {
  return apiRequest({
    url: `/admin/user`,
    method: 'put',
    data
  });
};

// 删除成员
export const delUser = params => {
  return apiRequest({
    url: `/admin/user/${params.id}`,
    method: 'delete'
  });
};

// 修改-成员信息【密码、邮箱...】
export const updateUserWithInfo = data => {
  return apiRequest({
    url: `/admin/user/updateUserWithInfo`,
    method: 'put',
    data
  });
};

// 交付人员列表
export const getUserByDeptId = params => {
  return apiRequest({
    url: '/admin/user/getUserByDeptId',
    method: 'get',
    params,
    isList: true
  });
};
