import 'babel-polyfill';
import 'classlist-polyfill';
import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import VueCompositionApi from '@vue/composition-api';
import App from './App';
import ElementUI from 'element-ui';
// import '@/styles/element-variables.scss';
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import animated from 'animate.css';
import avueFormDesign from 'pig-avue-form-design';
import './permission'; // 权限
import './error'; // 日志
import router from './router/router';
import store from './store';
import { loadStyle } from './util/util';
import './util/require-components';
import * as urls from '@/config/env';
import { iconfontUrl, iconfontVersion } from '@/config/env';
import * as filters from './filters'; // 全局filter
// import * as directives from './directives'; // 全局filter
import './styles/common.scss';
// import basicContainer from './components/no-register/basic-container/main';
import * as echarts from 'echarts';
import { plugin } from 'echarts-for-vue';
import 'xe-utils';
import VXETable from 'vxe-table';
// import 'vxe-table/lib/style.css';
Vue.use(plugin, { echarts });
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/lines';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/map';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/chart/radar';
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/chart/effectScatter';
// import 'echarts/lib/chart/gauge';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/grid';
// import 'echarts/lib/component/geo';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/markPoint';

Vue.use(VueAxios, axios);
Vue.use(VueCompositionApi);
Vue.use(ElementUI, {
  size: 'small',
  menuType: 'text'
});

Vue.use(Avue, {
  size: 'small',
  menuType: 'text',
  theme: ''
});

Vue.use(router);
Vue.use(animated);
Vue.use(avueFormDesign);
Vue.use(VXETable);

// 注册全局容器
// Vue.component('basicContainer', basicContainer);
// Vue.component('chart', VueEchart);

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});

//加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// Object.keys(directives).forEach(key => {
//   console.log(key);
//   Vue.directive(key, directives[key]);
// });

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  console.log(iconfontUrl.replace('$key', ele));
  loadStyle(iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
