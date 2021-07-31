<template>
  <div>
    <!-- 查询 -->
    <el-form
      class="top-form no-rules-form"
      ref="filterFm"
      :model="filter.model"
      label-width="65px"
    >
      <el-row class="flex flex-wrap" :gutter="10" type="flex">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="网站层级" prop="ex_tradeValues">
            <el-select
              v-model="filter.model.checkScope"
              placeholder="请选择"
              @change="getList"
            >
              <el-option label="1个月内" :value="30"></el-option>
              <el-option label="3个月内" :value="90"></el-option>
              <el-option label="6个月内" :value="180"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @selection-change="onTableSelectionChange"
    >
    </ex-table>
  </div>
</template>

<script>
import * as dateUtil from '@/util/date';
import { tableOption } from './config';
import { getHistoryTaskList } from '@/api/website/order';
export default {
  props: {
    // 任务id
    taskId: {
      type: [String, Number],
      default: ''
    },
    // 站点id
    siteId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      filter: {
        model: {
          checkScope: 30
        }
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
        },
        selection: []
      }
    };
  },
  methods: {
    transData(data) {
      data.forEach(item => {
        item.startTime = dateUtil.dateFormat(item.startTime, 'yyyy-MM-dd');
        item.endTime = dateUtil.dateFormat(item.endTime, 'yyyy-MM-dd');
      });
      return data;
    },
    // 获取列表数据
    async getList() {
      this.table.data = [];
      this.table.loading = true;
      let { code, data, total } = await getHistoryTaskList({
        taskId: this.taskId,
        siteId: this.siteId,
        checkScope: this.filter.model.checkScope,
        page: {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
      });
      this.table.loading = false;
      if (code === 0) {
        data = this.transData(data);
        this.table.data = data;
        this.table.page.total = total;
      }
    },
    // table勾选变化
    onTableSelectionChange(selection) {
      this.table.selection = selection;
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped></style>
