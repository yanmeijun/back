/**
 * 人工检测手动录入表单混入
 */
let mixin = {
  // 公共参数
  inject: ['param'],
  computed: {
    // 监测时间是否在任务时间范围外
    isOutRange() {
      let time = new Date(this.model.monitorTime.replace(/-/g, '/'));
      let start = new Date(this.param.task.startTime.replace(/-/g, '/'));
      let end = new Date(this.param.task.endTime.replace(/-/g, '/'));
      let isOutRange = time < start || time > end;
      return isOutRange;
    }
  }
};

export default mixin;
