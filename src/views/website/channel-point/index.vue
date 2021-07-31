<template>
  <div class="column">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        ref="columnForm"
        :model="columnForm"
        label-width="114px"
        class="no-rules-form"
      >
        <el-row :gutter="10" type="flex" justify="end" class="flex flex-wrap">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="网站标识码 :" prop="siteCode">
              <select-website
                class="input-with-tree"
                :value.sync="columnForm.siteCode"
                v-model="columnForm.siteCode"
              >
              </select-website>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="栏目名称 :" prop="channelName">
              <el-input
                v-model="columnForm.channelName"
                placeholder="请输入栏目名称"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="分类 :" prop="classification">
              <select-column v-model="columnForm.classification" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="栏目地址 :" prop="channelAddress">
              <el-input
                v-model="columnForm.channelAddress"
                placeholder="请输入栏目地址"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="能否连通 :" prop="connectResult">
              <el-select
                v-model="columnForm.connectResult"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.connect_result"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="监测状态 :" prop="monitoringStatus">
              <el-select
                v-model="columnForm.monitoringStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.monitoring_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="连通性监测频率 :" prop="monitoringFrequency">
              <el-select
                v-model="columnForm.monitoringFrequency"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.monitoring_frequency"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item
              label="更新监测频率 :"
              prop="updateMonitoringFrequency"
            >
              <el-select
                v-model="columnForm.updateMonitoringFrequency"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.update_monitoring_frequency"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="是否渲染 :" prop="isRender">
              <el-select v-model="columnForm.isRender" placeholder="请选择">
                <el-option
                  v-for="item in dicList.is_render"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="数据来源 :" prop="sources">
              <el-select v-model="columnForm.sources" placeholder="请选择">
                <el-option
                  v-for="item in dicList.sources"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item class="form-item--not-update-num" prop="customDays">
              <template slot="label">
                <el-select
                  v-model="columnForm.customDays"
                  placeholder="请选择"
                  @change="onChangeDay"
                >
                  <el-option
                    v-for="item in customInfoList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
              <el-select
                v-if="columnForm.customDays === 1"
                v-model="columnForm.daysNotUpdated"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.days_not_updated"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <input-number-range
                v-else
                v-model="columnForm.customDay"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="创建时间 :" prop="createdTime">
              <el-date-picker
                class="kp-date-picker"
                v-model="columnForm.createdTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <div class="flex justify-end padding-none">
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
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">栏目信息列表</span>
        <div class="flex">
          <el-button plain @click="exportDataFun('exportDataState')"
            >导出</el-button
          >
          <ImportBtn
            :title="`导入`"
            :url="`/cloud-website-back/websiteChannelPoint/channelImport`"
            :primary="noneDefault"
            :modelUrl="
              `/cloud-website-back/websiteChannelPoint/downloadTemplate`
            "
          />
          <div class="import-btn">
            <el-button type="primary" @click="onAddOrEdit">添加</el-button>
          </div>
        </div>
      </div>

      <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="channelAddress" slot-scope="scope">
          <el-link
            class="word-ellipsis-1"
            type="primary"
            :href="scope.row.channelAddress"
            target="_blank"
            >{{ scope.row.channelAddress }}</el-link
          >
        </template>
        <template slot="firstClassificationName" slot-scope="scope">
          <span>{{
            scope.row.firstClassificationMeaning ||
              scope.row.firstClassificationName
          }}</span>
        </template>
        <template slot="secondaryClassificationName" slot-scope="scope">
          <span>{{
            scope.row.secondaryClassificationMeaning ||
              scope.row.secondaryClassificationName
          }}</span>
        </template>
        <template slot="isRender" slot-scope="scope">
          <el-switch
            class="el-switch--label-inside"
            v-model="scope.row.isRender"
            :width="40"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="onRowChange(scope.row, 'isRender', 'updateIsRenderApi')"
          >
          </el-switch>
        </template>
        <template slot="connectResult" slot-scope="scope">
          <el-switch
            class="el-switch--label-inside"
            v-model="scope.row.connectResult"
            :width="40"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="
              onRowChange(scope.row, 'connectResult', 'connentResultApi')
            "
          >
          </el-switch>
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
                @click="onAddOrEdit(scope.row)"
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
    </basic-container>
    <!-- 添加 & 编辑弹框 -->
    <addOrEdit-dialog
      :visible.sync="addOrEditDialog.visible"
      :editData="addOrEditDialog.editData"
      @on-success="getData"
    />
    <!-- 删除信息提示 -->
    <tip-info-dialog
      :tipContent="delTipDialog.tipContent"
      :isOpen="delTipDialog.visible"
      @closeDialog="delTipDialog.visible = false"
      @confirmFn="doDel"
    />
  </div>
