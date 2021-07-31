<template>
  <div class="pool-detail">
    <PoolInfo :monitorOrnotmonitInfo="monitorOrnotmonitInfo" class="top-info" />
    <basic-container>
      <el-form class="no-rules-form" ref="form" :model="form" label-width="0">
        <el-row type="flex" justify="space-between">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item>
              <el-input
                clearable
                placeholder="请输入"
                v-model="form.content"
                class="input-with-select"
              >
                <el-select
                  v-model="form.isText"
                  slot="prepend"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="ele in searchList"
                    :key="ele.label"
                    :label="ele.label"
                    :value="ele.value"
                  ></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getList(true)"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="">
              <div class="flex align-center justify-end">
                <span class="label">只显示原创</span>
                <el-switch
                  v-model="form.isOrigin"
                  :active-value="0"
                  :inactive-value="1"
                  @change="getList(true)"
                ></el-switch>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ex-table
        ref="refCrud"
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="order" slot-scope="scope">
          <span>{{ scope.row.rowIndex + 1 }}</span>
        </template>
        <template slot="title" slot-scope="scope">
          <el-link
            class="word-ellipsis-1"
            type="primary"
            :href="scope.row.webUrl"
            target="__blank"
            >{{ scope.row.title }}</el-link
          >
        </template>
      </ex-table>
    </basic-container>
  </div>
</template>
<script>
import { getPoolDetailList } from '@/api/new-media/account-pool';
import { getAccountInfo } from '@/api/new-media/account-pool';
import {
  detailOptions101,
  detailOptions102,
  detailOptions103
} from '../table-option/index';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-info'],
  diff: 86
});
import PoolInfo from '@/components/business-components/new-media/order/pool-info/index';

export default {
  name: 'pool-detail',
  components: {
    PoolInfo
  },
  mixins: [mixin],
  data() {
    return {
      detailOptions101,
      detailOptions102,
      detailOptions103,
      monitorOrnotmonitInfo: {},
      form: {
        content: '',
        isText: 1,
        isOrigin: 1
      },
      searchList: [
        {
          label: '标题',
          value: 1
        },
        {
          label: '正文',
          value: 0
        }
        // {
        //   label: '评论数',
        //   value: 3
        // }
      ],
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: detailOptions101,
      data: []
    };
  },
  watch: {
    $route(to, from) {
      if (
        to.fullPath !== from.fullPath &&
        to.path === '/new-media/media-account-pool/detail/index'
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
      this.getDetail();
      this.getList();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    async getDetail() {
      const { id } = this.$route.query;
      let { data } = await getAccountInfo({ id });
      this.monitorOrnotmonitInfo = data;
      this.tableOption =
        this[`detailOptions${data.accountType}`] || this.detailOptions101;
      this.resetTableHeight();
    },
    async getList(bool) {
      let { uniqueCode, accountType } = this.$route.query;
      if (bool) {
        this.resetParams();
      }
      let { content, isOrigin } = this.form;
      const form = !content ? { isOrigin } : this.form;
      const params = Object.assign(
        {
          uniqueCode,
          accountType,
          size: this.page.pageSize,
          current: this.page.currentPage
        },
        form
      );
      this.loading = true;
      const { data, total } = await getPoolDetailList(params);
      this.data = data;
      this.loading = false;
      this.page.total = total;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.pool-detail {
  .input-with-select {
    ::v-deep {
      .el-input-group__prepend,
      .el-select.el-select--small {
        width: 80px;
      }
    }
  }
  .label {
    margin-right: 5px;
  }
}
</style>
