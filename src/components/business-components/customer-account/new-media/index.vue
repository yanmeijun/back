<template>
  <div>
    <!-- 查询 -->
    <el-form
      class="top-form no-rules-form"
      ref="filterFm"
      :model="filter.model"
      label-width="110px"
    >
      <el-row :gutter="10" type="flex" justify="end" class="flex flex-wrap">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="行业：" prop="ex_tradeValues">
            <select-trade v-model="filter.model.ex_tradeValues" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="地区：" prop="ex_addressValues">
            <select-address v-model="filter.model.ex_addressValues" clearable />
          </el-form-item>
        </el-col>
        <template v-if="filter.isMore">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="填报单位信息：" prop="custInfo">
              <el-input
                v-model="filter.model.custInfo"
                placeholder="请输入标识码/名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="状态：" prop="status">
              <select-dict
                v-model="filter.model.status"
                type="status"
                show-all
              />
            </el-form-item>
          </el-col>
          <!-- 当前组织单位无子级时挂靠单位筛选隐藏 -->
          <el-col v-if="orgNode.hasChildren" :xs="24" :sm="24" :md="8">
            <el-form-item label="挂靠组织单位：" prop="ex_parentId">
              <select-organization-tree
                v-model="filter.model.ex_parentId"
                :parent="orgNode"
                check-strictly
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="机构：" prop="ex_organValues">
              <select-organ-level
                v-model="filter.model.ex_organValues"
                clearable
              />
            </el-form-item>
          </el-col>
        </template>
        <el-col :xs="24" :sm="24" :md="8">
          <div class="flex justify-end" style="margin-bottom: 6px">
            <pack-button
              @packClick="onPackClick"
              :packUp="filter.isMore"
            ></pack-button>
            <el-button @click="onFilterReset">重置</el-button>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name"
        >{{ orgNode.custName }}（{{ table.page.total || 0 }}）</span
      >
      <div class="flex">
        <el-button
          plain
          @click="onChangeAffiliatedUnit"
          :disabled="!table.selection.length"
          >调整挂靠组织单位</el-button
        >
        <ExportDropdown
          :url="`/cloud-common/exportData/export`"
          :idList="exportDropdown.idList"
          :pageSize="table.page.pageSize"
          :total="table.page.total"
          :args="exportDropdown.args"
        />
        <el-button plain disabled>批量导入</el-button>
        <el-button type="primary" @click="onAdd">添加客户</el-button>
      </div>
    </div>

    <!--表格渲染-->
    <ex-table
      ref="refCrud"
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
      @selection-change="onTableSelectionChange"
    >
      <!-- 网站标识码 -->
      <template slot="custCode" slot-scope="scope">
        <el-link
          type="primary"
          class="word-ellipsis-1"
          href="javascript:void(0)"
          >{{ scope.row.custCode }}</el-link
        >
      </template>

      <!-- 网站名称 -->
      <template slot="custName" slot-scope="scope">
        <span>{{ scope.row.custName }}</span>
      </template>

      <!-- 地区 -->
      <!-- <template slot="szd" slot-scope="{ row }">
        <span>{{
          `${row.provDistName || ''}${row.cityDistName ||
            ''}${row.countyDistName || ''}`
        }}</span>
      </template> -->
      <!-- 机构 -->
      <!-- <template slot="organName" slot-scope="{ row }">
        <span>{{
          [row.organPname, row.organSname, row.organGname]
            .filter(ele => ele !== null)
            .join('/')
        }}</span>
      </template> -->
      <!-- 行业 -->
      <!-- <template slot="tradeName" slot-scope="{ row }">
        <span>{{
          [row.tradePname, row.tradeSname, row.tradeGname]
            .filter(ele => ele !== null)
            .join('/')
        }}</span>
      </template> -->

      <template slot="isFlag" slot-scope="scope">
        <el-switch
          class="el-switch--label-inside"
          v-model="scope.row.isFlag"
          :width="70"
          active-text="渲染"
          inactive-text="不渲染"
          active-value="1"
          inactive-value="0"
          @change="onRowIsFlagChange(scope.row)"
        >
        </el-switch>
      </template>

      <template slot="customParentRelationList" slot-scope="scope">
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            scope.row.customParentRelationList
              .map(ele => ele.parentCode)
              .join('; ')
          "
          placement="top"
        >
          <div class="des word-ellipsis-1">
            <el-tag
              v-for="item in scope.row.customParentRelationList"
              :key="item.id"
              style="margin: 0 2px"
              >{{ item.parentCode }}</el-tag
            >
          </div>
        </el-tooltip>
      </template>

      <template slot="mediaAccountCount" slot-scope="scope">
        <el-link
          type="primary"
          class="word-ellipsis-1"
          href="javascript:void(0)"
          @click.native="onRowMediaAccountCountClick(scope.row)"
          >{{ scope.row.mediaAccountCount }}</el-link
        >
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
              @click="onEdit(scope.row)"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="修改密码"
            placement="top"
            :enterable="false"
          >
            <i
              class="iconfont icontubiaozhizuomoban52"
              @click="onChangePassword(scope.row)"
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
              @click="onDel(scope.row)"
            ></i>
          </el-tooltip>
        </div>
      </template>
    </ex-table>

    <!-- 添加 -->
    <add-dialog
      :visible.sync="addDialog.visible"
      :orgNode="orgNode"
      @on-success="getData"
    />

    <!-- 编辑 -->
    <edit-dialog
      :visible.sync="editDialog.visible"
      :id="editDialog.id"
      @on-success="getData"
    />

    <!-- 调整挂靠单位前提示 -->
    <tip-info-dialog
      :tipContent="changeAffiliatedUnitTipDialog.tipContent"
      :isOpen="changeAffiliatedUnitTipDialog.visible"
      @closeDialog="changeAffiliatedUnitTipDialog.visible = false"
      @confirmFn="changeAffiliatedUnitDialog.visible = true"
    ></tip-info-dialog>

    <!-- 调整挂靠单位 -->
    <change-affiliated-unit-dialog
      :visible.sync="changeAffiliatedUnitDialog.visible"
      :selection="table.selection"
      @on-success="getData"
    />

    <!-- 修改账户密码 -->
    <change-password-dialog
      :visible.sync="changePasswordDialog.visible"
      :model="changePasswordDialog.model"
    />

    <!-- 新媒体账号明细列表 -->
    <new-media-account-list-dialog
      :visible.sync="newMediaAccountListDialog.visible"
      :model="newMediaAccountListDialog.model"
    />

    <!-- 删除信息提示 -->
    <tip-info-dialog
      :tipContent="delTipDialog.tipContent"
      :isOpen="delTipDialog.visible"
      @closeDialog="delTipDialog.visible = false"
      @confirmFn="doDel"
    ></tip-info-dialog>
  </div>
