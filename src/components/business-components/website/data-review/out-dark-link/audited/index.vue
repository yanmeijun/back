<template>
  <div class="pending">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        class="no-rules-form"
        :model="oneForm"
        ref="refOneForm"
        label-width="110px"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-end">
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item label="客户信息：">
              <div class="flex">
                <el-select
                  class="input-with-select"
                  v-model="oneForm.codeType"
                  placeholder="请选择"
                  @change="onChangeWay"
                >
                  <el-option
                    v-for="item in customInfoList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <select-organization-tree
                  class="input-with-tree"
                  v-if="oneForm.codeType === 1"
                  :valueKey="`custCode`"
                  v-model="oneForm.codeTypeValInput"
                  check-strictly
                  placeholder="请选择"
                />
                <el-input
                  class="input-with-tree"
                  clearable
                  v-else
                  v-model="oneForm.codeTypeValInput"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item class="no-margin" prop="time">
              <div class="flex">
                <el-select
                  class="input-with-select"
                  v-model="oneForm.dateType"
                  placeholder="请选择"
                >
                  <el-option label="监测时间" :value="0"></el-option>
                  <el-option label="修改时间" :value="1"></el-option>
                </el-select>
                <el-date-picker
                  class="kp-date-picker input-with-tree"
                  v-model="oneForm.time"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="onPickerChange"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="操作结果：" prop="resultType">
              <el-select v-model="oneForm.resultType" placeholder="请选择">
                <el-option
                  v-for="item in onFilterResultType(dicList.result_type)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="网站信息：" prop="siteInfo">
              <GetAccountInfo :limit="5" v-model="oneForm.siteInfo" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="问题类型：" prop="questionTypeList">
              <el-select
                class="kp-select-multiple"
                clearable
                multiple
                v-model="oneForm.questionTypeList"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicList.outerdark_question_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="问题级别：" prop="questionLevel">
              <el-select v-model="oneForm.questionLevel" placeholder="请选择">
                <el-option
                  v-for="item in dicList.question_level"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="外链暗链地址：" prop="url">
              <el-input placeholder="请输入" v-model="oneForm.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="标记状态：" prop="questionLevel">
              <el-select v-model="oneForm.questionLevel" placeholder="请选择">
                <el-option
                  v-for="item in dicList.question_level"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="检测结果：" prop="questionLevel">
              <el-select v-model="oneForm.questionLevel" placeholder="请选择">
                <el-option
                  v-for="item in dicList.question_level"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="地区：" prop="ex_addressValues">
              <select-address v-model="oneForm.ex_addressValues" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="行业：" prop="ex_tradeValues">
              <select-trade v-model="oneForm.ex_tradeValues" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="isPackUp">
            <el-form-item label="机构：" prop="ex_organValues">
              <select-organ-level v-model="oneForm.ex_organValues" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <div class="flex justify-end">
              <pack-button
                @packClick="onPackUp"
                :packUp="isPackUp"
              ></pack-button>
              <el-button @click="onResetQuery">重置</el-button>
              <el-button type="primary" @click="onQueryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">外链暗链</span>
        <div class="flex right">
          <ShowColumn
            v-model="showColumn"
            :allShowColumn="allShowColumn"
            :tableOption="tableOption"
          />
          <Marks :rows="checkTableList" />
          <el-button
            type="primary"
            :disabled="checkTableList.length === 0"
            @click="onShowing('isSelected', 2)"
            >预警并显示</el-button
          >
          <el-button
            type="primary"
            :disabled="checkTableList.length === 0"
            @click="onShowing('isSelected', 3)"
            >误报</el-button
          >
          <ExportDropdown
            class="export-btn"
            :url="`/newmedia-back/websiteSensitiveDetail/exportData`"
            :idList="exportIdList"
            :args="exportArgs"
            :pageSize="page.pageSize"
            :total="page.total"
          />
        </div>
      </div>
      <ex-table
        ref="refCrud"
        :data="data"
        :option="tableOption"
        :loading="loading"
        :show-column="showColumn"
        :page="page"
        :span-method="onSpanCol"
        @on-load="onLoad"
        @selection-change="onTableSelectionChange"
      >
        <template slot="selectionHeader" slot-scope="{ column }">
          <el-dropdown
            trigger="click"
            placement="bottom"
            class="selection-dropdown"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                class="kp-text-center"
                @click.native="onCheckAll"
                >{{ cCheckTxt }}</el-dropdown-item
              >
              <el-dropdown-item
                class="kp-text-center"
                @click.native="onCheckNum"
                >按序号选择当前页数据</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="index" slot-scope="scope">
          <div class="kp-text-center">{{ scope.row.rowIndex + 1 }}</div>
        </template>
        <template slot="url" slot-scope="scope">
          <el-link
            class="word-ellipsis-1"
            type="primary"
            :href="scope.row.url"
            target="_blank"
            >{{ scope.row.url }}</el-link
          >
        </template>
        <template slot="count" slot-scope="scope">
          <div class="kp-color-main">{{ scope.row.count || 0 }}</div>
        </template>
        <template slot="linkCount" slot-scope="scope">
          <div class="kp-color-main">{{ scope.row.linkCount || 0 }}</div>
        </template>
        <template slot="snapshot" slot-scope="scope">
          <div class="flex center icons">
            <el-link
              type="primary"
              target="_blank"
              :href="scope.row.snapshot"
              :underline="false"
            >
              <i class="iconfont icontubiaozhizuomoban59"></i>
            </el-link>
          </div>
        </template>
        <template slot="homePage" slot-scope="scope">
          <el-link
            v-if="!!scope.row.homePage"
            type="primary"
            :underline="false"
            :href="scope.row.homePage"
            target="_blank"
          >
            <i class="iconfont iconlianjie"></i>
          </el-link>
          <span v-else>-</span>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex align-center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="预警并显示"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban56"
                :class="{ 'kp-opacity': scope.row.resultType === 2 }"
                @click="onShowing(scope.row, 2)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="误报"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban54"
                :class="{ 'kp-opacity': scope.row.resultType === 3 }"
                @click="onShowing(scope.row, 3)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="onShowEdit(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 审核 -->
    <AuditTipDialog
      v-if="isAuditTipDialog"
      ref="AuditTipDialog"
      :option="auditOption"
      :isOpen="isAuditTipDialog"
      @update="onUpdate"
      @closeDialog="isAuditTipDialog = false"
    />
    <!-- 编辑 -->
    <EditReasonDialog
      v-if="isEditReasonDialog"
      ref="refEditReasonDialog"
      :isOpen="isEditReasonDialog"
      @update="onUpdate"
      @closeDialog="onCloseEditReasonDialog"
    />
    <!-- 按序号选中 -->
    <SelectionByNumDialog
      ref="SelectionByNumDialog"
      v-if="isSelectionByNumDialog"
      :isOpen="isSelectionByNumDialog"
      :pageSize="data.length"
      @select="onSelectionChange"
      @closeDialog="isSelectionByNumDialog = false"
    />
  </div>
</template>
<script>
import { getDarkLinkList } from '@/api/website/data-review';
import {
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
  nextTick
} from '@vue/composition-api';

import useGetDicList from '@/hook/useGetDicList';

import ErrorSensitiveSearch from '@/components/business-components/new-media/data-review/error-sensitive/error-sensitive-search/index';
import ExportDropdown from '@/components/base/export/export-dropdown';
import ShowColumn from '@/components/base/show-column';
import SelectOrganizationTree from '@/components/base/select-organization-tree';
import GetAccountInfo from '@/components/base/get-website-account-info';

import SelectionByNumDialog from '@/components/dialog/new-media/data-review/selection-by-num-dialog';
import Marks from '../marks';
import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别

import EditReasonDialog from '../edit-reason-dialog';
import AuditTipDialog from '../audit-tip-dialog';

import { option2 } from '../table-option';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 102
});
export default {
  name: 'pending',
  components: {
    ErrorSensitiveSearch,
    ExportDropdown,
    ShowColumn,
    SelectOrganizationTree,
    GetAccountInfo,
    EditReasonDialog,
    SelectionByNumDialog,
    Marks,
    SelectAddress,
    SelectTrade,
    SelectOrganLevel,
    AuditTipDialog
  },
  mixins: [mixin],
  setup(props, { root }) {
    // 定义ref
    const refOneForm = ref(null);
    const refEditReasonDialog = ref(null);
    const refCrud = ref(null);
    // 定义state
    const state = reactive({
      // 已审核
      check: 1,
      // 是否显示-推荐搜索
      loading: false,
      oneForm: {
        codeType: 1,
        dateType: 0,
        codeTypeVal: [],
        codeTypeValInput: '',
        time: [],
        accountTypeList: [],
        siteInfo: [],
        resultType: '',
        questionTypeList: [],
        questionLevel: '',
        ex_addressValues: [],
        ex_tradeValues: [],
        ex_organValues: []
      },
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        currentPage: 1,
        pageSizes: [100, 500, 1000]
      },
      allShowColumn: ['index', 'selection', 'questionType'],
      showColumn: [
        'index',
        'selection',
        'questionType',
        'url',
        'homeUrl',
        'count',
        'linkCount',
        'snapshot',
        'websiteName',
        'websiteCode',
        'processingTime',
        'questionLevelMeaning',
        'markType',
        'resultTypeMeaning'
      ],
      data: [],
      tableOption: option2,
      checkTableList: [],
      exportIdList: [],
      exportArgs: {},
      customInfoList: [
        {
          label: '组织单位',
          value: 1
        },
        {
          label: '填报单位',
          value: 0
        },
        {
          label: '订单号',
          value: 2
        },
        {
          label: '任务号',
          value: 3
        }
      ],
      isEditReasonDialog: false,
      isSelectionByNumDialog: false,
      isAuditTipDialog: false,
      isPackUp: false,
      auditOption: {},
      pickerMinDate: '',
      pickerOptions: {
        onPick: obj => {
          state.pickerMinDate = new Date(obj.minDate).getTime();
        },
        disabledDate: time => {
          if (state.pickerMinDate) {
            const day1 = 365 * 24 * 3600 * 1000;
            let maxTime = state.pickerMinDate + day1;
            let minTime = state.pickerMinDate - day1;
            return (
              time.getTime() > maxTime ||
              time.getTime() < minTime ||
              time.getTime() > Date.now() - 0 * 24 * 3600 * 1000
            );
          } else {
            return time.getTime() > Date.now() + 0 * 24 * 3600 * 1000;
          }
        }
      }
    });
    // // 属性
    const cCheckTxt = computed(() => {
      return state.checkTableList.length === state.data.length
        ? '取消当前页全选'
        : '当前页全选';
    });

    onMounted(() => {
      onGetList();
    });

    /**
     * ---------------- useHook ----------------
     */
    // 获取字典
    const onFilterDictType = (options = []) => {
      return options.filter(ele => ['101', '102', '103'].includes(ele.value));
    };
    const onFilterResultType = (options = []) => {
      return options.filter(ele => parseInt(ele.value) !== 4);
    };
    const { dicList } = useGetDicList([
      'question_level',
      'account_type',
      'outerdark_question_type',
      'result_type'
    ]);
    // ---------------- END - Hook ----------------

    // // 方法 ------------------------------
    // 获取列表
    const onGetList = async () => {
      const [startDate = '', endDate = ''] = state.oneForm.time;
      const siteInfo = state.oneForm.siteInfo.join(',');
      state.checkTableList = [];
      state.exportIdList = [];
      // 客户信息
      let codeTypeVal = [];
      if (
        state.oneForm.codeTypeVal.length > 0 &&
        state.oneForm.codeType === 1
      ) {
        codeTypeVal = state.oneForm.codeTypeVal;
      } else if (state.oneForm.codeTypeValInput) {
        codeTypeVal = [state.oneForm.codeTypeValInput];
      }

      // 地区处理
      let distId = {};
      if (state.oneForm.ex_addressValues.length) {
        let [
          provDistId = '',
          cityDistId = '',
          countyDistId = ''
        ] = state.oneForm.ex_addressValues;
        distId.provDistId = provDistId;
        distId.cityDistId = cityDistId;
        distId.countyDistId = countyDistId;
      }
      // 行业处理
      if (state.oneForm.ex_tradeValues.length) {
        let [p = '', s = '', g = ''] = state.oneForm.ex_tradeValues;
        distId.tradePid = p;
        distId.tradeSid = s;
        distId.tradeGid = g;
      }
      // 机构类处理
      if (state.oneForm.ex_organValues.length) {
        let [p = '', s = '', g = ''] = state.oneForm.ex_organValues;
        distId.organPid = p;
        distId.organSid = s;
        distId.organGid = g;
      }

      const params = Object.assign(
        {
          check: state.check,
          startDate,
          endDate,
          page: {
            size: state.page.pageSize,
            current: state.page.currentPage
          }
        },
        state.oneForm,
        {
          codeTypeVal,
          siteInfo
        },
        distId
      );
      state.exportArgs = Object.assign({ ...params }, { method: 'post' });
      delete state.exportArgs.page;
      state.loading = true;
      const { data, total } = await getDarkLinkList(params);
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
      state.data = data;
      state.page.total = total;
      state.loading = false;
    };

    // --重置页码
    const onResetParams = () => {
      state.page.currentPage = 1;
      state.page.pageSize = 100;
    };

    // 查询
    const onQueryList = () => {
      onResetParams();
      onGetList();
    };

    // 重置
    const onResetQuery = () => {
      state.oneForm.codeType = 1;
      state.oneForm.codeTypeVal = [];
      state.oneForm.siteInfo = [];
      state.oneForm.codeTypeValInput = '';
      state.pickerMinDate = '';
      onResetParams();
      refOneForm.value.resetFields();
      onGetList();
    };

    // // 搜索 - 切换
    const onChangeWay = val => {
      state.oneForm.codeTypeVal = [];
      state.oneForm.codeTypeValInput = '';
    };

    // 表格加载
    const onLoad = page => {
      // console.log('page', page);
      state.page = page;
      onGetList();
    };

    // 选中结果
    const onCheckAll = () => {
      if (state.checkTableList.length === state.data.length) {
        refCrud.value.clearCheckboxRow();
      } else {
        refCrud.value.setAllCheckboxRow();
      }
    };
    // const onCheckNum = () => {
    //   state.isSelectionByNumDialog = true;
    // };
    const onTableSelectionChange = selection => {
      // console.log(selection);
      state.checkTableList = selection;
      state.exportIdList = selection.map(ele => ele.id);
    };

    // 显示-弹框
    const onShowing = (row, type) => {
      if (!type || row.resultType === type) return;
      // checkbox - 多选
      const tips = [
        {
          title: '仅显示',
          tip: ''
        },
        {
          title: '预警并显示',
          tip: ''
        },
        {
          title: '误报',
          tip: ''
        }
      ];
      const data =
        row === 'isSelected' && !row.id ? state.checkTableList : [row];
      state.auditOption = { ...tips[type - 1], type, data, check: state.check };
      state.isAuditTipDialog = true;
    };
    // 编辑
    const onShowEdit = row => {
      state.isEditReasonDialog = true;
      nextTick(() => {
        if (!refEditReasonDialog.value) {
          console.log('no refEditReasonDialog');
          return;
        }
        refEditReasonDialog.value.init({ ...row, check: state.check });
      });
    };

    // 关闭 - 弹框
    const onCloseEditReasonDialog = () => {
      state.isEditReasonDialog = false;
    };

    // 重置数据
    const onUpdate = () => {
      // 刷新列表
      onGetList();
    };

    const onPackUp = () => {
      state.isPackUp = !state.isPackUp;
    };
    const onSpanCol = ({ _rowIndex, columnIndex }) => {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 2 };
      } else if (columnIndex === 1) {
        return { rowspan: 0, colspan: 0 };
      }
    };
    const onCheckNum = () => {
      state.isSelectionByNumDialog = true;
    };
    // 根据序号选择
    const onSelectionChange = val => {
      const [start, end] = val;
      let list = [];
      if (!end) {
        list = state.data.slice(parseInt(start) - 1, parseInt(start));
      } else {
        list = state.data.slice(parseInt(start) - 1, parseInt(end));
      }
      refCrud.value.clearCheckboxRow();
      refCrud.value.setCheckboxRow(list);
    };

    const replaceErr = row => {
      var reg = new RegExp(row.sensitiveWords, 'g');
      return row.context.replace(
        reg,
        `<span class="kp-color-error">${row.sensitiveWords}</span>`
      );
    };

    const onPickerChange = () => {
      state.pickerMinDate = '';
    };
    // 返回
    return {
      refOneForm,
      refCrud,
      refEditReasonDialog,
      cCheckTxt,
      ...toRefs(state),
      dicList,
      onFilterResultType,
      replaceErr,
      onQueryList,
      onLoad,
      onResetQuery,
      onChangeWay,
      onSelectionChange,
      onTableSelectionChange,
      onCheckAll,
      onFilterDictType,
      onPackUp,
      onShowing,
      onShowEdit,
      onCloseEditReasonDialog,
      onUpdate,
      onCheckNum,
      onSpanCol,
      onPickerChange
    };
  }
};
</script>
<style lang="scss" scoped>
.pending {
  .input-with-select {
    width: 160px;
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
  .no-margin {
    ::v-deep {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .input-with-tree {
    border-radius: 0 4px 4px 0;
    ::v-deep {
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
  }
  .selection-dropdown {
    position: absolute;
    left: 0;
    top: 14px;
    z-index: 99;
    cursor: pointer;
  }
  .el-dropdown-link-txt {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.85);
  }
  .err-icon {
    margin-right: 8px;
  }
  .export-btn {
    margin-right: 0;
  }
}
.show-input {
  position: relative;
  ::v-deep {
    .el-select__tags {
      position: absolute;
      height: 32px;
      top: 5px;
    }
  }
}
</style>
<style>
.popper-ewm {
  min-width: 130px;
}
.popper-ewm .ewm-con {
  padding: 4px 0;
}

.popper-ewm img {
  display: block;
  margin: 0 auto 6px;
  width: 96px;
  height: 96px;
}
</style>
