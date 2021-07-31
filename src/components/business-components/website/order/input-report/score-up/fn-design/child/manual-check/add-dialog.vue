<template>
  <el-dialog
    class="dialog"
    title="添加"
    width="740px"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <add-form ref="addForm" v-if="conRender" @success="onSuccess" />
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onOk">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {
    AddForm: () => import('./add-form')
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 站点标识
    siteId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      self_visible: this.visible,
      conRender: true // 内容是否渲染
    };
  },
  watch: {
    visible(val) {
      this.self_visible = val;
      if (val) {
        this.conRender = true;
      }
    },
    self_visible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    onCancel() {
      this.close();
    },
    onClosed() {
      this.conRender = false;
    },
    onOk() {
      this.$refs['addForm'].submit();
    },
    onSuccess() {
      this.$emit('success');
      this.close();
    },
    close() {
      this.self_visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  max-height: 75vh;
}
</style>
