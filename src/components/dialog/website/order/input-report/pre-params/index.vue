<template>
  <el-dialog
    class="dialog"
    title="录入报告"
    width="500px"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <params-form
      ref="form"
      v-if="conRender"
      :taskDetail="taskDetail"
      @success="onSuccess"
      @error="onError"
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
import ParamsForm from './form';
export default {
  components: {
    ParamsForm
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 任务详情
    taskDetail: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      self_visible: this.visible,
      conRender: false
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
    onSuccess() {
      this.$emit('success');
      this.close();
    },
    onError() {},
    close() {
      this.self_visible = false;
    },
    onOk() {
      this.$refs['form'].submit();
    }
  }
};
</script>
<style lang="scss" scoped></style>
