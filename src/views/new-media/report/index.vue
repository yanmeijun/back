<template>
  <div class="task-Info order newMedia">
    <div class="top-form">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="flex align-center justify-between bg-purple">
            <div class="titleCon">
              <p>未完成任务</p>
              <b class="numClass">{{ taskNum.unFinshTaskNum }}</b>
              <span> 个任务</span>
            </div>
            <div class="flex center top-icons">
              <i class="iconfont icontubiaozhizuomoban46"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="flex align-center justify-between bg-purple">
            <div class="titleCon">
              <p>本周任务平均处理时间</p>
              <b class="numClass2">{{ taskNum.finshTaskAvgTime }}</b>
              <span> 分钟</span>
            </div>
            <div class="flex center top-icons top-icons-2">
              <i class="iconfont icontubiaozhizuomoban10"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="flex align-center justify-between bg-purple">
            <div class="titleCon">
              <p>本周完成任务数</p>
              <b class="numClass3">{{ taskNum.finshTaskNum }}</b>
              <span> 个任务</span>
            </div>
            <div class="flex center top-icons top-icons-3">
              <i class="iconfont icontubiaozhizuomoban49"></i>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <basic-container :border="true" mini>
      <el-form ref="orderForm" :model="orderForm" label-width="62px">
        <el-row>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="任务号 :" prop="taskCode">
              <el-input
                v-model.trim="orderForm.taskCode"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="状态 :" prop="reportStatus">
              <select-dict
                v-model="orderForm.reportStatus"
                :type="`report_status`"
                show-all
              ></select-dict>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="flex justify-end btns">
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="getList(true)">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">报告列表</span>
      </div>
      <!--表格渲染-->
      <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="reportNum" slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>
              <span class="munLink">报告数量：</span
              >{{ scope.row.reportNum || 0 }}份
            </p>
            <p>
              <span class="munLink">报告内容：</span
              >{{ scope.row.reportContName }}
            </p>
            <p>
              <span class="munLink">引入近几次检查结果：</span
              >{{ scope.row.resultTimesName }}
            </p>
            <!-- <p>
              <span class="munLink">报告格式 ：</span
              >{{ scope.row.reportModeName }}
            </p> -->
            <div slot="reference" class="name-wrapper">
              <span class="active kp-color-main"
                >{{ scope.row.reportNum || 0 }}份</span
              >
              <!-- <el-tag size="medium" class="active">{{ scope.row.type }}</el-tag> -->
            </div>
          </el-popover>
        </template>
        <template slot="reportStatus" slot-scope="scope">
          <div
            class="flex align-center progress"
            v-if="scope.row.reportStatus === '0'"
          >
            <!-- <span class="progress-name">{{ scope.row.reportStatusName }}</span> -->
            <el-progress
              class="progress"
              :percentage="getPercentage(scope.row.reportStatus)"
              :format="() => ''"
            ></el-progress>
            <i
              class="iconfont icontubiaozhizuomoban24 zbBg bg-00000066"
              style="opacity: 0.5"
            ></i>
          </div>
          <div class="flex align-center" v-if="scope.row.reportStatus === '1'">
            <!-- <span class="progress-name">{{ scope.row.reportStatusName }}</span> -->
            <el-progress
              class="progress"
              :percentage="scope.row.completeRates * 100"
              :format="() => ''"
            ></el-progress>
            <span class="zbBg">{{ scope.row.completeRates * 100 }}%</span>
          </div>
          <div class="flex align-center" v-if="scope.row.reportStatus === '2'">
            <!-- <span class="progress-name">{{ scope.row.reportStatusName }}</span> -->
            <el-progress
              class="progress"
              status="success"
              :percentage="getPercentage(scope.row.reportStatus)"
              :format="() => ''"
            ></el-progress>
            <i class="iconfont icontubiaozhizuomoban9 successBgIcon zbBg"></i>
          </div>
          <div class="flex align-center" v-if="scope.row.reportStatus === '3'">
            <!-- <span class="progress-name">{{ scope.row.reportStatusName }}</span> -->
            <el-progress
              class="progress"
              status="exception"
              :percentage="getPercentage(scope.row.reportStatus)"
              :format="() => ''"
            ></el-progress>
            <i class="iconfont icontubiaozhizuomoban50 failBgIcon zbBg"></i>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              v-if="scope.row.reportStatus === '2'"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="lookDetail(scope.row)"
              ></i>
            </el-tooltip>
            <i v-else class="iconfont icontubiaozhizuomoban37 kp-opacity"></i>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="del(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
      <tipInfo-dialog
        v-if="errorTipShow"
        ref="errorTip"
        :tipContent="tipContent"
        :isOpen="errorTipShow"
        @confirmFn="delTask"
        @closeDialog="closeTip"
      ></tipInfo-dialog>
      <NewMediaReport
        v-if="viewReportShow"
        ref="viewReport"
        :isOpen="viewReportShow"
        :id="reportId"
        @closeDialog="closeViewreport"
      />
    </basic-container>
  </div>
