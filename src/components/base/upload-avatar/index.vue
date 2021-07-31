<template>
  <el-upload
    class="avatar-uploader"
    action="newmedia-back/reportQuestion/uploadFile"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-error="errHandle"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import store from '@/store';
export default {
  name: 'upload-avatar',
  data() {
    return {
      imageUrl: ''
    };
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
    headers() {
      let token = store.getters.access_token;
      return {
        Authorization: `Bearer ${token}`
      };
    }
  },
  watch: {
    src(val) {
      this.imageUrl = val;
    }
  },
  mounted() {
    this.imageUrl = this.src;
  },
  methods: {
    async handleAvatarSuccess(res, file) {
      if (!res || res.code.length > 1) {
        this.$message.error('上传失败!');
        return;
      }
      this.imageUrl = res.data.url;
      this.$emit('uploadSuccess', res.data.url);
    },
    errHandle() {
      this.$message.error('上传失败!');
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  ::v-deep {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
}
</style>
