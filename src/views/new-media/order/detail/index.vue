<template>
  <div class="order-detail">
    <orderInfo class="top-form" :info="info" />
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">交付任务</span>
        <el-button
          type="primary"
          v-if="!overdue"
          @click="showEditDialog()"
          :disabled="page.total >= info.deliveryTimes"
          >添加</el-button
        >
        <el-tooltip v-else placement="top" content="已过期">
          <el-button type="primary" :disabled="overdue">添加</el-button>
        </el-tooltip>
      </div>
      <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="range" slot-scope="scope">
          <div class="kp-text-center">
            <span>{{ scope.row.startTime | replaceFormatTime }}</span>
            <span>~</span>
            <span>{{ scope.row.endTime | replaceFormatTime }}</span>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="任务详情"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban34"
                @click="toTaskDetail(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="showEditDialog(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="del(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <EditOrderDetailDialog
      ref="isEditOrderDetailDialog"
      v-if="isEditOrderDetailDialog"
      :isOpen="isEditOrderDetailDialog"
      :dateRanges="dateRanges"
      :info="info"
      @update="getList"
      @closeDialog="isEditOrderDetailDialog = false"
    />
    <TipInfoDialog
      v-if="isTipConfirmDialog"
      ref="isTipConfirmDialog"
      :tipContent="tipContent"
      :isOpen="isTipConfirmDialog"
      @confirmFn="confirmHandel"
      @closeDialog="closeTip"
    />
  </div>
</template>

<script>
import {
  getOrderInfo,
  getOrderTaskList,
  putDelTaskId
} from '@/api/new-media/order';
import ResetTable from '@/mixins/resetTableHeight';
import orderInfo from '@/components/business-components/new-media/order/order-info';
import EditOrderDetailDialog from '@/components/dialog/new-media/order/edit-order-detail-dialog';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 59
});
export default {
  name: 'order-detail',
  components: {
    orderInfo,
    EditOrderDetailDialog,
    TipInfoDialog
  },
  mixins: [mixin],
  data() {
    return {
      isEditOrderDetailDialog: false,
      isTipConfirmDialog: false,
      loading: false,
      tipContent: {
        title: '您确定要删除吗？删除之后将不可恢复.'
      },
      info: {},
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        menu: true, // 隐藏操作
        menuWidth: 110,
        index: true,
        indexWidth: 56,
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '任务号',
            prop: 'taskCode',
            width: 240,
            align: 'left',
            showOverflow: true
          },
          {
            label: '任务名称',
            prop: 'taskName',
            minWidth: 150,
            align: 'left',
            showOverflow: true
          },
          {
            label: '任务数据范围',
            prop: 'range',
            width: 200,
            slot: true
          },
          {
            label: '要求交付时间',
            prop: 'deliveryTime',
            width: 115,
            type: 'time',
            format: 'yyyy-MM-dd'
          },
          {
            label: '指定交付人员',
            prop: 'deliveryUsernameMeaning',
            width: 110,
            align: 'left'
          },
          {
            label: '交付结果',
            prop: 'deliveryStatusMeaning',
            width: 85
          }
        ]
      },
      data: [],
      dateRanges: [],
      delOrderRow: ''
    };
  },
  computed: {
    overdue() {
      if (!this.info || !this.info.endTime) {
        return true;
      }
      return Date.now() - new Date(this.info.endTime).getTime() > 0;
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.fullPath !== from.fullPath &&
        to.path === '/new-media/order/detail/index'
      ) {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getInfo();
    },
    async getInfo() {
      let { id } = this.$route.query;
      let { data = {}, code = 0 } = await getOrderInfo({
        id
      });
      if (code) {
        return;
      }
      this.dateRanges = [data.startTime, data.endTime];
      this.info = data;
      this.getList();
    },
    async getList() {
      this.loading = true;
      let { id } = this.$route.query;
      let { total = 0, data = [] } = await getOrderTaskList({
        Others: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        orderId: id,
        // orderCode: this.info.orderCode,
        sortField: 'delivery_time',
        sortFlag: false,
        status: 1, // TODO: 后期改动态值
        prodId: '4'
      });
      this.loading = false;
      this.page.total = total;
      this.data = data;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    showEditDialog(row = {}) {
      // 交付任务 === 交付次数
      if (
        this.validatenull(row) &&
        this.page.total >= this.info.deliveryTimes
      ) {
        return;
      }
      let _self = this;
      _self.isEditOrderDetailDialog = true;
      _self.$nextTick().then(() => {
        _self.$refs.isEditOrderDetailDialog.init(row);
      });
    },
    del(row) {
      this.delOrderRow = row;
      this.isTipConfirmDialog = true;
    },
    async confirmHandel() {
      let { err = 0, code, msg = '' } = await putDelTaskId({
        ids: [this.delOrderRow.id],
        status: '-1'
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg
        });
        return;
      }
      if (err) {
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '删除成功！'
      });
      this.getList();
    },
    toTaskDetail(row) {
      let { id } = this.$route.query;
      this.$router.push({
        path: '/new-media/order/task/index',
        query: {
          orderId: id,
          custCode: this.info.custCode,
          id: row.id,
          custType: this.info.custType,
          custId: this.info.custId
        }
      });
    },
    closeTip() {
      this.isTipConfirmDialog = false;
      this.delOrderRow = '';
    }
  }
};
</script>
