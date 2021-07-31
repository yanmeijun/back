<template>
  <el-dialog
    class="dialog"
    title="编辑"
    width="740px"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <EditForm
      ref="editForm"
      v-if="conRender"
      :data="data"
      @success="onSuccess"
    />
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
    EditForm: () => import('./edit-form')
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 要编辑的数据
     */
    data: Object
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
      this.$refs['editForm'].submit();
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
