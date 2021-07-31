<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">首页不更新</span>
    </div>
    <!-- 表单 -->
    <el-form
      class="form"
      ref="form"
      :model="model"
      label-suffix="："
      label-width="160px"
    >
      <el-row :gutter="20" class="row">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="网站名称"> {{ model.siteName }} </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="网页地址">
            <el-link type="primary" :href="model.homeUrl" target="_blank">
              {{ model.homeUrl }}
            </el-link>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="快照">
            <el-link type="primary" :href="model.snapshot" target="_blank">
              {{ model.snapshot }}
            </el-link>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="监测时间">
            {{ model.monitorTime }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="最后更新时间" prop="description">
            <el-date-picker
              v-model="model.lastUpdateTime"
              :clearable="false"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              @change="updateHomeUpdateByDto('lastUpdateTime')"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item
            class="el-form-item--ex-border-radio"
            label="检查结果"
            prop="images"
          >
            <el-radio
              v-model="model.monitorResult"
              label="0"
              border
              @change="updateHomeUpdateByDto('monitorResult')"
            >
              更新及时
            </el-radio>
            <el-radio
              v-model="model.monitorResult"
              label="1"
              border
              @change="updateHomeUpdateByDto('monitorResult')"
            >
              首页2周内无信息更新
            </el-radio>
            <el-radio
              v-model="model.monitorResult"
              label="2"
              border
              @change="updateHomeUpdateByDto('monitorResult')"
            >
              首页2周内无信息更新，稿件发布页未注明发布时间
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  data() {
    return {
      old: {},
      model: {}
    };
  },
  inject: ['param'],
  methods: {
    // 获取数据
    async getData() {
      let { code, data } = await inputReportApi.getHomeUpdate({
        siteId: this.param.taskDetail.siteId,
        siteCode: this.param.taskDetail.siteCode
      });
      if (code === 0) {
        this.model = data;
        this.old = data;
      }
    },
    async updateHomeUpdateByDto(prop) {
      let params = {
        id: this.model.id,
        taskId: this.param.taskDetail.taskId,
        taskCode: this.param.taskDetail.taskCode,
        orderId: this.param.taskDetail.orderId,
        orderCode: this.param.taskDetail.orderCode,
        custId: this.param.taskDetail.custId
      };
      params[prop] = this.model[prop];
      let { code } = await inputReportApi.updateHomeUpdateByDto(params);
      if (code === 0) {
        this.old = this.model;
      } else {
        this.$message.error('操作失败');
        this.model[prop] = this.old[prop];
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.form {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  /deep/ .el-col {
    margin-bottom: 0;
    &:last-child .el-form-item__label {
      padding-bottom: 6px;
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    &__label {
      line-height: 44px;
      background-color: #f6f9fb;
      border-right: 1px solid #e8e8e8;
      color: #666;
    }
    &__content {
      padding: 0 16px;
      line-height: 44px;
    }
    .el-link {
      line-height: 24px;
    }
  }
  /deep/ .el-link {
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    &--inner {
      white-space: nowrap;
    }
  }
}
</style>
