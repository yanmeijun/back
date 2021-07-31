<template>
  <div class="order-base-info">
    <h3 class="flex algin-center title">
      <i
        class="iconfont icontubiaozhizuomoban39 icon-font-bg flex center title-icon"
      ></i>
      订单号：{{ info.orderCode || '--' }}
    </h3>
    <div class="info clearfix">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="5">
          <div class="flex align-center">
            <span class="label">订购服务：</span>
            <el-dropdown
              placement="bottom"
              v-if="info.serviceName"
              trigger="click"
            >
              <span class="el-dropdown-link drop-menu">
                {{ info.serviceName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="info-tip" slot="dropdown">
                <el-dropdown-item>
                  <div class="line-item">
                    <span>创建人：</span>
                    <span>{{ info.saleUsername || '--' }}</span>
                  </div>
                  <div class="line-item">
                    <span>创建时间：</span>
                    <span>{{ info.createdTime | replaceFormatTime }}</span>
                  </div>
                  <div class="line-item">
                    <span>服务站点数：</span>
                    <span>{{ info.accountNum }}</span>
                  </div>
                  <!-- <div class="flex line-item">
                    <span>备注：</span>
                    <span>{{ info.remark || '--' }}</span>
                  </div>-->
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span v-else>--</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="18">
          <div class="flex align-center">
            <el-dropdown placement="bottom" trigger="click">
              <span class="el-dropdown-link drop-menu left-label">
                数据权限
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="info-tip" slot="dropdown">
                <el-dropdown-item>
                  <div class="flex line-item">
                    <i class="iconfont icontubiaozhizuomoban13"></i>
                    <span>
                      {{
                        parseInt(info.dataPermission) === 1
                          ? '允许下一级填报单位查看数据'
                          : '不允许下一级填报单位查看数据'
                      }}
                    </span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="5">
          <div class="flex align-center">
            <span class="label">付费客户：</span>
            <span class="value">{{ info.custCode || '--' }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="7" :xl="6">
          <p class="flex align-center">
            <span class="label">订单起止日期：</span>
            <span class="value" v-if="info.startTime">
              {{ info.startTime | replaceFormatTime }} ～
              {{ info.endTime | replaceFormatTime }}
            </span>
            <span v-else>--</span>
          </p>
        </el-col>
        <el-col :xs="24" :sm="24" :md="10">
          <div class="flex align-center">
            <span class="label">单位名称：</span>
            <span class="value">{{ info.custName || '--' }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="flex right">
      <div class="block" style="text-align: center">
        <p class="name">订单状态</p>
        <el-dropdown placement="bottom" trigger="click">
          <p class="type type-drop">
            {{ info.orderStatusMeaning || '--' }}
            <i
              class="el-icon-arrow-down"
              style="color: #2e75f1; font-size: 14px"
            ></i>
          </p>
          <el-dropdown-menu class="result-tip" slot="dropdown">
            <el-dropdown-item>
              <p class="line-item">
                服务次数：
                <span>{{ info.deliveryTimes || '--' }}次</span>
              </p>
              <p class="line-item">
                已服务次数：
                <span>{{ info.deliveredTimes || '--' }}次</span>
              </p>
              <p class="line-item">
                追加服务次数：
                <span>{{ info.addFrequency || '--' }}次</span>
              </p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <p class="type">{{ info.orderStatusMeaning || '--' }}</p> -->
      </div>
      <div class="block">
        <p class="name">订单类型</p>
        <p class="type">{{ info.orderTypeMeaning || '--' }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'order-info',
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.result-tip {
  .line-item {
    font-size: 14px;
    line-height: 30px;
    color: #000;
    span {
      color: #999;
    }
  }
}
.info-tip {
  .el-dropdown-menu__item {
    padding: 14px 20px;
    cursor: auto;
  }
  .line-item {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 3px;
    i,
    span:nth-of-type(1) {
      color: $mainBlack85;
    }
    span:nth-of-type(2) {
      color: $mainBlack45;
      max-width: 200px;
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
  }
  .info {
    padding-left: 34px;
    line-height: 20px;
    font-weight: 400;
    ::v-deep {
      .el-col {
        // &:nth-of-type(3) {
        //   margin-bottom: 0;
        // }
        &:nth-of-type(5) {
          margin-bottom: 0;
        }
      }
    }
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
    bottom: 26px;
    .block {
      text-align: right;
      margin-left: 50px;
      .name {
        font-size: 12px;
        color: $mainBlack45;
      }
      .type-drop {
        cursor: pointer;
        &:hover {
          color: var(--primary);
        }
      }
      .type {
        padding-top: 7px;
        font-size: 18px;
        color: $mainBlack85;
        font-weight: 600;
      }
    }
  }
}
@media (max-width: 992.98px) {
  .order-base-info {
    .info {
      ::v-deep {
        .el-col {
          &:nth-of-type(3) {
            margin-bottom: 8px;
          }
        }
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
      ::v-deep {
        .el-col {
          &:nth-of-type(3) {
            margin-bottom: 8px;
          }
        }
      }
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
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #fff;
}
</style>
