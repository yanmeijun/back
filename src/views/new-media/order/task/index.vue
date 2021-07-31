<template>
  <div class="task-Info order">
    <taskInfo :info="taskInfo" :results="results" />
    <!-- 填报单位和组织单位 -->
    <basic-container v-if="isInits">
      <SelectCustomer
        ref="SelectCustomer"
        :modal="true"
        :info="taskInfo"
        :taskId="taskInfo.id"
        :isTask="true"
        :isEdit="true"
        @query="queryData"
      />
    </basic-container>
    <basic-container :border="true">
      <el-form
        ref="orderForm"
        :model="orderForm"
        label-width="107px"
        style="margin-left: -35px;"
      >
        <el-row>
          <el-col :xs="24" :sm="24" :md="7">
            <el-form-item label="账号信息 :" prop="accountInformation">
              <el-input
                v-model="orderForm.accountInformation"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              label="管理状态 :"
              prop="manageStatus"
              class="administrationState"
            >
              <el-select v-model="orderForm.manageStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicList.manage_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7">
            <el-form-item label="账号类型：" prop="accountTypeList">
              <el-select
                class="kp-select-multiple"
                multiple
                clearable
                v-model="orderForm.accountTypeList"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in filterDictType(dicList.account_type)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="任务完成情况 :"
              prop="taskCompletionStatus"
              class="administrationState"
            >
              <el-select
                v-model="orderForm.taskCompletionStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.task_completion_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" style="margin-left: -28px;">
            <el-form-item label="检查结果 :" prop="checkResult">
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
          <el-col :xs="24" :sm="24" :md="3">
            <el-form-item
              class="flex justify-end padding-none btns"
              style="margin-right: -27px;"
            >
              <el-button @click="resetData">重置</el-button>
              <el-button type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">任务列表</span>
        <div>
          <el-button
            type="primary"
            :disabled="!showLookReport"
            @click="lookReport"
            >查看报告</el-button
          >
          <el-button
            type="primary"
            :disabled="!showCreateReport"
            @click="createReport(false)"
            >生成报告</el-button
          >
          <el-button
            type="primary"
            :disabled="!checkedList.length > 0"
            @click="modiyResultFun"
            >修改检测结果</el-button
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
        <template slot="link1" slot-scope="scope">
          <el-link type="primary"
            >{{ scope.row.articleCount ? scope.row.articleCount : '' }}
          </el-link>
          <span class="split-line">{{
            scope.row.commentCount && scope.row.articleCount ? '/' : '-'
          }}</span>
          <el-link type="primary">
            {{ scope.row.commentCount ? scope.row.commentCount : '' }}</el-link
          >
        </template>
        <template slot="link2" slot-scope="scope">
          <el-link type="primary">{{
            scope.row.link2 ? scope.row.link2 : '-'
          }}</el-link>
        </template>
        <template slot="link3" slot-scope="scope">
          <el-link type="primary">{{
            scope.row.link3 ? scope.row.link3 : '-'
          }}</el-link>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
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
            </el-tooltip>
          </div>
        </template>
      </ex-table>
      <report-dialog
        v-if="taskOrUpdateVisible"
        ref="taskOrUpdate"
        :isOpen="taskOrUpdateVisible"
        :taskInfo="taskInfo"
        @update="getReportList"
        @closeDialog="taskOrUpdateVisible = false"
      ></report-dialog>
      <ModiyInspectResultDialog
        v-if="modiyTaskVisible"
        ref="modiyTaskVisible"
        :taskDate="taskInfo.startTime"
        :list="checkedList"
        :isOpen="modiyTaskVisible"
        @update="updateData"
        @closeDialog="modiyTaskVisible = false"
      />
      <TipInfoDialog
        v-if="isTipConfirmDialog"
        ref="isTipConfirmDialog"
        :tipContent="tipContent"
        :isOpen="isTipConfirmDialog"
        @confirmFn="confirmHandel"
        @closeDialog="isTipConfirmDialog = false"
      />
      <TipInfoDialog
        v-if="isTipLookConfirmDialog"
        ref="isTipLookConfirmDialog"
        :tipContent="showLookReportTip"
        :isOpen="isTipLookConfirmDialog"
        @confirmFn="confirmLookHandel"
        @closeDialog="isTipLookConfirmDialog = false"
      />
    </basic-container>
  </div>
