<template>
  <div>
    <div class="head" v-loading="loading">
      <!-- 信息 -->
      <div class="info">
        <template v-if="taskDetail">
          <h1 class="info-title">
            <i class="iconfont icontubiaozhizuomoban39"></i>
            <span>{{ taskDetail.siteName }}</span>
          </h1>
          <div class="info-main">
            <div class="left">
              <div class="item">
                <span class="item-label">网站标识码：</span>
                <span>{{ taskDetail.siteCode }}</span>
              </div>
              <div class="item">
                <span class="item-label">检查范围：</span>
                <select-dict
                  v-model="taskDetail.isSingleVeto"
                  type="is_single_veto"
                  style="width: 86px"
                  @change="editTaskDetail('check-range')"
                />
              </div>
              <div>
                <div class="item" style="margin-bottom: 0">
                  <span class="item-label">有无有对外服务职能：</span>
                  <select-dict
                    v-model="taskDetail.foreignService"
                    type="foreign_service"
                    style="width: 43px"
                    @change="editTaskDetail('foreign-service')"
                  />
                </div>
              </div>
            </div>
            <div class="right">
              <div class="item">
                <span class="item-label">分数</span>
                <div class="item-val">
                  <span>
                    <template v-if="score">{{ score }}分</template>
                    <span v-else class="null">—</span>
                  </span>
                  <el-tooltip content="计算得分" placement="top">
                    <i
                      class="item-icon el-icon-refresh"
                      :class="{ 'el-icon-loading': scoreCalculating }"
                      @click="scoreCalculat"
                    ></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="item">
                <span class="item-label">检查结果</span>
                <div class="item-val">
                  <template>{{ taskDetail.checkResultMeaning }}</template>
                  <el-tooltip content="检查结果修改" placement="top">
                    <i
                      class="item-icon el-icon-setting"
                      @click="onCheckResultSet"
                    ></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- 检查结果修改前提示 -->
        <Comfirm
          :tipContent="editCheckResultConfirm.tipContent"
          :isOpen="editCheckResultConfirm.visible"
          @closeDialog="editCheckResultConfirm.visible = false"
          @confirmFn="checkResultSetDialog.visible = true"
        />
        <!-- 检查结果修改确认--无结果 -->
        <Comfirm
          :tipContent="noResultEditResultComfirm.tipContent"
          :isOpen="noResultEditResultComfirm.visible"
          @closeDialog="noResultEditResultComfirm.visible = false"
          @confirmFn="checkResultSetDialog.visible = true"
        />
        <!-- 检查结果修改确认--已有结果 -->
        <CheckResultSetDialog
          v-if="isReady"
          :visible.sync="checkResultSetDialog.visible"
          :task="param.task"
          :taskDetail="param.taskDetail"
          @valid="onCheckResultSetDialogValid"
        />
      </div>
      <!-- tab -->
      <el-tabs v-model="tabs.value" class="el-tabs--ex-theme1">
        <el-tab-pane label="单项否决" name="single-deny"></el-tab-pane>
        <el-tab-pane label="扣分指标" name="score-down"></el-tab-pane>
        <el-tab-pane label="加分指标" name="score-up"></el-tab-pane>
        <el-tab-pane label="监测情况总览" name="overall-view"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主体 -->
    <div class="main">
      <div
        class="content"
        :style="{
          'min-height': `${contentMinHeight}px`
        }"
      >
        <transition name="el-fade-in" mode="out-in">
          <component v-if="isReady" :is="tabs.value"></component>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTaskInfo,
  getTaskDetailInfo,
  editTaskDetail
} from '@/api/website/order';
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  components: {
    Comfirm: () => import('@/components/dialog/tip-dialog'), // 提示弹框
    CheckResultSetDialog: () =>
      import('@/components/dialog/website/order/input-report/check-result-set'), // 设置检查结果弹框
    SingleDeny: () =>
      import(
        '@/components/business-components/website/order/input-report/single-deny'
      ), // 单项否决
    ScoreDown: () =>
      import(
        '@/components/business-components/website/order/input-report/score-down'
      ), // 扣分指标
    ScoreUp: () =>
      import(
        '@/components/business-components/website/order/input-report/score-up'
      ), // 加分指标
    OverallView: () =>
      import(
        '@/components/business-components/website/order/input-report/overall-view'
      ) // 监测情况总览
  },
  data() {
    return {
      contentMinHeight: 400,
      // 子组件公用参数
      param: {
        task: null, // 任务
        taskDetail: null // 任务详情
      },
      // 任务详情
      taskDetail: null,
      loading: false,
      score: 0, // 得分
      scoreCalculating: false, // 得分计算中
      tabs: {
        value: 'single-deny'
      },
      // 检查结果修改确认框--无结果
      noResultEditResultComfirm: {
        visible: false,
        tipContent: {
          title: `您确定给出检查结果吗？`,
          info: `
            <p>给出检查结果后任务完成状态会变成已完成。</p>
            <p>更改后的状态将不能恢复为交付中。</p>
          `
        }
      },
      // 检查结果修改确认框--已有结果
      editCheckResultConfirm: {
        visible: false,
        tipContent: {
          title: '此操作中有已经存在检查结果是否要继续修改？'
        }
      },
      // 修改检查结果弹框
      checkResultSetDialog: {
        visible: false,
        data: null // 弹框验证通过返回数据
      }
    };
  },
  computed: {
    // 是否准备完毕（必要参数任务及任务明细必须备好）
    isReady() {
      return this.param.task && this.param.taskDetail;
    }
  },
  provide() {
    return {
      param: this.param
    };
  },
  watch: {
    isReady(val) {
      if (this.score) {
        return;
      }
      val && this.scoreCalculat();
    }
  },
  methods: {
    // 计算content最小高度
    computedContentMinHeight() {
      this.contentMinHeight = document.body.clientHeight - 284;
    },
    // 复位任务详情数据 如修改失败时复位改动前数据
    resetTaskDetail() {
      this.taskDetail = JSON.parse(JSON.stringify(this.param.taskDetail));
    },
    // 获取任务
    async getTask() {
      let { code, data } = await getTaskInfo({ id: this.$route.query.taskId });
      if (code === 0) {
        this.param.task = data;
      }
    },
    // 获取任务明细
    async getTaskDetail() {
      let { code, data } = await getTaskDetailInfo(
        this.$route.query.taskDetailId
      );
      if (code === 0) {
        data.foreignService = data.foreignService + '';
        data.isSingleVeto = data.isSingleVeto + '';
        this.param.taskDetail = JSON.parse(JSON.stringify(data));
        this.taskDetail = data;
      }
    },
    /**
     * action 动作 如下：
     * check-range: 检查范围
     * foreign-service: 是否有对外服务职能
     * check-result: 网站检查结果
     */
    async editTaskDetail(action) {
      // 参数组合
      let params = {
        id: this.taskDetail.id // 任务详情ID     --必传
      };
      if (action === 'check-range') {
        params.isSingleVeto = this.taskDetail.isSingleVeto; // 检查范围0.检查全部指标；1.仅单否 --非必传
      }
      if (action === 'foreign-service') {
        params.foreignService = this.taskDetail.foreignService; // 是否有对外服务职能1是0否 --非必传
      }
      if (action === 'check-result') {
        params.checkResult = this.checkResultSetDialog.data.checkResult; // 网站检查结果 1->合格；2->不合格 --非必传
        params.checkTime = this.checkResultSetDialog.data.checkTime; // 检查时间 --非必传
      }
      let { code, msg } = await editTaskDetail(params);
      if (code === 0) {
        // 如果是修改检查结果
        if (action === 'check-result') {
          this.checkResultSetDialog.visible = false;
        }
        this.getTaskDetail();
      } else {
        this.resetTaskDetail();
        this.$message.error(msg);
      }
    },
    // 计算得分
    async scoreCalculat() {
      this.scoreCalculating = true;
      let { code, data } = await inputReportApi.getCalculate({
        siteId: this.param.taskDetail.siteId,
        taskId: this.param.taskDetail.taskId,
        orderId: this.param.taskDetail.orderId,
        startTime: this.param.task.startTime,
        endTime: this.param.task.endTime
      });
      this.scoreCalculating = false;
      if (code === 0) {
        this.score = data.resultScore;
      }
    },
    // 检查结果设置
    onCheckResultSet() {
      // 已存在检查结果时 confirm提示
      if (this.taskDetail.checkResult !== '0') {
        this.editCheckResultConfirm.visible = true;
      } else {
        this.noResultEditResultComfirm.visible = true;
      }
    },
    // 检查结果验证通过
    onCheckResultSetDialogValid(data) {
      this.checkResultSetDialog.data = data;
      this.editTaskDetail('check-result');
    }
  },
  created() {
    this.getTask();
    this.getTaskDetail();
  },
  mounted() {
    this.computedContentMinHeight();
  }
};
</script>

