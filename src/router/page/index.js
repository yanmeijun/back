import Layout from '@/page/index/';
import PageLayout from '@/page/index/layout';
export default [
  {
    path: '/login',
    name: '登录页',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: '/403',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/500',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/',
    name: '主页',
    redirect: '/index'
  },
  {
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [
      {
        path: ':routerPath',
        name: 'iframe',
        component: () =>
          import(/* webpackChunkName: "page" */ '@/components/iframe/main'),
        props: true
      }
    ]
  },
  {
    path: '/model',
    redirect: '/model/index',
    component: PageLayout,
    children: [
      {
        path: 'index',
        name: '模板页面',
        component: () =>
          import(/* webpackChunkName: "page" */ '@/page/model/index'),
        meta: {
          keepAlive: false,
          isTab: false,
          isAuth: false
        }
      },
      {
        path: 'list',
        name: '详细信息',
        component: () =>
          import(/* webpackChunkName: "page" */ '@/page/model/list'),
        meta: {
          keepAlive: false,
          isTab: false,
          isAuth: false
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
];