</template>

<script>
import { tableOption } from './config';
import * as custAccountApi from '@/api/cust-account';
import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业
import SelectOrganizationTree from '@/components/base/select-organization-tree'; // 下拉选择-组织树
import AddDialog from '@/components/dialog/customer-account/new-media/add'; // 添加
import EditDialog from '@/components/dialog/customer-account/new-media/edit'; // 编辑
import TipInfoDialog from '@/components/dialog/tip-dialog/index'; // 提示弹框
import ChangeAffiliatedUnitDialog from '@/components/dialog/customer-account/new-media/change-affiliated-unit'; // 调整挂靠单位
import ChangePasswordDialog from '@/components/dialog/customer-account/common/change-password'; // 修改账户密码
import NewMediaAccountListDialog from '@/components/dialog/customer-account/common/new-media-account-list'; // 新媒体账号列表
import ExportDropdown from '@/components/base/export/export-dropdown';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'table.option',
  list: ['.top-form'],
  diff: 160
});

export default {
  name: 'customer-site-account',
  mixins: [mixin],
  components: {
    SelectAddress,
    SelectOrganLevel,
    SelectTrade,
    SelectOrganizationTree,
    AddDialog,
    EditDialog,
    TipInfoDialog,
    ChangeAffiliatedUnitDialog,
    ChangePasswordDialog,
    NewMediaAccountListDialog,
    ExportDropdown
  },
  props: {
    // 父级节点
    orgNode: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // 查询模块
      filter: {
        model: {
          url: '', // 主页url
          ex_addressValues: [], // 地区
          provDistId: '', // 地区-省
          cityDistId: '', // 地区-市
          countyDistId: '', // 地区-县
          ex_tradeValues: [], // 扩展-行业
          tradeId: '', // 行业
          isFlag: '', // 是否渲染
          status: '', // 状态
          ex_organValues: [], // 扩展-机构级别
          organId: '', // 机构
          organLevelId: '', // 级别
          // 扩展机构级别
          ex_organLevelId: {
            show: false // 是否显示
          },
          ex_parentId: null, // 挂靠组织单位--单选
          parentIdList: [], // 挂靠组织单位
          custInfo: '' // 填报单位关键词
        },
        rules: {}, // 验证
        isMore: false // 更多
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
      // 导出相关
      exportDropdown: {
        idList: [],
        args: {}
      },
      // 添加模态框
      addDialog: {
        visible: false
      },
      // 编辑模态框
      editDialog: {
        visible: false,
        id: 0 // 当前你编辑行实例
      },
      // 删除确认弹框
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        },
        ids: [] // 要删除的id集合
      },
      // 调整挂靠组织单位确认弹框
      changeAffiliatedUnitTipDialog: {
        visible: false,
        tipContent: {
          title: '重新调整所选数据的挂接靠组织单位，是否要继续？'
        }
      },
      // 调整挂靠组织单位模态框
      changeAffiliatedUnitDialog: {
        visible: false
      },
      // 修改密码模态框
      changePasswordDialog: {
        visible: false,
        model: {}
      },
      // 新媒体账号明细模态框
      newMediaAccountListDialog: {
        visible: false,
        model: {}
      }
    };
  },
  watch: {
    // 监听组织机构变化
    'orgNode.custCode': {
      immediate: true,
      handler(val) {
        if (!val) {
          return;
        }
        this.getData();
        this.exportDropdown.args = this.getExportSearchModel();
      }
    }
  },
  methods: {
    // 获取查询过滤条件
    getSearchModel() {
      let searchModel = {
        data: {
          source: 'BS', // 新媒体填报单位
          delFlag: '2', // 未删除
          custLevel: '1' // 0:组织单位 1:填报单位
        },
        params: {
          size: this.table.page.pageSize,
          current: this.table.page.currentPage
        }
      };
      let filterModel = JSON.parse(JSON.stringify(this.filter.model));
      // 地区处理
      if (filterModel.ex_addressValues.length) {
        let [
          provDistId = '',
          cityDistId = '',
          countyDistId = ''
        ] = filterModel.ex_addressValues;
        filterModel.provDistId = provDistId;
        filterModel.cityDistId = cityDistId;
        filterModel.countyDistId = countyDistId;
      }
      // 行业处理
      if (filterModel.ex_tradeValues.length) {
        let [p = '', s = '', g = ''] = filterModel.ex_tradeValues;
        filterModel.tradePid = p;
        filterModel.tradeSid = s;
        filterModel.tradeGid = g;
      }
      // 机构类处理
      if (filterModel.ex_organValues.length) {
        let [p = '', s = '', g = ''] = filterModel.ex_organValues;
        filterModel.organPid = p;
        filterModel.organSid = s;
        filterModel.organGid = g;
      }
      // 挂靠单位处理
      if (filterModel.ex_parentId) {
        //如果无查询挂靠单位条件以传进来的组织机构及子项id为条件
        filterModel.parentIdList = [filterModel.ex_parentId];
      } else {
        filterModel.parentIdList = [this.orgNode.id];
      }
      // 去除自定义扩展属性
      Object.keys(filterModel).forEach(k => {
        if (k.startsWith('ex_')) {
          delete filterModel[k];
        }
      });
      searchModel.data = Object.assign({}, searchModel.data, filterModel);
      return searchModel;
    },
    // 获取导出过滤条件
    getExportSearchModel() {
      let searchModel = {
        source: 'BS', // 新媒体填报单位
        delFlag: '2', // 未删除
        custLevel: '1', // 0:组织单位 1:填报单位
        parentId: this.orgNode.id
      };
      return searchModel;
    },
    // 获取列表数据
    async getData() {
      this.table.data = [];
      this.table.loading = true;
      let searchModel = this.getSearchModel();
      let { code, data, total } = await custAccountApi.getList(searchModel);
      this.table.loading = false;
      if (code === 0) {
        data.forEach(item => {
          item.addressName = [
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
        this.table.data = data;
        this.table.page.total = total;
      }
    },
    onLoad(page) {
      this.table.page = page;
      this.getData();
    },
    // 搜索展开收起点击
    onPackClick() {
      this.filter.isMore = !this.filter.isMore;
      this.$nextTick(() => {
        this.resetTableHeight();
      });
    },
    // 查询条件重置
    onFilterReset() {
      this.$refs['filterFm'].resetFields();
      this.table.page.currentPage = 1;
      this.getData();
    },
    // 查询
    onQuery() {
      this.table.page.currentPage = 1;
      this.getData();
    },
    // table勾选变化
    onTableSelectionChange(selection) {
      this.table.selection = selection;
      // 导出-按选中
      this.exportDropdown.idList = selection.map(item => item.id);
    },
    // 调整挂靠单位-批量
    onChangeAffiliatedUnit() {
      this.changeAffiliatedUnitTipDialog.visible = true;
    },
    // 添加
    onAdd() {
      this.addDialog.visible = true;
    },
    // 编辑
    onEdit(row) {
      this.editDialog.visible = true;
      this.editDialog.id = row.id;
    },
    // 修改密码
    onChangePassword(row) {
      this.changePasswordDialog.visible = true;
      this.changePasswordDialog.model = row;
    },
    // 删除-单个
    onDel(row) {
      this.delTipDialog.visible = true;
      this.delTipDialog.ids = [row.id];
    },
    // 执行删除-批量
    async doDel() {
      let { code } = await custAccountApi.updateStatus({
        idList: this.delTipDialog.ids,
        status: '2' // 删除
      });
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.getData();
      }
    },
    // 行数据媒体账号数点击
    onRowMediaAccountCountClick(row) {
      this.newMediaAccountListDialog.visible = true;
      this.newMediaAccountListDialog.model = row;
    },
    // 跳转链接
    onJumpLink(row, link) {
      window.open(link, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input--select {
  /deep/ .el-input-group__prepend {
    padding: 0;
    width: 111px;
    .el-select {
      margin: -10px 0;
    }
  }
}
</style>
