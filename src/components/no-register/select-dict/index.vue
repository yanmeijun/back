<template>
  <el-select
    v-model="sVal"
    :multiple="multiple"
    placeholder="请选择"
    :clearable="clearable"
    @change="change"
  >
    <el-option
      v-for="item in filterOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDict } from '@/api/common/index';
export default {
  name: 'select-type',
  data() {
    return {
      options: [],
      sVal: ''
    };
  },
  props: {
    /**
     * 是否显示"全部"
     */
    showAll: Boolean,
    multiple: Boolean,
    value: {
      // 双向绑定v-model
      type: String | Array,
      default: ''
    },
    clearable: Boolean,
    type: {
      // 表名
      type: String | Number,
      default: ''
    },
    filter: Function,
    url: {
      // 接口地址
      type: String,
      default: ''
    },
    args: {
      // 其他参数
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(['currentDisplay']),
    filterOptions() {
      // console.log(typeof this.filter === 'function');
      if (this.filter && typeof this.filter === 'function') {
        let arr = this.filter(this.options);
        return arr;
      }
      return this.options;
    }
  },
  watch: {
    value(val) {
      this.sVal = val;
    },
    currentDisplay() {
      if (this.url) {
        this.getOptions();
      }
    }
  },
  created() {
    // 初始化数据
    this.sVal = this.value;
    this.getOptions();
  },
  methods: {
    async getOptions() {
      const params = Object.assign({}, { type: this.type }, this.args);
      if (this.url) {
        params.type = this.currentDisplay.value;
      }
      if (this.validatenull(params.type)) {
        return;
      }
      let { code, data = [], msg } = await getDict(params, this.url);
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '字典查询失败！'
        });
        return;
      }
      let options = data.map(ele => {
        ele.value = ele.value + '';
        ele.value = ele.value === '999' ? '' : ele.value; // 全部value置为空字符
        return ele;
      });
      // 是否过滤掉"全部"
      if (!this.showAll) {
        let index = options.findIndex(item => item.value === '');
        if (index !== -1) {
          options.splice(index, 1);
        }
      }
      this.options = options;
    },
    change(val) {
      this.sVal = val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    /**
     * 获取选中option
     * 单选：对象
     * 多选：对象数组
     */
    getSelection() {
      if (!this.sVal) {
        return;
      }
      let vals = this.multiple ? this.sVal : [this.sVal];
      let selection = this.options.filter(item => {
        return vals.includes(item.value);
      });
      return this.multiple ? selection : selection[0];
    }
  }
};
</script>
