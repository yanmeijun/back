import apiRequest from '@/router/apiAxios';
// import qs from 'qs';
// 辅助/公用类接口
// 获取字典接口
export const getDict = (obj = {}, url) => {
  url = url ? url : '/cloud-common/dict/type';
  let { type, ...params } = obj;
  return apiRequest({
    url: `${url}/${type}`,
    method: 'get',
    params,
    isList: true
  });
};

// 获取字典列表
export const getDictList = data => {
  return apiRequest({
    url: `/cloud-common/dict/listByDictListQueryDto`,
    method: 'post',
    data,
    isList: true
  });
};

// 根据字典标识集合查询多个字典详情（详细信息）
export const getDictDetailMap = async ({ typeNames }) => {
  let params = typeNames
    .map(ele => {
      return `typeNames=${ele}`;
    })
    .join('&');
  let { data, code, msg } = await apiRequest({
    url: `/cloud-common/dict/detailedMap?${params}`,
    method: 'get'
  });
  for (let dic of Object.keys(data)) {
    // 将 全部999 => 置空''
    const list = data[dic].list.map(ele => {
      if (parseInt(ele.value) === 999) {
        ele.value = '';
      }
      return ele;
    });
    data[dic].list = list;
  }
  return {
    data,
    code,
    msg
  };
};

// 地区
export const getAddress = params => {
  return apiRequest({
    url: `/admin/district/listDistrictByParams`,
    method: 'get',
    params,
    isList: true
  });
};

// 地区-添加
export const districtAdd = data => {
  return apiRequest({
    url: `/admin/district`,
    method: 'post',
    data
  });
};
// 地区-编辑
export const districtEdit = data => {
  return apiRequest({
    url: `/admin/district`,
    method: 'put',
    data
  });
};
// 地区-删除
export const districtDelete = id => {
  return apiRequest({
    url: `/admin/district/${id}`,
    method: 'delete'
  });
};
// 地区-查询根据id
export const districtGet = id => {
  return apiRequest({
    url: `/admin/district/${id}`,
    method: 'get'
  });
};
// 地区-查询全部树集合
export const getDistrictTree = (pid = 0) => {
  return apiRequest({
    url: `/admin/district/tree`,
    isList: true
  });
};
// 地区-根据父级获取地区集合
export const getDistrictListByParent = (pid = 0) => {
  return apiRequest({
    url: `/admin/district/listUnderDistrictById/${pid}`,
    isList: true
  });
};
// 地区-根据id值获取父子关系链
export const getDistrictTreeById = (id = 0) => {
  return apiRequest({
    url: `/admin/district/listCurrentDistrictTreesById/${id}`,
    isList: true
  });
};

// 机构-添加
export const organAdd = data => {
  return apiRequest({
    url: `/admin/organ`,
    method: 'post',
    data
  });
};
// 机构-编辑
export const organEdit = data => {
  return apiRequest({
    url: `/admin/organ`,
    method: 'put',
    data
  });
};
// 机构-删除
export const organDelete = id => {
  return apiRequest({
    url: `/admin/organ/${id}`,
    method: 'delete'
  });
};
// 机构-查询根据id
export const organGet = id => {
  return apiRequest({
    url: `/admin/organ/${id}`,
    method: 'get'
  });
};
// 机构-查询全部树集合
export const getOrganTree = (pid = 0) => {
  return apiRequest({
    url: `/admin/organ/tree`,
    isList: true
  });
};
// 机构-根据父级获取机构级别集合
export const getOrganLevelListByParent = (pid = 0) => {
  return apiRequest({
    url: `/admin/organ/listUnderOrganById/${pid}`,
    isList: true
  });
};
// 机构-根据id值获取父子关系链
export const getOrganLevelTreeById = (id = 0) => {
  return apiRequest({
    url: `/admin/organ/listCurrentOrganTreesById/${id}`,
    isList: true
  });
};

// 行业-添加
export const tradeAdd = data => {
  return apiRequest({
    url: `/admin/trade`,
    method: 'post',
    data
  });
};
// 行业-编辑
export const tradeEdit = data => {
  return apiRequest({
    url: `/admin/trade`,
    method: 'put',
    data
  });
};
// 行业-删除
export const tradeDelete = id => {
  return apiRequest({
    url: `/admin/trade/${id}`,
    method: 'delete'
  });
};
// 行业-查询根据id
export const tradeGet = id => {
  return apiRequest({
    url: `/admin/trade/${id}`,
    method: 'get'
  });
};
// 行业-查询全部树集合
export const getTradeTree = (pid = 0) => {
  return apiRequest({
    url: `/admin/trade/tree`,
    isList: true
  });
};
// 行业-根据父级获取行业集合
export const getTradeListByParent = (pid = 0) => {
  return apiRequest({
    url: `/admin/trade/listUnderTradeById/${pid}`,
    isList: true
  });
};
// 行业-根据id值获取父子关系链
export const getTradeTreeById = (id = 0) => {
  return apiRequest({
    url: `/admin/trade/listCurrentTradeTreesById/${id}`,
    isList: true
  });
};

// 导出
export const exportTable = ({ url, method = 'get', ...params }) => {
  let data = {};
  if (method === 'post') {
    data = { ...params };
    params = {};
  }
  return apiRequest({
    method,
    url,
    params,
    data,
    responseType: 'arraybuffer'
  });
};

//栏目监测-分类
export const getColumnTree = (pid = 0) => {
  return apiRequest({
    url: `/cloud-website-back/channelTree/tree`,
    isList: true
  });
};

// 栏目监测-分类-根据父级获取地区集合
export const getColumnListByParent = (pid = 0) => {
  return apiRequest({
    url: `/cloud-website-back/channelTree/tree/${pid}`,
    isList: true
  });
};
