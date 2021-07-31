<template>
  <el-dialog
    class="dialog"
    :title="`添加${mapping.type[type]}信息`"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <add-form
      v-if="form.render"
      ref="form"
      :type="type"
      :parent="parent"
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
import { mapping } from '@/views/tag/config';
import AddForm from '@/components/business-components/tag/type/add-form';
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
    /**
     * 类别
     * region: 地区
     * org: 机构
     * trade: 行业
     */
    type: {
      type: String,
      require: true,
      validator(value) {
        return ['region', 'org', 'trade'].includes(value);
      }
    },
    /**
     * 父级
     */
    parent: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      self_visible: this.visible,
      mapping,
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
.dialog {
  ::v-deep {
    .el-dialog {
      width: 55%;
    }
    .el-dialog__body {
      padding-top: 16px;
    }
  }
}
</style>
