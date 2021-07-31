<template>
  <basic-container :block="true" class="customer-basic">
    <el-row class="customer-row">
      <el-col :xs="24" :sm="24" :md="5" class="aside">
        <organization-tree
          ref="organizationTree"
          :current.sync="currentNode"
          head-fixed
          show-operation
          :keyword="$route.query.custCode"
        />
      </el-col>
      <el-col
        class="customer-main"
        v-if="currentNode"
        :xs="24"
        :sm="24"
        :md="19"
      >
        <div class="form-wrap">
          <transition name="el-fade-in" mode="out-in">
            <!-- 编辑视图 -->
            <edit-form
              v-if="isEdit"
              ref="editForm"
              :id="currentNode.id"
              @on-success="onSaveSuccess"
            />
            <!-- 查看视图 -->
            <view-form v-else :id="currentNode.id" />
          </transition>
        </div>
        <!-- 动作 -->
        <div class="action">
          <el-button v-if="!isEdit" type="primary" @click="onEdit">
            编辑
          </el-button>
          <template v-else>
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onEditCancle">取消</el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import OrganizationTree from '@/components/base/organization-tree';
import EditForm from '@/components/business-components/customer-account/organization/edit-form';
import ViewForm from '@/components/business-components/customer-account/organization/view-form';
export default {
  name: 'org-account',
  components: {
    OrganizationTree,
    EditForm,
    ViewForm
  },
  data() {
    return {
      currentNode: this.$route.query.id
        ? { id: parseInt(this.$route.query.id) }
        : null, // 当前节点
      isEdit: false // 是否编辑
    };
  },
  methods: {
    onEdit() {
      this.isEdit = true;
    },
    onEditCancle() {
      this.isEdit = false;
    },
    onSave() {
      this.$refs.editForm.submit();
    },
    onSaveSuccess() {
      this.isEdit = false;
      this.$refs.organizationTree.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.customer-basic ::v-deep .el-card__body {
  height: 100%;
}
.customer-row {
  height: 100%;
  @media (max-width: 882.88px) {
    overflow-y: auto;
  }
}
.aside {
  padding-right: 17px;
  height: 100%;
  border-right: 3px solid #e5e5e5;
  overflow: auto;

  @media (max-width: 882.88px) {
    border-right: 0;
    height: auto;
  }
}
.customer-main {
  display: flex;
  flex-direction: column;
  padding: 0 0 0 15px;
  height: 100%;
  .form-wrap {
    flex: 1 1 auto;
    overflow-x: hidden;
  }
  .action {
    flex: 0 0 auto;
    padding-top: 20px;
    text-align: center;
  }
}
</style>
