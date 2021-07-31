/**
 * 标签管理
 */
import apiRequest from '@/router/apiAxios';

// 条件查询全部标签
export const search = data => {
  return apiRequest({
    url: '/admin/classificationlabel/Search',
    method: 'post',
    data,
    isList: true
  });
};

// 列表
export const getList = params => {
  return apiRequest({
    url: '/admin/classificationlabel/page',
    params: params,
    isList: true
  });
};
// 列表-按标识集合
export const getListByIds = ids => {
  return apiRequest({
    url: '/admin/classificationlabel/getLabelByIds',
    method: 'post',
    params: {
      ids
    },
    isList: true
  });
};

// 添加
export const add = data => {
  return apiRequest({
    url: '/admin/classificationlabel',
    method: 'post',
    data
  });
};

// 删除
export const del = ids => {
  if (ids && ids.length === 1) {
    // 单删
    return apiRequest({
      url: `/admin/classificationlabel/${ids[0]}`,
      method: 'delete'
    });
  }
};

// 查询标签分类下的标签
export const getDataById = params => {
  return apiRequest({
    url: '/admin/classificationlabel/getDataById',
    params
  });
};
// 标签关联
export const categoryLabelRelationship = data => {
  return apiRequest({
    url: '/admin/categoryLabelRelationship',
    method: 'post',
    data
  });
};
