<template>
  <div class="role">
    <basic-container :bordr="true" :mini="true">
      <el-form
        class="no-rules-form"
        ref="refForm"
        :model="form"
        label-width="80px"
      >
        <el-row type="flex" class="flex flex-wrap justify-between">
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <div class="flex justify-end">
              <el-button @click="onResetQuery">重置</el-button>
              <el-button type="primary" @click="onGetList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">角色列表</span>
        <el-button
          v-if="roleManager_btn_add"
          type="primary"
          @click="onEditRole()"
          >添加</el-button
        >
      </div>
      <avue-crud
        class="table-no-menu"
        :data="tableData"
        :option="tableOption"
        :table-loading="loading"
        :page.sync="page"
        v-if="visibled"
        @on-load="onLoad"
      >
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="onLookRole(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="roleManager_btn_edit"
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="onEditRole(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="roleManager_btn_del"
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="onDelRole(scope.row)"
              ></i>
            </el-tooltip>
          </div>
          <!-- <el-button
            v-if="roleManager_btn_edit"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
            >编辑
          </el-button>
          <el-button
            v-if="roleManager_btn_del"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.index)"
            >删除
          </el-button>
          <el-button
            v-if="roleManager_btn_perm"
            type="text"
            icon="el-icon-plus"
            @click="handlePermission(scope.row, scope.index)"
            >权限
          </el-button> -->
        </template>
      </avue-crud>
    </basic-container>
    <EditRoleDialog
      ref="refEditRoleDialog"
      v-if="isEditRoleDialog"
      :isOpen="isEditRoleDialog"
      @update="onGetList"
      @closeDialog="isEditRoleDialog = false"
    />
  </div>
</template>
<script>
import {
  // addObj,
  // delObj,
  getRoleList
  // fetchRoleTree,
  // permissionUpd,
  // putObj
} from '@/api/admin/role';

import EditRoleDialog from '@/components/dialog/admin/role/edit-role-dialog/index';

import { reactive, toRefs, ref, nextTick } from '@vue/composition-api';
import { mapGetters } from 'vuex';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  diff: 190
});
export default {
  name: 'role',
  mixins: [mixin],
  components: {
    EditRoleDialog
  },
  data() {
    return {
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    };
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    permissions: {
      handler() {
        this.setPermissions();
      },
      deep: true
    }
  },
  created() {
    this.setPermissions();
  },
  methods: {
    setPermissions() {
      this.roleManager_btn_add = this.permissions['sys_role_add'];
      this.roleManager_btn_edit = this.permissions['sys_role_edit'];
      this.roleManager_btn_del = this.permissions['sys_role_del'];
      this.roleManager_btn_perm = this.permissions['sys_role_perm'];
    }
  },
  setup() {
    const refForm = ref(null);
    const refEditRoleDialog = ref(null);
    const state = reactive({
      isEditRoleDialog: false,
      form: {
        name: ''
      },
      tableOption: {
        index: true,
        indexLabel: '序号',
        menu: true, // 隐藏操作
        menuWidth: 98,
        tip: false,
        editBtn: false, // 添加按钮
        delBtn: false, // 添加按钮
        addBtn: false, // 添加按钮
        columnBtn: false, // 列显隐按钮
        refreshBtn: false, // 刷新按钮
        search: false,
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '角色名称',
            prop: 'roleName',
            width: 180
          },
          {
            label: '角色描述',
            prop: 'roleDesc',
            overHidden: true
          },
          {
            label: '创建时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            width: 140
          }
        ]
      },
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      changePage: {
        currentPage: 1,
        pageSize: 100
      },
      tableData: []
    });

    // 表格分页切换
    const onLoad = page => {
      state.changePage = page;
    };
    // 查询 / 获取列表
    const onGetList = async () => {
      state.loading = true;
      const params = Object.assign(
        {},
        {
          current: state.changePage.currentPage,
          size: state.changePage.pageSize
        },
        state.form
      );
      const { data, total } = await getRoleList(params);
      state.loading = false;
      state.tableData = data;
      state.page.total = total;
    };
    onGetList();

    // 查看角色
    const onLookRole = () => {};
    const onEditRole = row => {
      state.isEditRoleDialog = true;
      nextTick().then(() => {
        refEditRoleDialog.value.init(row);
      });
    };
    const onDelRole = () => {};

    // 重置
    const onResetQuery = () => {
      refForm.value.resetFields();
      onGetList();
    };
    // 添加/编辑
    const onShowEditDialog = () => {
      state.isEditRoleDialog = true;
    };
    return {
      refForm,
      refEditRoleDialog,
      ...toRefs(state),
      onGetList,
      onResetQuery,
      onShowEditDialog,
      onLoad,
      onLookRole,
      onEditRole,
      onDelRole
    };
  }
};
</script>
<style lang="scss" scoped>
.role {
}
</style>
