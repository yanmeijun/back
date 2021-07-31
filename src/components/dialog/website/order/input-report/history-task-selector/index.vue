<template>
  <!-- 站点历史数据选择 -->
  <el-dialog
    class="dialog"
    title="选择历史任务"
    width="1000px"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <task-list
      ref="taskTable"
      v-if="conRender"
      :taskId="taskId"
      :siteId="siteId"
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
import TaskList from './task-list';
export default {
  components: {
    TaskList
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 任务id
    taskId: {
      type: [String, Number],
      default: ''
    },
    // 站点id
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
      let data = this.$refs.taskTable.table.selection || [];
      data = JSON.parse(JSON.stringify(data));
      this.$emit('on-ok', data);
      this.close();
    },
    close() {
      this.self_visible = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
