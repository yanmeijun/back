<template>
  <div class="task-Info order newMedia">
    <!-- 统计 -->
    <div class="top-form">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="flex align-center justify-between bg-purple">
            <div class="titleCon">
              <p>未完成任务</p>
              <b class="numClass">{{ statistics.unFinshTaskNum }}</b>
              <span>个任务</span>
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
              <b class="numClass2">{{ statistics.finshTime }}</b>
              <span>分钟</span>
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
              <b class="numClass3">{{ statistics.finshTasknum }}</b>
              <span>个任务</span>
            </div>
            <div class="flex center top-icons top-icons-3">
              <i class="iconfont icontubiaozhizuomoban49"></i>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <basic-container :border="true" mini>
      <el-form ref="filter" :model="filter" label-width="62px">
        <el-row>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="任务号 :" prop="taskCode">
              <el-input v-model.trim="filter.taskCode" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="状态 :" prop="reportStatus">
              <select-dict
                v-model="filter.reportStatus"
                :type="`report_status`"
                show-all
              ></select-dict>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="flex justify-end btns">
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="onSearch">查询</el-button>
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
        <template slot="reportStatus" slot-scope="{ row }">
          <!-- 0未生成 1生成中 2已完成 3异常 -->
          <div class="status-progress">
            <el-progress
              :class="progressStatus.classMap[row.reportStatus]"
              :percentage="progressStatus.percentageFmt(row)"
              :show-text="false"
            />
            <span class="ratio">{{
              `${row.completeNum}/${row.reportNum}`
            }}</span>
          </div>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              :enterable="false"
            >
              <i
                :class="[
                  'iconfont',
                  'icontubiaozhizuomoban37',
                  {
                    disabled: row.reportStatus === '0'
                  }
                ]"
                @click="onReportListShow(row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
      <!-- 报告列表弹框 -->
      <ReportListDialog
        v-if="reportListDialog.visible"
        :isOpen="reportListDialog.visible"
        :taskId="reportListDialog.taskId"
        @closeDialog="onReportListClose"
      />
    </basic-container>
  </div>
</template>
<script>
import { tableOption } from './config';
import { getStatistics, getList } from '@/api/website/report';
import ReportListDialog from '@/components/dialog/website/report/task-report-list';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 155
});

export default {
  components: {
    ReportListDialog
  },
  mixins: [mixin],
  data() {
    return {
      // 顶部统计
      statistics: {
        unFinshTaskNum: 0, // 未完成任务
        finshTime: 0, // 本周任务平均处理时间
        finshTasknum: 0 // 本周完成任务数
      },
      // 筛选
      filter: {
        status: '1', // 未删除
        taskCode: '',
        reportStatus: ''
      },
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 100,
        pageSizes: [100, 500, 1000]
      },
      tableOption,
      data: [],
      // 报告列表弹框(某个任务下报告列表)
      reportListDialog: {
        visible: false,
        taskId: '' // 任务id
      },
      /**
       * 状态进度条相关
       * 0未生成 1生成中 2已完成 3异常
       */
      progressStatus: {
        // 百分比数据格式化
        percentageFmt(row) {
          return (row.completeNum / row.reportNum) * 100;
        },
        // 样式映射
        classMap: {
          0: 'not-started',
          1: 'doing',
          2: 'done',
          3: 'exception'
        }
      }
    };
  },
  methods: {
    // 重置
    onReset() {
      this.$refs['filter'].resetFields();
      this.filter.taskCode = '';
      this.page.currentPage = 1;
      this.getList();
    },
    // 查询
    onSearch() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取统计信息
    async getStatistics() {
      let params = {
        reportStatus: 2,
        unDerway: 1,
        reportStatusArr: [0, 1]
      };
      let { code, data } = await getStatistics(params);
      if (code === 0) {
        this.statistics = data;
      }
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      let params = {
        ...this.filter,
        page: {
          size: this.page.pageSize,
          current: this.page.currentPage
        }
      };
      let { total = 0, data = [] } = await getList(params);
      this.loading = false;
      this.page.total = total;
      this.data = data;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    // 报告列表
    onReportListShow(row) {
      // 未生成不能查看
      if (row.reportStatus === '0') return;
      this.reportListDialog.taskId = row.taskId;
      this.reportListDialog.visible = true;
    },
    // 报告列表-关闭
    onReportListClose() {
      this.reportListDialog.visible = false;
      this.reportListDialog.taskId = '';
    },
    // 监测是否显示下载报告弹框
    initShowReportDownloadDialog() {
      let { action, taskId } = this.$route.query;
      if (action === 'report-download' && taskId) {
        this.reportListDialog.taskId = taskId;
        this.reportListDialog.visible = true;
      }
    }
  },
  created() {
    this.filter.taskCode = this.$route.query.taskCode || '';
    this.getStatistics();
    this.getList();
    this.initShowReportDownloadDialog();
    // this.$router.push(this.$route.path);
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
      color: var(--primary);
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
  .active {
    cursor: pointer;
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

// 状态进度条
.status-progress {
  display: inline-flex;
  align-items: center;
  /deep/ .el-progress {
    flex: 0 0 118px;
    margin-right: 10px;
    width: 118px;
    // 未开始
    &.not-started {
    }
    // 处理中
    &.doing {
      .el-progress-bar__outer {
        background: rgba(24, 144, 255, 0.1);
      }
    }
    // 完成
    &.done {
      .el-progress-bar__outer {
        background: rgba(103, 194, 58, 0.1);
      }
      .el-progress-bar__inner {
        background: rgb(103, 194, 58);
      }
    }
    // 异常
    &.exception {
      .el-progress-bar__outer {
        background: rgba(255, 56, 58, 0.1);
      }
      .el-progress-bar__inner {
        background: rgb(255, 56, 58);
      }
    }
  }
  .ratio {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
