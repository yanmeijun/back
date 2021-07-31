export const type = ['组织单位', '网站填报单位', '新媒体填报单位'];

// 节流
export const throttle = function(func, delay) {
  var prev = Date.now();
  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};

// 防抖
export const debounce = (fn, delay) => {
  let timer = null; //借助闭包
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay); // 简化写法
  };
};
