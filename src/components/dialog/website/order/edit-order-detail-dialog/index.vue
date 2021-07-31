<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      class="edit-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialogN"
      :close-on-click-modal="false"
    >
      <el-steps
        class="xs-hide"
        :active="stepIndex"
        finish-status="success"
        simple
      >
        <el-step title="基本信息">
          <template slot="icon">
            <i class="icon-text">1</i>
          </template>
        </el-step>
        <el-step :title="stepTitle">
          <template slot="icon">
            <i class="icon-text">2</i>
          </template>
        </el-step>
      </el-steps>

      <div class="one-step" v-show="stepIndex === 0">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="140px"
        >
          <div v-for="(ele, index) in ruleForm.orderTaskSaveDtos" :key="index">
            <h2 class="flex justify-between align-center kp-dialog-title">
              <span>
                任务
                <span v-show="!ifEdited">{{ index + 1 }}</span>
              </span>

              <i
                class="el-icon-plus add-part-icon"
                :class="{ 'el-icon-remove-outline del-part-icon': index > 0 }"
                @click="addOrDelPart(ele)"
                v-show="!ifEdited"
              ></i>
            </h2>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="12">
                <el-form-item
                  label="任务名称："
                  :prop="'orderTaskSaveDtos.' + index + '.taskName'"
                  :rules="rules.taskName"
                  style="height: 32px"
                >
                  <el-input
                    v-model="ele.taskName"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12">
                <el-form-item
                  :prop="'orderTaskSaveDtos.' + index + '.rangeDate'"
                  class="question-container"
                  :rules="{
                    required: true,
                    message: '请选择任务数据范围',
                    trigger: 'change'
                  }"
                >
                  <div slot="label">
                    <div class="span-box">
                      任务数据范围
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="选取该交付任务中的数据范围（人工录入数据除外），需在订单的起止时间范围内"
                        placement="top"
                      >
                        <i
                          class="iconfont icontubiaozhizuomoban12 question-icon"
                        ></i> </el-tooltip
                      >：
                    </div>
                  </div>
                  <el-date-picker
                    class="kp-date-picker"
                    v-model="ele.rangeDate"
                    :disabled="ifEdited"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12">
                <el-form-item
                  label="要求交付日期："
                  :prop="'orderTaskSaveDtos.' + index + '.deliveryTime'"
                  :rules="{
                    required: true,
                    message: '请选择交付日期',
                    trigger: 'change'
                  }"
                >
                  <el-date-picker
                    class="kp-date-picker"
                    v-model="ele.deliveryTime"
                    :disabled="ifEdited"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerDeliveryOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <h2 class="kp-dialog-title">基础信息</h2>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" class="flex">
              <el-form-item label="系统监测内容：" prop="monitorContent">
                <el-checkbox-group
                  v-model="ruleForm.monitorContent"
                  size="small"
                  class="monitor-content-group"
                  :disabled="ifEdited"
                >
                  <el-checkbox
                    v-for="item in dicList.issue_type"
                    :key="item.id"
                    :label="item.value"
                    border
                    >{{ item.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12">
              <el-form-item label="指定交付人员：" prop="deliveryUsername">
                <el-select v-model="ruleForm.deliveryUsername" placeholder>
                  <el-option
                    v-for="item in delivererList"
                    :key="item.userId"
                    :label="item.accountName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="22" :sm="22" :md="22" class="flex">
              <el-form-item label="全站死链扫描配置：">
                <el-radio-group
                  v-model="ifDefault"
                  :disabled="ifEdited"
                  size="small"
                  @change="clearDefaultData"
                >
                  <el-radio-button
                    :label="item.value"
                    v-for="item in dicList.config_type"
                    :key="item.id"
                    >{{ item.label }}</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" v-if="ifDefault == 1">
              <el-form-item label="扫描层次：" prop="scanTimes">
                <el-input
                  v-model="ruleForm.scanTimes"
                  :disabled="ifEdited"
                  placeholder="范围:1-50"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" v-if="ifDefault == 1">
              <el-form-item label="扫描范围：">
                <el-input value="站点" disabled size="small"></el-input>
                <!-- <el-input v-model="ruleForm.scanExtent" placeholder="范围:1-50" size="small"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" v-if="ifDefault == 1">
              <el-form-item prop="urlNum">
                <div slot="label">
                  <div class="span-box">
                    最大url数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="超过范围则停止扫描"
                      placement="top"
                    >
                      <i
                        class="iconfont icontubiaozhizuomoban12 question-icon"
                      ></i> </el-tooltip
                    >：
                  </div>
                </div>
                <el-input
                  v-model="ruleForm.urlNum"
                  :disabled="ifEdited"
                  placeholder="范围:1-500000"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" v-if="ifDefault == 1">
              <el-form-item prop="linkNum">
                <div slot="label">
                  <div class="span-box">
                    最大死链数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="超过范围则停止扫描"
                      placement="top"
                    >
                      <i
                        class="iconfont icontubiaozhizuomoban12 question-icon"
                      ></i> </el-tooltip
                    >：
                  </div>
                </div>
                <el-input
                  v-model="ruleForm.linkNum"
                  :disabled="ifEdited"
                  placeholder="范围:1-10000"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <div class="footer-btn">
            <el-button type="primary" @click="goNextStep()">下一步</el-button>
          </div>
        </div>
      </div>
      <div class="two-step" v-show="stepIndex === 1">
        <el-form
          v-if="info.custType == 0"
          ref="siteForm"
          :model="siteForm"
          :rules="rules2"
          label-width="140px"
        >
          <el-row :gutter="10" v-show="!ifEdited">
            <el-col :xs="22" :sm="22" :md="22" class="flex">
              <el-form-item label="交付任务站点：" prop="deliveryWebsite">
                <div class="select-website flex">
                  <el-button
                    type="primary"
                    class="select-website-button"
                    @click="showWebDialog"
                    size="small"
                    >选择</el-button
                  >
                  <!-- <div class="noPay">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="`已选交付任务站点${selectedSiteList.length}个`"
                      placement="top"
                    >
                      <span class="kp-disabled no-pay-vip"
                        >已选{{ selectedSiteList.length }}项</span
                      >
                    </el-tooltip>
                  </div>-->
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 筛选所选站点部分 -->
        <el-form
          ref="searchForm"
          :model="searchForm"
          v-show="!ifEdited"
          label-width="80px"
          class="no-rules-form2"
        >
          <el-row
            :gutter="10"
            type="flex"
            class="flex flex-wrap justify-between"
          >
            <el-col :xs="8" :sm="8" :md="8">
              <el-form-item label="机构：" prop="organization">
                <select-organ-level
                  v-model="searchForm.organization"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8">
              <el-form-item label="地区：" prop="address">
                <select-address v-model="searchForm.address" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8">
              <el-form-item label="行业：" prop="trade">
                <select-trade v-model="searchForm.trade" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8">
              <el-form-item label="状态：" prop="status">
                <el-select v-model="searchForm.status" placeholder="请选择">
                  <el-option
                    v-for="item in dicList.website_real_status"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16">
              <div class="flex justify-end">
                <el-button @click="resetSiteQuery">重置</el-button>
                <el-button type="primary" @click="searchTableData(1)"
                  >查询</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- 站点显示部分 -->
        <ex-table
          ref="crud"
          :data="siteList"
          :option="option"
          :loadHold="loadHold"
          @selection-change="selectionChangeHandle"
          @scroll="tableScroll"
        >
          <template slot="index" slot-scope="scope">
            <span>{{ scope.row.rowIndex + 1 }}</span>
          </template>
          <template slot="websiteAccountStatusMeaning" slot-scope="scope">
            <span>{{ scope.row.websiteAccountStatusMeaning }}</span>
          </template>
          <template slot="tradePname" slot-scope="scope">
            <span>
              {{ scope.row.tradePname ? scope.row.tradePname : ''
              }}{{ scope.row.tradeSname ? '/' + scope.row.tradeSname : ''
              }}{{ scope.row.tradeGname ? '/' + scope.row.tradeGname : '' }}
            </span>
          </template>
          <template slot="provDistName" slot-scope="scope">
            <span>
              {{ scope.row.provDistName ? scope.row.provDistName : ''
              }}{{ scope.row.cityDistName ? '/' + scope.row.cityDistName : ''
              }}{{
                scope.row.countyDistName ? '/' + scope.row.countyDistName : ''
              }}
            </span>
          </template>
          <template slot="organPname" slot-scope="scope">
            <span>
              {{ scope.row.organPname ? scope.row.organPname : '' }}
              {{ scope.row.organSname ? '/' + scope.row.organSname : '' }}
              {{ scope.row.organGname ? '/' + scope.row.organGname : '' }}
            </span>
          </template>
        </ex-table>
        <div slot="footer" class="footer-slot">
          <div class="footer-btn clearfix">
            <div class="unitTotalNum" v-show="unitTotalUnm > 0">
              共 {{ unitTotalUnm }} 条记录
            </div>
            <el-button @click="goPreStep">上一步</el-button>
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <selectWebsiteDialog
      ref="selectWebDialog"
      :isOpen="ifshowWebDialog"
      :info="info"
      :selectedList="selectedSiteList"
      @closeDialog="ifshowWebDialog = false"
      @selectWeb="closeWebDialog"
    />
  </div>
</template>
<script>
import {
  addTask,
  getTaskInfo,
  getSiteTablebySiteId,
  getSiteTablebyTaskId,
  updateTask
} from '@/api/website/order';
import useGetDicList from '@/hook/useGetDicList';

import { getUserByDeptId } from '@/api/admin/organization';
import { mapGetters } from 'vuex';
import { computedStrLen } from '@/util/util';
import selectWebsiteDialog from '@/components/dialog/website/order/website-select-dialog';
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业
import { dateFormat } from '@/util/date';
import TipAlert from '@/components/base/tip-alert/index';
export default {
  name: 'edit-order-detail-diallog',
  components: {
    selectWebsiteDialog,
    TipAlert,
    SelectOrganLevel,
    SelectAddress,
    SelectTrade,
    updateTask
  },
  data() {
    var rangeDateFun = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择任务数据范围'));
      } else {
        callback();
      }
    };
    // var deliveryWebsiteFun = (rule, value, callback) => {
    //   if (!value || value.length === 0) {
    //     callback(new Error('请选择交付任务站点'));
    //   } else {
    //     callback();
    //   }
    // };
    var taskNameFun = (rule, value, callback) => {
      let len = computedStrLen(value);
      if (!value || value.length === 0 || value.length === '') {
        callback(new Error('任务名称不能为空'));
      } else if (len > 60) {
        return callback(new Error('最长60个字符(一个汉字等于2个字符)'));
      } else {
        callback();
      }
    };
    var scanTimesFun = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error('请输入正整数'));
      } else if (Number(value) < 1 || Number(value) > 50) {
        callback(new Error('请输入1-50内的正整数'));
      } else {
        callback();
      }
    };
    var urlNumFun = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error('请输入正整数'));
      } else if (Number(value) < 1 || Number(value) > 500000) {
        callback(new Error('请输入1-500000内的正整数'));
      } else {
        callback();
      }
    };
    var linkNumFun = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error('请输入正整数'));
      } else if (Number(value) < 1 || Number(value) > 10000) {
        callback(new Error('请输入1-10000内的正整数'));
      } else {
        callback();
      }
    };
    return {
      oneDisabled: false,
      title: '添加',
      stepTitle: '',
      stepIndex: 0,
      ifDefault: '0',
      loading: false,
      isAutoReport: false,
      company: null,
      tipContent:
        '自动生成报告时间为要求交付日期；手动生成报告设置后自动生成报告自动取消',
      ruleForm: {
        deliveryUsername: '', // 交付人员
        monitorContent: ['0', '1', '2', '3', '4', '5', '6'], // 监测内容
        scanTimes: '', // 扫描层次
        scanExtent: '', // 扫描范围
        urlNum: '', // 最大Url数
        linkNum: '', // 最大死链数
        deliveryWebsite: [], // 交付任务站点
        orderTaskSaveDtos: [
          {
            key: Date.now(),
            taskName: '',
            rangeDate: [],
            deliveryTime: ''
          }
        ]
      },
      siteForm: {},
      dataList: [], // 编辑状态下交付任务站点
      // labelPosition: 'left',
      rules: {
        taskName: [{ required: true, validator: taskNameFun, trigger: 'blur' }],
        rangeDate: [
          {
            required: true,
            validator: rangeDateFun,
            trigger: 'change'
          }
        ],
        deliveryTime: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        deliveryUsername: [
          { required: true, message: '请选择交付人员', trigger: 'change' }
        ],
        monitorContent: [
          { required: true, message: '请选择监测内容', trigger: 'change' }
        ],
        scanTimes: [
          {
            required: true,
            validator: scanTimesFun,
            trigger: 'blur'
          }
        ],
        urlNum: [
          {
            required: true,
            validator: urlNumFun,
            trigger: 'blur'
          }
        ],
        linkNum: [
          {
            required: true,
            validator: linkNumFun,
            trigger: 'blur'
          }
        ]
      },
      searchForm: {
        organization: [],
        address: [],
        trade: [],
        status: '1'
      }, // 筛选站点的条件
      selectedSiteList: [], // 弹框中选中的站点列表
      ifshowWebDialog: false,
      siteList: [], // 表格中展示的站点列表
      siteListPage: {
        current: 1,
        size: 20
      },
      siteListTotalPage: 0,
      loadHold: false,
      option: {
        page: false,
        align: 'center',
        menuAlign: 'center',
        menu: false,
        height: 350,
        selection: true,
        selectionWidth: 34,
        rowKey: 'id',
        column: [
          {
            label: '序号',
            prop: 'index',
            width: 56,
            slot: true
          },
          {
            label: '网站标识码',
            prop: 'siteCode',
            width: 120,
            align: 'center',
            showOverflow: true
          },
          {
            label: '网站名称',
            prop: 'accountName',
            width: 250,
            align: 'left',
            showOverflow: true
          },
          {
            label: '状态',
            prop: 'realStatusMeaning',
            width: 70,
            align: 'center',
            showOverflow: true
          },
          {
            label: '行业',
            prop: 'tradePname',
            width: 120,
            align: 'left',
            showOverflow: true,
            slot: true
          },
          {
            label: '地区',
            prop: 'provDistName',
            width: 120,
            align: 'left',
            showOverflow: true,
            slot: true
          },
          {
            label: '机构',
            prop: 'organPname',
            width: 120,
            align: 'left',
            showOverflow: true,
            slot: true
          }
        ]
      },
      rules2: {},
      delivererList: [],
      data: [],
      checkedSiteList: [],
      ifEdited: false,
      editedTaskData: {},
      relationSaveDtos: [],
      unitTotalUnm: 0
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    dateRanges: {
      type: Array,
      default: () => []
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['currentDisplay', 'depts']),
    dialogTitle() {
      return this.title + '任务';
    },
    pickerOptions() {
      let _self = this;
      return {
        disabledDate(time) {
          return (
            time.getTime() < new Date(_self.dateRanges[0]).getTime() ||
            time.getTime() > new Date(_self.dateRanges[1]).getTime() ||
            time.getTime() < Date.now() - 3600 * 1000 * 24
          );
        }
      };
    },
    pickerDeliveryOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      };
    },
    getRowKeys(row) {
      return row.id;
    }
  },
  setup() {
    const { dicList } = useGetDicList(
      ['config_type', 'issue_type', 'website_real_status'],
      false
    );
    return { dicList };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 初始化
    async init(row) {
      this.loading = true;
      if (this.validatenull(row)) {
        this.title = '添加';
        this.stepTitle = '选择站点';
        this.ifEdited = false;
        this.loading = false;
        let dateNow = new Date();
        let date7 = new Date(new Date().setDate(dateNow.getDate() + 6));
        this.ruleForm.orderTaskSaveDtos[0].rangeDate = [
          dateFormat(dateNow, 'yyyy-MM-dd'),
          dateFormat(date7, 'yyyy-MM-dd')
        ];
        this.ruleForm.orderTaskSaveDtos[0].deliveryTime = dateFormat(
          date7,
          'yyyy-MM-dd'
        );
      } else {
        this.title = '编辑';
        this.stepTitle = '站点信息';
        let { data = {} } = await getTaskInfo({
          id: row.id
        });
        this.editedTaskData = data;
        this.ifEdited = true;
        // 任务部分
        this.ruleForm.orderTaskSaveDtos = [
          {
            taskName: data.taskName,
            rangeDate: [
              data.startTime ? data.startTime.slice(0, 11) : '',
              data.endTime ? data.endTime.slice(0, 11) : ''
            ],
            deliveryTime: data.deliveryTime.slice(0, 11)
          }
        ];
        // 基础信息部分
        this.ruleForm.deliveryUsername = Number(data.deliveryUsername);
        if (data.configVo) {
          this.ifDefault = Number(data.configVo.configType);
        } else {
          this.ifDefault = 0;
        }
        if (this.ifDefault == 1) {
          this.ruleForm.scanTimes = data.configVo.scanTimes;
          this.ruleForm.scanExtent = data.configVo.scanExtent;
          this.ruleForm.urlNum = data.configVo.urlNum;
          this.ruleForm.linkNum = data.configVo.linkNum;
        }
        // 系统监测内容
        this.ruleForm.monitorContent = [];
        if (data.configVo.issueType && data.configVo.issueType.length > 0) {
          this.ruleForm.monitorContent = data.configVo.issueType.split(',');
        }
        this.loading = false;
      }
    },
    // 添加或删除任务
    addOrDelPart(item) {
      let index = this.ruleForm.orderTaskSaveDtos.indexOf(item);
      if (index !== -1 && index > 0) {
        this.ruleForm.orderTaskSaveDtos.splice(index, 1);
      } else {
        // 创建任务数量有限制
        if (
          this.ruleForm.orderTaskSaveDtos.length + 1 >
          this.info.deliveryTimes - this.info.deliveredTimes
        ) {
          this.$message({
            message: '已超过可创建任务上限',
            type: 'warning'
          });
        } else {
          // 批量创建任务，下一次任务的数据范围，按照上一个任务的范围增加一个月
          let lastDto = this.ruleForm.orderTaskSaveDtos[
            this.ruleForm.orderTaskSaveDtos.length - 1
          ];
          let newStartDate = new Date(lastDto.rangeDate[0]);
          let newEndDate = new Date(lastDto.rangeDate[1]);
          newStartDate.setDate(newStartDate.getDate() + 30);
          newEndDate.setDate(newEndDate.getDate() + 30);
          this.ruleForm.orderTaskSaveDtos.push({
            key: Date.now(),
            taskName: '',
            rangeDate: [
              dateFormat(newStartDate, 'yyyy-MM-dd'),
              dateFormat(newEndDate, 'yyyy-MM-dd')
            ],
            deliveryTime: ''
          });
        }
      }
    },
    // 获取交付人员名单
    async getUserList() {
      const { data } = await getUserByDeptId({
        deptIds: this.depts
      });
      this.delivererList = data;
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
    closeDialogN() {
      this.$emit('closeDialogN');
    },
    clearDefaultData() {
      this.ruleForm.scanTimes = this.ruleForm.urlNum = this.ruleForm.linkNum =
        '';
    },
    // 编辑状态下，根据站点ID获取站点详情列表
    getSiteList() {
      // this.stepIndex = 1;
      getSiteTablebyTaskId({
        taskId: this.editedTaskData.id,
        // sortFlag: false,
        page: {}
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.siteList = res.data.records;
        }
        this.option.selection = false;
        this.stepIndex = 1;
      });
    },
    // 进入下一步
    goNextStep() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          if (this.ifEdited) {
            // 修改
            this.getSiteList();
          } else {
            // 新增
            // 填报单位
            if (this.info.custType != 0) {
              this.searchTableData();
            } else {
              this.siteList = [];
            }
            // 组织单位
            this.stepIndex = 1;
          }
        }
      });
    },
    //  返回上一步
    goPreStep() {
      this.stepIndex = 0;
      this.siteListTotalPage = 0;
      this.siteListPage.current = 1;
    },
    resetSiteQuery() {
      this.searchForm = {
        organization: [],
        address: [],
        trade: [],
        status: ''
      };
      this.searchTableData();
    },
    tableScroll(obj) {
      console.log(obj);
      if (this.siteListPage.current == this.siteListTotalPage) {
        return;
      } else {
        if (
          obj.scrollTop >
          this.siteListPage.current * 500 + this.siteListPage.current
        ) {
          this.siteListPage.current += 1;
          this.loadHold = false;
          this.searchTableData();
        }
      }
    },
    searchTableData(ifReset) {
      // getSiteTablebySiteId
      let paramsObj = {
        // sortFlag: false,
        page: this.siteListPage,
        prodId: '2'
      };
      // 配置参数
      if (this.info.custType == 0) {
        // 客户是组织单位 传idList:[]
        paramsObj.idList = this.selectedSiteList;
      } else {
        // 客户是填报单位 传custId:''
        paramsObj.custId = this.info.custId;
      }
      // 机构
      if (this.searchForm.organization.length == 1) {
        paramsObj.organPid = this.searchForm.organization[0];
      } else if (this.searchForm.organization.length == 2) {
        [paramsObj.organPid, paramsObj.organSid] = [
          this.searchForm.organization[0],
          this.searchForm.organization[1]
        ];
      } else if (this.searchForm.organization.length == 3) {
        [paramsObj.organPid, paramsObj.organSid, paramsObj.organGid] = [
          this.searchForm.organization[0],
          this.searchForm.organization[1],
          this.searchForm.organization[2]
        ];
      }
      // 地区
      if (this.searchForm.address.length == 1) {
        paramsObj.provDistId = this.searchForm.address[0];
      } else if (this.searchForm.address.length == 2) {
        [paramsObj.provDistId, paramsObj.cityDistId] = [
          this.searchForm.address[0],
          this.searchForm.address[1]
        ];
      } else if (this.searchForm.address.length == 3) {
        [paramsObj.provDistId, paramsObj.cityDistId, paramsObj.countyDistId] = [
          this.searchForm.address[0],
          this.searchForm.address[1],
          this.searchForm.address[2]
        ];
      }
      // 行业
      if (this.searchForm.trade.length == 1) {
        paramsObj.tradePid = this.searchForm.trade[0];
      } else if (this.searchForm.trade.length == 2) {
        [paramsObj.tradePid, paramsObj.tradeSid] = [
          this.searchForm.trade[0],
          this.searchForm.trade[1]
        ];
      } else if (this.searchForm.trade.length == 3) {
        [paramsObj.tradePid, paramsObj.tradeSid, paramsObj.tradeGid] = [
          this.searchForm.trade[0],
          this.searchForm.trade[1],
          this.searchForm.trade[2]
        ];
      }
      // 状态
      if (this.searchForm.status) {
        paramsObj.realStatus = this.searchForm.status;
      }
      this.loading = true;
      getSiteTablebySiteId(paramsObj)
        .then(res => {
          this.siteListTotalPage = res.data.pages;
          if (res.code == 0) {
            // 点击查询，先置空，然后push进去
            ifReset && (this.siteList = []);
            res.data.records.map(item => {
              this.siteList.push(item);
            });
            this.unitTotalUnm = res.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.msg
          });
        });
    },
    selectionChangeHandle(val) {
      // 站点选中事件
      this.checkedSiteList = val;
    },
    querySite() {
      this.loadHold = true;
      this.searchTableData();
    },
    showWebDialog() {
      // 显示选择站点弹窗
      this.ifshowWebDialog = true;
    },
    closeWebDialog(selectObj) {
      this.ifshowWebDialog = false;
      this.selectedSiteList = selectObj.selectedSiteData;
      this.relationSaveDtos = selectObj.relationSaveDtos;
      this.siteList = [];
      this.siteListTotalPage = 0;
      this.siteListPage.current = 1;
      if (this.selectedSiteList.length > 0) {
        // 有数据 请求
        this.searchTableData();
      } else {
        // 无数据 清空表格
        this.siteList = [];
      }
    },
    submitForm() {
      if (this.ifEdited) {
        // 修改
        let paramsObj = {
          id: this.editedTaskData.id,
          taskName: this.ruleForm.orderTaskSaveDtos[0].taskName,
          deliveryUsername: this.ruleForm.deliveryUsername
        };
        updateTask(paramsObj)
          .then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              });
              this.$emit('closeDialog');
            }
          })
          .catch(err => {});
      } else {
        // 新增
        // addTask
        let that = this;
        if (this.checkedSiteList.length == 0) {
          this.$message({
            message: '请选择扫描站点',
            type: 'warning'
          });
        } else {
          let paramsObj = {
            orderTaskSaveDtos: [], // 任务
            relationSaveDtos: this.relationSaveDtos, // 关联表对象集合
            taskIssue: {}, // 扫描配置
            detailDtos: [] // 扫描站点
          };
          // 填报单位的关联对象
          if (this.info.custCode.length == 10) {
            paramsObj.relationSaveDtos = [
              {
                custCode: this.info.custCode, // 上一级的custcode
                custId: this.info.custId, // 上一级的custid
                custType: '1',
                taskCustCode: this.info.custCode // 同custCode
              }
            ];
          } else {
            paramsObj.relationSaveDtos = this.relationSaveDtos;
          }

          // 任务列表
          this.ruleForm.orderTaskSaveDtos.map(item => {
            let taskObj = {
              taskName: item.taskName,
              orderId: this.info.id,
              orderCode: this.info.orderCode,
              prodId: '2',
              startTime: item.rangeDate[0],
              endTime: item.rangeDate[1],
              deliveryTime: item.deliveryTime,
              deliveryUsername: that.ruleForm.deliveryUsername,
              prodCode: 'WZJC'
            };
            paramsObj.orderTaskSaveDtos.push(taskObj);
          });
          // 扫描站点
          this.checkedSiteList.map(item => {
            paramsObj.detailDtos.push({
              siteId: item.id,
              custId: item.custId
            });
          });
          // 扫描配置
          if (this.ifDefault == 0) {
            // 默认
            paramsObj.taskIssue = {
              bizType: this.info.serviceType,
              issueType: this.ruleForm.monitorContent.join(','),
              configType: '0',
              scanExtent: '0',
              scanTimes: 500
            };
          } else {
            // 自定义
            paramsObj.taskIssue = {
              bizType: this.info.serviceType,
              issueType: this.ruleForm.monitorContent.join(','),
              configType: '1',
              linkNum: that.ruleForm.linkNum,
              scanExtent: '0',
              scanTimes: that.ruleForm.scanTimes,
              urlNum: that.ruleForm.urlNum
            };
          }
          paramsObj.taskIssue.orderStartTime = this.dateRanges[0].slice(0, 11);
          paramsObj.taskIssue.orderEndTime = this.dateRanges[1].slice(0, 11);

          addTask(paramsObj)
            .then(res => {
              console.log(res);
              if (res.code == 0) {
                // 成功
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });
                this.$emit('closeDialog');
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.msg
              });
            });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep {
  .el-step__head.is-success {
    color: var(--primary);
    border-color: var(--primary);
  }
  .el-step__title.is-success {
    color: $mainBlack65;
  }
}
.edit-dialog {
  ::v-deep.el-dialog {
    width: 958px;
    .el-dialog__body {
      position: relative;
      max-height: 80vh;
      overflow: hidden;
      overflow-y: auto;
      padding: 16px 30px 0;
    }
  }
  .one-step {
    // padding: 17px 0 0;
    .el-form {
      padding: 0 0 20px;
      .el-row {
        padding: 0 30px;
      }
    }
    .tip-alert-report {
      margin-bottom: 20px;
    }
    .add-part-icon {
      padding: 5px;
      border-radius: 4px;
      background: var(--primary);
      color: #fff;
      font-size: 10px;
      cursor: pointer;
      &.del-part-icon {
        background: transparent;
        color: $mainBlack45;
        font-size: 20px;
        padding: 0;
      }
    }
    .monitor-content-group {
      label {
        margin-left: 0;
        margin-right: 10px;
      }
      .is-disabled.el-checkbox {
        background: #f9f9f9;
      }
    }
  }
  .report-title {
    margin-top: 4px;
  }
  div[slot='footer'] {
    padding-bottom: 16px;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 90;
  }
  .footer-btn {
    text-align: right;
    border-top: 1px solid rgba(232, 232, 232, 1);
    padding-top: 16px;
    .unitTotalNum {
      float: left;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #333;
    }
  }
  .sub-btn {
    text-align: right;
  }
  ::v-deep {
    .el-steps {
      padding: 10px 20% 26px;
    }
    .two-step .avue-crud__tip {
      display: none !important;
    }
  }
  .table {
    margin: 8px 0 15px;
  }
  .two-step {
    padding: 17px 0 0;
    .company-btns {
      margin-bottom: 30px;
    }
  }
  .select-website {
    & > div {
      margin-bottom: 8px;
      .label {
        width: 115px;
        text-align: right;
      }
    }
    .select-website-button {
      width: 60px;
      height: 32px;
      line-height: 32px;
      padding: 0;
    }
    .no-pay-vip {
      position: relative;
      margin-left: 8px;
      // top: 4px;
      display: inline-block;
      width: 173px;
      height: 32px;
      border: 1px solid #d9d9d9;
      background-color: #fff;
    }
    .vip-icon {
      position: absolute;
      right: 0;
      top: -1px;
      color: #fd8f14;
      font-size: 14px;
    }
  }
}
@media (max-width: 992.98px) {
  .edit-dialog {
    .one-step {
      padding: 0;
    }
    .two-step {
      padding: 0 10px 0;
    }
    .sub-btn2 {
      padding-right: 0;
    }
  }
}
</style>

<style lang="scss"></style>
