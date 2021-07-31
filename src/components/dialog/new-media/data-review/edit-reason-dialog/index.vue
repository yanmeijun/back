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
        label-width="90px"
      >
        <el-form-item label="账号名称：" prop="accountName">
          {{ form.accountName }}
        </el-form-item>
        <el-form-item label="监测时间：" prop="scanDate">
          {{ form.scanDate }}
        </el-form-item>
        <el-form-item label="错敏词：" prop="sensitiveWords">
          <el-input
            v-model="form.sensitiveWords"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="推荐修改：" prop="recommendUpdate">
          <el-input
            v-model="form.recommendUpdate"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题级别：" prop="questionLevel">
          <el-select v-model="form.questionLevel" placeholder="请选择">
            <el-option
              v-for="item in onFilterResultType(dicList.question_level)"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改说明：" prop="proposalDesc">
          <el-input
            type="textarea"
            v-model="form.proposalDesc"
            placeholder="请输入"
            :rows="3"
            maxlength="200"
            show-word-limit
          ></el-input>
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
        <!-- <el-form-item v-if="cDelReason" label="快照问题：" prop="imgQuestion">
          <el-radio-group v-model="form.imgQuestion">
            <el-radio
            border
              v-for="item in imgQuestions"
              :key="item.label + 'imgQuestion'"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item
          class="mis-info"
          label="原因："
          prop="resultTypeDetails"
          v-if="
            parseInt(form.resultType) === 3 || parseInt(form.resultType) === 4
          "
        >
          <el-radio-group v-model="form.resultTypeDetails">
            <el-radio
              border
              v-for="item in onFilterDic(dicList.result_type_details)"
              :key="item.label + 'reasons'"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
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
import { getErrorSensitive } from '@/api/new-media/data-review';
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
        accountName: '',
        scanDate: '',
        sensitiveWords: '',
        recommendUpdate: '',
        questionLevel: '',
        proposalDesc: '',
        resultType: '1',
        resultTypeDetails: ''
      },
      rules: {
        sensitiveWords: [
          {
            required: true,
            message: '请输入错敏词',
            trigger: 'blur'
          }
        ],
        recommendUpdate: [
          {
            required: true,
            message: '请输入推荐修改',
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
        proposalDesc: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        resultType: [
          {
            required: true,
            message: '请选择操作',
            trigger: 'change'
          }
        ],
        resultTypeDetails: [
          {
            required: true,
            message: '请选择原因',
            trigger: 'change'
          }
        ]
      },
      reasons: []
    });

    // 属性
    // -- 标记删除
    // const cDelReason = computed(() => state.form.result_type === 3);
    // --误报
    // const cMisInfoReason = computed(() => state.form.result_type === 4);
    // const cMisInfoReason = computed(() => {
    //   const types = {
    //     3: 'MIS',
    //     4: 'TAG_DEL'
    //   };
    //   const name = types[state.form.resultType];
    //   return state.reasons.filter(ele => ele['description'] === name);
    // });

    const { dicList } = useGetDicList([
      'result_type_details',
      'result_type',
      'question_level'
    ]);
    const onFilterDic = (option = []) => {
      const types = {
        3: 'MIS',
        4: 'TAG_DEL'
      };
      const name = types[state.form.resultType];
      return option.filter(ele => ele.description === name);
    };
    const onFilterResultType = (option = []) => {
      return option.filter(ele => ele.value);
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
        scanDate,
        sensitiveWords,
        recommendUpdate,
        questionLevel,
        proposalDesc,
        resultType,
        resultTypeDetails
      } = row;
      resultType = resultType ? resultType + '' : '1';
      resultTypeDetails =
        resultTypeDetails === null ? '' : '' + resultTypeDetails;
      questionLevel = questionLevel === null ? '' : '' + questionLevel;
      state.form = {
        check,
        accountName,
        scanDate,
        sensitiveWords,
        recommendUpdate,
        questionLevel,
        proposalDesc,
        resultType,
        resultTypeDetails
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
      onClear();
      const {
        sensitiveWords,
        recommendUpdate,
        proposalDesc,
        resultType,
        resultTypeDetails,
        questionLevel,
        check
      } = state.form;
      const params = {
        sensitiveWords,
        recommendUpdate,
        proposalDesc,
        resultType,
        resultTypeDetails,
        questionLevel,
        check,
        ids: [state.id]
      };
      const { code, msg } = await getErrorSensitive(params);
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
    const onClear = () => {
      switch (state.form.resultType) {
        case 1:
          state.form.reason = '';
          state.form.delReason = '';
          return;
        case 2:
          state.form.reason = '';
          state.form.delReason = '';
          return;
        case 3:
          state.form.reason = '';
          return;
        case 4:
          state.form.delReason = '';
          return;
      }
    };
    const onCancle = () => {
      emit('closeDialog');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onChangeHandle = val => {
      // switch (val) {
      //   case 1:
      //     state.form.reason = '';
      //     state.form.imgQuestion = '';
      //     state.form.other = '';
      //     return;
      //   case 2:
      //     state.form.reason = '';
      //     state.form.imgQuestion = '';
      //     state.form.other = '';
      //     return;
      //   case 3:
      //     state.form.reason = '';
      //     state.form.imgQuestion = 1;
      //     state.form.other = 1;
      //     return;
      //   case 4:
      //     state.form.reason = 1;
      //     state.form.imgQuestion = '';
      //     state.form.other = '';
      //     return;
      // }
    };

    // const onGetDic = async () => {
    //   const { data } = await getDict({
    //     type: 'result_type_details'
    //   });
    //   state.reasons = data;
    // };

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
      onCloseDialog,
      onChangeHandle
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
