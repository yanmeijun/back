<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="flex justify-center avatar-main">
        <UploadAvatar :src="userInfo.avatar" @uploadSuccess="uploadSuccess" />
      </div>
      <el-form class="info-form" label-width="80px">
        <el-form-item label="账号：">
          <div class="color65 padding-left">
            {{ userInfo.username || '--' }}
          </div>
        </el-form-item>
        <el-form-item label="手机号：">
          <div class="color65 padding-left">{{ userInfo.phone || '--' }}</div>
        </el-form-item>
        <el-form-item label="邮箱：">
          <div class="color65 padding-left">{{ userInfo.email || '--' }}</div>
        </el-form-item>
        <el-form-item label="职务：">
          <div class="color65 padding-left">
            {{ userInfo.postName || '--' }}
          </div>
        </el-form-item>
        <el-form-item label="姓名：">
          <div class="padding-left flex justify-between align-center">
            <span class="color65">{{ userInfo.accountName || '--' }}</span>
            <el-button type="primary" class="kp-btn" @click="changeName"
              >修改</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="密码：">
          <div class="padding-left flex justify-between align-center">
            <span class="color65"
              >密码要求8-16位，须包含数字/字母/字符2种及以上组合</span
            >
            <el-button type="primary" class="kp-btn" @click="changePass"
              >修改</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </basic-container>
    <EditUserNameDialog
      ref="EditUserNameDialog"
      v-if="isOpenEditUserNameDialog"
      :isOpen="isOpenEditUserNameDialog"
      :userInfo="userInfo"
      @closeDialog="isOpenEditUserNameDialog = false"
    />
    <EditPasswordDialog
      ref="EditPasswordDialog"
      v-if="isOpenEditPasswordDialog"
      :userInfo="userInfo"
      :isOpen="isOpenEditPasswordDialog"
      @closeDialog="isOpenEditPasswordDialog = false"
    />
  </div>
</template>

<script>
import { updateUserWithInfo } from '@/api/admin/organization';
import UploadAvatar from '@/components/base/upload-avatar';
import EditUserNameDialog from '@/components/dialog/admin/user/edit-user-name-dialog';
import EditPasswordDialog from '@/components/dialog/admin/user/edit-password-dialog';
import { mapGetters } from 'vuex';
// import store from '@/store';
// import request from '@/router/axios';

export default {
  name: 'info',
  components: {
    UploadAvatar,
    EditUserNameDialog,
    EditPasswordDialog
  },
  data() {
    return {
      isOpenEditUserNameDialog: false,
      isOpenEditPasswordDialog: false
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {},
  methods: {
    async uploadSuccess(url) {
      const { msg, code } = await updateUserWithInfo({
        avatar: url,
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
    },
    changeName() {
      this.isOpenEditUserNameDialog = true;
    },
    changePass() {
      this.isOpenEditPasswordDialog = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-main {
  padding: 54px 0;
}
.info-form {
  width: 620px;
  margin: 0 auto;
  padding-bottom: 20px;
  .color65 {
    color: rgba(0, 0, 0, 0.65);
  }
  .padding-left {
    padding-left: 8px;
  }
  .kp-btn {
    padding: 9px 26px;
  }
}
</style>
