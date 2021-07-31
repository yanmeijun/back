<template>
  <div class="task-Info order">
    <taskInfo :info="taskInfo" />

    <basic-container :border="true">
      <el-form ref="orderForm" :model="orderForm" label-width="130px">
        <el-row>
          <el-col :xs="24" :sm="24" :md="7" style="margin-left: -40px">
            <el-form-item label="网站信息：" prop="keyWord">
              <el-input
                v-model="orderForm.keyWord"
                placeholder="请输入网站标识码/名称"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" style="margin-left: -56px">
            <el-form-item label="检查结果：" prop="checkResult">
              <el-select v-model="orderForm.checkResult" placeholder="请选择">
                <el-option
                  v-for="item in dicList.check_result"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" style="margin-left: -28px">
            <el-form-item label="报告生成状态：" prop="reportStatus">
              <el-select v-model="orderForm.reportStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicList.produce_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="3" style="margin-left: 120px">
            <el-form-item class="flex justify-end padding-none btns">
              <el-button @click="resetData">重置</el-button>
              <el-button type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">任务详情列表</span>
        <div>
          <!-- 报告状态未生成不能下载报告 -->
          <el-button :disabled="!reportFinishNum" @click="onReportDownload">
            下载报告
          </el-button>
          <el-button
            type="primary"
            :disabled="createReportBtnDisabled"
            @click="onCreateReport"
            >生成报告</el-button
          >
        </div>
      </div>
      <!--表格渲染-->
      <ex-table
        :data="tableData"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
        @selection-change="selectionChangeHandle"
      >
        <template slot="index" slot-scope="scope">
          <div class="kp-text-center">{{ scope.row.rowIndex + 1 }}</div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="录入报告"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban34"
                @click="onInputReport(scope.row)"
              ></i>
            </el-tooltip>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="toDetail(scope.row)"
              ></i>
            </el-tooltip>-->
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 生成报告：已生成或生成中 重新生成提示 -->
    <TipComfirm
      :isOpen="createReport.reCreateComfirm.visible"
      :tipContent="createReport.reCreateComfirm.tipContent"
      @closeDialog="createReport.reCreateComfirm.visible = false"
      @confirmFn="createReport.confRuleDialog.visible = true"
    />
    <!-- 生成报告弹窗 -->
    <el-dialog
      title="生成报告"
      class="create-report-dialog"
      :visible.sync="createReport.confRuleDialog.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @closed="onCreateReportDialogClosed"
    >
      <el-form
        class="no-rules-form2"
        ref="createReportForm"
        label-width="80px"
        :model="createReport.confRule"
        :rules="createReport.confRuleRules"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="检查范围：" prop="checkRange">
              <el-radio-group
                v-model="createReport.confRule.checkRange"
                size="small"
                class="monitor-content-group"
              >
                <el-radio
                  v-for="item in dicList.report_type"
                  :key="item.value"
                  :label="item.value"
                  border
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <div class="footer-btn">
          <el-button @click="createReport.confRuleDialog.visible = false">
            取消
          </el-button>
          <el-button type="primary" @click="doCreateReport"> 确定 </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 录入报告前置参数弹框 -->
    <input-report-pre-params-dialog
      :visible.sync="inputReport.preParamsDialog.visible"
      :taskDetail="inputReport.preParamsDialog.taskDetail"
    />
  </div>
</template>
<script>
import * as dateUtil from '@/util/date';
import { getOrderTaskInfo } from '@/api/new-media/order';
import { searchTaskList, getReportFinishNum } from '@/api/website/order';
import { produceReportByDto } from '@/api/website/report';

import taskInfo from '@/components/business-components/website/order/task-info';
import { setStore, removeStore } from '@/util/store';
import InputReportPreParamsDialog from '@/components/dialog/website/order/input-report/pre-params';
import TipComfirm from '@/components/dialog/tip-dialog'; // 提示弹框
import useGetDicList from '@/hook/useGetDicList';

