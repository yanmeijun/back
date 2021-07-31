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
import { getChannelTypeTree } from '@/api/website/channel-type';
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
    checkStrictly: Boolean,
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
        label: 'name',
        value: 'id',
        multiple: this.multiple,
        checkStrictly: this.checkStrictly,
        expandTrigger: 'click'
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
      let { code, data } = await getChannelTypeTree();
      if (code === 0) {
        this.options = this.transData(data);
      }
    },
    onChange(val) {
      this.self_value = val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    // 获取选中节点
    getCheckedNodes(leafOnly = false) {
      return this.$refs.cascader.getCheckedNodes(leafOnly);
    }
  },
  created() {
    this.getTreeData();
  }
};
</script>
<style lang="scss" scoped></style>
