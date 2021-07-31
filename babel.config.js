const plugins = ['@vue/babel-plugin-transform-vue-jsx'];
// 生产环境移除console
if (process.env.NODE_ENV !== 'development') {
  plugins.push('transform-remove-console');
}
module.exports = {
  plugins,
  presets: ['@vue/app']
};
