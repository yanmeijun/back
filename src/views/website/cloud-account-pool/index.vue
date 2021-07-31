<template>
  <div class="account-pool">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        ref="poolForm"
        :model="poolForm"
        label-width="100px"
        class="no-rules-form"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-between">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="网站信息 :" prop="accountLike">
              <el-input
                v-model="poolForm.accountLike"
                placeholder="请输入网站标识码/名称"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="网站类型 :" prop="siteType">
              <el-select v-model="poolForm.siteType" placeholder="请选择">
                <el-option
                  v-for="item in dicList.site_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="账号状态 :" prop="websiteAccountStatus">
              <el-select
                v-model="poolForm.websiteAccountStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.website_account_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="地区 :" prop="siteArea">
              <select-address v-model="poolForm.siteArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="机构 :" prop="orgArea">
              <select-organ-level v-model="poolForm.orgArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="行业 :" prop="tradeArea">
              <select-trade v-model="poolForm.tradeArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="网站地址:" prop="url">
              <el-input v-model="poolForm.url" placeholder="请输入主页URL" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="是否渲染 :" prop="isFlag">
              <el-select v-model="poolForm.isFlag" placeholder="请选择">
                <el-option
                  v-for="item in dicList.is_flag"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
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
        <span class="flex align-center name">管理中心列表</span>
        <div class="flex">
          <ShowColumn v-model="showColumn" :tableOption="tableOption" />
          <ExportPage
            class="export-page"
            :pageSize="page.pageSize"
            :total="page.total"
            :args="exportArgs"
            @getExportArgs="getExportArgs"
            :url="`/cloud-website-back/websiteAccountPool/export`"
          />
          <ImportBtn
            :url="`/cloud-website-back/websiteAccountPool/webSiteImport`"
            :modelUrl="
              `/cloud-website-back/websiteAccountPool/downloadTemplate?type=0&downTempFileName=网站账号导入表格模板.xlsx&tempFileName=accountImport`
            "
            @update="resetQuery"
          />
          <el-button type="primary" @click="addSite()">添加</el-button>
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
        <template slot="isFlag" slot-scope="scope">
          <vxe-switch
            @change="changeFlag(scope.row)"
            v-model="scope.row.isFlag"
            open-label="开"
            open-value="1"
            close-label="关"
            close-value="0"
          ></vxe-switch>
        </template>
        <template slot="url" slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.url"
            placement="top"
            :enterable="false"
          >
            <el-link
              class="word-ellipsis-1"
              type="primary"
              target="_blank"
              :href="scope.row.url"
            >
              <span>{{ scope.row.url }}</span>
            </el-link>
          </el-tooltip>
        </template>

        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="showEditDialog(scope.row.id)"
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
                @click="showDeleteDialog(scope.row.id)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>

    <!-- <ExportPageDataDialog
      ref="ExportPageDataDialog"
      v-if="isExportPageDataDialog"
      :isOpen="isExportPageDataDialog"
      :pageSize="page.pageSize"
      @closeDialog="isExportPageDataDialog = false"
    />-->
    <!-- 删除弹窗 -->
    <TipInfoDialog
      v-if="isDeleteDiaShow"
      ref="isTipConfirmDialog"
      :tipContent="tipContent"
      :isOpen="isDeleteDiaShow"
      @confirmFn="confirmDeleteHandel"
      @closeDialog="closeTip"
    />
    <!-- 更新是否渲染弹窗 -->
    <TipInfoDialog
      v-if="isFlagDiaShow"
      ref="isFlagDialog"
      :tipContent="flagContent"
      :isOpen="isFlagDiaShow"
      @confirmFn="confirmToggleFlag"
      @closeDialog="closeFlag"
    />
    <!-- 右侧抽屉 -->
    <EditAccountDialog
      v-if="isEditAccountDialog"
      ref="EditAccountDialog"
      :isOpen="isEditAccountDialog"
      @update="getList"
      @closeDialog="isEditAccountDialog = false"
    />
  </div>
</template>
<script>
import {
  getPoolList,
  deleteSite,
  updateIsFlag,
  getWebsiteInfo,
  createWebSiteCode
} from '@/api/website/account-pool';
import useGetDicList from '@/hook/useGetDicList';

import { options } from './table-option/index';
import ResetTable from '@/mixins/resetTableHeight';
import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业

let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 46
});
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import ShowColumn from '@/components/base/show-column';
import ExportPage from '@/components/base/website/export/export-page';
import ImportBtn from '@/components/base/website/import-btn';
import EditAccountDialog from '@/components/dialog/website/account-pool/edit-account-dialog';

