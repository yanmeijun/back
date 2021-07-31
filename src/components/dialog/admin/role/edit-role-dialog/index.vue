<template>
  <el-dialog
    class="edit-role-dialog"
    :title="title"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form :model="form" :rules="rules" ref="refForm" label-width="120px">
        <h2 class="kp-dialog-title">基本信息</h2>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            v-model="form.roleName"
            maxlength="30"
            show-word-limit
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input
            v-model="form.roleDesc"
            placeholder="请输入"
            type="textarea"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <h2 class="kp-dialog-title">分配权限</h2>
        <div class="dialog-main-tree">
          <el-tree
            ref="refMenuTree"
            :data="treeData"
            :default-checked-keys="checkedKeys"
            :check-strictly="false"
            :props="defaultProps"
            :filter-node-method="onFilterNode"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
          />
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancle">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getRoleTree } from '@/api/admin/role';
import { fetchMenuTree } from '@/api/admin/menu';

import { reactive, ref, toRefs } from '@vue/composition-api';

export default {
  name: 'edit-role-dialog',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    const refMenuTree = ref(null);
    const refForm = ref(null);
    const state = reactive({
      isEdit: false,
      title: '添加角色',
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      roleId: '',
      treeData: [],
      checkedKeys: []
    });

    // 初始化数据--------
    const init = row => {
      if (root.validatenull(row)) {
        state.isEdit = false;
        state.title = '添加角色';
        return;
      }
      state.isEdit = true;
      state.title = '编辑角色';
      state.roleId = row.roleId;
    };
    const onGetRoleTree = async () => {
      onGetMenuTree();
      if (!state.roleId) {
        state.checkedKeys = [];
        return;
      }
      const { data } = await getRoleTree({
        roleId: state.roleId
      });
      state.checkedKeys = data;
    };
    const onGetMenuTree = async () => {
      const { data: res } = await fetchMenuTree();
      state.treeData = res.data || [];
    };
    onGetRoleTree();
    // 方法----------------
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          console.log(state.form);
        } else {
          console.log('error');
        }
      });
    };
    const onCancle = () => {
      onCloseDialog();
    };
    // 筛选 - tree
    const onFilterNode = (value, data) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };
    // 关闭弹框
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    return {
      refMenuTree,
      refForm,
      ...toRefs(state),
      init,
      onCancle,
      onSubmit,
      onFilterNode,
      onCloseDialog
    };
  }
};
</script>
<style lang="scss" scoped>
.edit-role-dialog {
  .filter-tree {
    height: 25vh;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
