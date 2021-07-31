<!--
  左侧树组件
  Attributes：详情描述见 props
  Events：详情见methods中emit开头的函数
  Slots：无
-->
<template>
  <div :class="['tree', { 'tree--fixed-head': headFixed }]">
    <!-- 头部 -->
    <div class="tree_head">
      <!-- 过滤 -->
      <div class="filter" v-if="showFilter">
        <el-input
          class="filter-kw"
          v-model.trim="self_keyword"
          prefix-icon="el-icon-search"
          :placeholder="`搜索${mapping.typeWord[type]}`"
        />
      </div>

      <!-- 管理按钮 -->
      <el-button
        v-show="showManageBtn"
        class="btn-manage-org"
        type="primary"
        @click="onManage"
      >
        管理{{ mapping.typeWord[type] }}
      </el-button>

      <!-- 操作 -->
      <div class="operation" v-if="showOperation">
        <el-dropdown trigger="click" placement="bottom-start">
          <el-button type="primary">
            添加
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 120px">
            <el-dropdown-item :disabled="!current" @click.native="onAdd('eq')">
              同级
            </el-dropdown-item>
            <el-dropdown-item
              :disabled="!current || isLimitLevel"
              @click.native="onAdd('sub')"
            >
              子级
              <el-tooltip placement="top" content="最多只允许添加3级">
                <i
                  v-show="isLimitLevel"
                  class="tip-icon iconfont icontubiaozhizuomoban12"
                  @click.stop
                  style="pointer-events: all; cursor: pointer"
                ></i>
              </el-tooltip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          type="primary"
          @click="onDel"
          :disabled="!!curDelTooltipContent || currentDetailLoading"
        >
          删除
          <el-tooltip placement="top" :content="curDelTooltipContent">
            <i
              v-show="curDelTooltipContent && !currentDetailLoading"
              class="tip-icon iconfont icontubiaozhizuomoban12"
            ></i>
          </el-tooltip>
        </el-button>
      </div>
    </div>
    <!-- 主体 -->
    <div class="tree_body">
      <div class="loading" v-show="loading" v-loading="loading"></div>

      <!-- 树 -->
      <el-tree
        v-show="!loading"
        class="tree"
        ref="tree"
        :data="data"
        node-key="id"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @current-change="onCurrentChange"
      >
        <!-- 自定义节点 -->
        <span class="node" slot-scope="{ node, data }">
          <!-- 节点名称 -->
          <span class="node_label" :title="data.names">
            <el-tooltip placement="top" :enterable="false" :content="data.name">
              <span>{{ data.name }}</span>
            </el-tooltip>
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 表单 -->
    <add-dialog
      :visible.sync="addDialog.visible"
      :type="type"
      :parent="addDialog.parent"
      @on-success="reload"
    />

    <!-- 删除信息提示 -->
    <tip-info-dialog
      :tipContent="delTipDialog.tipContent"
      :isOpen="delTipDialog.visible"
      @closeDialog="delTipDialog.visible = false"
      @confirmFn="doDel"
    />
  </div>
</template>

