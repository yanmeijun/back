<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">
        发布或链接反动、暴力、色情内容
      </span>
    </div>
    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
    >
      <template slot="linkUrl" slot-scope="{ row }">
        <el-link
          class="word-ellipsis-1"
          type="primary"
          :href="row.linkUrl"
          target="_blank"
        >
          {{ row.linkUrl }}
        </el-link>
      </template>
      <template slot="url" slot-scope="{ row }">
        <el-link
          class="word-ellipsis-1"
          type="primary"
          :href="row.url"
          target="_blank"
        >
          {{ row.url }}
        </el-link>
      </template>
      <template slot="snapshot" slot-scope="{ row }">
        <div class="flex center icons">
          <el-link
            v-if="row.snapshot"
            type="primary"
            target="_blank"
            :href="row.snapshot"
            :underline="false"
          >
            <i class="iconfont icontubiaozhizuomoban59"></i>
          </el-link>
        </div>
      </template>
      <template slot="isJoin" slot-scope="{ row }">
        <el-switch
          v-model="row.isJoin"
          :active-value="0"
          :inactive-value="1"
          @change="onRowIsJoinChange(row)"
        />
      </template>
    </ex-table>
    <!-- 是否单否确认弹框 -->
    <Comfirm
      :tipContent="isJoinComfirm.tipContent"
      :isOpen="isJoinComfirm.visible"
      @closeDialog="isJoinComfirm.visible = false"
      @confirmFn="doUpdateIsJoin"
    />
  </div>
</template>

<script>
import { tableOption } from './config';
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  components: {
    Comfirm: () => import('@/components/dialog/tip-dialog/index')
  },
  inject: ['param'],
  props: {
    // 站点标识
    siteId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      filter: {
        model: {
          timeRange: 'month1'
        }
      },
      // table列表
      table: {
        loading: false,
        option: tableOption,
        data: [],
        page: {
          pageSize: 30,
          pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
          total: 0,
          pageSizes: [30, 50, 100]
        }
      },
      // 是否单否确认弹框
      isJoinComfirm: {
        visible: false,
        row: null, // 操作行数据
        tipContent: {
          title: '单项否决？'
        }
      }
    };
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.table.data = [];
      this.table.loading = true;
      let { code, data, total } = await inputReportApi.getWebsiteOuterdarkChain(
        {
          // targetType: 1,
          check: 1,
          dataState: true,
          report: true,
          // siteId: this.param.taskDetail.siteId,
          page: {
            current: this.table.page.currentPage,
            size: this.table.page.pageSize
          },
          siteCode: this.param.taskDetail.siteCode,
          orderCode: this.param.taskDetail.orderCode,
          taskCode: this.param.taskDetail.taskCode,
          startDate: this.param.task.startTime,
          endDate: this.param.task.endTime
        }
      );
      this.table.loading = false;
      if (code === 0) {
        this.table.data = data;
        this.table.page.total = total;
      }
    },
    // 行数据是否纳入报告改变
    onRowIsJoinChange(row) {
      this.isJoinComfirm.row = row;
      this.isJoinComfirm.tipContent.title =
        row.isJoin === 1 ? '取消单项否决？' : '确定单项否决？';
      this.isJoinComfirm.visible = true;
    },
    // 修改是否纳入
    async doUpdateIsJoin() {
      let { code } = await inputReportApi.updateIsJoin({
        targetType: 6,
        uniqueCode: this.param.taskDetail.siteCode,
        siteCode: this.param.taskDetail.siteCode,
        orderId: this.param.taskDetail.orderId,
        orderCode: this.param.taskDetail.orderCode,
        taskId: this.param.taskDetail.taskId,
        taskCode: this.param.taskDetail.taskCode,
        prodId: this.param.task.prodId,
        questionId: this.isJoinComfirm.row.id,
        isJoin: this.isJoinComfirm.row.isJoin
      });
      if (code === 0) {
        let current = this.table.data.find(
          item => item.id === this.isJoinComfirm.row.id
        );
        current.isJoin = this.isJoinComfirm.row.isJoin;
        this.$message.success('操作成功');
      }
    },
    onLoad(page) {
      this.table.page = page;
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped></style>
