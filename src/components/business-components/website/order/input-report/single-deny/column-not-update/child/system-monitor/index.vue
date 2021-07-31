<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">栏目不更新系统监测</span>
    </div>
    <el-form
      ref="filterForm"
      class="form-filter"
      :model="filter"
      label-width="125px"
      label-suffix=":"
    >
      <el-row :gutter="10" type="flex">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="分类" prop="type">
            <SelectColumn v-model="filter.type" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item
            class="form-item--not-update-num"
            prop="notUpdateNumType"
          >
            <template slot="label">
              <el-select v-model="filter.notUpdateNumType">
                <el-option value="select" label="未更新天数"></el-option>
                <el-option value="custom" label="自定义"></el-option>
              </el-select>
            </template>
            <el-select
              v-if="filter.notUpdateNumType === 'select'"
              v-model="filter.notUpdateNum"
            >
              <el-option value="7" label="7日以上"></el-option>
              <el-option value="14" label="14日以上"></el-option>
              <el-option value="30" label="30日以上"></el-option>
              <el-option value="180" label="6个月以上"></el-option>
              <el-option value="365" label="1年以上"></el-option>
            </el-select>
            <InputNumberRange
              v-else
              v-model="filter.notUpdateNumRange"
              clearable
            />
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
      <!-- 是否纳入报告 -->
      <template slot="isIncludeReport" slot-scope="{ row }">
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
export default {
  components: {
    InputNumberRange: () => import('@/components/base/input-number-range'),
    SelectColumn: () => import('@/components/base/select-column'),
    Comfirm: () => import('@/components/dialog/tip-dialog/index')
  },
  data() {
    return {
      // 检索条件
      filter: {
        type: [], // 分类
        notUpdateNumType: 'select',
        notUpdateNum: '7', // 未更新天数
        notUpdateNumRange: [] // 未更新天数区间
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
        targetType: 1,
        siteCode: this.param.taskDetail.siteCode,
        orderId: this.param.taskDetail.orderId,
        taskId: this.param.taskDetail.taskId,
        startDate: this.param.task.startTime,
        endDate: this.param.task.endTime,
        page: {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
      };
      // 自定义未更新天数
      if (this.filter.notUpdateNumType === 'custom') {
        let [start, end] = this.filter.notUpdateNumRange;
        params.notUpdateNumGte = start;
        params.notUpdateNumLte = end;
      } else {
        params.notUpdateNumGte = parseInt(this.filter.notUpdateNum);
      }
      let { code, data } = await inputReportApi.getChannelUpdateList(params);
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
    onQueryReset() {
      this.filter.type = []; // 分类
      this.filter.notUpdateNumType = 'select';
      this.filter.notUpdateNum = '7'; // 未更新天数
      this.filter.notUpdateNumRange = []; // 未更新天数区间
      this.getList();
    },
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
        targetType: 1,
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
    text-align: right;
  }
}
.form-item--not-update-num {
  /deep/ .el-form-item__label {
    padding: 0;
    .el-input__inner {
      border-radius: 4px 0 0 4px;
      color: #909399;
      background: #f8f8f9;
    }
  }
  /deep/ .el-form-item__content {
    left: -1px;
    .el-input__inner,
    .el-day-editor {
      border-radius: 0 4px 4px 0;
    }
    .el-day-editor {
      top: -0.5px;
    }
  }
  /deep/ .el-input.is-focus,
  .el-input__inner:focus {
    z-index: 10;
  }
}
</style>
