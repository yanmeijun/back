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
        placement="bottom"
        v-if="monitorOrnotmonitInfo.accountType == '101'"
      >
        <span class="el-dropdown-link drop-menu drop-margin">
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
        <el-col :xs="24" :sm="24" :md="10" :lg="9" :xl="6">
          <div class="flex align-center">
            <span class="label">账号主体：</span>
            <span class="value">{{
              monitorOrnotmonitInfo.authentication || '--'
            }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="18">
          <div class="flex align-center">
            <span class="label">同主体账号：</span>
            <MainAccountDropdown
              :tableData="data"
              :accountName="monitorOrnotmonitInfo.accountName"
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="flex align-center">
            <span class="label"
              >{{
                monitorOrnotmonitInfo.accountType == '101' ? '公众号' : ''
              }}简介：</span
            >
            <OverflowTooltip :content="monitorOrnotmonitInfo.accountInfo" />
            <!-- <el-tooltip
              class="item"
              effect="dark"
              :content="monitorOrnotmonitInfo.accountInfo"
              placement="top-start"
            >
              <span class="value ellipsis">{{
                monitorOrnotmonitInfo.accountInfo
              }}</span>
            </el-tooltip> -->
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19" :lg="19" :xl="19">
          <div class="flex align-center">
            <span class="label">关联客户：</span>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              :content="accountListName"
              placement="top-start"
            >
              <div class="value word-ellipsis-1">
                <span
                  v-for="item in monitorOrnotmonitInfo.custList"
                  :key="item.id"
                  >{{ item.custName }}</span
                >
              </div>
            </el-tooltip> -->
            <OverflowTooltip :content="accountListName" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="flex right">
      <div class="block">
        <p class="name">账号状态</p>
        <p class="type">正常</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getPoolList } from '@/api/new-media/account-pool';
import MainAccountDropdown from '@/components/base/main-account-dropdown/index';
import OverflowTooltip from '@/components/base/overflow-tooltip';
import AccountTypeIcon from '@/components/base/account-type-icon';

export default {
  name: 'pool-info',
  components: {
    MainAccountDropdown,
    OverflowTooltip,
    AccountTypeIcon
  },
  data() {
    return {
      loading: false,
      data: []
    };
  },
  props: {
    monitorOrnotmonitInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    accountListName() {
      const { custList = [] } = this.monitorOrnotmonitInfo;
      return custList.map(ele => `${ele.custName}：${ele.custCode}`).join(' ');
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      let { data: poolData } = await getPoolList({
        authentication: '我是主体账号'
      });
      this.data = poolData;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.monitor-padding,
.info-tip {
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
    .link {
      margin-left: 79px;
    }
    .monitorIcon4 {
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
      span {
        margin-right: 10px;
      }
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
    cursor: pointer;
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
    bottom: 60px;
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
