<template>
  <el-dialog
    class="audit-tip"
    :title="option.title"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <TipAlert v-if="option.tip" :content="option.tip" />
      <el-form
        :key="isLoad"
        :model="form"
        :rules="rules"
        ref="refForm"
        label-width="120px"
      >
        <el-form-item class="radio" label="应用范围：" prop="step">
          <el-radio-group v-model="form.step">
            <el-radio border :label="1">该站点</el-radio>
            <el-radio border :label="2">涉及站点</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancle">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { setDarkLink } from '@/api/website/data-review';
import TipAlert from '@/components/base/tip-alert/index';
import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted
} from '@vue/composition-api';
export default {
  name: 'audit-tip',
  components: {
    TipAlert
  },
  props: {
    isOpen: { type: Boolean, default: false },
    option: {
      type: Object,
      default: () => {
        return {
          title: '审核',
          type: 0,
          row: {}
        };
      }
    }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    const state = reactive({
      rules: {},
      form: {
        step: 1
      },
      isLoad: false
    });

    // 属性
    onMounted(() => {
      // 防止 - 初次提交refs 为null
      state.isLoad = false;
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 方法
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          console.log(state.form);
          console.log(props);
          // const params = {
          //   ids: state.Ids,
          //   check: props.option.check,
          //   resultType: props.option.type
          // };
          // const { code, msg } = await setDarkLink(params);
          // if (code) {
          //   root.$message.error(msg || '修改失败！');
          //   return;
          // }
          // root.$message.success(msg || '修改成功！');
          // emit('update');
        } else {
          console.log('audit-tip err');
        }
      });
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onCancle = () => {
      onCloseDialog();
    };

    // 返回
    return {
      refForm,
      ...toRefs(state),
      onSubmit,
      onCancle,
      onCloseDialog
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.audit-tip {
  ::v-deep {
    .el-dialog {
      width: 540px;
    }
  }
  .radio ::v-deep {
    .el-form-item__content {
      .el-radio {
        margin-bottom: 8px;
      }
      .el-radio.is-bordered {
        margin-left: 0;
        margin-right: 8px;
      }
    }
  }
}
</style>
