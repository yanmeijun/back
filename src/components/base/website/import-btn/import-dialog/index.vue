<template>
  <el-dialog
    class="import-dialog"
    :title="title"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-upload
        class="upload"
        drag
        :name="argName"
        :file-list="files"
        :limit="1"
        :show-file-list="false"
        :headers="cHeaders"
        :action="url"
        :on-success="onSuccess"
        :before-upload="onBeforeUpload"
        :on-progress="onProgress"
      >
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
          <p class="txt">
            上传文件必须为下载模版所给出的excel格式，请认真阅读模板内“填写须知”
          </p>
          <p class="txt">并按要求填写</p>
        </div>
      </el-upload>
      <div class="upload-info" v-if="fileName">
        <div class="flex err">
          <i class="el-icon-close icon-close" @click="onRemove"></i>
          <span class="file-name word-ellipsis-1">
            <i class="iconfont icontubiaozhizuomoban310"></i>
            {{ fileName }}
          </span>
          <div v-if="isSuccess && isProgressEnd">
            <p>
              <span class="kp-color-success">读取成功</span>
              ，共
              {{ resData.rightNum }} 条
            </p>
          </div>
          <div v-if="!isSuccess && isProgressEnd">
            <p v-if="isError">
              <span class="kp-color-error">上传失败</span>
            </p>
            <div v-else>
              <p>
                <span class="kp-color-error">读取失败</span>
                ，正确
                {{ resData.rightNum }} 条，错误 {{ resData.errorNum }} 条。
              </p>
              <p class="txt">请修改错误信息，重新导入。</p>
              <el-button
                class="detail-btn"
                size="mini"
                type="primary"
                @click="onErrDetail"
                >错误详情</el-button
              >
            </div>
          </div>
        </div>
        <el-progress
          v-if="isProgress"
          :percentage="loadProgress"
          :stroke-width="2"
        ></el-progress>
      </div>
    </div>
    <div slot="footer">
      <div class="flex justify-between footer-btn">
        <el-link class="kp-color-main" @click="onDownFile">下载模板</el-link>
        <div class="btn">
          <el-button @click="onCancle">取消</el-button>
          <el-button type="primary" :disabled="!isSuccess" @click="onSubmit"
            >提交</el-button
          >
        </div>
      </div>
    </div>
    <ErrorDetailDialog
      ref="ErrorDetailDialog"
      v-if="isErrorDetailDialog"
      :url="cDownErrorUrl"
      :data="resData"
      :isOpen="isErrorDetailDialog"
      @closeDialog="isErrorDetailDialog = false"
    />
  </el-dialog>
</template>

<script>
import { getFile, importFile } from '@/api/website/common';
import { computed, toRefs, reactive } from '@vue/composition-api';
import store from '@/store';

import ErrorDetailDialog from '../error-detail-dialog';
export default {
  name: 'import-dialog',
  components: {
    ErrorDetailDialog
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入'
    },
    url: {
      type: String,
      default: ''
    },
    modelUrl: {
      type: String,
      default: ''
    },
    argName: {
      type: String
    }
  },
  setup(props, { root, emit }) {
    const { modelUrl } = toRefs(props);
    // data
    const state = reactive({
      isSuccess: false,
      files: [],
      file: '',
      fileName: '',
      resData: {},
      isErrorDetailDialog: false,
      loadProgress: 0,
      isProgress: false,
      isProgressEnd: false,
      isError: false
    });

    const cHeaders = computed(() => {
      return {
        Authorization: `Bearer ${store.getters.access_token}`
      };
    });
    const cDownErrorUrl = computed(() => {
      return `/cloud-website-back/websiteAccountPool/downloadErrorMessage?uniqueness=${state.file}&errFileName=${state.fileName}`;
    });

    // 方法
    const onSubmit = async () => {
      if (!state.isSuccess || !state.file) {
        root.$message({
          type: 'error',
          message: '导入失败！'
        });
        return;
      }
      const { code, msg } = await importFile({
        uniqueness: state.file
      });
      if (code) {
        root.$message({
          type: 'error',
          message: msg || '导入失败！'
        });
        return;
      }
      onCloseDialog();
      root.$message({
        type: 'success',
        message: msg || '导入成功！'
      });
      emit('update');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onCancle = () => {
      onCloseDialog();
    };

    const onRemove = () => {
      state.file = '';
      state.fileName = '';
      state.files = [];
    };

    const onSuccess = res => {
      if (res && res.code === '0' && res.data.status) {
        // 内容无错误-成功
        state.isSuccess = true;
        state.file = res.data.uniqueness;
      }
      if (res && res.code === '0' && !res.data.status) {
        // 内容有错误
        state.isSuccess = false;
        state.file = res.data.uniqueness;
      }
      state.resData = res.data;
    };
    const onError = (err, file, fileList) => {
      state.isSuccess = false;
      state.isError = true;
    };
    const getSuffix = str => {
      return str.substr(str.lastIndexOf('.') + 1);
    };
    const onBeforeUpload = file => {
      state.isProgressEnd = false;
      const isXLS =
        getSuffix(file.name) === 'xls' || getSuffix(file.name) === 'xlsx';

      if (!isXLS) {
        root.$message.error('上传文件格式只能是 XLS/XLSX 格式!');
      }
      if (isXLS) {
        state.fileName = file.name;
      }
      return isXLS;
    };

    const onErrDetail = () => {
      if (!state.file) {
        root.$message.error('查看错误详情失败！');
        return;
      }
      state.isErrorDetailDialog = true;
    };

    const onDownFile = async () => {
      await getFile({ url: modelUrl.value });
    };

    const onProgress = (event, file, fileList) => {
      // console.log(event);
      // console.log(file);
      state.isProgress = true; // 显示进度条
      state.isProgressEnd = false;
      state.isError = false;
      state.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (state.loadProgress >= 100) {
        state.loadProgress = 100;
        onCheckStatus(file); // 一秒后关闭进度条
      }
    };

    const onCheckStatus = file => {
      state.timer = setTimeout(() => {
        console.log(file.status);
        clearTimeout(state.timer);
        if (file.status === 'fail') {
          state.isError = true;
        }
        if (file.status === 'uploading') {
          onCheckStatus(file);
          return;
        }
        state.isProgress = false;
        state.isProgressEnd = true;
      }, 500); // 一秒后关闭进度条
    };

    // 返回
    return {
      cHeaders,
      cDownErrorUrl,
      ...toRefs(state),
      onRemove,
      onSubmit,
      onCancle,
      onCloseDialog,
      onSuccess,
      onError,
      onBeforeUpload,
      onErrDetail,
      onDownFile,
      onProgress
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.import-dialog {
  ::v-deep {
    .el-dialog {
      width: 500px;
    }
  }
  .form-main {
    // padding: 0 30px;
  }
  .upload {
    width: 100%;
    margin-bottom: 12px;
    ::v-deep {
      .el-upload {
        width: 100%;
      }
      .el-upload-dragger {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.02);
      }
    }
  }
  .txt {
    color: #999;
    font-size: 12px;
    line-height: 20px;
  }
  .upload-info {
    border-radius: 4px;
    padding: 12px 10px;
    margin-bottom: 8px;
    background: #f8f8f8;
  }
  .err {
    position: relative;
    .icon-close {
      position: absolute;
      right: 4px;
      top: 0px;
      font-size: 10px;
      padding: 5px;
      color: rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }
  }
  .file-name {
    flex: 0 0 140px;
    padding-right: 8px;
  }
  .detail-btn {
    margin-top: 6px;
  }
}
</style>
