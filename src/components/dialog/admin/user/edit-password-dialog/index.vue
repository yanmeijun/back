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
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <!-- <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            placeholder="原密码"
          ></el-input>
        </el-form-item> -->
        <el-form-item prop="newpassword1">
          <el-input
            type="password"
            v-model="ruleForm.newpassword1"
            autocomplete="off"
            placeholder="新密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newpassword2">
          <el-input
            type="password"
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
  name: 'edit-pass-dialog',
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
        // password: '',
        newpassword1: '',
        newpassword2: ''
      },
      rules: {
        // password: [{ validator: validatePass, trigger: 'blur' }],
        newpassword1: [{ validator: validatePass, trigger: 'blur' }],
        newpassword2: [{ validator: validatePass2, trigger: 'blur' }]
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
          const { msg, code } = await updateUserWithInfo({
            password: this.ruleForm.newpassword1,
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
          // this.$store.dispatch('GetUserInfo');
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