<script>
import * as commonApi from '@/api/common';
import TipInfoDialog from '@/components/dialog/tip-dialog/index'; // 提示弹框
import AddDialog from '@/components/dialog/tag/type/add-dialog'; // 表单弹框
export default {
  components: {
    TipInfoDialog,
    AddDialog
  },
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
     * 当前选中节点
     * .async双向绑定
     */
    current: {
      type: Object,
      default() {
        return null;
      }
    },
    /**
     * 是否默认选中第一个
     * current参数优先级更高 如果不为空则此选项会被忽略
     */
    currentFirst: {
      type: Boolean,
      default: true
    },
    /**
     * 是否固定头部 滚动时头部固定
     * 默认false 不固定
     */
    headFixed: {
      type: Boolean,
      default: false
    },
    /**
     * 首次加载筛选关键字
     * 默认''
     */
    keyword: {
      type: String,
      default: ''
    },
    /**
     * 是否显示过滤框
     * 默认true 显示
     */
    showFilter: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示管理按钮
     * 默认false 不显示
     */
    showManageBtn: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示操作栏
     * 默认false 不显示
     */
    showOperation: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示节点操作菜单
     * 默认false 不显示
     */
    showNodeMenu: {
      type: Boolean,
      default: false
    },
    /**
     * 节点菜单项配置
     * 默认都不显示
     * 示例 只配置详情和删除:['detail', 'del']
     * 所有配置项如下
     *  jump-front: 跳转前台
     *  detail: 信息
     *  change-pwd: 修改密码
     *  del: 删除
     *  auth: 数据权限
     */
    nodeMenuOption: {
      type: Array,
      default() {
        return [];
      }
    }
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
        // 接口映射
        api: {
          // 获取全部数据
          data: {
            region: commonApi.getDistrictTree,
            org: commonApi.getOrganTree,
            trade: commonApi.getTradeTree
          },
          // 获取详情
          get: {
            region: commonApi.districtGet,
            org: commonApi.organGet,
            trade: commonApi.tradeGet
          },
          // 删除接口映射
          delete: {
            region: commonApi.districtDelete,
            org: commonApi.organDelete,
            trade: commonApi.tradeDelete
          }
        },
        // 字段映射
        key: {
          region: {
            code: 'distCode',
            name: 'distName',
            sort: 'distSort'
          },
          org: {
            code: 'organCode',
            name: 'organName',
            sort: 'sort'
          },
          trade: {
            code: 'tradeCode',
            name: 'tradeName',
            sort: 'tradeSort'
          }
        },
        // 管理路由映射
        manageUrl: {
          region: '/tag/type/region',
          org: '/tag/type/org',
          trade: '/tag/type/trade'
        }
      },
      loading: false,
      self_keyword: this.keyword, // 筛选关键字
      isFirstLoad: true,
      currentDetail: null, // 当前节点详细
      currentDetailLoading: false, // 加载当前选中详情数据loading
      data: [], // 树数据
      // 树属性映射
      props: {
        isLeaf(data, node) {
          return !data.hasChildren;
        }
      },
      // 添加模态框
      addDialog: {
        visible: false,
        actionLevel: 'eq', // eq:同级 sub:子级
        model: {
          parent: null
        }
      },
      // 删除确认弹框
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        }
      }
    };
  },
  computed: {
    // 当前删除tip提示文字
    curDelTooltipContent() {
      let detail = this.currentDetail;
      let content = '';
      if (!detail) {
        return content;
      }
      if (detail.hasChildren && detail.hasConnectTag) {
        content = '存在子级和已关联标签，删除功能不可用';
      } else if (detail.hasChildren) {
        content = '存在子级，删除功能不可用';
      } else if (detail.hasConnectTag) {
        content = '已关联标签，删除功能不可用';
      }
      return content;
    },
    // 是否到达限制层级
    isLimitLevel() {
      if (!this.current || !this.$refs.tree) {
        return false;
      }
      // 当前节点
      let node = this.$refs.tree.getNode(this.current.id);
      if (node && node.level === 3) {
        return true;
      }
      return false;
    }
  },
  watch: {
    type(val) {
      this.self_keyword = '';
      this.reload();
    },
    self_keyword(val) {
      this.$refs.tree.filter(val);
    },
    'current.id'(val) {
      if (!val) {
        return;
      }
      this.getCurrentDetail();
    }
  },
  methods: {
    // 数据加工
    transData(data, parent) {
      data = JSON.parse(JSON.stringify(data));
      parent = JSON.parse(JSON.stringify(parent));
      parent && delete parent.children;
      // 每项数据添加parent属性
      data.forEach(item => {
        item.parent = parent;
        if (item.children && item.children.length) {
          item.children = this.transData(item.children, item);
        }
      });
      return data;
    },
    async getTreeData() {
      this.loading = true;
      let { code, data } = await this.mapping.api.data[this.type]();
      this.loading = false;
      if (code === 0) {
        let parent = null;
        data = this.transData(data, parent);
        this.data = data;
        this.dataLoadedCallback(data);
      }
    },
    // 获取当前详情
    async getCurrentDetail() {
      this.currentDetailLoading = true;
      let { code, data } = await this.mapping.api.get[this.type](
        this.current.id
      );
      this.currentDetailLoading = false;
      if (code === 0) {
        let keyMap = this.mapping.key[this.type];
        let detail = {
          id: data.id,
          code: data[keyMap.code],
          name: data[keyMap.name],
          sort: data[keyMap.sort],
          hasChildren: data.hasChildren, // 是否有子级
          hasConnectTag: data.hasChildrenLabel // 是否有关联标签
        };
        if (data.parentId) {
          detail.parent = {
            id: data.parentId,
            code: data.parentCode
          };
        }
        this.currentDetail = detail;
      }
    },
    // 客户端动态筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 数据加载后回调
    dataLoadedCallback(data) {
      if (!data || !data.length) {
        return;
      }
      if (this.isFirstLoad) {
        this.$nextTick(() => {
          this.initCurrent();
          this.isFirstLoad = false;
        });
      }
    },
    // 初始化选中项
    initCurrent() {
      if (!this.$refs || !this.$refs.tree) return;
      let key = this.$refs.tree.getCurrentKey();
      // 没有被选中值且指定了current参数
      if (!key && this.current && this.current.id) {
        let model = this.data.find(item => (item.id = this.current.id));
        if (!model) {
          return;
        }
        this.$refs.tree.setCurrentKey(this.current.id);
        this.$emit('update:current', model);
        this.$emit('change', model);
      } else if (this.currentFirst && !key && !this.current) {
        // 没有选中数据并且没有指定current 默认选中第一个
        let model = this.data[0];
        this.$refs.tree.setCurrentKey(model.id);
        this.$emit('update:current', model);
        this.$emit('change', model);
      }
    },
    // 跳转到管理
    onManage() {
      this.$router.push(this.mapping.manageUrl[this.type]);
    },
    // 当前选中节点改变回调
    onCurrentChange(data, node) {
      this.$emit('update:current', data);
      this.$emit('change', data);
    },
    /**
     * 添加组织
     * @param {String} actionLevel 级别 eq:同级 sub:子级
     */
    async onAdd(actionLevel) {
      // 同级
      if (actionLevel === 'eq') {
        this.addDialog.parent = this.current.parent;
      } else {
        // 验证 最多只能添加三级
        if (this.isLimitLevel) {
          this.$message.warning('最多只允许添加3级 请检查');
          return;
        }
        this.addDialog.parent = this.current;
      }
      this.addDialog.visible = true;
    },
    // 删除选中
    onDel() {
      if (!this.current || !this.current.id) {
        this.$message.warning({
          message: '请选择要删除的节点'
        });
        return;
      }
      this.delTipDialog.visible = true;
    },
    // 执行删除
    async doDel() {
      let { code } = await this.mapping.api.delete[this.type](this.current.id);
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.reload();
      }
    },
    // 添加成功回调
    onAddSuccess(data) {
      let { actionLevel } = this.addDialog;
      if (actionLevel === 'eq') {
        this.$refs.tree.insertBefore(data, this.current.id);
      } else {
        this.$refs.tree.append(data, this.current.id);
      }
    },
    reload() {
      this.isFirstLoad = true;
      this.$emit('update:current', null);
      this.$emit('change', null);
      this.$refs.tree.setCurrentKey();
      this.data = [];
      this.getTreeData();
    }
  },
  mounted() {
    this.getTreeData();
  }
};
</script>

