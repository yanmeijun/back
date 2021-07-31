<template>
  <div class="order-base-info">
    <h3 class="flex align-center title">
      <!-- <i class="iconfont icontubiaozhizuomoban14 monitorIcon monitorIcon3"></i> -->
      <AccountTypeIcon :type="monitorOrnotmonitInfo.accountType" />
      <span
        >{{ monitorOrnotmonitInfo.accountName }}：{{
          monitorOrnotmonitInfo.uniqueCode
        }}</span
      >
      <el-dropdown
        class="drop-margin"
        placement="bottom"
        v-if="monitorOrnotmonitInfo.accountType === '101'"
      >
        <span class="el-dropdown-link drop-menu">
          <i class="iconfont icontubiaozhizuomoban7 monitorIcon2"></i>
        </span>
        <el-dropdown-menu class="info-tip monitor-padding" slot="dropdown">
          <el-dropdown-item>
            <div class="line-item">
              <img :src="monitorOrnotmonitInfo.qrCode" class="erweima" />
              <p class="content-erweima">微信扫一扫</p>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-link
        class="link"
        target="_blank"
        :href="monitorOrnotmonitInfo.homePage"
        :underline="false"
        v-else
      >
        <i class="iconfont icontubiaozhizuomoban59 monitorIcon2 monitorIcon4">
          <a href="javascript:"></a>
        </i>
      </el-link>
    </h3>
    <div class="info">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="flex align-center">
            <span class="label">认证信息：</span>
            <span class="value">{{
              monitorOrnotmonitInfo.authentication || '--'
            }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="flex align-center">
            <span class="label"
              >{{
                monitorOrnotmonitInfo.accountType === '101' ? '公众号' : ''
              }}简介：</span
            >
            <OverflowTooltip
              :content="monitorOrnotmonitInfo.accountInfo || '--'"
            />
            <!-- <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              v-if="monitorOrnotmonitInfo.accountInfo"
              :content="monitorOrnotmonitInfo.accountInfo"
            >
              <span class="value word-ellipsis-1">{{
                monitorOrnotmonitInfo.accountInfo
              }}</span>
            </el-tooltip>
            <span v-else>--</span> -->
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="10" :lg="9" :xl="6">
          <div class="flex align-center">
            <span class="label">关联客户：</span>
            <OverflowTooltip :content="accountListName" />
            <!-- <div class="value word-ellipsis-1">
              <span
                v-for="item in monitorOrnotmonitInfo.custList"
                :key="item.id"
                >{{ item.custName }}</span
              >
            </div> -->
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="18">
          <p class="flex align-center">
            <span class="label">任务数据范围：</span>
            <span class="value"
              >{{ monitorOrnotmonitInfo.startTime | replaceFormatTime }} ~
              {{ monitorOrnotmonitInfo.endTime | replaceFormatTime }}</span
            >
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="flex right" style="bottom: 30px;">
      <div class="block">
        <p class="name">管理状态</p>
        <p class="type">订单中</p>
      </div>
      <div class="block">
        <p class="name">检查结果</p>
        <p class="type">
          {{ monitorOrnotmonitInfo.checkResultMeaning || '' }}
          <i
            class="iconfont icontubiaozhizuomoban28"
            style="color: #2e75f1; cursor: pointer;"
            @click="modiyResultFun"
          ></i>
        </p>
      </div>
    </div>
    <ModiyInspectResultDialog
      v-if="modiyTaskVisible"
      ref="modiyTaskVisible"
      :list="checkedList"
      :checkResult="monitorOrnotmonitInfo.checkResult"
      :taskDate="monitorOrnotmonitInfo.startTime"
      :isOpen="modiyTaskVisible"
      @update="setData"
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
  </div>
</template>
<script>
import ModiyInspectResultDialog from '@/components/dialog/new-media/order/modiy-inspect-result-dialog/index';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import OverflowTooltip from '@/components/base/overflow-tooltip';
import AccountTypeIcon from '@/components/base/account-type-icon';
export default {
  name: 'monitor-info',
  components: {
    ModiyInspectResultDialog,
    TipInfoDialog,
    OverflowTooltip,
    AccountTypeIcon
  },
  data() {
    return {
      modiyTaskVisible: false,
      isTipConfirmDialog: false,
      tipContent: {
        title: '此操作中已存在有检查结果的账号，是否继续修改？'
      },
      resultList: ['未检查', '合格', '不合格']
    };
  },
  props: {
    monitorOrnotmonitInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // resultTxt() {
    //   if (!this.monitorOrnotmonitInfo.checkResult) {
    //     return '';
    //   }
    //   return (
    //     this.monitorOrnotmonitInfo &&
    //     this.monitorOrnotmonitInfo.checkResult &&
    //     this.resultList[parseInt(this.monitorOrnotmonitInfo.checkResult)]
    //   );
    // },
    checkedList() {
      return [
        {
          id: this.monitorOrnotmonitInfo.id,
          taskCompletionStatus: this.monitorOrnotmonitInfo.taskCompletionStatus,
          checkTime: this.monitorOrnotmonitInfo.checkTime
        }
      ];
    },
    accountListName() {
      const { custList = [] } = this.monitorOrnotmonitInfo;
      return custList.map(ele => `${ele.custName}：${ele.custCode}`).join(' ');
    }
  },
  mounted() {},
  methods: {
    modiyResultFun() {
      // 是否已有检查结果 - 已有，弹出提示
      if (parseInt(this.monitorOrnotmonitInfo.checkResult) !== 0) {
        this.isTipConfirmDialog = true;
        return;
      }
      this.modiyTaskVisible = true;
    },
    setData() {
      this.$emit('update');
    },
    confirmHandel() {
      this.modiyTaskVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.monitor-padding {
  .el-dropdown-menu__item {
    padding-top: 7px;
    cursor: auto;
    &:hover {
      background: transparent;
      i {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .line-item {
    font-size: 14px;
    line-height: 22px;
    span:nth-of-type(1) {
      color: $mainBlack85;
    }
    span:nth-of-type(2) {
      color: $mainBlack45;
      max-width: 200px;
    }
    .erweima {
      width: 96px;
      height: 97px;
    }
    .content-erweima {
      text-align: center;
      font-size: 12px;
      color: $mainBlack65;
      margin-top: -5px;
    }
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
    font-weight: 500;
    color: #000000;
    opacity: 0.85;
    line-height: 28px;
    .monitorIcon {
      margin-right: 10px;
      font-size: 24px;
      color: #46bb36;
      font-weight: normal;
    }
    .monitorIcon2 {
      color: $mainBlack05;
      font-size: 24px;
    }
    .monitorIcon3 {
      color: #0c9cef;
    }
    .monitorIcon4 {
      margin-left: 79px;
      &:hover {
        cursor: pointer;
        color: var(--primary);
      }
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
      flex: 1;
      color: $mainBlack65;
    }
    .ellipsis {
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      width: 60.2%;
      white-space: nowrap;
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
    display: block;
    cursor: pointer;
    line-height: 8px;
    &:hover {
      color: var(--primary);
      i.monitorIcon2 {
        color: var(--primary);
      }
    }
  }
  .drop-margin {
    margin-left: 42px;
  }
  .right {
    position: absolute;
    right: 20px;
    bottom: 20px;
    .block {
      text-align: right;
      margin-left: 50px;
      .name {
        font-size: 12px;
        color: $mainBlack45;
      }
      .type {
        padding-top: 7px;
        font-size: 18px;
        color: $mainBlack85;
        font-weight: 500;
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
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>
