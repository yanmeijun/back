/**
 * 公共数据缓存
 * 如：字典，机构树，地区树等
 */
import { getStore, setStore } from '@/util/store';
import * as commonApi from '@/api/common/index';

const data = {
  // namespaced: true,
  state: {
    // 字典
    dict: getStore({ name: 'dict' }) || {},
    // 地区
    region: getStore({ name: 'region' }) || [],
    // 行业
    trade: getStore({ name: 'trade' }) || [],
    // 机构
    organ: getStore({ name: 'organ' }) || []
  },
  actions: {
    // 拉取所有公共数据
    PullData(cxt) {
      cxt.dispatch('GetDictData'); // 拉取字典数据
      cxt.dispatch('GetRegionData'); // 拉取地区数据
      cxt.dispatch('GetTradeData'); // 拉取行业数据
      cxt.dispatch('GetOrganData'); // 拉取机构数据
    },
    // 获取字典数据
    GetDictData({ commit }) {
      return new Promise((resolve, reject) => {
        commonApi
          .getDictList()
          .then(res => {
            console.log('dict:', res);
            const data = res.data || [];
            commit('SET_DICT', data);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    },
    // 获取地区数据(全部树数据)
    GetRegionData({ commit }) {
      return new Promise((resolve, reject) => {
        commonApi
          .getDistrictTree()
          .then(res => {
            const data = res.data || [];
            commit('SET_REGION', data);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    },
    // 获取行业数据(全部树数据)
    GetTradeData({ commit }) {
      return new Promise((resolve, reject) => {
        commonApi
          .getTradeTree()
          .then(res => {
            const data = res.data || [];
            commit('SET_TRADE', data);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    },
    // 获取机构数据(全部树数据)
    GetOrganData({ commit }) {
      return new Promise((resolve, reject) => {
        commonApi
          .getOrganTree()
          .then(res => {
            const data = res.data || [];
            commit('SET_ORGAN', data);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    }
  },
  mutations: {
    // 字典
    SET_DICT: (state, dict) => {
      state.dict = dict;
      setStore({
        name: 'dict',
        content: dict
      });
    },
    // 地区
    SET_REGION: (state, data) => {
      state.region = data;
      setStore({
        name: 'region',
        content: data
      });
    },
    // 行业
    SET_TRADE: (state, data) => {
      state.trade = data;
      setStore({
        name: 'trade',
        content: data
      });
    },
    // 机构
    SET_ORGAN: (state, data) => {
      state.organ = data;
      setStore({
        name: 'organ',
        content: data
      });
    }
  }
};
export default data;
