<template>
  <el-dialog
    :title="'检查结果修改'"
    class="taskModal1"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="检查结果：" class="resultMargin" prop="checkResult">
        <el-radio-group v-model="form.checkResult">
          <el-radio label="1" border>合格</el-radio>
          <el-radio label="2" border>不合格</el-radio>
        </el-radio-group>
        <span
          style="line-height: 22px;height: 22px;color: #F5222D;font-size: 14px;padding-left: 12px;"
          >此结果为账号最终检查结果</span
        >
      </el-form-item>
      <el-form-item label="检查时间：" prop="checkTime" class="resultMargin2">
        <el-date-picker
          class="kp-date-picker"
          v-model="form.checkTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerDeliveryOptions"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit(true)">确 定</el-button>
    </div>
    <TipInfoDialog
      v-if="isTipConfirmDialog"
      ref="isTipConfirmDialog"
      :tipContent="tipContent"
      :isOpen="isTipConfirmDialog"
      @confirmFn="confirmHandel"
      @closeDialog="isTipConfirmDialog = false"
    />
  </el-dialog>
</template>

<script>
import { putOrderTaskDetailResult } from '@/api/new-media/order';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';

import { dateFormat } from '@/util/date';
export default {
  name: 'modiy-inspect-result-dialog',
  components: {
    TipInfoDialog
  },
  data() {
    return {
      isTipConfirmDialog: false,
      form: {
        checkResult: '1',
        checkTime: dateFormat(new Date())
      },
      isEnding: false,
      // 表单校验
      rules: {
        checkResult: [{ required: true, message: '请选择', trigger: 'change' }],
        checkTime: [
          { required: true, message: '选择检查时间', trigger: 'change' }
        ]
      },
      tipContent: {
        title: '此操作中已存在有检查结果的账号，是否继续修改？',
        info: `<p>给出检查结果后任务完成状态会变成已完成。</p><p>更改后的状态将不能恢复为交付中。</p>`
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    checkResult: {
      type: String || Number,
      default: ''
    },
    taskDate: {
      type: String || Number,
      default: Date.now() + ''
    }
  },
  computed: {
    isFinished() {
      return this.list.filter(ele => parseInt(ele.taskCompletionStatus) !== 2)
        .length > 0
        ? true
        : false;
    },
    isChecked() {
      return this.list.filter(ele => parseInt(ele.checkResult) !== 0).length > 0
        ? true
        : false;
    },
    pickerDeliveryOptions() {
      let _this = this;
      return {
        disabledDate(time) {
          return time.getTime() < new Date(_this.taskDate).getTime();
        }
      };
    }
  },
  mounted() {
    if (this.checkResult) {
      this.form.checkResult = this.checkResult;
    }
    if (this.list.length === 1) {
      this.form.checkTime = this.list[0].checkTime || dateFormat(new Date());
      return;
    }
    this.form.checkTime = dateFormat(new Date());
  },
  methods: {
    // 表单提交
    submit(sure) {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const { checkResult, checkTime } = this.form;
          const ids = this.list.map(ele => ele.id);
          // 是否已检查
          console.log(this.isChecked);
          if (!this.isChecked && sure) {
            this.tipContent = {
              title: '您确认给出检查结果吗？',
              info: `<p>给出检查结果后任务完成状态会变成已完成。</p><p>更改后的状态将不能恢复为交付中。</p>`
            };
            this.isTipConfirmDialog = true;
            return;
          }
          // 是否有未完成
          if (this.isFinished && sure && this.isChecked) {
            this.isTipConfirmDialog = true;
            return;
          }
          // 任务详情 - 修改结果
          let { code, msg } = await putOrderTaskDetailResult({
            ids,
            checkResult,
            checkTime,
            taskCompletionStatus: 2
          });
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '修改检查结果失败，请重试！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '修改检查结果，成功！'
          });
          this.$emit('update');
          this.closeDialog();
        }
      });
    },

    confirmHandel() {
      this.submit(false);
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.taskModal1 {
  .el-radio {
    margin-right: 0;
  }
  ::v-deep.el-dialog {
    width: 554px;
  }
  ::v-deep.el-dialog__body {
    padding: 16px 50px 30px;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid #e8e8e8;
    margin: 0 30px;
    padding: 11px 0;
  }
}
</style>
