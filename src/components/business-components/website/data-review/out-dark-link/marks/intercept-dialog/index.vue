<template>
  <el-dialog
    class="edit-reason"
    title="添加为拦截"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <TipAlert content="标记后可通过筛选条件单独查看" />
      <el-form
        :model="form"
        :rules="rules"
        :key="isLoad"
        ref="refForm"
        label-width="120px"
      >
        <el-form-item v-if="form.url" label="外链暗链地址：" prop="url">
          <div class="flex align-center">
            <el-tooltip
              class="item"
              effect="dark"
              :content="form.url"
              placement="top"
            >
              <el-link
                class="word-ellipsis-1"
                type="primary"
                :href="form.url"
                target="_blank"
                >{{ form.url }}</el-link
              >
            </el-tooltip>
            <i
              class="el-icon-document-copy copy-icon"
              @click="onCopyLink(form.url)"
            ></i>
          </div>
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
import { getErrorSensitive } from '@/api/website/data-review';
import useGetDicList from '@/hook/useGetDicList';
import TipDialog from '@/components/dialog/tip-dialog';
import TipAlert from '@/components/base/tip-alert/index';
import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted
} from '@vue/composition-api';
export default {
  name: 'intercept-dialog',
  components: {
    TipDialog,
    TipAlert
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
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
      form: {
        questionType: '',
        questionLevel: '',
        step: 1
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
        ]
      }
    });

    // 属性

    // -- hook

    const { dicList } = useGetDicList(['question_level', 'question_type']);
    const onFilterDic = (option = []) => {
      return option.filter(ele => ele.value);
    };
    onMounted(() => {
      // 防止 - 初次提交refs 为null
      state.isLoad = false;
      init(props.rows);
      // onGetDic();
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 方法
    // 初始化
    const init = rows => {
      if (root.validatenull(rows) || rows.length > 1) return;
      let { url, questionType, questionLevel } = rows[0];
      questionType = questionType === null ? '' : '' + questionType;
      questionLevel = questionLevel === null ? '' : '' + questionLevel;
      state.form = {
        url,
        questionType,
        questionLevel
      };
    };
    // 提交
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          state.isSubmit = true;
          onTipConfirm();
        } else {
          console.log('error');
        }
      });
    };
    const onTipConfirm = async () => {
      console.log('提交吧', state.form);
      // 根据result_type--清除一下 问题类型form
      const { questionType, questionLevel } = state.form;
      const params = {
        questionType,
        questionLevel
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
    const onCancle = () => {
      emit('closeDialog');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };

    const onCopyLink = text => {
      const input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.left = '-200%';
      document.body.appendChild(input);
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', text);
      input.select();
      input.setSelectionRange(0, text.length);
      try {
        document.execCommand('copy');
        root.$message.success('复制成功!');
      } catch (err) {
        console.log('复制失败!');
      }
      document.body.removeChild(input);
    };
    // 返回
    return {
      refForm,
      ...toRefs(state),
      init,
      dicList,
      onFilterDic,
      onSubmit,
      onTipConfirm,
      onTipClose,
      onCancle,
      onCloseDialog,
      onCopyLink
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
  .copy-icon {
    margin-left: 16px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #266bee;
    }
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
