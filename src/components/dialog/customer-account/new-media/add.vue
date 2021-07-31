<template>
  <el-dialog
    class="dialog"
    title="添加新媒体填报单位"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <add-form
      v-if="form.render"
      ref="form"
      :orgNode="orgNode"
      @on-success="onSuccess"
    />
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import AddForm from '@/components/business-components/customer-account/new-media/add-form';
export default {
  components: {
    AddForm
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 父级节点
    orgNode: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      self_visible: this.visible,
      form: {
        render: false // 是否渲染
      }
    };
  },
  watch: {
    visible(val) {
      this.self_visible = val;
      if (val) {
        this.form.render = true;
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
    // Dialog关闭动画结束时的回调
    onClosed() {
      this.form.render = false; // 完全关闭后销毁form表单 避免表单突兀消失
    },
    // 提交表单
    onSubmit() {
      this.$refs.form.submit();
    },
    // 操作成功回调
    onSuccess() {
      this.close();
      this.$emit('on-success');
    },
    close() {
      this.self_visible = false;
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dialog {
  ::v-deep {
    .el-dialog {
      width: 55%;
      max-width: 742px;
    }
    .el-dialog__body {
      padding-top: 16px;
    }
  }
}
</style>
