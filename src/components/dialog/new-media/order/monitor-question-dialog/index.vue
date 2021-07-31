<template>
  <el-dialog
    class="moitor-edit-dialog"
    :title="title"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form
        :model="state.ruleForm"
        :rules="getRules"
        :key="state.isLoad"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="问题URL：" prop="questionUrl">
          <el-input
            v-model="state.ruleForm.questionUrl"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="监测时间：" prop="monitorTime">
          <el-date-picker
            class="kp-date-picker"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="state.ruleForm.monitorTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="问题类型："
          prop="questionType"
          class="radio-question"
        >
          <select-dict
            v-model="state.ruleForm.questionType"
            :type="`question_type`"
            :filter="filterDic"
          ></select-dict>
        </el-form-item>
        <el-form-item label="描述：" prop="questionCont">
          <el-input
            class="textarea"
            type="textarea"
            placeholder="请输入"
            v-model="state.ruleForm.questionCont"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="截图：" prop="imgUrlList">
          <uploadImages
            :urls="state.ruleForm.imgUrlList"
            @change="setImgUrlList"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  computed,
  reactive,
  toRefs,
  ref,
  nextTick,
  onMounted
} from '@vue/composition-api';
import { addOrEditQuestion } from '@/api/new-media/monitor';

import { dateFormat } from '@/util/date';
import { validateURL } from '@/util/validate';
import uploadImages from '@/components/base/upload-images';
export default {
  name: 'moitor-question-dialog',
  components: {
    uploadImages
  },
  data() {
    return {
      srcList: [
        // 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        // 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      questionList: [
        {
          label: '仅显示',
          value: 1
        }
      ]
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添加互动回应问题'
    },
    targetType: {
      type: String,
      default: 'XMT_OTHER'
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { refs, root, emit }) {
    let { title, targetType, info } = toRefs(props);
    // const { $route } = root;
    const ruleForm = ref(null);
    const state = reactive({
      isLoad: true,
      id: '',
      isEdit: false,
      ruleForm: {
        questionUrl: '',
        monitorTime: dateFormat(new Date()),
        questionType: '',
        questionCont: '',
        imgUrlList: [
          // {
          //   url:
          //     'https://cloud3-front.oss-cn-hangzhou.aliyuncs.com/cloud_backweb/ewebeditor/uploadfile/1/20210118/51d7bbf0797e42a4abc0ef87fafacd47.jpeg'
          // },
          // {
          //   url:
          //     'https://cloud3-front.oss-cn-hangzhou.aliyuncs.com/cloud_backweb/ewebeditor/uploadfile/1/20210118/51d7bbf0797e42a4abc0ef87fafacd47.jpeg'
          // }
        ]
      }
    });

    // 属性
    const getRules = computed(() => {
      const rules = {
        questionUrl: [
          { required: true, message: '请输入链接地址', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!validateURL(value)) {
                callback(new Error('请输入合法链接地址'));
              } else {
                callback();
              }
            }
          }
        ],
        monitorTime: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        questionType: [
          { required: true, message: '请选择问题类型', trigger: 'change' }
        ],
        questionCont: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        imgUrlList: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      };
      if (title !== '添加其他问题') {
        return rules;
      }
      return {
        questionType: rules.questionType
      };
    });

    // 生命
    onMounted(() => {
      state.isLoad = false;
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 初始化
    const init = row => {
      if (root.validatenull(row)) {
        state.isEdit = false;
        return;
      }
      const {
        id,
        questionUrl,
        monitorTime,
        questionType,
        questionCont,
        imgUrlList = []
      } = row;
      state.isEdit = true;
      state.id = id;
      let list = imgUrlList.map(ele => {
        return {
          url: ele
        };
      });
      // 获取数据
      state.ruleForm = Object.assign({}, state.ruleForm, {
        questionUrl,
        monitorTime,
        questionType,
        questionCont,
        imgUrlList: list
      });
    };
    const submitHandle = () => {
      ruleForm.value.validate(async valid => {
        if (valid) {
          // let { orderId, taskId, uniqueCode } = $route.query;
          // console.log(info.value);
          const {
            accountId,
            accountType,
            orderCode,
            taskCode,
            orderId,
            taskId,
            uniqueCode
          } = info.value;
          let data = Object.assign(
            {
              id: state.id,
              taskId,
              accountId,
              orderId,
              uniqueCode,
              accountType,
              // mediaType,
              orderCode,
              taskCode,
              targetType: targetType.value
            },
            state.ruleForm
          );
          data.imgUrlList = data.imgUrlList.map(ele => ele.url);
          const { code, msg } = await addOrEditQuestion(data);
          let bool = state.isEdit ? '修改' : '添加';
          if (code) {
            root.$message({
              type: 'error',
              message: msg || bool + '失败！'
            });
            return;
          }
          root.$message({
            type: 'success',
            message: bool + '成功！'
          });
          emit('update', targetType.value);
          closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    };

    const filterDic = options => {
      let dic = targetType.value === 'XMT_OTHER' ? 'XOTHER' : 'XHD';
      return options.filter(ele => ele.description === dic);
    };

    const closeDialog = () => {
      emit('closeDialog');
    };

    const setImgUrlList = list => {
      // console.log('---------');
      // console.log(list);
      state.ruleForm.imgUrlList = list;
    };

    // 返回
    return {
      ruleForm,
      state,
      getRules,
      init,
      filterDic,
      submitHandle,
      closeDialog,
      setImgUrlList
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.moitor-edit-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 640px;
      .el-dialog__body {
        padding-bottom: 5px;
      }
    }
  }
  .form-main {
    padding: 0 30px;
    overflow-x: hidden;
    overflow-y: auto;
    .radio-question {
      ::v-deep.el-form-item__content {
        padding-top: 8px;
      }
    }
    .radio-last {
      margin-top: 10px;
    }
    .radio-input {
      width: 95%;
    }
    .textarea ::v-deep.el-textarea__inner {
      height: 80px;
      resize: none;
    }
    ::v-deep {
      .el-form-item--small.el-form-item {
        margin-bottom: 24px;
      }
    }
  }
}
@media (max-width: 768.98px) {
  .moitor-edit-dialog {
  }
}
</style>
