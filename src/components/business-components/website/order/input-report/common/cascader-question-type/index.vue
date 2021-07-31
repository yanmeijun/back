<template>
  <el-cascader
    ref="cascader"
    :props="props"
    v-model="self_value"
    :options="options"
    :clearable="clearable"
    :disabled="disabled"
    @change="onChange"
  ></el-cascader>
</template>
<script>
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  name: 'select-address',
  props: {
    // 双向绑定v-model
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * 父级id
     */
    parentId: {
      type: [Number, String],
      required: true
    },
    /**
     * 是否懒加载
     */
    lazy: Boolean,
    /**
     * 限制加载层级
     * 如：限制为1级 1级都为末级不继续加载子级 即使1级选项下有子级
     */
    limitLevel: Number,
    /**
     * 是否多选
     */
    multiple: Boolean,
    /**
     * 是否严格模式 严格模式父子互不影响
     */
    checkStrictly: {
      type: Boolean,
      default: true
    },
    /**
     * 是否允许清空
     */
    clearable: Boolean,
    /**
     * 是否禁用
     */
    disabled: Boolean
  },
  data() {
    return {
      self_value: '',
      options: [],
      props: {
        ex_parentId: this.parentId, // 父级Id
        label: 'targetName',
        value: 'id',
        multiple: this.multiple,
        // checkStrictly: this.checkStrictly,
        expandTrigger: 'click',
        lazy: this.lazy,
        async lazyLoad(node, resolve) {
          let level = node.level;
          let pid = level === 0 ? this.ex_parentId : node.value;
          let { code, data } = await inputReportApi.getQuestionTypeByPid(pid);
          if (code === 0) {
            data.forEach(item => {
              if (this.limitLevel && this.limitLevel === level + 1) {
                // 到达限制级强制置为末级
                item.leaf = true;
              } else {
                item.leaf = item.hasSon ? false : true;
              }
              // item.leaf = item.hasSon ? false : true;
            });
            resolve(data);
          } else {
            resolve([]);
          }
        }
      }
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.self_value = val;
      }
    },
    multiple(val) {
      this.props.multiple = val;
    },
    checkStrictly(val) {
      this.props.checkStrictly = val;
    }
  },
  methods: {
    transData(data) {
      return data.map(item => {
        let hasChildren = item.children && item.children.length;
        item.leaf = !hasChildren;
        if (hasChildren) {
          item.children = this.transData(item.children);
        } else {
          item.children = null;
        }
        return item;
      });
    },
    // 一次性加载所有数据
    async getTreeData() {
      // this.loading = true;
      // let { code, data } = await getDistrictTree();
      // this.loading = false;
      // if (code === 0) {
      //   this.options = this.transData(data);
      // }
    },
    onChange(val) {
      this.self_value = val;
      this.$emit('input', val);
      this.$emit('change', val);
      // 单选时 选中后自动收起
      // if (!this.multiple && val.length) {
      //   this.$refs.cascader.toggleDropDownVisible();
      // }
    },
    // 获取选中节点
    getCheckedNodes(leafOnly = false) {
      return this.$refs.cascader.getCheckedNodes(leafOnly);
    }
  },
  created() {
    if (!this.lazy) {
      console.error('暂不支持全部加装数据');
      // this.getTreeData();
    }
  }
};
</script>
<style lang="scss" scoped></style>
