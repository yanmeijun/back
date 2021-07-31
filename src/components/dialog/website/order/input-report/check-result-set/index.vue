<template>
  <el-dialog
    class="dialog"
    title="检查结果修改"
    width="500px"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <Form ref="form" v-if="conRender" :task="task" :taskDetail="taskDetail" />
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onOk">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Form from './form';
export default {
  components: {
    Form
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 任务
    task: {
      type: Object,
      required: true,
      default: () => null
    },
    // 任务详情
    taskDetail: {
      type: Object,
      required: true,
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
    close() {
      this.self_visible = false;
    },
    onOk() {
      this.$refs['form'].getData((valid, data) => {
        if (valid) {
          this.$emit('valid', data);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
