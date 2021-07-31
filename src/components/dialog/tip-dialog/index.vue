<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
    :visible.sync="isOpen"
    class="tipModalWidth"
    :width="width"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div>
      <div class="flex">
        <i class="iconfont icontubiaozhizuomoban26 icon-info"></i>
        <span class="tip-modal" v-html="tipContent.title"></span>
      </div>
      <div class="tip-info" v-html="tipContent.info"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'tip-dialog',
  props: {
    tipContent: {
      type: Object,
      default: () => {
        return {
          title: '',
          info: ''
        };
      }
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '480px'
    }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog(val) {
      this.$emit('closeDialog', val);
    },
    submit() {
      this.$emit('confirmFn');
      this.closeDialog('submit');
    }
  }
};
</script>
<style lang="scss" scoped>
.tipModalWidth {
  border-radius: 2px;
  /deep/ .el-dialog {
    width: 480px;
    min-height: 136px;
    border-left: 7px solid var(--primary);
  }
  /deep/ .el-dialog {
    .el-dialog__header {
      display: none;
    }
  }
  /deep/ .el-dialog__footer {
    padding: 0 30px 24px 0;
  }
  /deep/ .el-dialog__body {
    padding-top: 30px;
    padding-bottom: 24px;
  }
}
.icon-info {
  color: var(--primary);
  font-size: 22px;
  margin-top: -1px;
}
.tip-modal {
  font-size: 16px;
  color: #000;
  line-height: 24px;
  padding-left: 16px;
}
.tip-info {
  margin-left: 46px;
  margin-top: 11px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 24px;
}
</style>