export default {
  name: 'task-Info',
  components: {
    taskInfo,
    TipComfirm,
    InputReportPreParamsDialog
  },
  data() {
    return {
      typeinForm: {
        taskData: [],
        external: '0',
        checkRange: []
      },
      modiyResultIds: '',
      orderForm: {
        keyWord: '',
        checkResult: '',
        reportStatus: ''
      },
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        selection: true,
        height: 500,
        selectionWidth: 34,
        menu: true, // 隐藏操作
        menuWidth: 80,
        editBtn: false, // 添加按钮
        delBtn: false, // 添加按钮
        addBtn: false, // 添加按钮
        columnBtn: false, // 列显隐按钮
        refreshBtn: false, // 刷新按钮
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '序号',
            prop: 'index',
            width: 56,
            slot: 'true',
            fixed: 'left'
          },
          {
            label: '网站标识码',
            prop: 'siteCode',
            width: 110,
            align: 'left'
          },
          {
            label: '网站名称',
            prop: 'siteName',
            minWidth: 150,
            align: 'center',
            showOverflow: true
          },
          {
            label: '系统监测状态',
            prop: 'sysStatusMeaning',
            width: 110,
            align: 'center',
            showOverflow: true
          },
          {
            label: '人工录入状态',
            prop: 'personStatusMeaning',
            width: 110,
            align: 'center',
            showOverflow: true
          },
          {
            label: '网站检查结果',
            prop: 'checkResultMeaning',
            width: 110,
            align: 'center'
          },
          {
            label: '报告生成状态',
            prop: 'reportStatusMeaning',
            width: 110,
            align: 'center'
            // slot: true
          },
          {
            label: '创建报告时间',
            prop: 'startTime',
            width: 180
          },
          {
            label: '生成报告时间',
            prop: 'endTime',
            width: 180
          },
          {
            label: '最新人工录入时间',
            prop: 'reportLastTime',
            width: 180
          }
        ]
      },
      tableData: [],
      data: [],
      taskInfo: {},
      checkedList: [],
      restaurants: [],
      // 生成报告
      createReport: {
        // 配置规则
        confRule: {
          checkRange: ''
        },
        // 配置规则验证
        confRuleRules: {
          checkRange: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        // 配置规则弹框
        confRuleDialog: {
          visible: false
        },
        // 重新生成报告确认提示
        reCreateComfirm: {
          visible: false,
          tipContent: {
            title: '列表中有已生成或进行中的报告，是否要重新生成报告？'
          }
        }
      },
      // 录入报告
      inputReport: {
        // 前置参数弹框
        preParamsDialog: {
          visible: false,
          taskDetail: null
        }
      },
      reportFinishNum: 0 // 任务报告完成数量
    };
  },
  computed: {
    isIncludeslNoResult() {
      // 有检查结果 - 提示弹框
      return this.checkedList.filter(ele => parseInt(ele.checkResult) !== 0)
        .length;
    },
    // 生成报告按钮禁用状态
    createReportBtnDisabled() {
      if (!this.checkedList.length) {
        return true;
      }
      // 录入报告状态非完成状态 禁用
      if (this.checkedList.some(item => item.personStatus != 2)) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.$refs.SelectCustomer.getEditData();
  },
  watch: {
    $route(to, from) {
      if (
        to.fullPath !== from.fullPath &&
        to.path === '/website/order/task/index'
      ) {
        this.getData();
      }
    }
  },
  beforeDestroy() {
    removeStore({
      name: this.taskId,
      type: 'session'
    });
  },
  methods: {
    getData() {
      this.getInfo();
      this.getList();
      this.getReportFinishNum();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    async getInfo() {
      let { id, custCode } = this.$route.query;
      let { data = {} } = await getOrderTaskInfo({
        id
      });
      data.custCode = custCode;
      this.taskInfo = data;
    },
    // 获取报告完成数量
    async getReportFinishNum() {
      let { id } = this.$route.query;
      let { data = 0 } = await getReportFinishNum({
        taskId: id,
        status: 1
      });
      this.reportFinishNum = data;
    },
    queryData() {
      this.resetParams();
      this.getList();
    },
    // 生成报告弹窗开启按钮
    onCreateReport() {
      // 是否重新生成
      let isReCreate = !!this.checkedList.find(item => {
        // 进行中 已完成的数据可重新生成
        return ['1', '2'].includes(item.reportStatus.toString());
      });
      if (isReCreate) {
        // 重新生成提示
        this.createReport.reCreateComfirm.visible = true;
      } else {
        // 弹出规则配置
        this.createReport.confRuleDialog.visible = true;
      }
    },
    // 关闭生成报告弹窗
    onCreateReportDialogClosed() {
      this.$refs['createReportForm'].resetFields();
    },
    // 生成报告执行
    doCreateReport() {
      this.$refs['createReportForm'].validate(async valid => {
        if (!valid) {
          return;
        }
        let siteIds = this.checkedList.map(item => item.siteId);
        let { id } = this.$route.query;
        let reportTypeMeaning = this.dicList.report_type.find(
          item => item.value === this.createReport.confRule.checkRange
        ).label;
        let { code, message } = await produceReportByDto({
          taskId: id,
          siteIds,
          reportType: this.createReport.confRule.checkRange,
          reportTypeMeaning,
          orderId: this.taskInfo.orderId,
          startTime: dateUtil.dateFormat(this.taskInfo.startTime, 'yyyy-MM-dd'),
          endTime: dateUtil.dateFormat(this.taskInfo.endTime, 'yyyy-MM-dd')
        });
        if (code === 0) {
          this.$message.success('操作成功');
          this.createReport.confRuleDialog.visible = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    // 下载报告
    onReportDownload() {
      let taskCode = encodeURIComponent(this.taskInfo.taskCode);
      let path = `/website/report/index?taskId=${this.taskInfo.id}&taskCode=${taskCode}&action=report-download`;
      this.$router.push(path);
    },
    // 确认下载报告
    handleDownloadReports() {},
    resetData() {
      this.$refs['orderForm'].resetFields();
      this.resetParams();
      this.getList();
    },
    async getList() {
      this.loading = true;
      let { id } = this.$route.query;
      let params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        taskId: Number(id),
        status: '1'

        // sortField: 'created_time',
        // sortFlag: false,
        // status: 1
      };
      params = Object.assign(params, this.orderForm);
      let { total = 0, data = [] } = await searchTaskList(params);
      this.loading = false;
      this.page.total = total;
      this.tableData = data;
      this.checkedList = []; // 重置选中数据
    },

    updateData() {
      this.checkedList = [];
      this.getList();
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    toDetail(row) {
      let { orderId } = this.$route.query;
      this.$router.push({
        path: '/website/order/monitor/index',
        query: {
          id: row.id,
          accountId: row.accountId,
          startTime: this.taskInfo.startTime,
          endTime: this.taskInfo.endTime,
          taskId: row.taskId,
          uniqueCode: row.uniqueCode,
          orderId,
          // custId: row.custId,
          accountType: row.accountType
        }
      });
    },
    getState(state) {
      if (state == '1') {
        return '交付中';
      } else {
        return '已完成';
      }
    },
    selectionChangeHandle(val) {
      // console.log(val);
      this.checkedList = val;
      // cache - 已有检查结果
      this.modiyResultIds = val.map(ele => ele.checkResult !== '0');
      // cache - 已完成
      this.finishList = val.map(ele => ele.taskCompletionStatus === '2');
    },
    lookReport() {
      setStore({
        name: 'taskCode',
        content: this.taskInfo.taskCode,
        type: 'session'
      });
      this.$router.push({
        path: '/website/report/index'
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {},
    /**录入报告相关 */
    // 行录入报告点击
    onInputReport(row) {
      /**
       * 是否有存报告数据条件
       * 已存：直接跳转录入报告
       * 未存：弹框选择相关参数
       */
      if (row.foreignService !== null) {
        let path = `/website/order/input-report?taskId=${row.taskId}&taskDetailId=${row.id}`;
        this.$router.push(path);
        return;
      }
      // 弹出录入报告前置参数模态
      this.inputReport.preParamsDialog.taskDetail = row;
      this.inputReport.preParamsDialog.visible = true;
    }
  },
  setup() {
    let { dicList } = useGetDicList(
      ['report_type', 'check_result', 'produce_status'],
      false
    );
    return {
      dicList
    };
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/task.scss';
::v-deep {
  .el-card .avue-crud__tip {
    display: none !important;
  }
}
.administrationState {
  margin-bottom: 0 !important;
}
.split-line {
  margin: 0 10px;
}
.create-report-dialog {
  ::v-deep.el-dialog {
    width: 506px;
    .el-dialog__body {
      max-height: 80vh;
      overflow: hidden;
      overflow-y: auto;
      padding: 20px 30px 24px;
    }
    .monitor-content-group label {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}
.typein-report-dialog {
  ::v-deep.el-dialog {
    width: 633px;
    .el-dialog__body {
      max-height: 80vh;
      overflow: hidden;
      overflow-y: auto;
    }
    .monitor-content-group label {
      margin-left: 0;
      margin-right: 10px;
    }
    .el-form {
      // padding: 0 0 20px;
      .el-row {
        padding: 0 30px;
      }
    }
    .monitor-content-group label {
      margin-left: 0;
      margin-right: 10px;
    }
    .el-checkbox.is-bordered.el-checkbox--small .el-checkbox__label {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.task-Info.order .el-form .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
