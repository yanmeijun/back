<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
    :title="getTitle"
    class="taskModal"
    :visible.sync="isOpen"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="167px">
      <el-form-item label="生成报告方式:" prop="reportMode">
        <select-dict
          v-model="form.reportMode"
          @change="changeReportMode"
          :type="`report_mode`"
          :filter="filterDict"
        ></select-dict>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报告数量:" class="activeNum">
            {{ form.reportNum }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="报告内容:" prop="reportCont">
        <select-dict
          v-model="form.reportCont"
          :type="`report_cont`"
        ></select-dict>
      </el-form-item>
      <el-form-item
        label="引入近几次检查结果:"
        prop="resultTimes"
        v-if="showTimes"
      >
        <select-dict
          v-model="form.resultTimes"
          :type="`result_times`"
          :filter="filterReportContDict"
        ></select-dict>
      </el-form-item>
      <!-- <el-form-item label="报告格式:" prop="permission">
        <el-select
          v-model="form.reportFormat"
          placeholder="请选择"
          style="width: 361px;"
        >
          <el-option
            v-for="item in reportFormatList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getReportNumByParams,
  getResultTimesByParams,
  postReport
} from '@/api/new-media/report';
import { mapGetters } from 'vuex';
export default {
  name: 'taskModal',
  data() {
    return {
      title: '生成报告',
      form: {
        reportMode: '',
        reportNum: 0,
        reportCont: '0',
        resultTimes: '0'
      },
      // 表单校验
      rules: {
        reportCont: [
          { required: true, message: '报告内容', trigger: 'change' }
        ],
        resultTimes: [
          { required: true, message: '引入近几次检查结果', trigger: 'change' }
        ]
      },
      latelyList: 0,
      showTimes: false,
      reportFormatList: [
        { value: '1', label: 'word' },
        { value: '2', label: 'pdf' }
      ],
      reportTypeList: []
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    taskInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getTitle() {
      let title = this.reportTypeList.find(
        ele => ele.value === this.form.reportMode
      );
      return `${(title && title.label) || ''}生成报告`;
    },
    ...mapGetters(['currentDisplay'])
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getReportTimes();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          // console.log(this.form);
          const { id, custCode, orderId, custId } = this.$route.query;
          const {
            taskName,
            orderCode,
            taskCode,
            startTime,
            endTime
          } = this.taskInfo;
          let data = Object.assign(
            {
              status: 0, // 0: 未删除，1删除
              reportStatus: 0,
              reportType: 0, // 0：人工；1：系统
              reportStyle: 'zip',
              prodId: this.currentDisplay.value,
              taskId: id,
              taskName,
              orderCode,
              taskCode,
              custCode,
              custId,
              orderId,
              dataStart: startTime,
              dataEnd: endTime
            },
            this.form
          );
          const { code, msg } = await postReport(data);
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '生成报告失败，请重新生成！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '生成报告成功！'
          });
          this.$emit('update');
          this.closeDialog();
        }
      });
    },
    changeReportMode(val) {
      this.getReportNum(val);
    },
    async getReportNum(val) {
      const { id, custCode, custId } = this.$route.query;
      let { reportMode } = this.form;
      if (val) {
        reportMode = val;
      }
      let { data } = await getReportNumByParams({
        custId,
        taskId: id,
        reportMode,
        custCode
      });
      this.form.reportNum = data;
    },
    async getReportTimes() {
      const { orderId } = this.$route.query;
      let { data } = await getResultTimesByParams({
        orderId,
        deliveryStatus: 2
      });
      this.latelyList = data;
      this.showTimes = true;
      // return data;
    },
    filterDict(options) {
      let _self = this;
      const { custType } = _self.$route.query;
      let opt = options.filter(ele => {
        if (parseInt(custType) === 0) {
          return ele;
        }
        return ele.value === '2';
      });
      if (opt.length > 0) {
        _self.form.reportMode = opt[0].value;
        _self.reportTypeList = options;
        this.getReportNum();
      } else {
        _self.form.reportMode = '';
      }
      _self.form = { ..._self.form };
      return opt;
    },
    filterReportContDict(options) {
      let _self = this;
      if (options.length === 0) return;
      let opt = options.slice(0, parseInt(_self.latelyList) + 1);
      return opt;
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.taskModal {
  ::v-deep.el-dialog {
    width: 623px;
  }
}
</style>
