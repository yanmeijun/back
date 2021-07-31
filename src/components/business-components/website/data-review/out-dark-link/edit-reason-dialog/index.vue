<template>
  <el-dialog
    class="edit-reason"
    title="编辑"
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
        label-width="120px"
      >
        <el-form-item label="账号名称：" prop="accountName">
          {{ form.accountName }}
        </el-form-item>
        <el-form-item label="监测时间：" prop="scanDate">
          {{ form.scanDate }}
        </el-form-item>
        <el-form-item label="外链暗链地址：" prop="url">
          <el-tooltip
            class="item"
            effect="dark"
            :content="form.url"
            placement="top"
          >
            <div class="word-ellipsis-1">{{ form.url }}</div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="问题类型：" prop="questionType">
          <el-select v-model="form.questionType" placeholder="请选择">
            <el-option
              v-for="item in onFilterDic(dicList.question_type)"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题级别：" prop="questionLevel">
          <el-select v-model="form.questionLevel" placeholder="请选择">
            <el-option
              v-for="item in onFilterDic(dicList.question_level)"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作：" prop="resultType">
          <el-select v-model="form.resultType" placeholder="请选择">
            <el-option
              v-for="item in onFilterResultType(dicList.result_type)"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancle">取消</el-button
        ><el-button type="primary" :disabled="isSubmit" @click="onSubmit"
          >提交</el-button
        >
      </div>
    </div>
    <!-- 提示 -->
    <TipDialog
      v-if="isTipShowDialog"
      ref="TipShowDialog"
      :tipContent="showTipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onTipConfirm"
      @closeDialog="onTipClose"
    />
  </el-dialog>
</template>

<script>
import { setDarkLink } from '@/api/website/data-review';
import useGetDicList from '@/hook/useGetDicList';
import TipDialog from '@/components/dialog/tip-dialog';

import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted
} from '@vue/composition-api';
export default {
  name: 'edit-reason',
  components: {
    TipDialog
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    const state = reactive({
      isTipShowDialog: false,
      showTipContent: {
        title: '操作后数据将进入已审核列表页，还要继续吗？'
      },
      isLoad: true,
      isSubmit: false,
      id: '',
      preForm: {},
      form: {
        check: 0,
        scanDate: '',
        url: '',
        questionType: '',
        questionLevel: '',
        resultType: '1'
      },
      rules: {
        questionType: [
          {
            required: true,
            message: '请选择问题类型',
            trigger: 'blur'
          }
        ],
        questionLevel: [
          {
            required: true,
            message: '请选择问题级别',
            trigger: 'blur'
          }
        ],
        resultType: [
          {
            required: true,
            message: '请选择操作',
            trigger: 'change'
          }
        ]
      },
      reasons: []
    });

    // 属性
    // -- 标记删除

    const { dicList } = useGetDicList([
      'result_type_details',
      'result_type',
      'question_level',
      'question_type'
    ]);
    const onFilterDic = (option = []) => {
      return option.filter(ele => ele.value);
    };
    const onFilterResultType = (option = []) => {
      return option.filter(ele => ele.value && ele.value !== '4');
    };

    onMounted(() => {
      // 防止 - 初次提交refs 为null
      state.isLoad = false;
      // onGetDic();
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 方法
    // 初始化
    const init = row => {
      if (root.validatenull(row)) return;
      state.id = row.id;
      let {
        check,
        accountName,
        url,
        scanDate,
        questionType,
        questionLevel,
        resultType
      } = row;
      resultType = resultType ? resultType + '' : '1';
      questionType = questionType === null ? '' : '' + questionType;
      questionLevel = questionLevel === null ? '' : '' + questionLevel;
      state.form = {
        check,
        accountName,
        url,
        scanDate,
        questionType,
        questionLevel,
        resultType
      };
      state.preForm = { ...state.form };
    };
    // 提交
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          state.isSubmit = true;
          if (!state.form.check) {
            state.isTipShowDialog = true;
          } else {
            onTipConfirm();
          }
        } else {
          console.log('error');
        }
      });
    };
    const onTipConfirm = async () => {
      console.log('提交吧', state.form);
      // 根据result_type--清除一下 问题类型form
      const { questionType, resultType, questionLevel, check } = state.form;
      const params = {
        resultType,
        questionType,
        questionLevel,
        check,
        ids: [state.id]
      };
      const { code, msg } = await setDarkLink(params);
      if (code) {
        root.$message.error(msg || '修改失败！');
        state.isSubmit = false;
        return;
      }
      root.$message.success(msg || '修改成功！');
      emit('update');
      onCloseDialog();
    };
    const onTipClose = val => {
      console.log(val);
      if (val !== 'submit') {
        state.isSubmit = false;
      }
      state.isTipShowDialog = false;
    };
    const onCancle = () => {
      emit('closeDialog');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    // 返回
    return {
      refForm,
      ...toRefs(state),
      init,
      dicList,
      onFilterDic,
      onFilterResultType,
      onSubmit,
      onTipConfirm,
      onTipClose,
      onCancle,
      onCloseDialog
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.edit-reason {
  /deep/ .el-dialog {
    width: 660px;
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
</style>
