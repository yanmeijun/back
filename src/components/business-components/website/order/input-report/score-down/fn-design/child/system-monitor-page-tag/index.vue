<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">页面标签系统监测</span>
    </div>

    <!-- 筛选 -->
    <el-form class="form-filter" label-width="70px" label-suffix=":">
      <el-row :gutter="10" type="flex">
        <!-- <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="是否纳入报告" prop="custInfo">
            <el-select v-model="filter.isJoin">
              <el-option value="0" label="是"></el-option>
              <el-option value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="页面类型" prop="custInfo">
            <el-select v-model="filter.pageType">
              <el-option label="全部" value=""> </el-option>
              <el-option
                v-for="item in dicList.dead_chain_position"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <div class="action">
          <el-button @click="onQueryReset">重置</el-button>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </div>
      </el-row>
    </el-form>

    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
    >
      <!-- 缺失标签 -->
      <!-- eslint-disable -->
      <template slot="lackTag" slot-scope="{ row }">
        <span v-if="row.isSiteName || row.isSiteDomain || row.isDiteIDCode">站点标签</span>
        <span v-else-if="row.isArticleTitle || row.isPubDate || row.isContentSource">内容标签</span>
        <span v-else-if="row.isColumnName || row.isColumnType || row.isColumnKeywords || row.isColumnDescription">栏目标签</span>
        <span v-else>-</span>
      </template>
      <!-- eslint-enable -->

      <!-- 问题页面URL -->
      <template slot="questionUrl" slot-scope="{ row }">
        <el-link
          v-if="row.questionUrl"
          type="primary"
          target="_blank"
          :href="row.questionUrl"
        >
          {{ row.questionUrl }}
        </el-link>
      </template>

      <!-- 快照 -->
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

      <!-- 是否纳入报告 -->
      <template slot="isJoin" slot-scope="{ row }">
        <el-switch
          v-model="row.isJoin"
          :active-value="0"
          :inactive-value="1"
          @change="onRowIsJoinChange(row)"
        />
      </template>
    </ex-table>
    <!-- 是否纳入报告确认弹框 -->
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
import useGetDicList from '@/hook/useGetDicList';
export default {
  components: {
    Comfirm: () => import('@/components/dialog/tip-dialog/index')
  },
  data() {
    return {
      // 检索条件
      filter: {
        pageType: '', // 页面类型
        isJoin: '' // 是否纳入报告
      },
      // table列表
      table: {
        loading: false,
        option: tableOption,
        data: [],
        page: {
          currentPage: 1,
          pageSize: 30,
          pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
          total: 0,
          pageSizes: [30, 50, 100]
        }
      },
      // 是否纳入报告确认弹框
      isJoinComfirm: {
        visible: false,
        row: null, // 操作行数据
        tipContent: {
          title: '是否纳入报告？'
        }
      }
    };
  },
  inject: ['param'],
  methods: {
    // 获取列表数据
    async getList() {
      this.table.data = [];
      this.table.loading = true;
      let params = {
        targetType: 2,
        siteCode: this.param.taskDetail.siteCode,
        orderId: this.param.taskDetail.orderId,
        taskId: this.param.taskDetail.taskId,
        startDate: this.param.task.startTime,
        endDate: this.param.task.endTime,
        pageType: this.filter.pageType,
        page: {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
      };
      let { code, data } = await inputReportApi.getPageTagList(params);
      this.table.loading = false;
      if (code === 0) {
        this.table.data = data.records;
        this.table.page.total = data.total;
      }
    },
    // 查询
    onQuery() {
      this.getList();
    },
    // 查询重置
    onQueryReset() {},
    // 行数据是否纳入报告改变
    onRowIsJoinChange(row) {
      this.isJoinComfirm.row = row;
      this.isJoinComfirm.tipContent.title = `
        是否${row.isJoin ? '取消' : ''}纳入报告？
      `;
      this.isJoinComfirm.visible = true;
    },
    // 修改是否纳入
    async doUpdateIsJoin() {
      let { code } = await inputReportApi.updateIsJoin({
        targetType: 2,
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
  setup() {
    let { dicList } = useGetDicList([
      'dead_chain_position' // 死链位置(首页/栏目)
    ]);
    return {
      dicList
    };
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.form-filter {
  /deep/ .el-row {
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .action {
    flex: 1 1 auto;
    margin-bottom: 8px;
    padding: 0 5px;
    text-align: right;
  }
}
.form-item--day-range {
  /deep/ .el-form-item__content {
    display: flex;
  }
}
</style>
