<template>
  <div>
    <el-form
      ref="form"
      :model="model"
      :rules="rules"
      label-suffix="："
      label-width="80px"
    >
      <el-row :gutter="20" class="row">
        <el-col>
          <el-alert
            title="监测时间不在任务周期范围内，该条数据不计入报告"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 8px;"
          />
        </el-col>
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
              :parentId="19"
              lazy
              clearable
              @change="onQuestionTypeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="栏目名称" prop="columnName">
            <el-input v-model="model.columnName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="栏目地址" prop="columnUrl">
            <el-input v-model="model.columnUrl"></el-input>
          </el-form-item>
        </el-col>
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
      model: {
        monitorTime: dateFormat(new Date(), 'yyyy-MM-dd'),
        type: [],
        description: '',
        images: [],
        columnName: '',
        columnUrl: ''
      },
      rules: {
        monitorTime: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        description: [{ required: true, message: '请输入', trigger: 'blur' }],
        images: [{ required: true, message: '请上传截图', trigger: 'change' }],
        columnName: [{ required: true, message: '请输入', trigger: 'blur' }],
        columnUrl: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: pattern.url, message: 'url格式不正确', trigger: 'blur' }
        ]
      }
    };
  },
  inject: ['param'],
  methods: {
    // 问题类型变化
    onQuestionTypeChange(val) {
      let [node] = this.$refs['cascaderQuestionType'].getCheckedNodes(true);
      this.model.description = node ? node.data.problemDesc : '';
    },
    onUploadImgsChange(urls) {
      this.model.images = urls;
      this.$refs['form'].validateField('images');
    },
    async doSubmit() {
      // 问题类别
      let [questionType, secondQuestionType] = this.model.type;
      // 栏目信息
      let channelInfoList = [
        {
          channelName: this.model.columnName,
          questionUrl: this.model.columnUrl
        }
      ];

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
        targetType: 19, // 指标
        questionType, // 问题类别
        secondQuestionType, // 问题类别二级
        questionCont: this.model.description, // 描述
        channelInfoList, // 栏目信息
        monitorTime: this.model.monitorTime,
        imgUrlList: this.model.images.map(item => item.url)
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

<style lang="scss" scoped></style>
