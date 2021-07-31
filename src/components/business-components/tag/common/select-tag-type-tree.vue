<!--
  下拉组织树组件
  Attributes：详情描述见 props
  Events：详情见methods中emit开头的函数
  Slots：无
-->
<template>
  <div>
    <el-popover
      ref="popover"
      placement="bottom-start"
      trigger="manual"
      transition="el-zoom-in-top"
      v-model="popover.visible"
      :disabled="disabled"
      :width="popover.width"
    >
      <el-select
        slot="reference"
        ref="select"
        v-model="self_value"
        :popper-append-to-body="false"
        :clearable="clearable"
        @clear="clear"
        @visible-change="onSelectDropdownVisibleChange"
      >
        <el-option
          v-if="current"
          v-show="false"
          :label="current.allLevelName"
          :value="current.id"
          :key="current.id"
        ></el-option>
      </el-select>
      <!-- 过滤 -->
      <div class="filter" v-if="filter">
        <input
          class="kw-input"
          v-model="filterKW"
          :placeholder="`搜索${mapping.typeWord[type]}`"
        />
      </div>
      <!-- 树 -->
      <el-tree
        v-loading="loading"
        class="tree"
        ref="tree"
        :data="data"
        :node-key="rowKey"
        icon-class="el-icon-arrow-right"
        :current-node-key="value"
        :expand-on-click-node="false"
        :props="{
          label: 'name',
          children: 'children',
          isLeaf: 'isLeaf'
        }"
        :filter-node-method="filterNode"
        @current-change="onCurrentChange"
      >
      </el-tree>
    </el-popover>
  </div>
</template>

<script>
import { getDistrictTree, getTradeTree, getOrganTree } from '@/api/common';
export default {
  props: {
    /**
     * 类别标识
     * region：地区
     * org：机构
     * trade：行业
     */
    type: {
      type: String,
      default: 'region'
    },
    /**
     * 数据映射主键 配置后值以此属性作为返回和回显
     * 注：暂时弃用 接口暂不支持 后续有需求再扩展
     */
    rowKey: {
      type: [String, Number],
      default: 'id'
    },
    placeholder: String,
    /**
     * 双向绑定值
     * 单选是主键
     * 多选是主键数组
     */
    value: {
      type: [Number, String],
      default: ''
    },
    /**
     * 所有层级名称
     * .sync 双向绑定
     * 分隔符依据separator配置
     * 示例：父级/子级
     */
    allLevelName: String,
    /**
     * 所有层级编码
     * .sync 双向绑定
     * 分隔符依据separator配置
     * 示例：1001/100101
     */
    allLevelCode: String,
    /**
     * 展示-是否显示所有层级
     */
    showAllLevels: Boolean,
    /**
     * 选项分割符
     */
    separator: {
      type: String,
      default: '/'
    },
    /**
     * 是否显示过滤框
     * 默认true 显示
     */
    filter: {
      type: Boolean,
      default: true
    },
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 是否可清空
     */
    clearable: Boolean
  },
  data() {
    return {
      // 映射相关
      mapping: {
        // 类型文字映射
        typeWord: {
          region: '地区',
          org: '机构',
          trade: '行业'
        },
        // 请求数据映射-获取全部数据
        dataApi: {
          region: getDistrictTree,
          org: getOrganTree,
          trade: getTradeTree
        }
      },
      filterKW: '', // 筛选关键字
      loading: false,
      self_value: this.value,
      data: [],
      // 选中数据
      current: null,
      // popover
      popover: {
        width: 200,
        visible: false
      }
    };
  },
  watch: {
    type() {
      this.reload();
    },
    filterKW(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async getTreeData() {
      this.loading = true;
      let { code, data } = await this.mapping.dataApi[this.type]();
      this.loading = false;
      if (code === 0) {
        this.data = this.transData(data);
      }
    },
    // 客户端动态筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1 || data.code.indexOf(value) !== -1;
    },
    // 下拉框显隐回调
    onSelectDropdownVisibleChange(val) {
      this.popover.visible = val;
    },
    // 树当前节点改变回调(对应单选)
    onCurrentChange(data, node) {
      this.current = data;
      this.emitUpdate();
      this.$refs['popover'].doClose();
    },
    clear() {
      this.current = null;
      this.$refs.tree.setCurrentKey();
      this.emitUpdate();
      this.$emit('clear');
    },
    // 返回数据转换统一格式
    transData(data) {
      // 加载全部数据
      return data.map(item => {
        return {
          id: item.id,
          code: item.code,
          name: item.name,
          children: item.children ? this.transData(item.children) : null
        };
      });
    },
    // 获取全部级别
    getAllLevelByNode(node, levels) {
      levels = levels || [];
      levels.push(node.data);
      if (node.parent && node.level > 1) {
        this.getAllLevelByNode(node.parent, levels);
      }
      return levels;
    },
    // 触发更新
    emitUpdate() {
      let allLevelCode = '';
      let allLevelName = '';
      if (this.current) {
        let node = this.$refs['tree'].getNode(this.current);
        let levels = this.getAllLevelByNode(node);
        allLevelCode = levels
          .map(item => item.code)
          .reverse()
          .join(this.separator);
        allLevelName = levels
          .map(item => item.name)
          .reverse()
          .join(this.separator);

        this.current.allLevelCode = allLevelCode;
        this.current.allLevelName = allLevelName;

        this.self_value = this.current.id;
        this.$emit('input', this.current.id);
        this.$emit('update:allLevelCode', allLevelCode);
        this.$emit('update:allLevelName', allLevelName);
      } else {
        this.$emit('input', '');
        this.$emit('update:allLevelCode', '');
        this.$emit('update:allLevelName', '');
      }
    },
    reload() {
      this.data = [];
      this.current = null;
      this.self_value = '';
      this.$refs.tree.setCurrentKey();
      this.emitUpdate();
      this.getTreeData();
    }
  },
  mounted() {
    this.getTreeData();
    this.popover.width = this.$refs.select.$el.offsetWidth;
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  .select_input-wrap {
    position: relative;
    .el-select__tags {
      right: 32px;
      left: 0;
      .el-tag {
        display: flex;
        align-items: center;
        max-width: 100%;
        .tag_name {
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        /deep/ .el-tag__close {
          flex-shrink: 0;
        }
      }
    }
  }

  /deep/ &-dropdown {
    display: none !important;
  }
}

.filter {
  margin-bottom: 10px;
  .kw-input {
    width: 100%;
    height: 32px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    text-indent: 12px;
  }
}

.tree {
  max-height: 180px;
  overflow: auto;
}
</style>
