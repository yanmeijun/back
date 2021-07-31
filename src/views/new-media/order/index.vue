<template>
  <div class="order">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        ref="orderForm"
        :model="orderForm"
        label-width="75px"
        class="no-rules-form"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-between">
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="付费客户 :" prop="custCode">
              <el-input v-model="orderForm.custCode" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="订单号 :" prop="orderCode">
              <el-input v-model="orderForm.orderCode" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="订购服务 :" prop="serviceId">
              <select-dict
                v-model="orderForm.serviceId"
                :url="`/cloud-common/order/listOrderServicesByParentId`"
                :filter="filterDict"
              ></select-dict>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" v-show="isPackUp">
            <el-form-item label="类型 :" prop="orderType">
              <el-select v-model="orderForm.orderType" placeholder="请选择">
                <el-option
                  v-for="item in dicList.order_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" v-show="isPackUp">
            <el-form-item label="创建时间 :" prop="createdTime">
              <el-date-picker
                class="kp-date-picker"
                v-model="orderForm.createdTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" v-show="isPackUp">
            <el-form-item label="创建人 :" prop="createUserName">
              <el-input
                v-model="orderForm.createUserName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" v-show="isPackUp">
            <el-form-item label="状态 :" prop="orderStatus">
              <el-select v-model="orderForm.orderStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicList.order_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <div class="flex justify-end">
              <pack-button
                @packClick="packUpHandle"
                :packUp="isPackUp"
              ></pack-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="queryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="time" slot-scope="scope">
          <div class="flex center">
            <span>{{ scope.row.startTime | replaceFormatTime }}</span>
            <span>~</span>
            <span>{{ scope.row.endTime | replaceFormatTime }}</span>
          </div>
        </template>
        <template slot="deliveryTime" slot-scope="scope">
          <div class="flex center">
            <span>{{ scope.row.deliveredTimes }}</span>
            <span>&nbsp;/&nbsp;</span>
            <span>{{ scope.row.deliveryTimes }}</span>
          </div>
        </template>
        <template slot="accountNum" slot-scope="scope">
          <div class="flex center">
            <span>{{ scope.row.addAccountNum }}</span>
            <span>&nbsp;/&nbsp;</span>
            <span>{{ scope.row.accountNum }}</span>
          </div>
        </template>
        <template slot="orderStatus" slot-scope="scope">
          <div class="flex center">
            <el-tag
              class="tag-info"
              :type="orderStatusType(scope.row.orderStatus)"
              >{{ scope.row.orderStatusMeaning }}</el-tag
            >
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="toDetail(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
  </div>
</template>

<script>
import { getOrderList } from '@/api/new-media/order';
import { mapGetters } from 'vuex';
import useGetDicList from '@/hook/useGetDicList';

import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form']
});

export default {
  name: 'order',
  components: {},
  mixins: [mixin],
  data() {
    return {
      isPackUp: false,
      orderForm: {
        orderCode: '',
        orderType: '',
        orderStatus: '',
        custCode: '',
        createdTime: '',
        serviceId: '',
        createUserName: ''
      },
      stateList: [
        {
          label: '全部',
          value: 1
        }
      ],
      typeList: [
        {
          label: '全部',
          value: 1
        }
      ],
      serveList: [
        {
          label: '全部',
          value: 1
        }
      ],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        index: true,
        indexWidth: 80,
        menu: true, // 隐藏操作
        menuWidth: 56,
        editBtn: false, // 添加按钮
        delBtn: false, // 添加按钮
        addBtn: false, // 添加按钮
        columnBtn: false, // 列显隐按钮
        refreshBtn: false, // 刷新按
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '付费客户',
            prop: 'custCode',
            align: 'left',
            width: 110,
            showOverflow: true
          },
          {
            label: '单位名称',
            minWidth: 150,
            prop: 'custName',
            align: 'left',
            showOverflow: true
          },
          {
            label: '订单号',
            prop: 'orderCode',
            width: 150,
            showOverflow: true
          },
          {
            label: '订购服务',
            prop: 'serviceName',
            align: 'left',
            width: 210
          },
          {
            label: '类型',
            prop: 'orderTypeMeaning',
            width: 90
          },
          {
            label: '订单起止时间',
            prop: 'time',
            width: 200,
            slot: true
          },
          {
            label: '交付任务次数',
            prop: 'deliveryTime',
            width: 110,
            slot: true
          },
          {
            label: '新媒体账号数',
            prop: 'accountNum',
            width: 110,
            slot: true
          },
          {
            label: '状态',
            prop: 'orderStatus',
            width: 80,
            slot: true
          },
          {
            label: '创建人',
            prop: 'saleUsername',
            width: 70,
            align: 'left',
            showOverflow: true
          },
          {
            label: '同步时间',
            prop: 'taskTime',
            width: 180
          },
          {
            label: '创建时间',
            prop: 'createdTime',
            width: 180
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(['currentDisplay'])
  },
  watch: {
    // currentDisplay() {
    //   this.getData();
    // },
    // $route(to, from) {
    //   if (
    //     to.fullPath !== from.fullPath &&
    //     to.fullPath === '/new-media/order/index'
    //   ) {
    //     this.getData();
    //   }
    // }
  },
  created() {
    this.getData();
  },
  setup() {
    const { dicList } = useGetDicList(['order_type', 'order_status'], false);
    return { dicList };
  },
  methods: {
    getData() {
      this.getList();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    queryList() {
      this.resetParams();
      this.getList();
    },
    resetQuery() {
      this.resetParams();
      this.$refs['orderForm'].resetFields();
      this.getList();
    },
    async getList() {
      this.loading = true;
      // if (!this.currentDisplay.value) return;
      if (this.orderForm.createdTime === null) {
        this.orderForm.createdTime = '';
      }
      let params = Object.assign(
        {
          Others: {
            size: this.page.pageSize,
            current: this.page.currentPage
          },
          prodId: 4
        },
        this.orderForm
      );
      let { total = 0, data = [] } = await getOrderList(params);
      this.loading = false;
      this.page.total = total;
      this.data = data;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    toDetail(row) {
      this.$router.push({
        path: `/new-media/order/detail/index`,
        query: { id: row.id }
      });
    },
    packUpHandle() {
      this.isPackUp = !this.isPackUp;
    },
    orderStatusType(status) {
      const list = {
        初始化: 'warning',
        服务中: '',
        服务结束: 'info',
        已作废: 'danger'
      };
      return Object.values(list)[status];
    },
    filterDict(options = []) {
      return [
        {
          label: '全部',
          value: ''
        },
        ...options
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.order {
  ::v-deep.el-form {
  }
}
</style>