<style lang="scss" scoped>
.head {
  background-color: #fff;
  .info {
    padding: 20px;
    min-height: 134px;
    &-title {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      line-height: 28px;
      font-size: 20px;
      .iconfont {
        display: inline-block;
        margin-right: 10px;
        height: 24px;
        width: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 50%;
        color: #fff;
        background-color: var(--primary);
        font-weight: normal;
        font-size: 14px;
      }
    }
    &-main {
      display: flex;
      justify-content: space-between;
      padding-left: 34px;
      line-height: 20px;
      .left {
        .item {
          display: inline-block;
          margin-bottom: 8px;
          & + .item {
            margin-left: 44px;
          }
          &-label {
            color: rgba(0, 0, 0, 0.85);
          }
          /deep/ .el-input--small {
            .el-input__inner {
              padding-left: 0;
              width: 131px;
              height: 20px;
              border: none;
              color: rgba(0, 0, 0, 0.85);
            }
            .el-select__caret {
              line-height: 20px;
              color: rgba(0, 0, 0, 0.85);
            }
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        .item {
          padding-right: 22px;
          color: #979797;
          text-align: right;
          & + .item {
            margin-left: 40px;
          }
          &-label {
            display: inline-block;
            margin-bottom: 10px;
          }
          &-val {
            position: relative;
            text-align: right;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 600;
            .null {
              font-weight: normal;
              color: #979797;
            }
          }
          &-icon {
            position: absolute;
            right: -25px;
            height: 20px;
            width: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            font-weight: normal;
            transition: all 0.2s;
            color: #979797;
            cursor: pointer;
            &:hover {
              color: var(--primary);
            }
          }
        }
      }
    }
  }
  .el-tabs--ex-theme1 {
    padding: 0 20px;
  }
}
.main {
  padding: 16px;
  .content {
    min-height: 400px;
    border-radius: 4px;
  }
}
</style>
