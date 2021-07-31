<template>
  <div class="account-pool">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        ref="poolForm"
        :model="poolForm"
        label-width="75px"
        class="no-rules-form"
      >
        <el-row :gutter="10" type="flex" justify="end" class="flex flex-wrap">
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="账号信息 :" prop="accountLike">
              <el-input v-model="poolForm.accountLike" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="账号类型 :" prop="accountTypeList">
              <el-select
                class="kp-select-multiple"
                multiple
                clearable
                v-model="poolForm.accountTypeList"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in filterDict(dicList.account_type)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item label="账号状态 :" prop="accountStatus">
              <el-select v-model="poolForm.accountStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicList.account_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" v-show="isPackUp">
            <el-form-item label="来源 :" prop="source">
              <el-select v-model="poolForm.source" placeholder="请选择">
                <el-option
                  v-for="item in dicList.source"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item class="flex justify-end padding-none">
              <pack-button
                @packClick="packUpHandle"
                :packUp="isPackUp"
              ></pack-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">新媒体账号池</span>
        <div class="flex">
          <ShowColumn v-model="showColumn" :tableOption="tableOption" />
          <!-- :url="`/newmedia-back/mediaAccountPool/export`" -->
          <ExportPage
            class="export-page"
            :pageSize="page.pageSize"
            :total="page.total"
            :url="`/newmedia-back/exportData/export`"
          />
          <ImportBtn
            :title="`导入更新`"
            :url="`/newmedia-back/mediaAccountPool/accountUpdate`"
            :modelUrl="
              `/newmedia-back/mediaAccountPool/createUserTemplate?type=1`
            "
            @update="resetQuery"
          />
          <ImportBtn
            :url="`/newmedia-back/mediaAccountPool/userImport`"
            :modelUrl="
              `/newmedia-back/mediaAccountPool/createUserTemplate?type=0`
            "
            @update="resetQuery"
          />
        </div>
      </div>
      <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        :show-column="showColumn"
        @on-load="onLoad"
      >
        <template slot="photo" slot-scope="scope">
          <el-image
            style="width: 32px; height: 32px"
            fit="cover"
            v-if="scope.row.photo"
            :src="scope.row.photo"
          >
            <div slot="error" class="image-slot"></div>
          </el-image>
          <div style="width: 32px; height: 32px" v-else>-</div>
        </template>
        <!-- <template slot="accountStatusName" slot-scope="scope">
          <el-tag
              class="tag-info"
              :type="orderStatusType(scope.row.orderStatus)"
              >{{ scope.row.accountStatusName }}</el-tag
            >
        </template> -->
        <template slot="homePage" slot-scope="scope">
          <el-link
            v-if="!!scope.row.homePage"
            class="word-ellipsis-1"
            type="primary"
            target="_blank"
            :href="scope.row.homePage"
          >
            <span>{{ scope.row.homePage }}</span>
          </el-link>
          <span v-else>-</span>
        </template>
        <template slot="source" slot-scope="scope">
          <span>{{ scope.row.source === 'BS' ? '是' : '否' }}</span>
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
          </div>
        </template>
      </ex-table>
    </basic-container>
    <EditAccountDialog
      ref="EditAccountDialog"
      v-if="isEditAccountDialog"
      :isOpen="isEditAccountDialog"
      @update="getList"
      @closeDialog="isEditAccountDialog = false"
    />
    <ExportPageDataDialog
      ref="ExportPageDataDialog"
      v-if="isExportPageDataDialog"
      :isOpen="isExportPageDataDialog"
      :pageSize="page.pageSize"
      @closeDialog="isExportPageDataDialog = false"
    />
  </div>
</template>
<script>
import { getPoolList } from '@/api/new-media/account-pool';
import { options } from './table-option/index';
import useGetDicList from '@/hook/useGetDicList';

import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 46
});
import EditAccountDialog from '@/components/dialog/new-media/account-pool/edit-account-dialog/index';
import ShowColumn from '@/components/base/show-column';
import ExportPage from '@/components/base/export/export-page';
import ImportBtn from '@/components/base/import-btn';

export default {
  name: 'media-account-pool',
  mixins: [mixin],
  components: {
    EditAccountDialog,
    ShowColumn,
    ExportPage,
    ImportBtn
  },
  data() {
    return {
      isPackUp: false,
      isEditAccountDialog: false,
      isExportPageDataDialog: false,
      poolForm: {
        accountLike: '',
        accountTypeList: [],
        accountStatus: '',
        source: ''
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
      showColumn: [
        'accountTypeName',
        'accountName',
        'accountId',
        'photo',
        'homePage',
        'accountStatusName',
        'createdTime',
        'updatedBy',
        'updatedTime'
      ],
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: options,
      data: []
    };
  },
  created() {
    this.getData();
  },
  setup() {
    const { dicList } = useGetDicList(
      ['account_type', 'account_status', 'source'],
      false
    );
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
    async getList() {
      this.loading = true;
      let params = Object.assign(
        {
          Others: {
            size: this.page.pageSize,
            current: this.page.currentPage
          }
        },
        this.poolForm
      );
      let { total = 0, data = [] } = await getPoolList(params);
      this.loading = false;
      this.page.total = total;
      data.forEach(item => {
        // 地区处理
        item.location = [
          item.provDistName,
          item.cityDistName,
          item.countyDistName
        ]
          .filter(m => m)
          .join('/');
        item.organName = [item.organPname, item.organSname, item.organGname]
          .filter(ele => ele)
          .join('/');
        item.tradeName = [item.tradePname, item.tradeSname, item.tradeGname]
          .filter(ele => ele)
          .join('/');
      });
      this.data = data;
    },
    resetQuery() {
      this.$refs['poolForm'].resetFields();
      this.resetParams();
      this.getList();
    },
    queryList() {
      this.resetParams();
      this.getList();
    },
    showEditDialog(row) {
      this.isEditAccountDialog = true;
      this.$nextTick().then(() => {
        this.$refs.EditAccountDialog.init(row);
      });
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    toDetail(row) {
      this.$router.push({
        path: '/new-media/media-account-pool/detail/index',
        query: {
          id: row.id,
          uniqueCode: row.uniqueCode,
          accountType: row.accountType
        }
      });
    },
    orderStatusType(status) {
      const list = {
        注销: 'info',
        正常: '',
        迁移: 'info',
        删除: 'danger'
      };
      return Object.values(list)[status];
    },
    filterDict(options = []) {
      return options.filter(ele => !['100'].includes(ele.value) && ele.value);
    },
    packUpHandle() {
      this.isPackUp = !this.isPackUp;
    }
  }
};
</script>
<style lang="scss" scoped>
.account-pool {
  ::v-deep.el-form {
    .btns {
      .el-button {
        @media (max-width: 992.98px) {
          margin-left: 10px;
        }
      }
    }
  }
  .export-page {
    // margin-right: 10px;
  }
}
</style>
