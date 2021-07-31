<template>
  <div>
    <el-form ref="form" :model="model" :rules="rules" label-width="135px">
      <el-row :gutter="20" class="row">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item
            class="el-form-item--ex-border-radio"
            label="检查结果"
            prop="checkResult"
          >
            <el-radio v-model="model.checkResult" label="1" border>
              合格
            </el-radio>
            <el-radio v-model="model.checkResult" label="2" border>
              不合格
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="监测时间" prop="checkTime">
            <el-date-picker
              type="date"
              v-model="model.checkTime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 100%"
              :picker-options="{
                disabledDate: checkTimeDisabledFn
              }"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 任务
    task: {
      type: Object,
      required: true,
      default: () => null
    },
    // 任务详情
    taskDetail: {
      type: Object,
      required: true,
      default: () => null
    }
  },
  data() {
    let validateCheckResult = (rule, value, callback) => {
      if (value === '0') {
        callback(new Error('请选择'));
      } else {
        callback();
      }
    };
    return {
      model: JSON.parse(JSON.stringify(this.taskDetail)),
      rules: {
        checkResult: [{ validator: validateCheckResult, trigger: 'change' }],
        checkTime: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    };
  },
  methods: {
    checkTimeDisabledFn(date) {
      let startDate = new Date(this.task.startTime.replace('-', '/'));
      if (date < startDate) {
        return true;
      }
    },
    getData(cb) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb(valid, {
            checkResult: this.model.checkResult,
            checkTime: this.model.checkTime
          });
        } else {
          cb(valid);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item--border-radio {
  /deep/ .el-form-item__content {
    .el-radio {
      margin: 0;
      & + .el-radio {
        margin-left: 4px;
      }
    }
  }
}
</style>
