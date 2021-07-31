<template>
  <el-dialog
    class="delete-reason"
    title="删除原因"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form
        ref="refForm"
        label-width="90px"
        :key="isLoad"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          class="mis-info"
          label="删除原因："
          prop="resultTypeDetails"
        >
          <el-radio-group v-model="form.resultTypeDetails">
            <el-radio
              border
              v-for="item in onFilterDic(dicList.result_type_details)"
              :key="item.label"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="flex align-center justify-between footer-btn">
        <p class="info">您操作的数据会作为机器学习的素材哦！</p>
        <div>
          <el-button @click="onCancle">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getErrorSensitive } from '@/api/new-media/data-review';
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  nextTick
} from '@vue/composition-api';
import useGetDicList from '@/hook/useGetDicList';
export default {
  name: 'delete-reason',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    // const { ids } = toRefs(props);
    const state = reactive({
      isLoad: true,
      form: {
        resultTypeDetails: 1
      },
      rules: {
        resultTypeDetails: [
          {
            required: true,
            message: '请选择删除原因',
            trigger: 'change'
          }
        ]
      }
    });
    const { dicList } = useGetDicList(['result_type_details']);
    const onFilterDic = (option = []) => {
      return option.filter(ele => ele.description === 'TAG_DEL');
    };
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
      if (!refForm.value) return;
      refForm.value.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, props.info, state.form);
          console.log('标记删除', params);
          const { code, msg } = await getErrorSensitive(params);
          if (code) {
            root.$message.error(msg || '修改失败！');
            return;
          }
          // 刷新列表
          onCloseDialog();
          emit('update');
        } else {
          console.log('error');
        }
      });
    };
    const onCancle = () => {
      onCloseDialog();
    };

    const onCloseDialog = () => {
      emit('closeDialog');
    };

    // 返回
    return {
      refForm,
      ...toRefs(state),
      dicList,
      onFilterDic,
      onSubmit,
      onCancle,
      onCloseDialog
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.delete-reason {
  /deep/ .el-dialog {
    width: 653px;
  }
  .form-main {
    padding: 0 30px;
    .mis-info {
      ::v-deep {
        .el-radio-group {
          width: 100%;
          .el-radio {
            margin: 0 8px 12px 0;
          }
        }
      }
    }
  }
}
.footer-btn .info {
  color: #717171;
  font-size: 12px;
}
</style>
