/**
 * 人工检测手动录入列表混入
 */
let mixin = {
  // 公共参数
  inject: ['param'],
  methods: {
    // 列表样式处理
    cellStyle({ row, rowIndex, column }) {
      // 监测时间在任务时间范围外 行颜色置为浅黄提示
      let time = new Date(row.monitorTime.replace(/-/g, '/'));
      let start = new Date(this.param.task.startTime.replace(/-/g, '/'));
      let end = new Date(this.param.task.endTime.replace(/-/g, '/'));
      let isOutRange = time < start || time > end;
      if (isOutRange) {
        return {
          backgroundColor: '#fffbe6'
        };
      }
    }
  }
};

export default mixin;
