<template>
  <basic-container :block="true" class="customer-basic">
    <el-row class="customer-row">
      <el-col :xs="24" :sm="24" :md="5" class="aside">
        <OrganizationTreeStucture ref="tree" @currentNode="currentNode">
          <el-button
            type="primary"
            class="btn-manage-org"
            @click="onGoOrgDepart"
            >管理部门</el-button
          >
        </OrganizationTreeStucture>
      </el-col>
      <el-col :xs="24" :sm="24" :md="19">
        <div
          class="customer-main"
          v-show="currentNodeData && currentNodeData.id"
        >
          <el-form class="top-form" ref="form" :model="form" label-width="50px">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="成员：" prop="username">
                  <el-autocomplete
                    class="inline-input"
                    v-model="form.username"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入"
                    :trigger-on-focus="false"
                    @select="searchSelect"
                    @change="searchChange"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="18">
                <div class="flex justify-end">
                  <el-button @click="resetQuery">重置</el-button>
                  <el-button type="primary" @click="toQuery">查询</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <div class="flex align-center justify-between kp-block-title">
            <!-- <span class="flex align-center name"
              >{{ currentNodeData && currentNodeData.name }}（id:
              {{ (currentNodeData && currentNodeData.id) || 0 }}）</span
            > -->
            <span class="flex align-center name">{{
              currentNodeData && currentNodeData.name
            }}</span>
            <div>
              <el-button
                plain
                v-if="false"
                :disabled="!checkedList.length > 0"
                @click="delChecked"
                >删除</el-button
              >
              <el-button
                plain
                :disabled="!checkedList.length > 0"
                @click="changeDepart"
                >调整所属部门</el-button
              >
              <el-button
                v-if="sys_user_add"
                type="primary"
                @click="showMemberDialog()"
                >添加成员</el-button
              >
            </div>
          </div>
          <!--表格渲染-->
          <ex-table
            :data="data"
            :option="tableOption"
            :loading="loading"
            :page="page"
            @on-load="onLoad"
            @selection-change="selectionChangeHandle"
          >
            <template slot="role" slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  scope.row.roleList.map(ele => ele.roleName).join('; ')
                "
                placement="top"
              >
                <div class="des word-ellipsis-1">
                  <el-tag
                    class="tag-info"
                    v-for="ele in scope.row.roleList"
                    :key="ele.roleId"
                    >{{ ele.roleName }}</el-tag
                  >
                </div>
              </el-tooltip>
            </template>
            <template slot="department" slot-scope="scope">
              <div>
                {{ scope.row.deptList.map(ele => ele.name).join(';') }}
              </div>
            </template>
            <template slot="menu" slot-scope="scope">
              <div class="flex center icons">
                <el-tooltip
                  v-if="sys_user_edit"
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <i
                    class="iconfont icontubiaozhizuomoban6"
                    @click="showMemberDialog(scope.row)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改密码"
                  placement="top"
                  :enterable="false"
                >
                  <i
                    class="iconfont icontubiaozhizuomoban13"
                    @click="showChangePass(scope.row)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="sys_user_del"
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <i
                    class="iconfont icontubiaozhizuomoban22"
                    @click="del(scope.row)"
                  ></i>
                </el-tooltip>
              </div>
            </template>
          </ex-table>
        </div>
      </el-col>
    </el-row>
    <!-- 删除 - 提示 -->
    <tipInfo-dialog
      v-if="tipShow"
      ref="tipShow"
      :tipContent="tipContent"
      :isOpen="tipShow"
      @confirmFn="delTipConfirm"
      @closeDialog="tipShow = false"
    ></tipInfo-dialog>
    <!-- <tipInfo-dialog
      v-if="delTipShow"
      ref="delTipShow"
      :tipContent="tipDelContent"
      :isOpen="delTipShow"
      @closeDialog="delTipShow = false"
    ></tipInfo-dialog> -->
    <!-- 添加/编辑成员 -->
    <EditOrganizationalMemberDialog
      v-if="isEditOrganizationalMemberDialog"
      ref="EditOrganizationalMemberDialog"
      :isOpen="isEditOrganizationalMemberDialog"
      @update="resetQuery"
      @closeDialog="isEditOrganizationalMemberDialog = false"
    />
    <!-- 修改密码 -->
    <EditOrganizationalPasswordDialog
      v-if="isChangePassDialog"
      ref="EditOrganizationalPasswordDialog"
      :isOpen="isChangePassDialog"
      @closeDialog="isChangePassDialog = false"
    />
    <!-- 调整所属部门 -->
    <ChangeDepartDialog
      v-if="isChangeDepartDialog"
      ref="isChangeDepartDialog"
      :checkedList="checkedList"
      :isOpen="isChangeDepartDialog"
      @update="resetQuery"
      @closeDialog="isChangeDepartDialog = false"
    />
  </basic-container>
</template>
<script>
import { getUserList, delUser } from '@/api/admin/organization';
import { mapGetters } from 'vuex';

