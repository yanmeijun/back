<template>
  <div class="tree">
    <div class="search-input">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
    </div>
    <slot></slot>
    <!-- 操作 -->
    <div class="operation" v-if="showOperation">
      <el-dropdown
        trigger="click"
        placement="bottom-start"
        v-if="deptManager_btn_add"
      >
        <el-button type="primary">
          添加
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="width: 120px">
          <el-dropdown-item
            @click.native="onAdd('eq')"
            :disabled="!currentNode || !currentNode.id"
          >
            同级
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="onAdd('sub')"
            :disabled="!currentNode || !currentNode.id"
          >
            子级
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        @click="onSelectedDel"
        :disabled="isDisabled"
        v-if="deptManager_btn_del"
      >
        删除
      </el-button>
    </div>
    <el-tree
      ref="tree"
      class="organization-tree"
      node-key="id"
      :data="treeData"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :default-expanded-keys="expandedKeysVal"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :filter-node-method="filterNode"
      :props="defaultProps"
    >
      <div
        class="flex justify-between align-center custom-tree-node"
        slot-scope="{ node, data }"
      >
        <span class="word-ellipsis-1">{{ node.label }}</span>
        <div class="flex align-center more-btn">
          <!-- <span class="num">{{ data.id }}</span> -->
          <el-cascader
            v-if="!isEdit"
            class="el-icon-more icon-more menu-cascader"
            popper-class="menu-cascader-popper"
            :ref="`cascader-${data.id}`"
            :vis="num"
            v-model="value"
            :options="getOptions(data)"
            :props="{ expandTrigger: 'hover' }"
            @visible-change="visibleChange"
          >
            <template slot-scope="{ data }">
              <div
                class="flex align-center"
                @click="cascaderHandleChange(data, node)"
              >
                <span
                  :class="{
                    'has-line': data.value === 'auth' && deptManager_btn_del
                  }"
                  >{{ data.label }}</span
                >
                <el-tooltip
                  v-if="data.value === 'del'"
                  effect="dark"
                  content="该部门是根节点或存在子部门/成员，无法删除"
                  placement="top"
                >
                  <i class="iconfont icontubiaozhizuomoban12 icon-del"></i>
                </el-tooltip>
              </div>
            </template>
          </el-cascader>
        </div>
      </div>
    </el-tree>
    <!-- 修改部门权限 -->
    <EditDepartmentAuthDialog
      v-if="isEditDepartmentAuthDialog"
      ref="EditDepartmentAuthDialog"
      :department="currentNode"
      :isOpen="isEditDepartmentAuthDialog"
      @closeDialog="isEditDepartmentAuthDialog = false"
    />
    <!-- 修改部门名称 -->
    <!-- <EditDepartNameDialog
      v-if="isEditDepartNameDialog"
      ref="EditDepartNameDialog"
      :isOpen="isEditDepartNameDialog"
      @closeDialog="isEditDepartNameDialog = false"
    /> -->
    <!-- 删除信息提示 -->
    <TipDialog
      :tipContent="tipContent"
      :isOpen="isTipDialog"
      @closeDialog="isTipDialog = false"
      @confirmFn="delCurrentNode"
    />
    <AddDepartDialog
      v-if="isAddDepartDialog"
      ref="AddDepartDialog"
      :isOpen="isAddDepartDialog"
      @update="getTreeData"
      @closeDialog="isAddDepartDialog = false"
    />
  </div>
</template>
<script>
import { getTreeList, getUserList, delDept } from '@/api/admin/organization';
import { mapGetters } from 'vuex';
// 部门权限
import EditDepartmentAuthDialog from '@/components/dialog/admin/organization/edit-department-auth-dialog/index';
// 重命名
// import EditDepartNameDialog from '@/components/dialog/admin/organization/edit-depart-name-dialog/index';
// 客户账号删除
import TipDialog from '@/components/dialog/tip-dialog/index';
import AddDepartDialog from '@/components/dialog/admin/organization/add-depart-dialog';