</template>
<script>
import {
  getOrderTaskInfo,
  getOrderTaskDetailList,
  getTaskResult
} from '@/api/new-media/order';
import { getReportList } from '@/api/new-media/report';
import useGetDicList from '@/hook/useGetDicList';

import taskInfo from '@/components/business-components/new-media/order/task-info';
import ReportDialog from '@/components/dialog/new-media/order/report-dialog/index';
import ModiyInspectResultDialog from '@/components/dialog/new-media/order/modiy-inspect-result-dialog/index';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import SelectCustomer from '@/components/base/select-customer';
import { setStore, removeStore } from '@/util/store';

export default {
  name: 'task-Info',
  components: {
    taskInfo,
    ReportDialog,
    ModiyInspectResultDialog,
    TipInfoDialog,
    SelectCustomer
  },
  data() {
    return {
      isVip: true,
      taskOrUpdateVisible: false,
      modiyTaskVisible: false,
      isTipConfirmDialog: false,
      tipContent: {
        title: '此操作中已存在有检查结果的账号，是否继续修改？'
      },
      isTipLookConfirmDialog: false,
      showLookReportTip: {
        title: '有已经生成报告，是否重新生成报告？'
      },
      modiyResultIds: '',
      orderForm: {
        accountInformation: '',
        manageStatus: '',
        accountTypeList: [],
        taskCompletionStatus: '',
        checkResult: ''
      },
      stateList: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '仅管理',
          value: 2
        },
        {
          label: '订单中',
          value: 3
        }
      ],
      inspectList: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '合格',
          value: 2
        },
        {
          label: '不合格',
          value: 3
        }
      ],
      typeList: [
        {
          label: '全部',
          value: 1
        }
      ],
      serveList: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '未开始',
          value: 2
        },
        {
          label: '交付中',
          value: 3
        },
        {
          label: '已完成',
          value: 4
        }
      ],
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
        // index: true,
        // indexWidth: 70,
        selectionWidth: 34,
        menu: true, // 隐藏操作
        menuWidth: 56,
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
            label: '账号类型',
            prop: 'accountTypeMeaning',
            width: 90,
            align: 'left'
          },
          {
            label: '账号名称',
            prop: 'accountName',
            minWidth: 150,
            align: 'left',
            showOverflow: true
          },
          {
            label: '唯一标识',
            prop: 'uniqueCode',
            width: 170,
            align: 'left',
            showOverflow: true
          },
          {
            label: '内容更新情况',
            prop: 'update',
            width: 120,
            showOverflow: true
          },
          {
            label: '未审错敏词(文章/评论)',
            prop: 'link1',
            width: 200,
            slot: true
          },
          {
            label: '未审信息泄密',
            prop: 'link2',
            width: 120,
            slot: true
          },
          {
            label: '未审外链暗链',
            prop: 'link3',
            width: 120,
            slot: true
          },
          {
            label: '管理状态',
            prop: 'manageStatusMeaning',
            width: 100
          },
          {
            label: '任务完成情况',
            prop: 'taskCompletionStatusMeaning',
            width: 120
          },
          {
            label: '检测结果',
            prop: 'checkResultMeaning',
            width: 100
            // },
            // {
            //   label: '生成报告',
            //   prop: 'reportStatusMeaning',
            //   width: 100
          }
        ]
      },
      tableData: [],
      data: [],
      taskInfo: {},
      checkedList: [],
      restaurants: [],
      dialogVisible2: false,
      isUnits: {},
      results: {},
      showLookReport: false
    };
  },
  computed: {
    isIncludeslNoResult() {
      // 有检查结果 - 提示弹框
      return this.checkedList.filter(ele => parseInt(ele.checkResult) !== 0)
        .length;
    },
    isInits() {
      // 是否是组织单位
      return (
        this.$route.query &&
        this.$route.query.custType &&
        parseInt(this.$route.query.custType) === 0
      );
    },
    showCreateReport() {
      // 全部- 任务完成 -> 可以生成报告
      return (
        this.results &&
        this.results.taskCompletionStatusCount ===
          this.results.mediaTaskDetailTotal
      );
    }
  },
  setup() {
    const { dicList } = useGetDicList(
      [
        'account_type',
        'task_completion_status',
        'manage_status',
        'check_result'
      ],
      false
    );
    return { dicList };
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
        to.path === '/new-media/order/task/index'
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
      this.getTaskResult();
      if (!this.isInits) {
        this.getList();
      }
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    async getTaskResult() {
      let { id } = this.$route.query;
      const { data } = await getTaskResult({
        id,
        status: 1
      });
      // console.log(data);
      this.results = data;
    },
    async getInfo() {
      let { id, custCode } = this.$route.query;
      let { data = {} } = await getOrderTaskInfo({
        id
      });
      data.custCode = custCode;
      this.taskInfo = data;
      this.getReportList();
    },
    queryData(isUnits) {
      if (isUnits && isUnits.tree) {
        this.isUnits = isUnits;
        this.$refs['orderForm'].resetFields();
      }
      this.resetParams();
      this.getList();
    },
    resetData() {
      this.$refs['orderForm'].resetFields();
      if (this.isInits) {
        this.$refs.SelectCustomer.getEditData();
      }
      this.resetParams();
      this.getList();
    },
    async getList() {
      this.loading = true;
      let { id } = this.$route.query;
      let params = {
        Others: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        taskId: id,
        sortField: 'created_time',
        sortFlag: false,
        status: 1
      };
      let custIdList = [];
      if (!this.validatenull(this.isUnits) && this.isInits) {
        let { wzIds = [], bsIds = [], keys = [] } = this.isUnits;
        // 重置表单
        // 组织单位 + 填报单位ids -> custIdList | []
        keys = keys.map(ele => ele.custId);
        custIdList = [...wzIds, ...bsIds, ...keys];
      }
      params = Object.assign(params, this.orderForm, { custIdList });
      let { total = 0, data = [] } = await getOrderTaskDetailList(params);
      this.loading = false;
      this.page.total = total;
      this.tableData = data;
    },
    async getReportList() {
      const { taskCode } = this.taskInfo;
      let { data = [] } = await getReportList({
        taskCode,
        reportStatus: ''
      });
      if (data && data.length > 0) {
        this.showLookReport = true;
        this.showLookReportTip = {
          title: `列表中有${
            data[0].reportStatus === '2' ? '已完成' : '进行中'
          }的报告，是否重新生成报告！`
        };
      } else {
        this.showLookReport = false;
      }
    },
    updateData() {
      this.checkedList = [];
      this.getList();
      this.getTaskResult();
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    // currentChange() {
    //   this.getList();
    // },
    // sizeChange() {
    //   this.getList();
    // },
    createReport(isEdit, id) {
      if (this.lookReport) {
        this.isTipLookConfirmDialog = true;
        return;
      }
      this.taskOrUpdateVisible = true;
    },
    confirmLookHandel() {
      this.taskOrUpdateVisible = true;
    },
    modiyResultFun() {
      if (!this.checkedList.length) {
        return;
      }
      // 是否包含已有检查结果 - 已有，弹出提示
      if (this.isIncludeslNoResult > 0) {
        this.isTipConfirmDialog = true;
        return;
      }
      this.modiyTaskVisible = true;
    },
    confirmHandel() {
      this.modiyTaskVisible = true;
    },
    toDetail(row) {
      let { orderId } = this.$route.query;
      this.$router.push({
        path: '/new-media/order/monitor/index',
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
        path: '/new-media/report/index'
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
    filterDictType(options = []) {
      return options.filter(ele => !['100'].includes(ele.value) && ele.value);
    },
    handleSelect(item) {},
    closeDialog() {
      this.dialogVisible2 = false;
    }
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
</style>
