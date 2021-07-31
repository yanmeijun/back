import { getStore, setStore } from '@/util/store';
import { isURL, validatenull } from '@/util/validate';
import {
  getUserInfo,
  loginByUsername,
  logout,
  refreshToken
} from '@/api/login';
import { deepClone, encryption } from '@/util/util';
import webiste from '@/const/website';
import { getMenu } from '@/api/admin/menu';
import { getDict } from '@/api/common/index';

function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild =
    ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index';
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    });
  }
}

const user = {
  state: {
    userInfo: {},
    permissions: {},
    roles: [],
    depts: [],
    menu:
      getStore({
        name: 'menu'
      }) || [],
    menuAll: [],
    expires_in:
      getStore({
        name: 'expires_in'
      }) || '',
    access_token:
      getStore({
        name: 'access_token'
      }) || '',
    refresh_token:
      getStore({
        name: 'refresh_token'
      }) || '',
    displayList: [],
    currentDisplay: {}
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        key: 'ucapnewmediaback',
        param: ['password']
      });
      return new Promise((resolve, reject) => {
        loginByUsername(user.username, user.password, user.code, user.randomStr)
          .then(response => {
            const data = response.data;
            commit('SET_ACCESS_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_EXPIRES_IN', data.expires_in);
            commit('CLEAR_LOCK');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            const data = res.data.data || {};
            commit('SET_USER_INFO', data.sysUser);
            commit('SET_DEPTS', data.depts || []);
            commit('SET_ROLES', data.roles || []);
            commit('SET_PERMISSIONS', data.permissions || []);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    },
    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token)
          .then(response => {
            const data = response.data;
            commit('SET_ACCESS_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_EXPIRES_IN', data.expires_in);
            commit('CLEAR_LOCK');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_MENU', []);
            commit('SET_PERMISSIONS', []);
            commit('SET_USER_INFO', {});
            commit('SET_ACCESS_TOKEN', '');
            commit('SET_REFRESH_TOKEN', '');
            commit('SET_EXPIRES_IN', '');
            commit('SET_DEPTS', []);
            commit('SET_ROLES', []);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
            commit('SET_CURRENT_DISPLAY', {});
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 注销session
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_MENU', []);
        commit('SET_PERMISSIONS', []);
        commit('SET_USER_INFO', {});
        commit('SET_ACCESS_TOKEN', '');
        commit('SET_REFRESH_TOKEN', '');
        commit('SET_DEPTS', []);
        commit('SET_ROLES', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        commit('SET_CURRENT_DISPLAY', {});
        resolve();
      });
    },
    // 获取系统菜单
    GetMenu({ commit }, obj) {
      return new Promise(resolve => {
        getMenu({ parentId: obj.parentId, prodId: obj.prodId }).then(res => {
          const data = res.data.data;
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele);
          });
          let type = obj.type;
          commit('SET_MENU', { type, menu });
          resolve(menu);
        });
      });
    },
    // 获取平台产品列表
    async GetDispalyList({ commit }) {
      let { data = [] } = await getDict({
        type: 'prod_id'
      });
      commit('SET_DISPLAY_LIST', data);
      let hasCurrent = getStore({
        name: 'current_display'
      });
      if (hasCurrent && hasCurrent.id) {
        commit('SET_CURRENT_DISPLAY', hasCurrent);
        return;
      }
      const media = data.filter(ele => ele.value === '999');
      commit('SET_CURRENT_DISPLAY', media[0]);
    }
  },
  mutations: {
    SET_DISPLAY_LIST: (state, data = []) => {
      state.displayList = data;
    },
    SET_CURRENT_DISPLAY: (state, current) => {
      state.currentDisplay = current;
      setStore({
        name: 'current_display',
        content: current,
        type: 'session'
      });
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      });
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
      setStore({
        name: 'expires_in',
        content: state.expires_in,
        type: 'session'
      });
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken;
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      });
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_MENU: (state, params = {}) => {
      let { menu, type } = params;
      if (type !== false) state.menu = menu;
      setStore({
        name: 'menu',
        content: menu,
        type: 'session'
      });
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_DEPTS: (state, depts) => {
      state.depts = depts;
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {};
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true;
      }
      state.permissions = list;
    }
  }
};
export default user;