export default {
  name: 'organization-tree-tructure',
  components: {
    EditDepartmentAuthDialog,
    // EditDepartNameDialog,
    TipDialog,
    AddDepartDialog
  },
  data() {
    return {
      num: 0,
      // isDisabled: true,
      isEditDepartmentAuthDialog: false,
      isTipDialog: false,
      isAddDepartDialog: false,
      currentNode: null,
      tipContent: {
        title: '您确定要删除吗？删除后不可恢复.'
      },
      expandedKeysVal: [],
      treeData: [],
      delCustomer: null,
      activeIndex: '1',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isdepartmentDialog: true,
      departmentComponent: null,
      addDepartment: null,
      indexArr: [],
      value: '',
      deptManager_btn_add: false,
      deptManager_btn_del: false
    };
  },
  props: {
    isEdit: Boolean,
    showOperation: Boolean,
    expandedKeys: {
      type: Array,
      default: () => []
    },
    current: {
      type: Object,
      default() {
        return null;
      }
    },
    hasData: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    permissions: {
      handler() {
        this.setPermissions();
      },
      deep: true
    },
    expandedKeys: {
      handler(val) {
        this.expandedKeysVal = val;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    getOptions() {
      return function(data) {
        let option = [
          {
            value: 'auth',
            // disabled: true,
            label: '数据权限'
          },
          {
            value: 'del',
            label: '删除',
            disabled:
              data.isRootNode === 0 ||
              data.isDisabled ||
              (data.children && data.children.length > 0)
          }
        ];
        if (!this.permissions['sys_dept_del']) {
          option = option.slice(0, 1);
        }
        return option;
      };
    },
    isDisabled() {
      if (!this.currentNode) {
        return true;
      }
      return (
        this.currentNode.isRootNode === 0 ||
        this.currentNode.isDisabled ||
        (this.currentNode.children && this.currentNode.children.length > 0)
      );
    }
  },
  created() {
    this.getData();
    this.setPermissions();
  },
  methods: {
    setPermissions() {
      this.deptManager_btn_add = this.permissions['sys_dept_add'];
      // this.deptManager_btn_edit = this.permissions['sys_dept_edit'];
      this.deptManager_btn_del = this.permissions['sys_dept_del'];
    },
    getData() {
      this.getTreeData();
    },
    async getTreeData() {
      const { data, code } = await getTreeList();
      if (code) {
        this.treeData = [];
        return;
      }
      this.treeData = data;
      // this.$refs.tree.setCurrentKey(data[0].id);
      this.handleNodeClick(data[0], false);
    },
    visibleChange(val) {
      // if (val) {
      // }
    },
    cascaderHandleChange(data, node) {
      switch (data.value) {
        case 'del':
          if (data.disabled) return;
          this.onSelectedDel();
          break;
        case 'auth':
          if (data.disabled) return;
          this.dataAuthHandle();
          break;
      }
      this.value = '';
    },
    async handleNodeClick(data, isAddOrDel) {
      // 点击操作拦截 - 添加/删除 跳过
      if (!isAddOrDel.isAddOrDel) {
        if (this.currentNode && this.currentNode.id === data.id) return;
      }
      if (this.validatenull(data)) return;
      data = await this.getList(data);
      this.currentNode = data;
      this.$refs.tree.setCurrentKey(data.id);
      this.expandedKeysVal = [data.id];
      this.$emit('currentNode', data);
    },
    async getList(nodeData) {
      if (!nodeData || !nodeData.id) return;
      const params = Object.assign(
        {
          size: 1,
          current: 1
        },
        { deptId: nodeData.id }
      );
      const { data } = await getUserList(params);

      if (data && data.length > 0) {
        nodeData.isDisabled = true;
      } else {
        nodeData.isDisabled = false;
      }
      this.num++;
      return nodeData;
    },
    /**
     * 添加组织
     * level:级别 => eq:同级 sub:子级
     */
    onAdd(level) {
      this.isAddDepartDialog = true;
      this.$nextTick().then(() => {
        this.$refs.AddDepartDialog.init(level, this.currentNode);
      });
    },
    // 删除选中
    onSelectedDel() {
      // 禁用状态
      if (!this.currentNode || !this.currentNode.id) {
        this.$message.warning({
          message: '请选择要删除的节点'
        });
        return;
      }
      this.isTipDialog = true;
    },
    async delCurrentNode() {
      // 非禁用状态 -- 可以执行删除操作
      this.isTipDialog = false;
      const { code, msg } = await delDept({
        id: this.currentNode.id
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '删除失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '删除成功！'
      });
      this.getTreeData();
      this.expandedKeysVal = [this.currentNode.parentId];
      this.currentNode = null;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      console.log(draggingNode);
      return false;
      // return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    upOrDownMove(arraw) {
      if (arraw === 'up') {
        console.log(arraw);
      } else {
        console.log(arraw);
      }
    },
    dataAuthHandle(nodeData) {
      this.isEditDepartmentAuthDialog = true;
    },
    addDepart(item, data) {
      let comps = ['addDepartment', 'addChildDepartment', 'addDepartment'];
      this.isdepartmentDialog = true;
      this.addDepartment = data;
      this.departmentComponent = comps[item];
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.tree {
  padding-right: 17px;
  .search-input {
    margin-bottom: 15px;
  }
}
.organization-tree {
  .num {
    color: $mainBlack25;
  }
  .menu-cascader,
  .el-menu-demo,
  .icon-add {
    display: none;
  }
  ::v-deep {
    .el-tree-node__content {
      height: 36px;
      border-radius: 4px;
      transition: all 0.5s;
      &:hover {
        background: rgba(var(--primary-opacity), 0.1);
        // color: #fff;
        .el-tree-node__expand-icon {
          // color: #fff;
          &.is-leaf {
            color: transparent;
          }
        }
        .menu-cascader,
        .el-menu-demo,
        .icon-add {
          display: block;
        }
      }
    }
    .el-tree-node.is-expanded.is-current.is-focusable,
    .el-tree-node.is-current.is-focusable {
      & > .el-tree-node__content {
        background: var(--primary);
        color: #fff;
        .el-tree-node__expand-icon {
          color: #fff;
          &.is-leaf {
            color: transparent;
          }
        }
        .num,
        .el-submenu__title i,
        .icon-add {
          color: #fff;
        }
        .menu-cascader,
        .el-menu-demo,
        .icon-add {
          display: block;
        }
      }
    }

    .el-menu--horizontal > .el-submenu .el-submenu__title {
      padding: 0;
      width: auto;
      height: 32px;
      line-height: 32px;
    }
    .el-submenu__icon-arrow {
      display: none;
    }
    .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
      border-bottom: 0;
    }
  }
  .custom-tree-node {
    width: calc(100% - 38px);
    .more-btn {
      line-height: 32px;
      .icon-more {
        margin: 0 6px;
        transform: rotate(90deg);
      }
    }
  }
}
.popper-submenu .el-menu .el-menu-item {
  padding: 0 17px;
}
.menu-cascader {
  height: 32px;
  margin: 0;
  ::v-deep {
    .el-input {
      display: none;
    }
  }
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
  }
  /deep/.el-dropdown button {
    width: 100%;
    border-radius: 3px 0 0 3px;
    border-right: 1px solid #eee;
  }
}
</style>
<style>
.menu-cascader-popper .popper__arrow {
  display: none !important;
}
.menu-cascader-popper .el-cascader-menu__wrap {
  height: auto !important;
}
.menu-cascader-popper .el-cascader-node.is-active > i {
  display: none !important;
}
.menu-cascader-popper .el-cascader-node.is-active .el-cascader-node__label {
  color: #606266;
  font-weight: normal;
}
.menu-cascader-popper .icon-del {
  margin-left: 8px;
}
.menu-cascader-popper .has-line::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  background: #e8e8e8;
  width: 100%;
}
.popper-submenu .el-menu {
  background: #fff !important;
}
.popper-submenu .el-menu .el-submenu__title {
  padding: 0;
}
.popper-submenu .el-menu .el-submenu__icon-arrow {
  right: 0;
}
</style>
