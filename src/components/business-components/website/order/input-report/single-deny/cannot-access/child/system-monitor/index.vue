<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">系统监测</span>
      <div>
        <el-radio
          v-model="isSingleVeto"
          :label="0"
          border
          @change="onIsSingleVetoChange"
        >
          取消否决
        </el-radio>
        <el-radio
          v-model="isSingleVeto"
          :label="1"
          border
          @change="onIsSingleVetoChange"
        >
          单项否决
        </el-radio>
      </div>
    </div>
    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
    >
      <template slot="ratio" slot-scope="{ row }">
        {{ row.ratio }}
      </template>
    </ex-table>
  </div>
</template>

<script>
import { tableOption } from './config';
import * as inputReportApi from '@/api/website/order/input-report';
import { editTaskDetail } from '@/api/website/order';
export default {
  data() {
    return {
      isSingleVeto: '', // 是否单否
      // table列表
      table: {
        loading: false,
        option: tableOption,
        data: []
      }
    };
  },
  inject: ['param'],
  methods: {
    // 数据加工
    transData(model) {
      let data = [
        {
          name: '连通成功',
          num: model.successNum,
          ratio: model.successProp ? `${model.successProp}%` : ''
        },
        {
          name: '确定不连通',
          num: model.failNum,
          ratio: model.failProp ? `${model.failProp}%` : ''
        },
        {
          name: '疑似不连通',
          num: model.suspectedNum,
          ratio: model.suspectedProp ? `${model.suspectedProp}%` : ''
        },
        {
          name: '连通总次数',
          num: model.totalConnection,
          ratio: ''
        },
        {
          name: '监测时间',
          num: `${model.startTime || '-'} 至 ${model.endTime || '-'}`,
          ratio: ''
        }
      ];

      return data;
    },
    // 获取数据
    async getConnectionHomeInfo() {
      this.table.data = [];
      this.table.loading = true;
      let { code, data } = await inputReportApi.getConnectionHomeInfo({
        siteCode: this.param.taskDetail.siteCode,
        startDate: this.param.task.startTime,
        endDate: this.param.task.endTime,
        orderId: this.param.taskDetail.orderId,
        taskId: this.param.taskDetail.taskId
      });
      this.table.loading = false;
      if (code === 0) {
        let list = this.transData(data); // 数据加工
        this.table.data = list;
      }
    },
    // 单否结果变换
    onIsSingleVetoChange(val) {
      this.isSingleVetoOld = val === 0 ? 1 : 0;
      this.doUpdateIsSingleVeto();
    },
    // 更新
    async doUpdateIsSingleVeto() {
      let { code } = await editTaskDetail({
        id: this.param.taskDetail.id, // 任务详情ID
        siteInaccessible: this.isSingleVeto
      });
      if (code === 0) {
        this.$message.success('操作成功');
      } else {
        this.isSingleVeto = this.isSingleVetoOld;
      }
    }
  },
  created() {
    this.isSingleVeto = this.param.taskDetail.siteInaccessible;
    this.getConnectionHomeInfo();
  }
};
</script>

<style lang="scss" scoped></style>
