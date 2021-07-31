<template>
  <div class="el-day-editor">
    <input
      placeholder=""
      :value="startDay"
      @input="handleInput($event, 'startDay')"
      @blur="handleNumBlur"
      class="day-input"
    />
    <span class="el-range-separator">至</span>
    <input
      :value="endDay"
      class="day-input"
      @input="handleInput($event, 'endDay')"
      @blur="handleNumBlur"
    />
    <span class="el-clearable" v-if="clearable">
      <i
        @click="clearableFun"
        v-if="this.startDay || this.endDay"
        class="el-input__icon el-icon-circle-close el-input__clear"
      ></i>
    </span>
  </div>
</template>
<script>
/**
 * <input>框自动校验,仅能填入数字，支持负数格式
 * 过滤规则: 仅能输入合法整数
 * 示例：<my-input-number :value.sync="value"/>
 */
function isValueNumber(value) {
  return /(^-?[1-9][0-9]*$)|(^-?0{1}$)/.test(value);
}
export default {
  name: 'InputNumberRange',
  // 定义来自父级的参数
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startDay: '',
      endDay: ''
    };
  },
  methods: {
    handleInput(event, ele) {
      let val = event.target.value.trim();
      if (isValueNumber(val)) {
        // let max = this.max;
        let min = this.min;
        val = Number(val);
        ele === 'startDay' ? (this.startDay = val) : (this.endDay = val);
        // if (val > max) this.startDay = max;
        if (ele === 'startDay') {
          if (val < min) this.startDay = min;
        } else {
          if (val < min) this.endDay = min;
        }
      } else {
        // 如果输入的非数字，则保留之前的数据
        event.target.value = ele === 'startDay' ? this.startDay : this.endDay;
      }
      let data = [this.startDay, this.endDay].filter(val => val);
      this.$emit('change', data);
      this.$emit('input', data);
    },
    handleNumBlur(event) {
      this.$emit('blur', event);
    },
    clearableFun() {
      this.startDay = '';
      this.endDay = '';
      this.$emit('change', []);
      this.$emit('input', []);
    },
    dayShow() {},
    dayhide() {},
    updateVal: function(val) {
      if (val > this.max) val = this.max;
      if (val < this.min) val = this.min;
      this.startDay = val;
    }
  },
  watch: {
    // 增加监听
    startDay(val) {
      // this.$emit('input', val);
      // this.$emit('on-change', val);
    },
    value(val) {
      //this.updateVal(val);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.el-day-editor {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 6px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  position: relative;
  &:hover {
    .el-clearable {
      display: block;
    }
  }
  .el-clearable {
    cursor: pointer;
    position: absolute;
    top: -5px;
    right: 0;
    height: 20px;
    display: none;
  }
  .day-input {
    appearance: none;
    border: none;
    outline: none;
    display: inline-block;
    height: 90%;
    margin: 0;
    padding: 0 6px;
    width: 46%;
    font-size: 14px;
    color: #606266;
    text-align: center;
  }
}
</style>
