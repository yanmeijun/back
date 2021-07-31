<template>
  <el-dialog
    class="edit-user-name-dialog"
    title="修改姓名"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="accountName">
          <el-input
            v-model="ruleForm.accountName"
            placeholder="请输入姓名"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { updateUserWithInfo } from '@/api/admin/organization';
export default {
  name: 'edit-user-name-dialog',
  components: {},
  data() {
    return {
      ruleForm: {
        accountName: this.userInfo.accountName || ''
      },
      rules: {
        accountName: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字', trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {},
  methods: {
    submitHandle() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm);
          const { msg, code } = await updateUserWithInfo({
            accountName: this.ruleForm.accountName,
            userId: this.userInfo.userId
          });
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '修改失败！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '修改成功！'
          });
          this.$store.dispatch('GetUserInfo');
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-user-name-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 497px;
    }
  }
  .form-main {
    padding: 0 30px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
