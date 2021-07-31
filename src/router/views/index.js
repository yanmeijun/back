import Layout from '@/page/index/';
export default [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: '首页',
        component: () => import(/* webpackChunkName: "views" */ '@/page/wel'),
        meta: {
          // isAuth: false
        }
      }
    ]
  },
  {
    path: '/new-media/order',
    component: Layout,
    redirect: '/new-media/order/index',
    children: [
      {
        path: 'detail/index',
        name: '订单详情',
        component: () =>
          import(
            /* webpackChunkName: "views/new-media" */ '@/views/new-media/order/detail/index'
          ),
        meta: {
          keepAlive: false,
          isTab: true
          // isAuth: false
        }
      },
      {
        path: 'task/index',
        name: '任务详情',
        component: () =>
          import(
            /* webpackChunkName: "views/new-media" */ '@/views/new-media/order/task/index'
          ),
        meta: {
          keepAlive: false,
          isTab: true
          // isAuth: false
        }
      },
      //订单详情---已监测状态和未监测状态
      {
        path: 'monitor/index',
        name: '监测状态',
        component: () =>
          import(
            /* webpackChunkName: "views/new-media" */ '@/views/new-media/order/monitor/index'
          )
      }
    ]
  },
  {
    path: '/new-media/media-account-pool',
    component: Layout,
    redirect: '/new-media/media-account-pool/index',
    children: [
      {
        path: 'detail/index',
        name: '账号详情',
        component: () =>
          import(
            /* webpackChunkName: "views/new-media" */ '@/views/new-media/media-account-pool/detail/index'
          ),
        meta: {
          keepAlive: false,
          isTab: true
          // isAuth: false
        }
      }
    ]
  },
  {
    path: '/new-media/customer-account',
    component: Layout,
    redirect: '/new-media/customer-account/organization',
    children: [
      {
        path: 'organization/index',
        name: '客户账号-组织机构',
        component: () =>
          import(
            /* webpackChunkName: "views/new-media" */ '@/views/customer-account/organization/index'
          ),
        meta: {
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/admin/organization-structure',
    component: Layout,
    redirect: '/admin/organization-structure/index',
    children: [
      {
        path: 'organization/index',
        name: '管理部门-组织机构',
        component: () =>
          import(
            /* webpackChunkName: "views/admin" */ '@/views/admin/organization-structure/organization/index'
          ),
        meta: {
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/tag',
    component: Layout,
    redirect: '/tag/index',
    children: [
      {
        path: 'type/region',
        name: '标签管理-管理地区',
        component: () =>
          import(/* webpackChunkName: "views/tag" */ '@/views/tag/type'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'type/org',
        name: '标签管理-管理机构',
        component: () =>
          import(/* webpackChunkName: "views/tag" */ '@/views/tag/type'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'type/trade',
        name: '标签管理-管理行业',
        component: () =>
          import(/* webpackChunkName: "views/tag" */ '@/views/tag/type'),
        meta: {
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '个人信息',
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/admin/user/info')
      },
      {
        path: 'index2',
        name: '个人信息2',
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/admin/user/info-old')
      }
    ]
  },
  // 网站平台的订单路由
  {
    path: '/website/order',
    component: Layout,
    redirect: '/website/order/index',
    children: [
      {
        path: 'detail/index',
        name: '订单详情',
        component: () =>
          import(
            /* webpackChunkName: "views/website" */ '@/views/website/order/detail/index'
          ),
        meta: {
          keepAlive: true,
          isTab: true
          // isAuth: false
        }
      },
      {
        path: 'task/index',
        name: '任务详情',
        component: () =>
          import(
            /* webpackChunkName: "views/website" */ '@/views/website/order/task/index'
          ),
        meta: {
          keepAlive: true,
          isTab: true
          // isAuth: false
        }
      },
      {
        path: 'input-report',
        name: '录入报告',
        component: () =>
          import(
            /* webpackChunkName: "views/website" */ '@/views/website/order/input-report/index'
          ),
        meta: {
          keepAlive: true,
          isTab: true
          // isAuth: false
        }
      }
      // //订单详情---已监测状态和未监测状态
      // {
      //   path: 'monitor/index',
      //   name: '监测状态',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "views/new-media" */ '@/views/website/order/monitor/index'
      //     )
      // }
    ]
  },
  {
    path: '/doc',
    component: Layout,
    redirect: '/doc/index',
    children: [
      {
        path: 'index',
        name: '文档',
        component: () =>
          import(/* webpackChunkName: "views/new-media" */ '@/views/doc/index'),
        meta: {
          keepAlive: false
        }
      }
    ]
  }
];
