<template>
  <el-cascader
    ref="cascader"
    :props="props"
    v-model="self_value"
    :options="options"
    :clearable="clearable"
    :disabled="disabled"
    @change="onChange"
    placeholder="请选择机构"
  ></el-cascader>
</template>
<script>
import { getOrganLevelListByParent, getOrganTree } from '@/api/common';
import { setStore, getStore } from '@/util/store';
export default {
  name: 'select-organ-level',
  props: {
    // 双向绑定v-model
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * 是否懒加载
     */
    lazy: Boolean,
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
        label: this.lazy ? 'organName' : 'name',
        value: 'id',
        multiple: this.multiple,
        checkStrictly: this.checkStrictly,
        expandTrigger: this.lazy ? 'hover' : 'click',
        lazy: this.lazy,
        async lazyLoad(node, resolve) {
          let pid = node.level === 0 ? 0 : node.value;
          let { code, data } = await getOrganLevelListByParent(pid);
          if (code === 0) {
            data.forEach(item => {
              item.leaf = !item.hasChildren;
              item.children = item.hasChildren ? item.children : null;
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
      this.loading = true;
      const organLevel = getStore({
        name: 'organLevel',
        type: 'session'
      });
      if (organLevel && organLevel.length > 0) {
        this.loading = false;
        this.options = organLevel;
        return;
      }
      let { code, data } = await getOrganTree();
      this.loading = false;
      if (code === 0) {
        this.options = this.transData(data);
        setStore({
          name: 'organLevel',
          content: this.options,
          type: 'session'
        });
      }
    },
    onChange(val) {
      this.self_value = val;
      this.$emit('input', val);
      this.$emit('change', val);
      // 单选时 选中后自动收起
      if (!this.multiple && val.length) {
        this.$refs.cascader.toggleDropDownVisible();
      }
    }
  },
  created() {
    if (!this.lazy) {
      this.getTreeData();
    }
  }
};
</script>
<style lang="scss" scoped></style>
