<template>
  <el-dialog
    :title="dialogTitle"
    class="edit-dialog"
    :visible.sync="isOpen"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-steps
      class="xs-hide"
      :active="stepIndex"
      finish-status="success"
      simple
    >
      <el-step title="填写任务信息">
        <template slot="icon">
          <i class="icon-text">1</i>
        </template>
      </el-step>
      <el-step title="选择新媒体账号">
        <template slot="icon">
          <i class="icon-text">2</i>
        </template>
      </el-step>
    </el-steps>
    <div class="one-step" v-show="stepIndex === 0">
      <el-form
        ref="oneForm"
        :model="oneForm"
        :rules="rules"
        label-width="130px"
      >
        <h2 class="kp-dialog-title">基础信息</h2>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="任务名称：" prop="taskName">
              <el-input
                v-model="oneForm.taskName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="指定交付人员：" prop="deliveryUsername">
              <el-select v-model="oneForm.deliveryUsername" placeholder="">
                <el-option
                  v-for="item in delivererList"
                  :key="item.userId"
                  :label="item.accountName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item prop="rangeDate" class="question-container">
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
                    ></i>
                  </el-tooltip>
                  ：
                </div>
              </div>
              <el-date-picker
                class="kp-date-picker"
                v-model="oneForm.rangeDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="要求交付日期：" prop="deliveryTime">
              <el-date-picker
                class="kp-date-picker"
                v-model="oneForm.deliveryTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerDeliveryOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="24">
            <el-form-item label="备注：" prop="remark">
              <el-input
                type="textarea"
                v-model="oneForm.remark"
                placeholder="请输入"
                maxlength="50"
                show-word-limit
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h2 class="kp-dialog-title report-title" v-if="isAutoReport">
          自动生成报告规则
        </h2>
        <TipAlert
          v-if="isAutoReport"
          :content="tipContent"
          class="tip-alert-report"
        />
        <el-row v-if="isAutoReport">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="生成报告方式：" prop="reportMode">
              <el-select v-model="oneForm.reportMode" placeholder="请选择">
                <el-option
                  v-for="item in filterDict(dicList.report_mode)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="报告内容：" prop="reportCont">
              <el-select v-model="oneForm.reportCont" placeholder="请选择">
                <el-option
                  v-for="item in dicList.report_cont"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <div class="footer-btn">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            :disabled="oneDisabled"
            @click="submitForm('oneForm')"
            >下一步</el-button
          >
        </div>
      </div>
    </div>
    <div class="two-step" v-show="stepIndex === 1">
      <div class="company-btns" v-if="info.custType === '0'">
        <!-- <selectCompany :code="taskId" @type="getType" /> -->
        <selectCustomer
          ref="selectCustomer"
          :info="info"
          :taskId="taskId"
          :taskCode="taskCode"
          :isEdit="isEdit"
          @query="queryData"
        />
      </div>
      <el-form
        ref="twoForm"
        :model="twoForm"
        label-width="80px"
        class="no-rules-form2"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="账号信息" prop="accountName">
              <el-input
                v-model="twoForm.accountName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="账号类型：" prop="accountTypeList">
              <el-select
                class="kp-select-multiple"
                multiple
                clearable
                v-model="twoForm.accountTypeList"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in filterDictType(dicList.account_type)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="账号状态" prop="accountStatus">
              <el-select v-model="twoForm.accountStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicList.account_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="16">
            <el-form-item label="管理状态" prop="manageState">
              <el-select v-model="twoForm.manageState" placeholder="请选择">
                <el-option
                  v-for="item in dicList.manage_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <div class="sub-btn sub-btn2">
              <el-button type="primary" @click="queryData">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <ex-table
        ref="crud"
        :data="data"
        :option="option"
        :loading="loading"
        @selection-change="selectionChangeHandle"
      >
        <template slot="index" slot-scope="scope">
          <span>{{ scope.row.rowIndex + 1 }}</span>
        </template>
      </ex-table>
      <!-- <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        class="table-no-menu table"
        :table-loading="loading"
        @selection-change="selectionChangeHandle"
      ></avue-crud> -->
      <div slot="footer">
        <div class="footer-btn">
          <el-button @click="backStep">上一步</el-button>
          <el-button type="primary" @click="submitForm('twoForm')"
            >提交</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  postAddOrderTask,
  putOrderTask,
  postListByTaskAndCustom,
  postInsertMediaTaskDetail,
  putUpdateBatch,
  getOrderTaskDetailList
} from '@/api/new-media/order';
import { postInsertTaskCustomRelation } from '@/api/new-media/common';
import {
  postReport,
  getTaskReportByParms,
  updateByTaskId
} from '@/api/new-media/report';
import useGetDicList from '@/hook/useGetDicList';

