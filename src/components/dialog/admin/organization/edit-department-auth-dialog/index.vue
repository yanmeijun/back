<template>
  <el-dialog
    class="edit-depart-dialog"
    :title="`设置该部门的数据权限`"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <div class="flex align-center justify-between vip-alert">
        <div class="flex align-center">
          <i class="iconfont icontubiaozhizuomoban25"></i>
          <span
            >成员继承部门数据权限，可在部门数据权限基础上再次设置成员数据权限，选择具体客户。部门数据权限调整后，成员数据权限将再次继承调整后的部门数据权限。</span
          >
        </div>
      </div>
      <el-form
        class="form"
        v-loading="loading"
        :model="model"
        :rules="rules"
        ref="form"
        label-width="80px"
      >
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="机构分类：" prop="authType">
              <el-radio-group v-model="model.isAuthority">
                <el-radio-button class="el-radio-button--plain" :label="0">
                  公司全部权限
                </el-radio-button>
                <el-radio-button class="el-radio-button--plain" :label="1">
                  自定义权限
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <div v-show="model.isAuthority === 1">
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="地区：" prop="districtList">
                <select-tag type="region" v-model="model.districtList" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="机构：" prop="organList">
                <select-tag type="org" v-model="model.organList" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="行业：" prop="tradeList">
                <select-tag type="trade" v-model="model.tradeList" />
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button :disabled="loading" @click="closeDialog">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="onSubmit">
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as deptApi from '@/api/admin/dept';
import SelectTag from '@/components/business-components/tag/common/select-tag';
export default {
  name: 'edit-department-auth-dialog',
  components: {
    SelectTag
  },
  data() {
    return {
      loading: false,
      model: {
        deptId: this.department.id,
        isAuthority: 0, // 0 全部权限  1 自定义权限
        districtList: [],
        organList: [],
        tradeList: []
      },
      rules: {}
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    // 部门
    department: {
      type: Object,
      default: () => null
    }
  },
  computed: {},
  methods: {
    async getPermission() {
      this.loading = true;
      let { code, data } = await deptApi.getPermission(this.department.id);
      this.loading = false;
      if (code === 0) {
        this.model.isAuthority = data.isAuthority;
        this.model.districtList = data.districtIdList || [];
        this.model.organList = data.organIdList || [];
        this.model.tradeList = data.tradeIdList || [];
      }
    },
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (!valid) {
          return;
        }
        let data = JSON.parse(JSON.stringify(this.model));
        if (this.model.isAuthority === 0) {
          delete data.districtList;
          delete data.organList;
          delete data.tradeList;
        } else {
          let hasAuth =
            data.districtList.length ||
            data.organList.length ||
            data.tradeList.length;
          if (!hasAuth) {
            this.$message.warning('请选择数据权限');
            return;
          }
        }
        this.loading = true;
        let { code } = await deptApi.updatePermission(data);
        this.loading = false;
        if (code === 0) {
          this.$message.success('操作成功');
        }
        this.closeDialog();
      });
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  },
  created() {
    this.department && this.getPermission();
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.edit-depart-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 617px;
      .el-dialog__body {
        padding-top: 16px;
      }
    }
  }
  .form-main {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 46vh;
    .form {
      padding: 0 30px;
      height: 235px;
    }
  }
  .vip-alert {
    margin-bottom: 16px;
    padding: 7px 12px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    .icontubiaozhizuomoban25 {
      color: rgb(24, 144, 255);
      margin-right: 8px;
      font-size: 16px;
    }
    .el-icon-close {
      cursor: pointer;
    }
  }
}
</style>