import OrganizationTreeStucture from '@/components/base/organization-tree-structure';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import EditOrganizationalMemberDialog from '@/components/dialog/admin/organization/edit-organization-member-dialog/index';
import EditOrganizationalPasswordDialog from '@/components/dialog/admin/organization/edit-organization-password-dialog/index';
import ChangeDepartDialog from '@/components/dialog/admin/organization/change-depart-dialog/index';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  diff: 130
});

import { options } from './table-option/index';

export default {
  name: 'organizational-structure',
  mixins: [mixin],
  components: {
    OrganizationTreeStucture,
    TipInfoDialog,
    EditOrganizationalMemberDialog,
    ChangeDepartDialog,
    EditOrganizationalPasswordDialog
  },
  data() {
    return {
      tipShow: false,
      // delTipShow: false,
      isChangeDepartDialog: false,
      isEditOrganizationalMemberDialog: false,
      isChangePassDialog: false,
      tipContent: {
        title: '确定要删除成员吗？'
      },
      tipDelContent: {
        title: '确定要删除吗？删除之后将不可恢复.'
      },
      form: {
        username: ''
      },
      tableOption: options,
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
      data: [],
      checkedList: [],
      currentNodeData: null,
      delRow: {},
      sys_user_add: false,
      sys_user_edit: false,
      sys_user_del: false
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
      this.sys_user_add = this.permissions['sys_user_add'];
      this.sys_user_edit = this.permissions['sys_user_edit'];
      this.sys_user_del = this.permissions['sys_user_del'];
    },
    currentNode(node) {
      if (!node || !node.id) return;
      this.currentNodeData = node;
      this.resetTableHeight();
      this.getList();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    async getList(isAddOrDel) {
      // if (current) {
      //   this.hasData = false;
      // }
      if (!this.currentNodeData || !this.currentNodeData.id) return;
      this.loading = true;
      const params = Object.assign(
        {
          size: this.changePage.pageSize,
          current: this.changePage.currentPage
        },
        { deptId: this.currentNodeData.id },
        this.form
      );
      const { code, data, total } = await getUserList(params);
      this.loading = false;
      if (code) {
        this.data = [];
        this.page.total = 0;
        return;
      }
      this.page.total = total;
      this.data = data;
      // 更新tree是否能删除
      if (isAddOrDel && isAddOrDel.isAddOrDel) {
        this.$refs.tree.handleNodeClick(this.currentNodeData, isAddOrDel);
      }
    },
    showChangePass(row) {
      // 修改密码
      if (this.validatenull(row)) {
        return;
      }
      this.isChangePassDialog = true;
      this.$nextTick().then(() => {
        this.$refs.EditOrganizationalPasswordDialog.init(row);
      });
    },
    showMemberDialog(row) {
      // 添加/编辑 - 成员
      this.isEditOrganizationalMemberDialog = true;
      this.$nextTick().then(() => {
        this.$refs.EditOrganizationalMemberDialog.init(
          row,
          this.currentNodeData
        );
      });
    },
    // 重置查询列表
    resetQuery(isAddOrDel) {
      this.$refs['form'].resetFields();
      this.checkedList = [];
      this.resetParams();
      // 如果是添加， 更新左侧树
      this.getList(isAddOrDel);
    },
    toQuery() {
      this.resetParams();
      this.getList();
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    selectionChangeHandle(val) {
      console.log(val);
      this.checkedList = val;
    },
    del(row) {
      // 删除成员
      this.tipShow = true;
      this.tipContent = {
        title: `确定要删除成员<span class="kp-color-error">${row.username}</span>吗？`
      };
      this.delRow = row;
    },
    async delTipConfirm() {
      // 确认删除
      if (this.validatenull(this.delRow)) return;
      const { code, msg } = await delUser({
        id: this.delRow.userId
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
      this.delRow = {};
      this.resetQuery({ isAddOrDel: true });
    },
    // delChecked() {
    //   this.delTipShow = true;
    // },
    changeDepart() {
      this.isChangeDepartDialog = true;
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      console.log(queryString);
      cb([]);
    },
    searchSelect(item) {
      console.log(item);
    },
    searchChange(item) {
      // console.log(item);
    },
    onGoOrgDepart() {
      this.$router.push('/admin/organization-structure/organization/index');
    }
  }
};
</script>
<style lang="scss" scoped>
.customer-basic ::v-deep .el-card__body {
  height: 100%;
}
.customer-row {
  height: 100%;
  .btn-manage-org {
    margin-top: -7px;
    margin-bottom: 15px;
    width: 100%;
  }
}
.aside {
  height: 100%;
  border-right: 3px solid #e5e5e5;
  @media (max-width: 992.98px) {
    border-right: 0;
    height: auto;
  }
}
.customer-main {
  padding: 0 0 0 20px;
}
.tag-info {
  margin: 0 3px;
}
::v-deep {
  .el-card .avue-crud__tip {
    display: none !important;
  }
}
</style>