import { getUserByDeptId } from '@/api/admin/organization';
import { mapGetters } from 'vuex';
import selectCustomer from '@/components/base/select-customer';
import TipAlert from '@/components/base/tip-alert/index';
import { dateFormat } from '@/util/date';
export default {
  name: 'edit-order-detail-diallog',
  components: {
    selectCustomer,
    TipAlert
  },
  data() {
    var rangeDateFun = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择任务数据范围'));
      } else {
        callback();
      }
    };
    return {
      oneDisabled: false,
      title: '添加',
      isEdit: false,
      loading: false,
      isAutoReport: false,
      stepIndex: 0,
      company: null,
      tipContent:
        '自动生成报告时间为要求交付日期；手动生成报告设置后自动生成报告自动取消',
      oneForm: {
        taskName: '',
        rangeDate: [],
        deliveryTime: '',
        deliveryUsername: '',
        remark: '',
        reportMode: '',
        reportCont: ''
      },
      // labelPosition: 'left',
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字', trigger: 'blur' }
        ],
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
        reportMode: [
          { required: true, message: '请选择生成方式', trigger: 'change' }
        ],
        reportCont: [
          { required: true, message: '请选择报告内容', trigger: 'change' }
        ]
      },
      delivererList: [
        // {
        //   label: '杨振亮',
        //   value: 2
        // }
      ],
      twoForm: {
        accountName: '',
        accountTypeList: [],
        accountStatus: '',
        manageState: ''
      },
      data: [
        // {
        //   type: '微信公众号',
        //   name: '北京交通',
        //   mark: 'MzA4OTE1Nzk3NA==',
        //   date: '2016/09/21 08:50:00',
        //   manage: '仅管理',
        //   account: '正常'
        // }
      ],
      option: {
        // index: true,
        // indexWidth: 56,
        page: false,
        align: 'center',
        menuAlign: 'center',
        menu: false,
        height: 350,
        selection: true,
        selectionWidth: 34,
        rowKey: 'id',
        // reserveSelection: false,
        column: [
          {
            label: '序号',
            prop: 'index',
            width: 56,
            slot: true
          },
          {
            label: '账号类型',
            prop: 'accountTypeName',
            width: 110,
            align: 'left',
            showOverflow: true
          },
          {
            label: '账号名称',
            prop: 'accountName',
            width: 220,
            align: 'left',
            showOverflow: true
          },
          {
            label: '唯一标识',
            prop: 'uniqueCode',
            width: 180,
            align: 'left',
            showOverflow: true
          },
          {
            label: '添加时间',
            prop: 'createdTime',
            width: 180
          },
          {
            label: '管理状态',
            prop: 'manageState',
            minWidth: 100
          },
          {
            label: '账号状态',
            prop: 'accountStatusName',
            minWidth: 100
          }
        ]
      },
      editCheckedList: [],
      checkedList: [],
      taskCode: '',
      taskId: '',
      hasUnits: false,
      custIdList: [],
      row: {}
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
            time.getTime() > new Date(_self.dateRanges[1]).getTime()
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
  mounted() {
    this.getUserList();
  },
  setup() {
    const { dicList } = useGetDicList(
      [
        'report_mode',
        'report_cont',
        'account_type',
        'account_status',
        'manage_status'
      ],
      false
    );
    return { dicList };
  },
  methods: {
    init(row) {
      if (this.validatenull(row)) {
        this.title = '添加';
        this.isEdit = false;
        this.isAutoReport = true;
        this.oneForm.rangeDate = [this.dateRanges[0], this.dateRanges[1]];
        return;
      }
      // 编辑 - 初始化赋值
      this.title = '编辑';
      this.isEdit = true;
      let {
        taskName,
        taskCode,
        id,
        startTime,
        endTime,
        deliveryTime,
        deliveryUsername,
        deliveryUsernameMeaning,
        remark
      } = row;
      this.row = row;
      this.taskCode = taskCode;
      this.taskId = id;
      const deliveryUser = deliveryUsernameMeaning
        ? parseInt(deliveryUsername)
        : '';
      this.oneForm = Object.assign({}, this.oneForm, {
        taskName,
        rangeDate: [startTime, endTime],
        deliveryTime,
        deliveryUsername: deliveryUser,
        remark
      });
      this.getTaskReportByParms();
      this.getCheckDetailList();
    },
    async queryData(isUnits) {
      // isTB：组织单位
      let _self = this;
      let params = {};
      let custIdList = [];
      this.loading = true;
      if (isUnits && isUnits.tree) {
        // console.log('isUnits', isUnits);
        let { wzIds = [], bsIds = [], keys = [] } = isUnits;
        // 重置表单
        this.$refs['twoForm'].resetFields();
        // 组织单位 + 填报单位ids -> custIdList | []
        keys = keys.map(ele => ele.custId);
        custIdList = [...wzIds, ...bsIds, ...keys];
        this.custIdList = custIdList;
      } else {
        custIdList = this.custIdList;
      }
      params = {
        custType: this.info.custType,
        taskId: this.taskId,
        custIdList,
        prodId: '4'
      };
      if (this.isEdit) {
        this.toggleSelection([]);
      }
      params = Object.assign({}, params, this.twoForm);
      let { data = [] } = await postListByTaskAndCustom(params);
      this.loading = false;
      this.data = data.filter(ele => ele.uniqueCode);
      if (this.isEdit) {
        this.$nextTick().then(() => {
          _self.toggleSelectionAll(_self.data);
        });
      }
    },
    async getTaskReportByParms() {
      let { data } = await getTaskReportByParms({
        taskId: this.taskId,
        orderId: this.info.id,
        reportType: 1
      });
      this.isAutoReport = !this.validatenull(data);
      if (!this.validatenull(data)) {
        this.oneForm.reportCont = data.reportCont || '';
        this.oneForm.reportMode = data.reportMode || '';
      }
    },
    async getCheckDetailList() {
      let { data = [] } = await getOrderTaskDetailList({
        Others: {
          current: 1,
          size: 1000
        },
        taskId: this.taskId,
        current: 1,
        size: 1000,
        sortField: 'created_time',
        sortFlag: false,
        status: 1
      });
      this.editCheckedList = data;
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (formName === 'oneForm') {
            this.oneDisabled = true;
            let isBool = await this.addOneStep();
            this.oneDisabled = false;
            if (!this.taskCode || !isBool) {
              return;
            }

            // 第二步------------------------
            this.stepIndex = 1;
            // 如果是填报单位 - 查询下列表
            if (this.info.custType !== '0') {
              this.queryData();
            }
            if (this.isEdit && this.info.custType === '0') {
              this.$refs.selectCustomer.getEditData();
            }
            return;
          }
          // 提交
          // 第二步 - 提交
          this.addTwoStep();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addOneStep() {
      if (!this.info.orderCode) return;
      let params = Object.assign(
        {
          orderCode: this.info.orderCode,
          prodCode: 'XMTJC', // 后续动态
          prodId: '4', // 后续动态
          startTime: this.oneForm.rangeDate[0],
          endTime: this.oneForm.rangeDate[1],
          orderId: this.info.id
        },
        this.oneForm
      );
      let bool = false;
      if (this.isEdit) {
        // 更新
        bool = await this.updateTask(params);
      } else {
        // 创建
        bool = await this.createdTask(params);
      }
      // 如果不是组织单位 - 创建的时候提交一下填报单位信息
      if (this.info.custType !== '0' && this.taskId) {
        let isInset = await this.postInsertTask();
        if (!isInset) return;
      }

      // bool = await this.postReport();
      return bool;
    },
    async changeReportTime() {
      let dataStart = this.oneForm.rangeDate[0].replace(/.*\s/, '');
      let dataEnd = this.oneForm.rangeDate[1].replace(/.*\s/, '');
      let time = dateFormat(new Date()).replace(/.*\s/, '');
      let { code } = await updateByTaskId({
        taskId: this.taskId,
        taskName: this.oneForm.taskName,
        dataStart: `${dataStart} ${time}`,
        dataEnd: `${dataEnd} ${time}`
      });
      if (code) {
        this.$message({
          type: 'error',
          message: '添加失败，请重试!'
        });
        return;
      }
      return true;
    },
    async postReport() {
      if (!this.taskId || !this.taskCode) return;
      const { orderCode, custCode, custId, id } = this.info;
      const { reportMode, reportCont } = this.oneForm;
      let dataStart = this.oneForm.rangeDate[0].replace(/\s.*/, '');
      let dataEnd = this.oneForm.rangeDate[1].replace(/\s.*/, '');
      let date = this.oneForm.deliveryTime.replace(/\s.*/, '');
      let time = dateFormat(new Date()).replace(/.*\s/, '');
      let { code } = await postReport({
        status: 0, // 0: 未删除，1删除
        reportStatus: 0,
        reportType: 1, // 0：人工；1：系统
        reportStyle: 'zip',
        resultTimes: 0,
        prodId: 4,
        taskId: this.taskId,
        taskName: this.oneForm.taskName,
        taskCode: this.taskCode,
        orderCode,
        custCode,
        custId,
        orderId: id,
        reportMode,
        reportCont,
        createdTime: `${date} ${time}`,
        dataStart: `${dataStart} ${time}`,
        dataEnd: `${dataEnd} ${time}`
      });
      if (code) {
        this.$message({
          type: 'error',
          message: '添加失败，请重试!'
        });
        return;
      }
      return true;
    },
    async postInsertTask() {
      let data = {
        prodId: '4',
        taskId: this.taskId,
        saveType: this.info.custType,
        taskCustCode: this.info.custCode,
        taskCustomRelationDtoList: [
          {
            custCode: this.info.custCode,
            custId: this.info.custId,
            custType: this.info.custType
          }
        ]
      };
      let { code } = await postInsertTaskCustomRelation(data);
      if (code) {
        this.$message({
          type: 'error',
          message: '填报单位保存失败，请重试!'
        });
        return;
      }
      return true;
    },
    async updateTask(datas) {
      datas.id = this.taskId;
      datas.taskCode = this.taskCode;
      datas.status = 1;
      let { code } = await putOrderTask(datas);
      if (code) {
        this.$message({
          type: 'error',
          message: '修改任务失败，请重试!'
        });
        return;
      }
      return true;
    },
    async createdTask(datas) {
      let { code, data } = await postAddOrderTask(datas);
      if (code) {
        this.$message({
          type: 'error',
          message: '创建任务失败，请重试!'
        });
        return;
      }
      this.taskCode = data.taskCode;
      this.taskId = data.id;
      return true;
    },
    async addTwoStep() {
      if (!this.checkedList.length) {
        this.$message({
          type: 'error',
          message: '请勾选账号！'
        });
        return;
      }
      let bool = false;
      if (this.isEdit) {
        // 更新
        bool = await this.updateTaskTwo();
      } else {
        // 创建
        bool = await this.createTaskTwo();
      }
      if (!bool) return;
      // 自动生成报告
      if (this.isAutoReport) {
        bool = await this.postReport();
      } else {
        // 如果已手动生成，修改任务时间范围
        bool = await this.changeReportTime();
      }
      if (!bool) return;
      this.$emit('update');
      this.closeDialog();
    },
    async createTaskTwo() {
      let list = this.checkedList.map(ele => {
        ele.accountCreatedTime = ele.createdTime;
        ele.updatedTime = '';
        ele.createdTime = '';
        ele.accountId = ele.id;
        return ele;
      });
      let { code, msg } = await postInsertMediaTaskDetail({
        orderCode: this.info.orderCode,
        taskId: this.taskId,
        taskCode: this.taskCode,
        taskStatus: 1,
        mediaTaskDetailSaveDtoList: list,
        status: 1,
        orderId: this.info.id,
        type: 1
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '添加任务列表失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '添加任务列表成功！'
      });
      return true;
    },
    async updateTaskTwo() {
      let list = this.checkedList.map(ele => {
        ele.accountCreatedTime = ele.createdTime;
        ele.updatedTime = '';
        ele.createdTime = '';
        ele.accountId = ele.id;
        return ele;
      });
      let { code, msg } = await putUpdateBatch({
        orderCode: this.info.orderCode,
        taskId: this.taskId,
        taskCode: this.taskCode,
        taskStatus: 1,
        mediaTaskDetailSaveDtoList: list,
        status: 1,
        orderId: this.info.id,
        type: 2
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '修改任务列表失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '修改任务列表成功！'
      });
      return true;
    },
    async getUserList() {
      const { data } = await getUserByDeptId({
        deptIds: this.depts
      });
      if (this.isEdit) {
        const hasUser = data.filter(
          ele => parseInt(ele.userId) === parseInt(this.row.deliveryUsername)
        );
        if (hasUser.length === 0 && this.row.deliveryUsernameMeaning) {
          data.push({
            userId: parseInt(this.row.deliveryUsername),
            accountName: this.row.deliveryUsernameMeaning
          });
        }
      }
      // console.log(data);
      this.delivererList = data;
    },
    filterDict(options = []) {
      let _self = this;
      let opt = options.filter(ele => {
        if (parseInt(_self.info.custType) === 0) {
          return ele;
        }
        return ele.value === '2';
      });
      return opt;
    },
    filterDictType(options = []) {
      return options.filter(ele => !['100'].includes(ele.value) && ele.value);
    },
    selectionChangeHandle(val) {
      // console.log('改变之后选中项:', val);
      // console.table(val);
      this.checkedList = val;
    },
    toggleSelectionAll(data) {
      // 是否有回显数据
      // let pre = this.checkedList;
      let list = this.editCheckedList.map(ele => ele.uniqueCode);
      let vals = data.filter(ele => {
        return list.includes(ele.uniqueCode);
      });
      // pre.filter(ele => ele.uniqueCode !== )
      // console.log('vals', vals);
      // this.checkedList = [...this.checkedList, ...vals];
      // this.checkedList = [...vals];
      this.toggleSelection(vals);
    },
    toggleSelection(val) {
      // 设置表格默认选中值
      // this.checkedList = [];
      this.$refs.crud.setCheckboxRow(val);
    },
    backStep() {
      this.stepIndex = 0;
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
    width: 930px;
    .el-dialog__body {
      max-height: 80vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .one-step {
    padding: 17px 0 0;
    .el-form {
      padding: 0 0 47px;
      .el-row {
        padding: 0 30px;
      }
    }
    .tip-alert-report {
      margin-bottom: 20px;
    }
  }
  .report-title {
    margin-top: 4px;
  }
  .footer-btn {
    text-align: right;
    border-top: 1px solid rgba(232, 232, 232, 1);
    padding-top: 16px;
  }
  .sub-btn {
    text-align: right;
  }
  ::v-deep {
    .el-steps {
      padding-top: 24px;
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
}
@media (max-width: 992.98px) {
  .edit-dialog {
    .one-step {
      padding: 0;
      .el-form {
        padding: 0 30px;
      }
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
