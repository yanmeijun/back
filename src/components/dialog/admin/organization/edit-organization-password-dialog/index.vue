<template>
  <el-dialog
    class="edit-pass-dialog"
    title="修改密码"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="账号：">
          <p>{{ info.accountName }}</p>
        </el-form-item>
        <el-form-item prop="newpassword1" label="密码：">
          <el-input
            type="password"
            v-model="ruleForm.newpassword1"
            autocomplete="off"
            show-password
            placeholder="6-16位的字母/数字/组合"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newpassword2" label="确认密码：">
          <el-input
            type="password"
            show-password
            v-model="ruleForm.newpassword2"
            autocomplete="off"
            placeholder="确认密码"
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
import { pattern } from '@/util/validate';
export default {
  name: 'edit-organization-password-dialog',
  components: {},
  data() {
    let validatePass = (rule, value, callback) => {
      let reg = pattern.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!reg.test(value)) {
        callback(new Error('6-16位的字母/数字/组合'));
      } else {
        if (this.ruleForm.newpassword2 !== '') {
          this.$refs.ruleForm.validateField('newpassword2');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newpassword1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        newpassword1: '',
        newpassword2: ''
      },
      rules: {
        newpassword1: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        newpassword2: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ]
      },
      info: {}
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    init(row) {
      this.info = row;
    },
    submitHandle() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm);
          let bool = await this.updateUser();
          if (!bool) return;
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async updateUser() {
      const { msg, code } = await updateUserWithInfo({
        password: this.ruleForm.newpassword1,
        userId: this.info.userId
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '修改成员失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '修改成员成功！'
      });
      return true;
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-pass-dialog {
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