export default {
  name: 'media-account-pool',
  mixins: [mixin],
  components: {
    ShowColumn,
    ExportPage,
    SelectAddress,
    SelectOrganLevel,
    SelectTrade,
    TipInfoDialog,
    createWebSiteCode,
    ImportBtn,
    EditAccountDialog
  },
  data() {
    return {
      isPackUp: false,
      isEditAccountDialog: false,
      isExportPageDataDialog: false,
      poolForm: {
        accountLike: '', // 网站信息
        siteType: '', // 网站类型
        websiteAccountStatus: '', // 网站状态
        siteArea: [], // 地区
        orgArea: [], // 机构
        tradeArea: [], // 行业
        isFlag: '',
        url: '' // url
        // accountTypeList: [],
        // source: ''
      },
      exportArgs: {
        // 导出的参数
      },
      showColumn: [
        'siteCode',
        'accountName',
        'url',
        'siteTypeMeaning',
        'location',
        'organName',
        'tradeName',
        'isScanMeaning',
        'monitorRateMeaning',
        'isFlag',
        'updatedByMeaning',
        'createdTime',
        'updatedTime'
      ],
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 20,
        pageSizes: [100, 500, 1000]
      },
      tableOption: options,
      data: [],
      isDeleteDiaShow: false,
      tipContent: {
        title: '您确定要删除该网站吗？'
      },
      goingDelId: '',
      toggleFlagObj: {},
      isFlagDiaShow: false,
      flagContent: {
        title: '您确定要切换该网站的渲染状态吗？'
      }
    };
  },
  created() {
    this.getData();
    // downloadTemplate({
    //   type: 0,
    //   downTempFileName: '网站账号导入表格模板',
    //   tempFileName: 'accountImport'
    // });
  },
  setup() {
    const onFilterDic = (options = []) => {
      return options.filter(ele => ele.value);
    };
    const { dicList } = useGetDicList(
      ['site_type', 'is_flag', 'website_account_status'],
      false
    );
    return { dicList, onFilterDic };
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

      let paramsObj = {
        url: this.poolForm.url,
        provDistId: this.poolForm.siteArea[0] ? this.poolForm.siteArea[0] : '',
        cityDistId: this.poolForm.siteArea[1] ? this.poolForm.siteArea[1] : '',
        countyDistId: this.poolForm.siteArea[2]
          ? this.poolForm.siteArea[2]
          : '',
        tradePid: this.poolForm.tradeArea[0] ? this.poolForm.tradeArea[0] : '',
        tradeSid: this.poolForm.tradeArea[1] ? this.poolForm.tradeArea[1] : '',
        tradeGid: this.poolForm.tradeArea[2] ? this.poolForm.tradeArea[2] : '',
        organPid: this.poolForm.orgArea[0] ? this.poolForm.orgArea[0] : '',
        organSid: this.poolForm.orgArea[1] ? this.poolForm.orgArea[1] : '',
        organGid: this.poolForm.orgArea[2] ? this.poolForm.orgArea[2] : '',
        isFlag: this.poolForm.isFlag,
        siteType: this.poolForm.siteType,
        accountStatus: this.poolForm.websiteAccountStatus,
        accountLike: this.poolForm.accountLike,
        sortFlag: false,
        sortField: '',
        page: {
          size: this.page.pageSize,
          current: this.page.currentPage
        }
      };
      let { total = 0, data = [] } = await getPoolList(paramsObj);
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
          .join('');
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
    async showEditDialog(id) {
      const { data, code, msg } = await getWebsiteInfo({ id });
      if (code) {
        this.$message.error(msg || '加载失败');
        return;
      }
      // 关联客户 回显 以及 关联客户选择器的备选项
      let custList = data.customInfoList || [];
      let accountOptions = [];
      const queryAccountList = custList
        .filter(ele => {
          return ele && ele.id;
        })
        .map(ele => {
          accountOptions.push({
            value: ele.id,
            label: `${ele.custName}：${ele.custCode}`
          });
          return {
            custId: parseInt(ele.id),
            custCode: ele.custCode,
            custName: ele.custName
          };
        });
      let accountList = queryAccountList.map(ele => {
        return {
          value: parseInt(ele.custId),
          key: ele.custCode
        };
      });
      if (!accountList.length) {
        accountList = [
          {
            value: '',
            key: Date.now()
          }
        ];
      }
      data.accountOptions = accountOptions;
      data.accountList = accountList;
      data.id = id;

      // 地区扩展处理
      let siteArea = [];
      data.provDistId && siteArea.push(parseInt(data.provDistId));
      data.cityDistId && siteArea.push(parseInt(data.cityDistId));
      data.countyDistId && siteArea.push(parseInt(data.countyDistId));
      data.siteArea = siteArea;
      // 机构类型扩展处理
      let orgArea = [];
      data.organPid && orgArea.push(parseInt(data.organPid));
      data.organSid && orgArea.push(parseInt(data.organSid));
      data.organGid && orgArea.push(parseInt(data.organGid));
      data.orgArea = orgArea;

      // 行业扩展处理
      let tradeArea = [];
      data.tradePid && tradeArea.push(parseInt(data.tradePid));
      data.tradeSid && tradeArea.push(parseInt(data.tradeSid));
      data.tradeGid && tradeArea.push(parseInt(data.tradeGid));
      data.tradeArea = tradeArea;

      this.isEditAccountDialog = true;
      this.$nextTick(() => {
        this.$refs.EditAccountDialog.onInit(data);
      });
    },
    addSite() {
      // 添加网站 开启抽屉
      // 生成标识码   0-中文  1-英文
      // createWebSiteCode({ type: 0 }).then(res => {
      //   this.ChineseSiteCode = res.data;
      //   this.addSiteForm.siteCode = this.ChineseSiteCode;
      //   this.ifEdit = false;
      //   this.drawerTitle = '添加网站';
      //   this.isDrawerShow = true;
      // });
      this.isEditAccountDialog = true;
      this.$nextTick(() => {
        this.$refs.EditAccountDialog.onInit();
      });
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    showDeleteDialog(id) {
      this.goingDelId = id;
      this.isDeleteDiaShow = true;
    },
    // 确认删除
    async confirmDeleteHandel() {
      // deleteSite
      let { err = 0, code, msg = '' } = await deleteSite({
        ids: [this.goingDelId],
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
      this.closeTip();
      this.queryList();
    },
    closeTip() {
      this.isDeleteDiaShow = false;
    },
    // 是否渲染开关
    changeFlag(obj) {
      this.toggleFlagObj = obj;
      // this.flagContent.title
      if (obj.isFlag == '1') {
        this.flagContent.title = '您确定要打开渲染吗？';
      } else {
        this.flagContent.title = '您确定要关闭渲染吗？';
      }
      this.isFlagDiaShow = true;
    },
    // 确认更新渲染状态
    async confirmToggleFlag() {
      // updateSite
      let paramsObj = {
        accountId: this.toggleFlagObj.id,
        isFlag: this.toggleFlagObj.isFlag == 0 ? '1' : '0'
      };
      let { err = 0, code, msg = '' } = await updateIsFlag(paramsObj);
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
        message: msg || '操作成功！'
      });
      this.closeFlag();
      this.queryList();
    },
    closeFlag() {
      this.isFlagDiaShow = false;
    },
    onChangeWay() {},
    packUpHandle() {
      this.isPackUp = !this.isPackUp;
    },
    // 获取导出参数
    getExportArgs() {
      this.exportArgs = {
        // url: this.poolForm.url,
        provDistId: this.poolForm.siteArea[0] ? this.poolForm.siteArea[0] : '',
        cityDistId: this.poolForm.siteArea[1] ? this.poolForm.siteArea[1] : '',
        countyDistId: this.poolForm.siteArea[2]
          ? this.poolForm.siteArea[2]
          : '',
        tradePid: this.poolForm.tradeArea[0] ? this.poolForm.tradeArea[0] : '',
        tradeSid: this.poolForm.tradeArea[0] ? this.poolForm.tradeArea[0] : '',
        tradeGid: this.poolForm.tradeArea[0] ? this.poolForm.tradeArea[0] : '',
        organPid: this.poolForm.orgArea[0] ? this.poolForm.orgArea[0] : '',
        organSid: this.poolForm.orgArea[0] ? this.poolForm.orgArea[0] : '',
        organGid: this.poolForm.orgArea[0] ? this.poolForm.orgArea[0] : '',
        isFlag: this.poolForm.isFlag,
        siteType: this.poolForm.siteType,
        accountStatus: this.poolForm.websiteAccountStatus,
        accountLike: this.poolForm.accountLike,
        exportType: '0',
        sortFlag: false,
        sortField: '',
        exportFileName: '网站账号导出',
        sheetName: '网站账号',
        includeColumnFiledNames: [
          'id',
          'siteType',
          'siteCode',
          'accountName',
          'url',
          'accountStatus',
          'realStatus',
          'isScan',
          'abnormalReason',
          'monitorRate',
          'isFlag',
          'distName',
          'organName',
          'tradeName',
          'createdBy',
          'createdTime',
          'updatedBy',
          'updatedTime'
        ]
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
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
  .no-margin {
    ::v-deep {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .export-page {
    margin-right: 10px;
  }
  .input-with-tree {
    width: 70%;
  }
  .input-with-select {
    width: 100px;
    ::v-deep {
      .el-input__suffix .el-input__suffix-inner {
        background: #fff;
      }
      .el-input .el-input__inner {
        border-radius: 4px 0 0 4px;
        border-right: 0;
      }
    }
  }
  .add-btn {
    margin-left: 8px;
  }
  .del-role-icon {
    position: absolute;
    right: -8px;
    top: -6px;
    padding: 2px 2px 2px 2px;
    background: $mainDanger;
    border-radius: 50%;
    color: #fff;
    font-size: 10px;
    cursor: pointer;
  }
  .concat-btn {
    padding-bottom: 16px;
  }
  /deep/ .el-button.btn-dashed {
    border-style: dashed;
    padding: 7px 13px;
    i {
      font-size: 12px;
      margin-right: 3px;
    }
  }
  .addDialog-foot {
    height: 42px;
    padding-top: 11px;
    box-sizing: border-box;
    text-align: right;
    border-top: 1px solid #e8e8e8;
  }
}
</style>
<style lang="scss">
// 抽屉样式
.addDialog {
  .el-drawer__header {
    margin-bottom: 0;
    padding-top: 0;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    > span {
      font-size: 16px;
      color: #000;
      font-weight: 500;
    }
  }
  .el-drawer__body {
    padding: 24px;
    overflow-y: scroll;
    .el-form-item__content {
      width: 328px;
    }
  }
}
</style>
