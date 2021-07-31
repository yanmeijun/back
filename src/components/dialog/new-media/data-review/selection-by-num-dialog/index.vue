<template>
  <el-dialog
    class="selection-by-num"
    title="按序号选择当页数据"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form
        :model="form"
        :rules="rules"
        :key="isLoad"
        ref="refForm"
        label-width="90px"
      >
        <el-form-item label="所选序号" prop="num">
          <el-input v-model="form.num" placeholder="例如：1-5、8、11-13">
            <div slot="suffix">
              当前序号范围1-{{ pageSize }}
              <!-- <span
                :class="{
                  'kp-color-error': count.pageSize > pageSizes * pageSize
                }"
                >{{ count.pageSize }}条</span
              >/{{ pageSizes }}页 -->
            </div>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancle">取消</el-button
        ><el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted
} from '@vue/composition-api';
export default {
  name: 'selection-by-num',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    const { pageSize } = toRefs(props);
    const state = reactive({
      isLoad: true,
      form: {
        num: ''
      },
      rules: {
        num: [
          {
            required: true,
            message: '请输入有效序号',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let msg = onCheckNum(value);
              if (msg) {
                callback(new Error(msg));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
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
          let [one = 0, two = 0] = state.form.num.split('-');
          let res = two > 0 && one !== two ? [one, two] : [one];
          emit('select', res);
          onCloseDialog();
        } else {
          console.log('error');
        }
      });
    };
    const onCancle = () => {
      emit('closeDialog');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onCheckNum = value => {
      let reg = /^\d+(-?\d+)?$/g;
      const size = pageSize.value;
      const msg = {
        min: '序号不能小于1',
        max: `序号不能大于${size}`,
        err: '请输入有效序号',
        order: '开始序号不能大于结束序号'
      };
      if (!value || !reg.test(value)) {
        return msg.err;
      }
      let [one = 0, two = 0] = value.split('-');
      one = parseInt(one);
      two = parseInt(two);
      // 页码差值;
      if (one <= 0) {
        return msg.min;
      }
      if (one > size) {
        return msg.max;
      }
      if (!two || two === 0) return '';
      // 两个值情况
      if (two > size) {
        return msg.max;
      }
      if (two - one < 0) {
        return msg.order;
      }
      return '';
    };

    // 返回
    return {
      refForm,
      ...toRefs(state),
      onSubmit,
      onCancle,
      onCloseDialog,
      onCheckNum
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.selection-by-num {
  /deep/ .el-dialog {
    width: 590px;
  }
  .form-main {
    padding: 0 30px;
  }
}
</style>
