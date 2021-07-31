<!--
  组织树组件
  Attributes：详情描述见 props
  Events：详情见methods中emit开头的函数
  Slots：无
-->
<template>
  <div
    :class="[
      'organization-tree',
      { 'organization-tree--fixed-head': headFixed }
    ]"
  >
    <!-- 头部 -->
    <div class="organization-tree_head">
      <!-- 过滤 -->
      <div class="filter" v-if="showFilter">
        <el-input
          class="filter-kw"
          v-model.trim="self_keyword"
          placeholder="输入关键字进行过滤"
        />
      </div>

      <!-- 管理组织单位按钮 -->
      <el-button
        v-show="showManageOrgBtn"
        class="btn-manage-org"
        type="primary"
        @click="onJumpOrgAccount"
      >
        管理组织单位
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
            <el-dropdown-item :disabled="!current" @click.native="onAdd('sub')">
              子级
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          type="primary"
          @click="onSelectedDel"
          :disabled="!current || current.hasChildren || current.hasCustCode"
        >
          删除
          <el-tooltip placement="top" :content="curDelTooltipContent">
            <i
              v-show="curDelTooltipContent"
              class="tip-icon iconfont icontubiaozhizuomoban12"
            ></i>
          </el-tooltip>
        </el-button>
      </div>
    </div>
    <!-- 主体 -->
    <div class="organization-tree_body">
      <div class="loading" v-show="loading" v-loading="loading"></div>

      <!-- 树 -->
      <el-tree
        v-show="!loading"
        class="tree"
        ref="tree"
        :data="data"
        node-key="id"
        :expand-on-click-node="false"
        lazy
        :props="props"
        :load="loadNode"
        @current-change="onCurrentChange"
      >
        <!-- 自定义节点 -->
        <span class="node" slot-scope="{ node, data }">
          <!-- 节点名称 -->
          <span
            class="node_label"
            :title="data.custName"
            @click="closeBeforeMenu"
          >
            <el-tooltip
              placement="top"
              :enterable="false"
              :content="data.custName"
            >
              <span>{{ data.custName }}</span>
            </el-tooltip>
          </span>
          <!-- 节点菜单 -->
          <span v-if="showNodeMenu && nodeMenuOption.length" class="node_menu">
            <el-popover
              :ref="`tree_menu_${data.id}`"
              popper-class="el-popover--no-padding"
              placement="right-start"
              trigger="click"
              @show="onMenuPopoverShow(node)"
            >
              <span class="node_menu_icon el-icon-more" slot="reference"></span>
              <!-- 菜单列表 -->
              <ul class="menu-list">
                <template v-for="item in getNodeMenus(node)">
                  <li
                    :key="item.value"
                    v-if="nodeMenuOption.includes(item.value)"
                    :class="[
                      'menu-item',
                      {
                        'menu-item--disabled': item.disabled
                      }
                    ]"
                    @click="onNodeMenuItemClick(item, node, data)"
                  >
                    <!-- 特殊菜单项 -->
                    <template v-if="item.value === 'del'">
                      {{ item.label }}
                      <el-tooltip
                        placement="top"
                        :content="item.tooltipContent"
                      >
                        <i
                          v-show="item.tooltipContent"
                          class="tip-icon iconfont icontubiaozhizuomoban12"
                        ></i>
                      </el-tooltip>
                    </template>
                    <!-- 正常菜单项 -->
                    <template v-else>{{ item.label }}</template>
                  </li>
                </template>
              </ul>
            </el-popover>
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 添加组织单位 -->
    <add-dialog
      :visible.sync="addDialog.visible"
      :parent="addDialog.parent"
      @on-success="reload"
    />

    <!-- 修改账户密码 -->
    <change-password-dialog
      :visible.sync="changePasswordDialog.visible"
      :model="changePasswordDialog.model"
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
import debounce from 'throttle-debounce/debounce';
import * as commonApi from '@/api/new-media/common';
import * as custAccountApi from '@/api/cust-account';
import TipInfoDialog from '@/components/dialog/tip-dialog/index'; // 提示弹框
import AddDialog from '@/components/dialog/customer-account/organization/add'; // 添加模态
import ChangePasswordDialog from '@/components/dialog/customer-account/common/change-password'; // 修改账户密码
export default {
  components: {
    TipInfoDialog,
    AddDialog,
    ChangePasswordDialog
  },
  props: {
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
     * 是否显示管理组织单位按钮
     * 默认false 不显示
     */
    showManageOrgBtn: {
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
     *  detail: 组织单位信息
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
      loading: false,
      isFirstLoad: true, // 是否首次加载树数据
      self_keyword: this.keyword, // 筛选关键字
      data: [
        {
          id: '1',
          custName: '测试',
          children: [
            {
              id: '1-2',
              custName: '测试子级',
              children: []
            }
          ]
        },
        {
          id: '2',
          custName: '测试2',
          children: []
        }
      ], // 树数据
      // 树属性映射
      props: {
        label: 'custName',
        children: 'children',
        isLeaf(data, node) {
          return !data.hasChildren;
        }
      },
      // 节点菜单项
      nodeMenuOptions: [
        {
          label: '跳转前台',
          value: 'jump-front'
        },
        {
          label: '组织单位信息',
          value: 'detail'
        },
        {
          label: '修改密码',
          value: 'change-pwd'
        },
        {
          label: '删除',
          value: 'del',
          disabled: false
        },
        {
          label: '数据权限',
          value: 'auth'
        }
      ],
      beforeNodeOfShowMenu: null, // 记录上次显示了菜单的节点
      // 添加模态框
      addDialog: {
        visible: false,
        actionLevel: 'eq', // eq:同级 sub:子级
        parent: null
      },
      // 删除确认弹框
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        },
        ids: [] // 要删除的id集合
      },
      // 修改密码模态框
      changePasswordDialog: {
        visible: false,
        model: {}
      }
    };
  },
  computed: {
    // 当前删除tip提示文字
    curDelTooltipContent() {
      let content = '';
      if (!this.current) {
        return content;
      }
      let {
        hasChildren: hasOrgUnit,
        hasCustCode: hasSubmitUnit
      } = this.current;
      if (hasOrgUnit && hasSubmitUnit) {
        content = '组织单位存在子级和已挂靠填报单位，删除功能不可用';
      } else if (hasOrgUnit) {
        content = '组织单位存在子级，删除功能不可用';
      } else if (hasSubmitUnit) {
        content = '组织单位存在已挂靠填报单位，删除功能不可用';
      }
      return content;
    }
  },
  watch: {
    self_keyword(val) {
      this.remoteFilter(val);
    }
  },
  methods: {
    // 懒加载树node
    async loadNode(node, resolve) {
      this.isFirstLoad = node.key ? false : true; // 是否首次懒加载

      if (this.isFirstLoad && this.keyword) {
        // 有参数进行搜索操作
        this.remoteFilter(this.keyword);
        return;
      } else if (this.isFirstLoad) {
        // 无参数
        this.loading = true;
      }
      let { code, data } = await commonApi.getCustomerTree({
        isAll: 0,
        custCode: this.isFirstLoad ? '' : node.data.custCode,
        parentId: this.isFirstLoad ? 0 : '',
        delFlag: 2
      });
      if (this.isFirstLoad) {
        this.loading = false;
      }
      if (code === 0) {
        resolve(data);
        this.$nextTick(() => {
          this.dataLoadedCallback(data);
        });
      } else {
        resolve([]);
      }
    },
    // 加载一级节点
    async loadRootData() {
      this.loading = true;
      let { code, data } = await commonApi.getCustomerTree({
        isAll: 0,
        parentId: 0,
        delFlag: 2
      });
      this.loading = false;
      if (code === 0) {
        this.data = data;
        this.$nextTick(() => {
          this.dataLoadedCallback(data);
        });
      }
    },
    // 远程筛选
    // eslint-disable-next-line
    remoteFilter: debounce(500, false, async function (val) {
      if (!val) {
        this.loadRootData();
        return;
      }
      this.loading = true;
      // 远程加载
      let { code, data } = await commonApi.getCustomerTree({
        custInfo: val,
        isAll: 2, // 查询树结构
        delFlag: 2
      });
      if (code === 0) {
        this.data = data;
        this.$nextTick(() => {
          this.dataLoadedCallback(data);
        });
      } else {
        this.data = [];
      }
      this.loading = false;
    }),
    // 数据加载后回调
    dataLoadedCallback(data) {
      if (!data || !data.length) {
        return;
      }
      if (this.isFirstLoad) {
        this.initCurrent(data);
        this.isFirstLoad = false;
      }
    },
    // 初始化选中项
    initCurrent(data) {
      if (!this.$refs || !this.$refs.tree) return;
      let key = this.$refs.tree.getCurrentKey();
      // 没有被选中值且指定了current参数
      if (!key && this.current && this.current.id) {
        let model = data.find(item => (item.id = this.current.id));
        if (!model) {
          return;
        }
        key = this.this.current.id;
      } else if (this.currentFirst && !key && !this.current) {
        // 没有选中数据并且没有指定current 默认选中第一个
        key = data[0].id;
      }
      this.$refs.tree.setCurrentKey(key);
      let node = this.$refs.tree.getNode(key);
      this.emitCurrent(node);
    },
    // 根据node获取node的菜单
    getNodeMenus(node) {
      let { data } = node;
      let options = JSON.parse(JSON.stringify(this.nodeMenuOptions));

      let delMenu = options.find(item => item.value === 'del');
      let { hasChildren: hasOrgUnit, hasCustCode: hasSubmitUnit } = data;
      if (hasOrgUnit && hasSubmitUnit) {
        delMenu.tooltipContent =
          '组织单位存在子级和已挂靠填报单位，删除功能不可用';
      } else if (hasOrgUnit) {
        delMenu.tooltipContent = '组织单位存在子级，删除功能不可用';
      } else if (hasSubmitUnit) {
        delMenu.tooltipContent = '组织单位存在已挂靠填报单位，删除功能不可用';
      }

      delMenu.disabled = hasOrgUnit || hasSubmitUnit;
      return options;
    },
    // 跳转到组织单位管理
    onJumpOrgAccount() {
      this.$router.push('/new-media/customer-account/organization/index');
    },
    // 当前选中节点改变回调
    onCurrentChange(data, node) {
      this.emitCurrent(node);
    },
    emitCurrent(node) {
      let current = node.data;
      let parent = node.parent.data;
      if (Array.isArray(parent)) {
        parent = null;
      }
      current.parent = parent;
      this.$emit('update:current', JSON.parse(JSON.stringify(current)));
    },
    /**
     * 添加组织
     * @param {String} actionLevel 级别 eq:同级 sub:子级
     */
    async onAdd(actionLevel) {
      this.addDialog.visible = true;
      // 同级
      if (actionLevel === 'eq') {
        this.addDialog.parent = this.current.parent;
      } else {
        this.addDialog.parent = this.current;
      }
    },
    // 删除（菜单删除项触发）
    onDel(node, data) {
      this.delTipDialog.visible = true;
      this.delTipDialog.ids = [data.id];
    },
    // 删除选中
    onSelectedDel() {
      if (!this.current || !this.current.id) {
        this.$message.warning({
          message: '请选择要删除的节点'
        });
        return;
      }
      this.delTipDialog.visible = true;
      this.delTipDialog.ids = [this.current.id];
    },
    /**
     * 菜单项点击
     * item：菜单项
     * node：当前节点
     * data：当前节点原数据
     */
    onNodeMenuItemClick(item, node, data) {
      if (item.disabled) {
        return;
      }
      switch (item.value) {
        case 'jump-front':
          this.onJumpFront(node, data);
          break;
        case 'detail':
          this.onDetail(node, data);
          break;
        case 'change-pwd':
          this.onChangePassword(node, data);
          break;
        case 'del':
          this.onDel(node, data);
          break;

        default:
          break;
      }
    },
    // 跳转前台
    onJumpFront(node, data) {
      let url = `https://jg.kaipuyun.cn/cloud_web/users_loginIndex.action?data=${data.custCodeEncrypt}${data.custPasswordEncrypt}`;
      window.open(url, '_blank');
    },
    // 详情
    onDetail(node, data) {
      this.$router.push(
        `/new-media/customer-account/organization/index?id=${data.id}&custCode=${data.custCode}`
      );
    },
    // 修改密码
    onChangePassword(node, data) {
      this.changePasswordDialog.visible = true;
      this.changePasswordDialog.model = data;
    },
    // 执行删除-批量
    async doDel() {
      let { code } = await custAccountApi.updateStatus({
        idList: this.delTipDialog.ids,
        status: '2' // 删除
      });
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.reload();
      }
    },
    // 菜单popover显示回调
    onMenuPopoverShow(node) {
      if (
        this.beforeNodeOfShowMenu &&
        node.data.id !== this.beforeNodeOfShowMenu.data.id
      ) {
        this.closeBeforeMenu();
      }
      this.beforeNodeOfShowMenu = node;
    },
    // 关闭上次菜单
    closeBeforeMenu() {
      if (this.beforeNodeOfShowMenu) {
        let id = this.beforeNodeOfShowMenu.data.id;
        let treeMenu = this.$refs[`tree_menu_${id}`];
        let filterTreeMenu = this.$refs[`filter_tree_menu_${id}`];
        treeMenu && treeMenu.doClose();
        filterTreeMenu && filterTreeMenu.doClose();
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
      this.remoteFilter();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.organization-tree {
  position: relative;
  &_head {
    .filter {
      margin-bottom: 10px;
    }
    .btn-manage-org {
      margin-bottom: 10px;
      width: 100%;
    }
    .operation {
      display: flex;
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
    .organization-tree_head {
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
