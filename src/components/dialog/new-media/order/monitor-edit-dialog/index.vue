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
        :model="ruleForm"
        :rules="getRules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item label="监测时间：" prop="monitorTime">
          <el-date-picker
            class="kp-date-picker"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.monitorTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="问题类型："
          prop="questionType"
          class="radio-question"
        >
          <el-radio-group v-model="ruleForm.questionType">
            <el-radio
              :label="item.value"
              v-for="item in questionList"
              :border="item.value === 'XCT_CUSTOM' ? false : true"
              :key="item.value"
              :class="{
                'kp-date-picker radio-last': item.value === 'XCT_CUSTOM'
              }"
            >
              <span v-if="item.value !== 'XCT_CUSTOM'">{{ item.label }}</span>
              <el-input
                v-else
                class="radio-input"
                placeholder="自定义"
                v-model="ruleForm.remark"
                :disabled="isDisabled"
              ></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="最后更新时间："
          prop="lastUpdated"
          v-if="showLastUpdated"
        >
          <el-date-picker
            class="kp-date-picker"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.lastUpdated"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="描述：" prop="questionCont">
          <el-input
            class="textarea"
            type="textarea"
            placeholder="请输入"
            v-model="ruleForm.questionCont"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="截图：" prop="imgUrlList">
          <uploadImages
            v-if="isInit"
            :urls="ruleForm.imgUrlList"
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
import { addOrEditQuestion } from '@/api/new-media/monitor';
import { getDict } from '@/api/common/index';

import { dateFormat } from '@/util/date';
import uploadImages from '@/components/base/upload-images';
export default {
  name: 'moitor-edit-dialog',
  components: {
    uploadImages
  },
  data() {
    return {
      isInit: false,
      ruleForm: {
        monitorTime: dateFormat(new Date()),
        questionType: 'XCT_UPJS',
        remark: '',
        lastUpdated: dateFormat(new Date()),
        questionCont: '',
        imgUrlList: []
      },
      rules: {
        monitorTime: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        questionType: [
          { required: true, message: '请选择问题类型', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value === 'XCT_CUSTOM' && !this.ruleForm.remark) {
                callback(new Error('请填写自定义问题类型'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // imgUrlList: [
      //   'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      //   'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      // ],
      questionList: [],
      info: {}
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '内容发布情况'
    }
  },
  computed: {
    isDisabled() {
      return this.ruleForm.questionType === 'XCT_CUSTOM' ? false : true;
    },
    showLastUpdated() {
      return ['XCT_UPJS', 'XCT_UPBJS'].includes(this.ruleForm.questionType);
    },
    getRules() {
      let rules = {
        monitorTime: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        questionType: [
          { required: true, message: '请选择问题类型', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value === 'XCT_CUSTOM' && !this.ruleForm.remark) {
                callback(new Error('请填写自定义问题类型'));
              } else {
                callback();
              }
            }
          }
        ],
        lastUpdated: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
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
      if (this.ruleForm.questionType !== 'XCT_UPJS') {
        return rules;
      }
      return {
        monitorTime: rules.monitorTime,
        questionType: rules.questionType
      };
    }
  },
  watch: {
    'ruleForm.questionType'() {
      this.$refs['ruleForm'].validate('questionCont');
    }
  },
  created() {
    this.getQuestionList();
  },
  methods: {
    init(data, info) {
      this.isInit = true;
      this.info = info;
      if (this.validatenull(data) || !data.id) return;
      this.ruleForm = Object.assign({}, this.ruleForm, data);
    },
    submitHandle() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          // let { orderId, taskId, uniqueCode } = this.$route.query;
          // console.log(this.info);
          const {
            id,
            accountId,
            orderId,
            taskId,
            accountType,
            uniqueCode,
            orderCode,
            taskCode
          } = this.info;
          if (!this.showLastUpdated) {
            this.ruleForm.lastUpdated = '';
          }
          let data = Object.assign(
            {
              id,
              taskId,
              accountId,
              orderId,
              uniqueCode,
              accountType,
              orderCode,
              taskCode,
              targetType: 'XMT_CONT'
            },
            this.ruleForm
          );
          data.imgUrlList = data.imgUrlList.map(ele => ele.url);
          data.imgUrl = '';
          // console.log(data);
          let { code, msg } = await addOrEditQuestion(data);
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '修改失败！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '修改成功！'
          });
          this.$emit('update');
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async getQuestionList() {
      let { data } = await getDict({
        type: 'question_type'
      });
      let list = data.filter(ele => ele.description === 'XCT');
      let arr = [];
      let last = {};
      for (let i of list) {
        if (i.value === 'XCT_CUSTOM') {
          last = i;
        } else {
          arr.push(i);
        }
      }
      this.questionList = [...arr, last];
    },
    setImgUrlList(list) {
      // console.log('list');
      // console.log(list);
      this.ruleForm.imgUrlList = list;
      this.$refs['ruleForm'].validate('imgUrlList');
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.moitor-edit-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 660px;
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
      ::v-deep {
        .el-radio {
          margin-right: 0px;
        }
        .el-form-item__content {
          // padding-top: 8px;
        }
      }
    }
    .radio-last {
      margin-top: 10px;
    }
    .radio-input {
      width: calc(100% - 26px);
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
