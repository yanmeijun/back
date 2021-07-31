import Vue from 'vue';
import VueRouter from 'vue-router';
import PageRouter from './page/';
import ViewsRouter from './views/';
import AvueRouter from './avue-router';
import Store from '../store/';
Vue.use(VueRouter);

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
let Router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      };
    }
  },
  routes: [].concat([])
});
AvueRouter.install(Router, Store);
Router.$avueRouter.formatRoutes(Store.state.user.menu, true);
Router.addRoutes([...PageRouter, ...ViewsRouter]);

// Router.beforeEach((to, from, next) => {
//   console.log(to);
//   console.log(from);
//   next();
// });

export default Router;
