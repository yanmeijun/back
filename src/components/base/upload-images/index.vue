<template>
  <div class="upload">
    <el-upload
      class="kp-upload"
      :class="{ 'is-len': hasLen }"
      ref="upload"
      multiple
      drag
      :action="action"
      list-type="picture-card"
      :headers="headers"
      :limit="5"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeAvatarUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      :on-remove="removeFn"
      :on-exceed="exceedFn"
    >
      <!-- <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" />
        <AuthImage class="el-upload-list__item-thumbnail" :src="file.url" />
      </div> -->
      <div
        class="el-upload__text"
        @mouseenter="addPaste"
        @mouseleave="removePaste"
      >
        <p class="text1">鼠标移入拖拽区域，支持ctrl+v粘贴图片</p>
        <p class="text2">拖拽到该区域或 <em>点击上传</em>，完成上传</p>
        <p class="text2">可上传jpeg、png格式图片，最多上传5张</p>
      </div>
    </el-upload>
    <el-image
      class="view-image"
      ref="viewImg"
      v-if="srcList.length > 0"
      :preview-src-list="srcList"
    ></el-image>
  </div>
</template>
<script>
// const delay = (function() {
//   let timer = 0;
//   return function(callback, ms) {
//     clearTimeout(timer);
//     timer = setTimeout(callback, ms);
//   };
// })();
import store from '@/store';
export default {
  name: 'upload-images',
  data() {
    return {
      uploadPercent: 0,
      showProgress: false,
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      srcList: []
    };
  },
  model: {
    // event: 'change'
  },
  props: {
    urls: {
      type: Array,
      default: () => []
    },
    /**
     * 上传action
     */
    action: {
      type: String,
      default: 'cloud-common/file/uploadFile'
    }
  },
  computed: {
    hasLen() {
      return this.urls.length >= 5 ? true : false;
    },
    headers() {
      let token = store.getters.access_token;
      return {
        Authorization: `Bearer ${token}`
      };
    }
  },
  watch: {
    // value: {
    //   handler(pre, old) {
    //     if (pre !== old) {
    //       this.fileList = this.value;
    //     }
    //   },
    //   deep: true
    // }
  },
  mounted() {
    // 取个巧
    this.fileList = this.urls;
    document.addEventListener('paste', this.onPasteUpload);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.onPasteUpload);
  },
  methods: {
    addPaste() {
      this.isPaste = true;
    },
    removePaste() {
      this.isPaste = false;
    },
    removeFn(file, fileList) {
      // this.fileList = fileList;
      console.log('del', fileList);
      let urls = fileList.map(ele => {
        if (ele.name && ele.response) {
          return { url: ele.response.data.url };
        }
        return ele;
      });
      this.$emit('change', urls);
    },
    exceedFn(files, fileList) {
      this.$message({
        type: 'error',
        message: '只能上传5张截图'
      });
      console.log(files, fileList);
    },
    handleError(err) {
      console.log(err);
    },
    handleSuccess(res, file) {
      // console.log(res);
      // console.log('success', this.urls);
      if (res.code && res.code !== '0') {
        this.$message({
          type: 'error',
          message: '上传图片失败！'
        });
        file.status = 'error';
        console.log(this.fileList);
        return;
      }
      let urls = this.urls.map(ele => {
        if (ele.name && ele.response) {
          return { url: ele.response.data.url };
        }
        return ele;
      });
      urls = [...urls, { url: `${res.data.url}` }];
      let obj = {};
      for (let item of urls) {
        obj[item.url] = item;
      }
      let list = Object.values(obj);
      console.log('success', list);
      // delay(() => {
      //   this.$emit('change', list);
      // }, 300);
      this.$emit('change', list);
    },
    onPasteUpload(e) {
      // if (
      //   !e ||
      //   !e.target ||
      //   e.target.className !== 'el-upload-list el-upload-list--picture-card'
      // )
      //   return;
      if (!this.isPaste) return;
      const upload = this.$refs.upload;
      if (!upload) {
        return;
      }
      if (this.urls.length >= 5) {
        this.$message.error('上传图片不能超过5张!');
        return;
      }
      var cbd = e.clipboardData;
      var ua = window.navigator.userAgent;
      // 如果是 Safari 直接 return
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
      if (
        cbd.items &&
        cbd.items.length === 2 &&
        cbd.items[0].kind === 'string' &&
        cbd.items[1].kind === 'file' &&
        cbd.types &&
        cbd.types.length === 2 &&
        cbd.types[0] === 'text/plain' &&
        cbd.types[1] === 'Files' &&
        ua.match(/Macintosh/i) &&
        Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
      ) {
        return;
      }
      for (const item of cbd.items) {
        console.log(item);
        const isJPG = item.type === 'image/jpeg' || item.type === 'image/png';
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPEG/PNG 格式!');
          return;
        }
        let type = item.type.replace('image/', '') === 'png' ? '.png' : '.jpg';
        const file = new File([item.getAsFile()], new Date().getTime() + type, {
          type: item.type,
          lastModified: new Date()
        });
        if (!(file.size / 1024 / 1024 < 10)) {
          this.$message.error('上传图片大小不能超过 10MB!');
          return;
        }
        upload.handleStart(file);
      }
      upload.submit();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPEG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
    handlePictureCardPreview(file) {
      this.srcList = [file.url];
      this.$nextTick().then(() => {
        this.$refs.viewImg.showViewer = true;
      });
      // this.dialogVisible = true;
      // this.dialogImageUrl = file.url;
    },
    uploadVideoProcess(event, file, fileList) {
      this.showProgress = true; // 显示进度条
      this.uploadPercent = parseInt(event.percent); // 动态获取文件上传进度
      if (this.uploadPercent >= 100) {
        this.uploadPercent = 100;
        setTimeout(() => {
          this.showProgress = false;
        }, 1000); // 一秒后关闭进度条
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.kp-upload {
  position: relative;
  &.is-len {
    ::v-deep {
      .el-upload--picture-card {
        display: none;
      }
      .el-upload-list {
        display: block;
        padding-top: 0px;
      }
    }
  }
  ::v-deep {
    .el-upload {
      position: absolute;
      left: 0;
      top: 0;
    }
    .el-upload-list {
      display: flex;
      flex-wrap: wrap;
      padding-top: 90px;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 80px;
      height: 80px;
      &.is-error {
        border-color: #ff383a;
      }
    }
    .el-upload--picture-card {
      width: 100%;
      height: 80px;
      line-height: 90px;
      border: 0;
    }
    .el-upload-dragger {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.02);
    }
    .el-upload__tip {
      line-height: 20px;
    }
    .el-upload__text {
      line-height: 22px;
    }
    // .el-progress {
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    // }
    .text1 {
      padding-top: 7px;
      font-size: 14px;
    }
    .text2 {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}

.view-dialog {
  ::v-deep {
    .el-dialog {
      background: transparent;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}

.view-image {
  ::v-deep {
    .el-image__error {
      display: none;
    }
  }
}
</style>