</template>
<script>
import {
  getReportTaskNum,
  getReportList,
  delReportTaskId
} from '@/api/new-media/report';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import NewMediaReport from '@/components/dialog/new-media/new-media-report/index';
import ResetTable from '@/mixins/resetTableHeight';
import { getStore, removeStore } from '@/util/store';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 155
});

export default {
  name: 'task-Info',
  components: { TipInfoDialog, NewMediaReport },
  mixins: [mixin],
  data() {
    return {
      errorTipShow: false,
      tipContent: {
        title: '您确定要删除吗？删除之后将不可恢复.'
      },
      viewReportShow: false,
      taskNum: {
        finshTaskNum: 0,
        unFinshTaskNum: 0,
        finshTaskAvgTime: 0
      },
      orderForm: {
        taskCode:
          getStore({
            name: 'taskCode'
          }) || '',
        reportStatus: ''
      },
      stateList: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '未开始',
          value: 2
        },
        {
          label: '进行中',
          value: 3
        },
        {
          label: '成功',
          value: 4
        },
        {
          label: '失败',
          value: 5
        }
      ],
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 100,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        menu: true, // 隐藏操作
        menuWidth: 80,
        index: true,
        indexWidth: 80,
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
            label: '任务号',
            prop: 'taskCode',
            width: 220,
            align: 'left',
            showOverflow: true
          },
          {
            label: '任务名称',
            prop: 'taskName',
            showOverflow: true,
            align: 'left',
            width: 160
          },
          {
            label: '生成报告方式',
            prop: 'reportModeName',
            showOverflow: true,
            width: 210,
            align: 'left'
          },
          {
            label: '报告数量',
            prop: 'reportNum',
            width: 80,
            slot: true
          },
          {
            label: '创建人',
            prop: 'createdByName',
            width: 64,
            showOverflow: true,
            align: 'left'
          },
          {
            label: '状态',
            prop: 'reportStatus',
            slot: true,
            width: 220
          },
          {
            label: '报告开始时间',
            prop: 'startTime',
            width: 180
          },
          {
            label: '报告结束时间',
            prop: 'endTime',
            width: 180
          },
          {
            label: '创建时间',
            prop: 'createdTime',
            width: 180
          }
        ]
      },
      data: [],
      reportId: '',
      delTaskRow: ''
    };
  },
  watch: {
    'orderForm.taskCode'() {
      removeStore({
        name: 'taskCode',
        type: 'session'
      });
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getTaskNum();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    resetQuery() {
      removeStore({
        name: 'taskCode',
        type: 'session'
      });
      this.$refs['orderForm'].resetFields();
      this.orderForm.taskCode = '';
      this.resetParams();
      this.getList();
    },
    async getTaskNum() {
      let params = {
        reportStatus: 2,
        unDerway: 1,
        reportStatusArr: [0, 1]
      };
      let { data } = await getReportTaskNum(params);
      data = Object.assign(this.taskNum, data);
      this.taskNum = data;
      this.getList();
    },
    async getList(bool) {
      if (bool) {
        this.resetParams();
      }
      this.loading = true;
      let params = Object.assign(
        {
          size: this.page.pageSize,
          current: this.page.currentPage
        },
        this.orderForm
      );
      let { total = 0, data = [] } = await getReportList(params);
      this.loading = false;
      this.page.total = total;
      this.data = data;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    modiyResultFun(inspection) {
      this.modiyTaskVisible = true;
      this.$nextTick(() => {
        this.$refs.modiyTask.init(inspection);
      });
    },
    lookDetail(row) {
      if (row.reportStatus !== '2') return;
      this.viewReportShow = true;
      this.reportId = row.id;
    },
    closeViewreport() {
      this.viewReportShow = false;
      this.reportId = '';
    },
    del(row) {
      this.errorTipShow = true;
      this.delTaskRow = row;
    },
    closeTip() {
      this.errorTipShow = false;
      this.delTaskRow = '';
    },
    async delTask() {
      if (!this.delTaskRow || !this.delTaskRow.id) return;
      const { code, msg } = await delReportTaskId({
        ids: [this.delTaskRow.id],
        status: -1
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '删除失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '删除成功！'
      });
      removeStore({
        name: 'taskCode',
        type: 'session'
      });
      this.$refs['orderForm'].resetFields();
      this.orderForm.taskCode = '';
      this.getData();
    },
    getPercentage(val) {
      let num = 0;
      switch (parseInt(val)) {
        case 0:
          num = 0;
          break;
        case 1:
          num = 30;
          break;
        case 2:
          num = 100;
          break;
        case 3:
          num = 50;
          break;
      }
      return num;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
@import '~@/styles/task.scss';
.bg-purple {
  background: #fff;
  padding: 4px;
  border-radius: 4px;
  .titleCon {
    padding-left: 20px;
    p {
      font-size: 12px;
      font-weight: 400;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: $mainBlack45;
    }
    b.numClass {
      font-size: 20px;
      font-weight: 500;
      color: #08d2ff;
    }
    b.numClass2 {
      font-size: 20px;
      font-weight: 500;
      color: #f8af30;
    }
    b.numClass3 {
      margin-right: 4px;
      font-size: 20px;
      font-weight: 500;
      color: rgb(24, 144, 255);
    }
  }
}

.newMedia {
  .top-form {
    margin: 16px 16px 8px 16px;
  }
  /deep/ .el-form {
    .marginLeft {
      @media (min-width: 992px) {
        margin-left: -18px;
      }
    }
  }
  .zindexBg {
    position: absolute;
    left: 0;
    top: 0;
    background: var(--primary);
    width: 60px;
    display: inline-block;
    height: 5px;
    z-index: 1;
    border-radius: 32px;
  }
  .bg {
    width: 84px;
    height: 5px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 32px;
    position: relative;
    display: inline-block;
    top: -2px;
    left: 6px;
  }
  .progress-name {
    width: 50px;
    text-align: right;
  }
  .progress {
    flex: 1;
    ::v-deep {
      .el-progress-bar {
        margin-right: -30px;
        padding-right: 20px;
      }
      .el-progress__text {
        display: none;
      }
    }
  }
  .active {
    cursor: pointer;
  }
  .zbBg {
    text-align: left;
    width: 38px;
  }
  .successBg {
    background: #52c41a;
    width: 100%;
    border-radius: 32px;
  }
  .failBg {
    background: #f5222d;
  }
  .failBgIcon {
    color: #f5222d;
  }
  .successBgIcon {
    color: #52c41a;
  }
  .bg-00000066 {
    color: rgba(0, 0, 0, 0.4);
  }
  .noStart {
    left: 1px;
  }
  .newMediaIcon {
    font-size: 80px;
    position: absolute;
    right: 0;
    top: -4px;
  }
  .kp-opacity {
    opacity: 0.4;
  }
  .top-icons {
    width: 70px;
    height: 70px;
    background: rgba(8, 210, 255, 0.1);
    border-radius: 0 15px 0 15px;
    i {
      font-size: 40px;
      color: rgba(8, 210, 255, 1);
    }
    &.top-icons-1 {
      background: rgba(8, 210, 255, 0.1);
      i {
        color: rgba(8, 210, 255, 1);
      }
    }
    &.top-icons-2 {
      background: rgba(253, 179, 48, 0.1);
      i {
        font-size: 35px;
        color: rgba(253, 179, 48, 1);
      }
    }
    &.top-icons-3 {
      background: rgba(24, 144, 255, 0.1);
      i {
        font-size: 35px;
        color: rgba(24, 144, 255, 1);
      }
    }
  }
  // /deep/ .el-card__body {
  //   padding: 11px;
  // }
}

.munLink {
  text-align: left;
  opacity: 0.85;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
}
/deep/ .el-popover {
  min-width: 311px;
}
.el-popover {
  p {
    line-height: 30px;
  }
}
</style>
