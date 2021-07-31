/**
 * 配置该文件可以参考:
 * https://cli.vuejs.org/zh/config/#%E7%9B%AE%E6%A0%87%E6%B5%8F%E8%A7%88%E5%99%A8
 *
 */
const path = require('path');
const fs = require('fs');
// 测试地址
const url = 'http://120.27.244.31/';
//栏目监测
//const url = 'http://192.168.2.83:6000/'
// const url = 'http://47.99.85.139/';
// 崔佳琪-本地
// const url = 'http://192.168.2.229:7123/';
// 熊廷武-本地
//const url = 'http://10.0.4.116:6000/';
// 乔景波-本地
// const url = 'http://192.168.2.180:7123/';
// mock数据-地址
// const url = 'http://localhost:4200'
console.log('mock地址:' + url);
const port = 9000; // 端口配置
function resolve(dir) {
  return path.join(__dirname, dir);
}
var version = new Date().getTime();
fs.writeFile(
  resolve('public/cdn/version.js'),
  `(function(){window.KP = ${version};})()`,
  function(err) {
    if (!err) {
      return console.log(`KP: ${version}`);
    }
  }
);
// 基础路径，发布前修改这里,当前配置打包出来的资源都是相对路径
let publicPath = './';
module.exports = {
  publicPath: publicPath,
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    config.externals({
      axios: 'axios'
    });
    const entry = config.entry('app');
    entry.add('babel-polyfill').end();
    entry.add('classlist-polyfill').end();
  },
  // 配置转发代理
  devServer: {
    port,
    proxy: {
      '/': {
        target: url,
        ws: true,
        // changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      }
      // v2.7.0 不需在配置前端代理
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    console.log(process.env.NODE_ENV);
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      );

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 0,
            reuseExistingChunk: true,
            enforce: true,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            enforce: true,
            reuseExistingChunk: true,
            test: /[\\/]element-ui[\\/]/ // in order to adapt to cnpm
          },
          echarts: {
            name: 'chunk-echarts', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/](echarts|vue-echarts|zrender)[\\/]/, // in order to adapt to cnpm
            enforce: true,
            reuseExistingChunk: true
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 2, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single');
    });
  },
  transpileDependencies: ['vue-echarts', 'resize-detector']
};
