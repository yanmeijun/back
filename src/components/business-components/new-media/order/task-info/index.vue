<template>
  <div class="order-base-info">
    <h3 class="flex algin-center title">
      <i
        v-if="true"
        class="iconfont icontubiaozhizuomoban38 icon-font-bg flex center title-icon title-icon1"
      ></i>
      <i
        v-else
        class="iconfont icontubiaozhizuomoban1 icon-font-bg flex center title-icon"
      ></i>
      任务名称：{{ info.taskName }}
    </h3>
    <div class="info">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="10" :lg="9" :xl="6">
          <div class="flex align-center">
            <span class="label">任务号：</span>
            <span class="value">
              {{ info.taskCode }}
            </span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="18">
          <div class="flex align-center">
            <span class="label">指定交付人员：</span>
            <span class="value">
              {{ info.deliveryUsernameMeaning }}
            </span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="10" :lg="9" :xl="6">
          <div class="flex align-center">
            <span class="label">任务数据范围：</span>
            <span class="value"
              >{{ info.startTime | replaceFormatTime }} ~
              {{ info.endTime | replaceFormatTime }}</span
            >
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="18">
          <p class="flex align-center">
            <span class="label">要求交付时间：</span>
            <span class="value">{{
              info.deliveryTime | replaceFormatTime
            }}</span>
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="flex right">
      <div class="block">
        <p class="name">距离交付时间还剩</p>
        <p class="type">
          {{ info.deliverySurplusDays || 0 }}<span class="unit">天</span>
        </p>
      </div>
      <div class="block">
        <p class="name">任务完成情况</p>
        <el-dropdown placement="bottom">
          <p class="type">
            <span class="num">{{
              (results && results.taskCompletionStatusCount) || 0
            }}</span
            >/{{ (results && results.mediaTaskDetailTotal) || 0 }}
          </p>
          <el-dropdown-menu class="result-tip" slot="dropdown">
            <el-dropdown-item>
              <p class="line-item-title">
                检查结果
              </p>
            </el-dropdown-item>
            <el-dropdown-item>
              <p class="line-item">
                合格/不合格
              </p>
              <p class="line-item-type">
                {{ getChecked }}
              </p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'task-info',
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    results: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getChecked() {
      let { mediaTaskDetailTotal = 0, checkResultCount = 0 } = this.results;
      if (this.validatenull(mediaTaskDetailTotal)) {
        mediaTaskDetailTotal = 0;
      }
      if (this.validatenull(checkResultCount)) {
        checkResultCount = 0;
      }
      let no = Number(mediaTaskDetailTotal) - Number(checkResultCount);
      return `${checkResultCount}/${no}`;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.result-tip {
  .el-dropdown-menu__item {
    padding: 10px 20px;
    cursor: auto;
    text-align: center;
    border-bottom: 1px solid #d9d9d9;
    &:hover {
      background: transparent;
      i {
        color: rgba(0, 0, 0, 0.65);
      }
    }
    &:nth-of-type(2) {
      border: none;
    }
  }
  .line-item-title {
    font-size: 14px;
    line-height: 22px;
    color: $mainBlack85;
    font-weight: 500;
  }
  .line-item {
    font-size: 12px;
    line-height: 22px;
    color: $mainBlack45;
  }
  .line-item-type {
    font-size: 20px;
    line-height: 22px;
    color: $mainBlack85;
    font-weight: 600;
  }
}

.order-base-info {
  position: relative;
  background: #fff;
  padding: 20px;
  margin-bottom: 16px;
  .title {
    padding-bottom: 15px;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    .title-icon {
      margin-right: 10px;
      font-size: 14px;
      color: #fff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-weight: normal;
    }
    .title-icon1 {
      background: #a894f6;
    }
  }
  .info {
    padding-left: 34px;
    font-weight: 400;
    .label {
      color: $mainBlack85;
    }
    .left-label {
      margin-right: 30px;
    }
    .value {
      color: $mainBlack65;
    }
    .font-color {
      margin: 0 2px;
      color: $fontLightBlue;
      font-size: 18px;
      font-weight: 500;
      font-style: normal;
    }
  }
  .drop-menu {
    cursor: pointer;
    &:hover {
      color: var(--primary);
    }
  }
  .right {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    .block {
      text-align: right;
      margin-left: 50px;
      .name {
        font-size: 12px;
        color: $mainBlack45;
      }
      .type {
        padding-top: 7px;
        font-size: 20px;
        color: $mainBlack85;
        font-weight: 600;
        .unit {
          font-size: 14px;
          color: $mainBlack45;
        }
      }
      .num {
        color: var(--primary);
      }
    }
  }
}
@media (max-width: 768.98px) {
  .info-tip {
    .el-dropdown-menu__item {
      padding: 6px 10px;
    }
    .line-item {
      font-size: 10px;
      line-height: 16px;
    }
  }
  .order-base-info {
    padding: 10px 10px 65px 10px;
    .title {
      font-size: 14px;
      font-weight: bold;
      .title-icon {
        font-size: 12px;
        margin-right: 5px;
      }
    }
    .info {
      padding-left: 5px;
      .left-label {
        margin-right: 10px;
      }
    }
    .right {
      top: auto;
      transform: translateY(0);
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>
