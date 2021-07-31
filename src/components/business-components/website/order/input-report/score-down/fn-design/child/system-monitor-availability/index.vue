<template>
  <div>
    <!-- 筛选 -->
    <el-form
      ref="filter"
      class="form-filter"
      :model="filter"
      label-width="116px"
      label-suffix=":"
    >
      <el-row :gutter="10" type="flex">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="链接范围" prop="urlScope">
            <el-select v-model="filter.urlScope">
              <el-option label="全部" value=""> </el-option>
              <el-option
                v-for="item in dicList.url_scope"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="链接位置" prop="urlPosition">
            <el-select v-model="filter.urlPosition">
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
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="有无标题" prop="hasTitle">
            <el-select v-model="filter.hasTitle">
              <el-option label="全部" value=""> </el-option>
              <el-option label="有" :value="1"> </el-option>
              <el-option label="无" :value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="资源类型" prop="resourceType">
            <el-select v-model="filter.resourceType">
              <el-option label="全部" value=""> </el-option>
              <el-option
                v-for="item in dicList.resource_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="返回码" prop="httpCode">
            <el-select v-model="filter.httpCode">
              <el-option label="全部" value=""> </el-option>
              <el-option
                v-for="item in dicList.http_code"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="是否删除" prop="isJoin">
            <el-select v-model="filter.isJoin">
              <el-option label="全部" value=""> </el-option>
              <el-option label="是" :value="0"> </el-option>
              <el-option label="否" :value="1"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label-width="0" prop="ex_urlTypeInput">
            <el-input
              class="el-input--select"
              v-model="filter.ex_urlTypeInput"
              placeholder="请输入"
            >
              <el-select v-model="filter.ex_urlType" slot="prepend">
                <el-option label="链接标题" value="title"></el-option>
                <el-option label="不可用链接" value="url"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="链接标题" prop="title">
            <el-input v-model="filter.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="不可用链接" prop="custInfo">
            <el-input v-model="filter.url"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="可用性类型" prop="status">
            <el-select v-model="filter.status">
              <el-option
                v-for="item in dicList.link_unavailability_status"
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

    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">可用性系统监测</span>
      <div>
        <el-button :disabled="disabled.allReset" @click="onAllReset">
          全部恢复
        </el-button>
        <el-button :disabled="disabled.allDel" @click="onAllDel">
          全部删除
        </el-button>
        <el-button :disabled="disabled.batchReset" @click="onBatchReset">
          恢复
        </el-button>
        <el-button
          type="primary"
          :disabled="disabled.batchDel"
          @click="onBatchDel"
        >
          删除
        </el-button>
      </div>
    </div>

    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
      @selection-change="onTableSelectionChange"
    >
      <template slot="url" slot-scope="{ row }">
        <el-link v-if="row.url" type="primary" target="_blank" :href="row.url">
          {{ row.url }}
        </el-link>
      </template>

      <template slot="parentUrl" slot-scope="{ row }">
        <el-link
          v-if="row.parentUrl"
          type="primary"
          target="_blank"
          :href="row.parentUrl"
        >
          {{ row.parentUrl }}
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
        {{ row.isJoin === 0 ? '是' : '否' }}
      </template>
    </ex-table>
    <!-- 全部删除确认弹框 -->
    <Comfirm
      :tipContent="allDelComfirm.tipContent"
      :isOpen="allDelComfirm.visible"
      @closeDialog="allDelComfirm.visible = false"
      @confirmFn="updateLinkUnavailability(table.data, true)"
    />
    <!-- 全部恢复确认弹框 -->
    <Comfirm
      :tipContent="allResetComfirm.tipContent"
      :isOpen="allResetComfirm.visible"
      @closeDialog="allResetComfirm.visible = false"
      @confirmFn="updateLinkUnavailability(table.data, false)"
    />
    <!-- 选中删除确认弹框 -->
    <Comfirm
      :tipContent="selectionDelComfirm.tipContent"
      :isOpen="selectionDelComfirm.visible"
      @closeDialog="selectionDelComfirm.visible = false"
      @confirmFn="updateLinkUnavailability(table.selection, true)"
    />
    <!-- 选中恢复确认弹框 -->
    <Comfirm
      :tipContent="selectionResetComfirm.tipContent"
      :isOpen="selectionResetComfirm.visible"
      @closeDialog="selectionResetComfirm.visible = false"
      @confirmFn="updateLinkUnavailability(table.selection, false)"
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
        urlScope: '',
        urlPosition: '1',
        hasTitle: '',
        resourceType: '',
        httpCode: '',
        isJoin: '',
        title: '',
        siteUrl: '',
        url: '',
        status: '0',
        ex_urlType: 'title',
        ex_urlTypeInput: ''
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
      },
      // 全部删除确认弹框
      allDelComfirm: {
        visible: false,
        tipContent: {
          title: '是否删除当前页数据？'
        }
      },
      // 全部恢复确认弹框
      allResetComfirm: {
        visible: false,
        tipContent: {
          title: '是否恢复当前页数据？'
        }
      },
      // 选中删除确认弹框
      selectionDelComfirm: {
        visible: false,
        tipContent: {
          title: '是否删除选中数据？'
        }
      },
      // 选中恢复确认弹框
      selectionResetComfirm: {
        visible: false,
        tipContent: {
          title: '是否恢复选中数据？'
        }
      }
    };
  },
  inject: ['param'],
  computed: {
    disabled() {
      let allReset = this.table.data.every(item => item.isJoin !== 0); // 数据没有删除状态
      let allDel = this.table.data.every(item => item.isJoin === 0); // 数据都是删除状态
      let batchReset = this.table.selection.every(item => item.isJoin !== 0); // 选中数据没有删除状态
      let batchDel = this.table.selection.every(item => item.isJoin === 0); // 选中数据都是删除状态
      return {
        allReset,
        allDel,
        batchReset,
        batchDel
      };
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.table.data = [];
      this.table.selection = [];
      this.table.loading = true;

      // 链接标题&不可用链接处理
      let filter = JSON.parse(JSON.stringify(this.filter));
      filter[filter.ex_urlType] = filter.ex_urlTypeInput;

      // 去除ex_属性
      Object.keys(filter).forEach(key => {
        if (key.startsWith('ex_')) {
          delete filter[key];
        }
      });

      let params = {
        targetType: 3,
        uniqueCode: this.param.taskDetail.siteCode,
        siteId: this.param.taskDetail.siteId,
        siteCode: this.param.taskDetail.siteCode,
        taskId: this.param.taskDetail.taskId,
        orderId: this.param.taskDetail.orderId,
        startDate: this.param.task.startTime,
        endDate: this.param.task.endTime,
        // startDate: '2011-06-08',
        // endDate: '2021-06-30',
        ...filter,
        page: {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
      };
      let { code, data } = await inputReportApi.getLinkUnavailabilityList(
        params
      );
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
      this.$refs['filter'].resetFields();
    },
    onLoad(page) {
      this.table.page = page;
      this.getList();
    },
    // table勾选变化
    onTableSelectionChange(selection) {
      this.table.selection = selection;
    },
    // 批量删除
    onBatchDel() {
      this.selectionDelComfirm.visible = true;
    },
    // 批量恢复
    onBatchReset() {
      this.selectionResetComfirm.visible = true;
    },
    // 全部删除
    onAllDel() {
      this.allDelComfirm.visible = true;
    },
    // 全部恢复
    onAllReset() {
      this.allResetComfirm.visible = true;
    },
    /**
     * 批量更新状态
     * rows：数据
     * isDel：是否删除
     */
    async updateLinkUnavailability(rows, isDel) {
      let commonParam = {
        targetType: 3,
        uniqueCode: this.param.taskDetail.siteCode,
        siteCode: this.param.taskDetail.siteCode,
        orderId: this.param.taskDetail.orderId,
        orderCode: this.param.taskDetail.orderCode,
        taskId: this.param.taskDetail.taskId,
        taskCode: this.param.taskDetail.taskCode,
        prodId: this.param.task.prodId,
        urlPosition: this.filter.urlPosition
      };
      let params = [];
      if (isDel) {
        rows = rows.filter(item => item.isJoin !== 0);
      } else {
        rows = rows.filter(item => item.isJoin === 0);
      }
      rows.forEach(item => {
        params.push({
          questionId: item.id,
          isJoin: isDel ? 0 : 1,
          ...commonParam
        });
      });

      let { code } = await inputReportApi.updateLinkUnavailability(params);
      if (code === 0) {
        this.$message.success('操作成功');
        this.getList();
      }
    }
  },
  setup() {
    let { dicList } = useGetDicList([
      'url_scope', // 死链范围
      'dead_chain_position', // 死链位置(首页/栏目)
      'resource_type', // 资源类型
      'http_code', // 链接不可用返回码
      'link_unavailability_status' // 可用性类型
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
.el-input--select {
  /deep/ .el-input-group__prepend {
    padding: 0;
    width: 116px;
    .el-select {
      margin: -10px 0;
    }
  }
}
</style>