</template>

<script>
import * as getColumnApi from '@/api/website/column-monitor/column-monitor';
import { mapGetters } from 'vuex';
import useGetDicList from '@/hook/useGetDicList';

import ResetTable from '@/mixins/resetTableHeight';
import { options } from './table-option/index';
import SelectWebsite from '@/components/business-components/website/column-monitor/select-website';
import InputNumberRange from '@/components/base/input-number-range';
import AddOrEditDialog from '@/components/dialog/website/column-monitor/add-or-edit'; // 添加 & 编辑
import TipInfoDialog from '@/components/dialog/tip-dialog/index'; // 提示弹框
import ImportBtn from '@/components/base/website/import-btn';
import SelectColumn from '@/components/base/select-column'; // 下拉选择-分类
import { exportTable } from '@/api/common';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 43
});

export default {
  name: 'column',
  components: {
    SelectWebsite,
    InputNumberRange,
    AddOrEditDialog,
    TipInfoDialog,
    ImportBtn,
    SelectColumn
  },
  mixins: [mixin],
  data() {
    return {
      isPackUp: false,
      columnForm: {
        siteCode: '',
        channelName: '',
        classification: [],
        monitoringStatus: '',
        channelAddress: '',
        customDays: 1,
        connectResult: '',
        updateMonitoringFrequency: '',
        monitoringFrequency: '',
        isRender: '',
        sources: '',
        daysNotUpdated: '',
        createdTime: '',
        status: 1
      },
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: options,
      data: [],
      customInfoList: [
        {
          label: '未更新天数',
          value: 1
        },
        {
          label: '自定义天数',
          value: 0
        }
      ],
      addOrEditDialog: {
        visible: false,
        editData: {}
      },
      noneDefault: '',
      // 删除 & 导出 & 渲染 & 连通确认弹框
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        },
        ids: [], // 要删除的id集合
        exportDataState: false, // 导出
        isRenderShow: false, //是否渲染
        connectResultShow: false // 是否连通
      },
      statusParam: {} //是否渲染 & 是否连通 参数
    };
  },
  computed: {
    ...mapGetters(['currentDisplay'])
  },
  watch: {
    currentDisplay() {
      this.getData();
    },
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.getData();
      }
    }
  },
  mounted() {
    this.getData();
  },
  setup() {
    const { dicList } = useGetDicList(
      [
        'connect_result',
        'monitoring_status',
        'monitoring_frequency',
        'update_monitoring_frequency',
        'is_render',
        'sources',
        'days_not_updated'
      ],
      false
    );
    return { dicList };
  },
  methods: {
    onChangeDay(val) {
      this.columnForm.daysNotUpdated = '';
      this.columnForm.customDay = [];
    },
    //唤起添加或许编辑弹框
    onAddOrEdit(row) {
      this.addOrEditDialog.editData = {};
      if (row.id) this.addOrEditDialog.editData = row;
      this.$nextTick(() => {
        this.addOrEditDialog.visible = true;
      });
    },
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
      this.columnForm.siteCode = '';
      this.resetParams();
      this.columnForm.daysNotUpdated = '';
      this.$refs['columnForm'].resetFields();
      this.getList();
    },
    async getList() {
      this.loading = true;
      if (!this.currentDisplay.value) return;
      // 参数处理
      if (this.columnForm.createdTime === null) {
        this.columnForm.createdTime = '';
      }

      let postParams = {};
      let [
        firstClassificationId = '',
        secondaryClassificationId = ''
      ] = this.columnForm.classification;
      postParams.firstClassificationId = firstClassificationId;
      postParams.secondaryClassificationId = secondaryClassificationId;

      Object.assign(postParams, this.columnForm);
      if (this.columnForm.customDays === 1) {
        postParams['beginDay'] = this.columnForm.daysNotUpdated;
        postParams['endDay'] = '';
        delete postParams.daysNotUpdated;
        if (postParams.customDay) delete postParams.customDay;
      } else {
        let [begin, end] = this.columnForm.customDay;
        postParams['beginDay'] = begin;
        postParams['endDay'] = end;
        delete postParams.customDay;
      }
      if (postParams.classification) delete postParams.classification;
      if (postParams.customDays || postParams.customDays === 0)
        delete postParams.customDays;
      let params = Object.assign(
        {
          Others: {
            size: this.page.pageSize,
            current: this.page.currentPage
          }
          // prodId: this.currentDisplay.value
        },

        Object.assign(
          {
            page: { size: this.page.pageSize, current: this.page.currentPage }
          },
          postParams
        )
      );
      let { total = 0, data = [] } = await getColumnApi.getColumnList(params);
      this.loading = false;
      this.page.total = total;
      this.data = data;
    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    packUpHandle() {
      this.isPackUp = !this.isPackUp;
    },
    // 是否渲染 & 是否连通 弹框提示
    async onRowChange(row, mgs, changeApi) {
      this.statusParam = {};
      if (mgs === 'connectResult') {
        //是否连通
        this.statusParam = {
          ids: [row.id],
          connectResult: row.connectResult
        };
        this.exportDataFun('connectResultShow');
      } else {
        //是否渲染
        this.statusParam = {
          ids: [row.id],
          isRender: row.isRender
        };
        this.exportDataFun('isRenderShow');
      }
    },
    //是否渲染 & 是否连通 接口
    async changeRenderOrConnectResultStatus(changeApi) {
      const { code, msg } = await getColumnApi[changeApi](this.statusParam);
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '更新失败！'
        });
        return;
      }
      this.getList();
      this.$message({
        type: 'success',
        message: msg || '更新成功！'
      });
    },
    // 删除-单个
    onDel(row) {
      this.delTipDialog.visible = true;
      this.delTipDialog.tipContent.title = '您确定要删除吗？删除后不可恢复.';
      this.delTipDialog.exportDataState = false;
      this.delTipDialog.isRenderShow = false;
      this.delTipDialog.connectResultShow = false;
      this.delTipDialog.ids = [row.id];
    },
    //导出
    async exportDataFun(ele) {
      this.delTipDialog.visible = true;
      if (ele === 'exportDataState') {
        this.delTipDialog.tipContent.title = '确定要导出当前页？';
      } else if (ele === 'isRenderShow') {
        this.delTipDialog.tipContent.title = '您确定要切换该网站的渲染状态吗？';
      } else if (ele === 'connectResultShow') {
        this.delTipDialog.tipContent.title = '您确定要切换该网站的连通状态吗？';
      }
      this.delTipDialog[ele] = true;
    },
    // 执行删除-批量 & 导出
    async doDel() {
      if (this.delTipDialog.exportDataState) {
        let params = Object.assign(
          {},
          {
            url: '/cloud-website-back/websiteChannelPoint/export',
            exportType: 0,
            pageStart: this.page.currentPage,
            pageEnd: this.page.currentPage,
            pageSize: this.page.pageSize,
            sheetName: '栏目导出列表',
            exportFileName: '栏目导出列表.xlsx'
          },
          { method: 'post' }
        );
        await exportTable(params);
      } else if (this.delTipDialog.isRenderShow) {
        this.changeRenderOrConnectResultStatus('updateIsRenderApi');
      } else if (this.delTipDialog.connectResultShow) {
        this.changeRenderOrConnectResultStatus('connentResultApi');
      } else {
        let { code } = await getColumnApi.updateStatusApi({
          ids: this.delTipDialog.ids,
          status: -1
        });
        if (code === 0 || code === '0') {
          this.$message.success({
            message: '操作成功'
          });
          this.getList();
        }
      }
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
.import-btn {
  margin-left: 10px;
}
</style>