<style lang="scss" scoped>
.tree {
  position: relative;
  &_head {
    padding: 12px 15px 0 15px;
    .filter {
      margin-bottom: 10px;
    }
    .btn-manage-org {
      margin-bottom: 10px;
      width: 100%;
    }
    .operation {
      margin-bottom: 10px;
      width: 100%;
      > button,
      /deep/.el-dropdown {
        width: 50%;
      }
      button {
        padding: 0;
        height: 32px;
        line-height: 32px;
      }
      > button {
        border-radius: 0 3px 3px 0;
        &.is-disabled {
          .tip-icon {
            cursor: pointer;
          }
        }
      }
      /deep/.el-dropdown button {
        width: 100%;
        border-radius: 3px 0 0 3px;
        border-right: 1px solid #eee;
      }
    }
  }

  &_body {
    padding: 0 15px 12px 15px;
    .loading {
      height: 100px;
    }
    .tree {
      .node {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;

        &:hover {
          .node_menu {
            visibility: visible;
            z-index: 1;
          }
        }

        &_label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &_menu {
          display: inline-block;
          height: 32px;
          width: 32px;
          flex-basis: 32px;
          flex-shrink: 0;
          line-height: 32px;
          text-align: center;
          visibility: hidden;
          z-index: -1;
          &_icon {
            transform: rotate(90deg);
          }
        }
      }
      /deep/ .el-tree-node.is-current {
        > .el-tree-node__content {
          background-color: var(--primary);
          color: #fff;
          border-radius: 4px;
          .el-tree-node__expand-icon {
            color: #fff;
          }
          .el-tree-node__expand-icon.is-leaf {
            color: transparent;
          }
          .node .node_menu {
            visibility: visible;
            z-index: 1;
          }
        }
      }
    }
  }

  // 头部固定
  &--fixed-head {
    .tree_head {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: #fff;
    }
  }
}

.menu-list {
  .menu-item {
    padding: 0 17px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
    }
    &--disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>
