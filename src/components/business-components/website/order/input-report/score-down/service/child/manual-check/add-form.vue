<template>
  <div>
    <el-form
      ref="form"
      :model="model"
      :rules="rules"
      label-suffix="："
      label-width="80px"
    >
      <el-alert
        title="监测时间不在任务周期范围内，该条数据不计入报告"
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 16px;"
      />
      <form-group
        :title="`栏目${index + 1}`"
        v-for="(item, index) in model.columns"
        :key="index"
      >
        <template slot="right">
          <button
            v-if="index === 0"
            class="kp-add-remove kp-add-remove--small"
            @click="onColumnAdd"
          >
            <i class="el-icon-plus"></i>
          </button>
          <button
            v-else
            class="kp-add-remove kp-add-remove--small kp-add-remove--plain kp-add-remove--danger kp-add-remove--circle"
            @click="onColumnDel(index)"
          >
            <i class="el-icon-minus"></i>
          </button>
        </template>
        <el-row :gutter="20" class="row">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item
              label="栏目名称"
              :prop="`columns.${index}.name`"
              :rules="{
                required: true,
                message: '请输入',
                trigger: 'blur'
              }"
            >
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item
              label="栏目地址"
              :prop="`columns.${index}.url`"
              :rules="[
                {
                  required: true,
                  message: '请输入',
                  trigger: 'blur'
                },
                {
                  pattern: pattern.url,
                  message: 'url格式不正确',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input v-model="item.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </form-group>
      <form-group title="基本信息">
        <el-row :gutter="20" class="row">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="监测时间" prop="monitorTime">
              <el-date-picker
                type="date"
                v-model="model.monitorTime"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="问题类型" prop="type">
              <CascaderQuestionType
                ref="cascaderQuestionType"
                v-model="model.type"
                :parentId="49"
                lazy
                clearable
                @change="onQuestionTypeChange"
              />
            </el-form-item>
          </el-col>
          <template v-if="model.missingFactorVisible">
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="缺失要素" prop="missingFactor">
                <select-dict
                  ref="selectMissingFactor"
                  v-model="model.missingFactor"
                  type="missing_factor"
                  multiple
                  @change="onMissingFactorChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="发现" prop="found">
                <select-dict v-model="model.found" type="factor_found" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="问题描述" prop="description">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6 }"
                v-model="model.description"
                :maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="截图" prop="images">
              <UploadImages :urls="model.images" @change="onUploadImgsChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </form-group>
    </el-form>
  </div>
</template>

<script>
import { pattern } from '@/util/validate';
import { dateFormat } from '@/util/date';
import * as inputReportApi from '@/api/website/order/input-report';
import CascaderQuestionType from '@/components/business-components/website/order/input-report/common/cascader-question-type';
import UploadImages from '@/components/base/upload-images';
export default {
  components: {
    CascaderQuestionType,
    UploadImages
  },
  data() {
    return {
      pattern,
      model: {
        monitorTime: dateFormat(new Date(), 'yyyy-MM-dd'),
        type: [],
        description: '',
        images: [],
        columns: [
          {
            name: '',
            url: ''
          }
        ],
        missingFactor: [], // 缺失要素
        missingFactorVisible: false, // 是否显示
        found: '' // 发现
      },
      rules: {
        monitorTime: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        missingFactor: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        found: [{ required: true, message: '请选择', trigger: 'change' }],
        description: [{ required: true, message: '请输入', trigger: 'blur' }],
        images: [{ required: true, message: '请上传截图', trigger: 'change' }]
      }
    };
  },
  inject: ['param'],
  methods: {
    onColumnAdd() {
      if (this.model.columns.length >= 5) {
        this.$message.error('栏目最多添加5个');
        return;
      }
      let column = {
        name: '',
        url: ''
      };
      this.model.columns.push(column);
    },
    onColumnDel(index) {
      this.model.columns.splice(index, 1);
    },
    onUploadImgsChange(urls) {
      this.model.images = urls;
      this.$refs['form'].validateField('images');
    },
    // 问题类型变化
    onQuestionTypeChange(val) {
      let [node] = this.$refs['cascaderQuestionType'].getCheckedNodes(true);
      // 无选中
      if (!node) {
        // 重置
        this.model.missingFactorVisible = false;
        this.model.missingFactor = [];
        this.model.found = '';
        this.model.description = '';
        return;
      }

      // 相关赋值
      this.model.description = node.data.problemDesc;

      // 缺失要素相关
      let isMiss = node.value === 158; // 是否缺失
      this.model.missingFactorVisible = isMiss; // 缺失要素是否显示
      if (!isMiss) {
        this.model.missingFactor = [];
        this.model.found = '';
      }
    },
    // 缺失要素变化
    onMissingFactorChange(vals) {
      let selection = this.$refs.selectMissingFactor.getSelection();
      let labels = selection.map(item => item.label);
      this.model.description = `办事指南要素缺失，包括${labels.join('，')}。`;
    },
    async doSubmit() {
      // 问题类别
      let [questionType, secondQuestionType] = this.model.type;
      // 栏目信息
      let channelInfoList = [];
      this.model.columns.forEach(item => {
        channelInfoList.push({
          channelName: item.name,
          questionUrl: item.url
        });
      });

      let {
        taskId,
        taskCode,
        orderId,
        orderCode,
        custId,
        siteId,
        siteCode
      } = this.param.taskDetail;

      let data = {
        taskId,
        taskCode,
        orderId,
        orderCode,
        custId,
        siteId,
        siteCode,
        targetClassify: 0, // 指标类别
        targetType: 49, // 指标
        questionType, // 问题类别
        secondQuestionType, // 问题类别二级
        questionCont: this.model.description, // 描述
        channelInfoList, // 栏目信息
        monitorTime: this.model.monitorTime,
        imgUrlList: this.model.images.map(item => item.url),
        factor: this.model.missingFactor.join(','),
        factorNum: this.model.found
      };
      let { code, msg } = await inputReportApi.inputAdd(data);
      if (code !== 0) {
        this.$message.error(msg);
        return;
      }
      this.$message.success('操作成功');
      this.$emit('success');
    },
    submit() {
      this.$refs['form'].validate((valid, obj) => {
        if (valid) {
          this.doSubmit();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-img {
  /deep/ .el-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .icon {
      font-size: 28px;
      color: #8c939d;
    }
  }
}
</style>
