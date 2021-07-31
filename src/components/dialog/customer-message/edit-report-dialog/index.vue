<template>
  <el-drawer
    :title="title"
    :visible.sync="isLoad"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :wrapperClosable="false"
    :size="`740px`"
  >
    <div class="main">
      <el-form
        :key="isLoad"
        :model="form"
        :rules="rules"
        label-position="top"
        ref="refForm"
        label-width="120px"
      >
        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="产品类型：" prop="prodType">
              <el-select
                v-model="form.prodType"
                @change="onChangeProdType"
                placeholder="请选择"
                :disabled="isDel"
              >
                <el-option
                  v-for="item in prodList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="客户类型：" prop="customerType">
              <el-select
                v-model="form.customerType"
                placeholder="请选择"
                @change="onChangeCustomerType"
                :disabled="isDel"
              >
                <el-option label="组织单位" value="0"></el-option>
                <el-option label="填报单位" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item class="error-left" label="选择客户：" prop="custId">
              <!-- 组织单位 -->
              <select-organization-tree
                class="input-with-tree"
                v-if="form.customerType == 0"
                :valueKey="`id`"
                v-model="form.custId"
                check-strictly
                placeholder="请选择"
                :disabled="isDel"
                @change="onSelectCust"
              />
              <!-- 填报单位 -->
              <el-select
                v-else
                v-model="form.custName"
                filterable
                remote
                reserve-keyword
                :value-key="`custName`"
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                @change="onSelectCust"
                :disabled="isDel"
              >
                <el-option
                  v-for="(cust, index) in custmerList"
                  :label="cust.custName"
                  :value="cust"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <p class="title">客户消息接收人</p>
            <el-form-item class="flex radio" label="负责人：" prop="head">
              <el-checkbox-group v-model="form.head" :disabled="isDel">
                <el-checkbox
                  border
                  v-for="(man, index) in dutymanList"
                  :label="man.value"
                  :key="index"
                  >{{ man.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="flex radio" label="联系人：" prop="contact">
              <el-checkbox-group v-model="form.contact" :disabled="isDel">
                <el-checkbox
                  border
                  v-for="(man, index) in linkmanList"
                  :label="man.value"
                  :key="index"
                  >{{ man.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <div class="line"></div>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item class="error-left" label="策略名称：" prop="name">
              <el-input
                v-model="form.name"
                maxlength="30"
                placeholder="请输入"
                :disabled="isDel"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="24">
            <div class="flex">
              <p class="trigger">触发条件：</p>
              <div class="trigger-main">
                <div class="day" v-show="form.prodType == 4">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[4]"
                      :disabled="motionDisList[4] || isDel"
                    ></el-checkbox>
                    <span>日报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.dailyDate" :disabled="isDel">
                        <el-option label="每天" value="1"></el-option>
                        <el-option label="周一到周五" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.dailyTime"
                        :disabled="isDel"
                        :picker-options="{
                          start: '08:00',
                          step: '00:01',
                          end: '23:59'
                        }"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="day" v-show="form.prodType == 4">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[5]"
                      :disabled="motionDisList[5] || isDel"
                    ></el-checkbox>
                    <span>周报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.weeklyDate" :disabled="isDel">
                        <el-option
                          v-for="item in monitorListOptions.weekDays"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.weeklyTime"
                        :picker-options="
                          form.weeklyDate == '1'
                            ? monitorListOptions.MondayRange
                            : monitorListOptions.otherRange
                        "
                        :disabled="isDel"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="day" v-show="form.prodType == 4">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[6]"
                      :disabled="motionDisList[6] || isDel"
                    ></el-checkbox>
                    <span>月报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.monthlyDate" :disabled="isDel">
                        <el-option
                          v-for="item in monitorListOptions.monthDays"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.monthlyTime"
                        :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '23:00'
                        }"
                        :disabled="isDel"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="day" v-show="form.prodType == 2">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[1]"
                      :disabled="motionDisList[1] || isDel"
                    ></el-checkbox>
                    <span>日报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.dailyDate" :disabled="isDel">
                        <el-option label="每天" value="1"></el-option>
                        <el-option label="周一到周五" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.dailyTime"
                        :disabled="isDel"
                        :picker-options="{
                          start: '08:00',
                          step: '00:01',
                          end: '23:59'
                        }"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="day" v-show="form.prodType == 2">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[2]"
                      :disabled="motionDisList[2] || isDel"
                    ></el-checkbox>
                    <span>周报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.weeklyDate" :disabled="isDel">
                        <el-option
                          v-for="item in monitorListOptions.weekDays"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.weeklyTime"
                        :picker-options="
                          form.weeklyDate == '1'
                            ? monitorListOptions.MondayRange
                            : monitorListOptions.otherRange
                        "
                        :disabled="isDel"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="day" v-show="form.prodType == 2">
                  <div class="flex align-center">
                    <el-checkbox
                      v-model="motionList[3]"
                      :disabled="motionDisList[3] || isDel"
                    ></el-checkbox>
                    <span>月报</span>
                    <span class="context">统计昨日数据</span>
                  </div>
                  <div class="trigger-date">
                    <el-form-item class="flex" label="接收日期：" prop="date">
                      <el-select v-model="form.monthlyDate" :disabled="isDel">
                        <el-option
                          v-for="item in monitorListOptions.monthDays"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="flex" label="接收时间：" prop="time">
                      <el-time-select
                        v-model="form.monthlyTime"
                        :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '23:00'
                        }"
                        :disabled="isDel"
                      >
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="line"></div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item class="flex radio" label="消息发送渠道：" prop="fun">
              <el-checkbox
                border
                true-label="1"
                false-label="2"
                v-model="form.emailReceive"
                :disabled="isDel"
                >邮箱</el-checkbox
              >
              <el-checkbox
                border
                true-label="1"
                false-label="2"
                v-model="form.telReceive"
                :disabled="isDel"
                >短信</el-checkbox
              >
              <el-checkbox
                border
                true-label="1"
                false-label="2"
                v-model="form.wxReceive"
                :disabled="isDel"
                >微信</el-checkbox
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer-btn" v-show="!isDel">
      <el-button @click="onCloseDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
    <CheckUnitDialog
      ref="CheckUnitDialog"
      v-if="isCheckUnitDialog"
      :isOpen="isCheckUnitDialog"
      :title="`选择单位`"
      @closeDialog="isCheckUnitDialog = false"
    />
  </el-drawer>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted,
  computed
} from '@vue/composition-api';
import CheckUnitDialog from '../check-unit-dialog';
import { Message } from 'element-ui';
import useGetDicList from '@/hook/useGetDicList';
import { computedStrLen } from '@/util/util';
import SelectOrganizationTree from '@/components/base/select-organization-tree';
import {
  listByCustInfo,
  getContactInfoList,
  getMonitorOption,
  createStrategy,
  getStrategyDetail,
  updateStrategy
} from '@/api/cust-message';
export default {
  name: 'edit-policy',
  components: {
    CheckUnitDialog,
    SelectOrganizationTree
  },
  props: {
    isOpen: Boolean,
    strategyData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const refForm = ref(null);
    let validateName = (rule, value, callback) => {
      let len = computedStrLen(value);
      if (value === '') {
        callback(new Error('策略名称不能为空'));
      } else if (len > 60) {
        callback(new Error('最长60个字符(一个汉字等于2个字符)'));
      } else {
        callback();
      }
    };
    const state = reactive({
      title: '产品预警策略',
      isEdit: false,
      isDel: false,
      isLoad: false,
      isCheckUnitDialog: false,
      form: {
        id: '',
        prodType: '2',
        customerType: '0',
        custCode: '',
        custId: '',
        custName: '',
        contact: [], // 联系人
        head: [], // 负责人
        name: '网站系统报告策略',
        dailyDate: '1',
        dailyTime: '09:00',
        weeklyDate: '1',
        weeklyTime: '09:00',
        monthlyDate: '3',
        monthlyTime: '09:00',
        wxReceive: '2',
        emailReceive: '1',
        telReceive: '1'
      },
      detailId: '',
      rules: {
        custId: [{ required: true, message: '请选择客户', trigger: 'change' }],
        name: { validator: validateName, required: true, trigger: 'blur' }
      },
      // 填报单位待选列表
      custmerList: [],
      linkmanList: [], // 联系人列表
      dutymanList: [], //责任人列表
      // 策略选中
      motionList: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false
      },
      // 策略禁用
      motionDisList: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false
      },
      // 触发条件中的option
      monitorListOptions: {
        weekDays: [
          { label: '周一', value: '1' },
          { label: '周二', value: '2' },
          { label: '周三', value: '3' },
          { label: '周四', value: '4' },
          { label: '周五', value: '5' },
          { label: '周六', value: '6' },
          { label: '周日', value: '7' }
        ],
        monthDays: [
          { label: '3日', value: '3' },
          { label: '4日', value: '4' },
          { label: '5日', value: '5' },
          { label: '6日', value: '6' },
          { label: '7日', value: '7' },
          { label: '8日', value: '8' },
          { label: '9日', value: '9' },
          { label: '10日', value: '10' },
          { label: '11日', value: '11' },
          { label: '12日', value: '12' },
          { label: '13日', value: '13' },
          { label: '14日', value: '14' },
          { label: '15日', value: '15' }
        ],
        MondayRange: { start: '09:00', step: '00:01', end: '23:00' },
        otherRange: { start: '00:00', step: '00:01', end: '23:00' }
      }
    });
    // 属性
    onMounted(() => {
      // 防止 - 初次提交refs 为null  dsffd
      state.isLoad = false;
      nextTick(() => {
        state.isLoad = true;
      });
    });
    // 获取字典
    const { dicList } = useGetDicList(['prod_id']);
    // 筛选产品类型
    const prodList = computed(() => {
      if (!dicList.value || !dicList.value.prod_id) {
        return [];
      }
      return dicList.value.prod_id.filter(item => {
        return item.value == '4' || item.value == '2';
      });
    });

    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          console.log(state.form);
          let ifCheck = false;
          for (let i in state.motionList) {
            if (state.motionList[i]) {
              ifCheck = true;
              break;
            }
          }
          if (!ifCheck) {
            Message({
              type: 'warning',
              message: '请至少选择一个触发条件'
            });
            return false;
          }

          // 设计参数对象
          let paramsObj = {
            strategyName: state.form.name,
            custId: state.form.custId,
            custCode: state.form.custCode,
            custName: state.form.custName,
            custLevel: state.form.customerType,
            prodId: state.form.prodType,
            strategyType: '2',
            fillType: '1',
            wxReceive: state.form.wxReceive,
            emailReceive: state.form.emailReceive,
            telReceive: state.form.telReceive,
            dailyDate: state.form.dailyDate,
            dailyTime: state.form.dailyTime,
            weeklyDate: state.form.weeklyDate,
            weeklyTime: state.form.weeklyTime,
            monthlyDate: state.form.monthlyDate,
            monthlyTime: state.form.monthlyTime,
            monitorList: [] // 监测项集合
          };
          // 监测项集合
          for (let id in state.motionList) {
            if (state.form.prodType == '2') {
              // 网站
              id < 4 &&
                state.monitorList[id] &&
                !state.unitMotionOption[id] &&
                paramsObj.monitorList.push(id);
            } else {
              // 新媒体
              id >= 4 &&
                state.monitorList[id] &&
                !state.unitMotionOption[id] &&
                paramsObj.monitorList.push(id);
            }
          }
          // 接收人集合 recipientList
          if (state.form.contact.length > 0 || state.form.head.length > 0) {
            let recipientArr = [];
            state.form.contact.map(item => {
              for (let i = 0; i < state.linkmanList.length; i++) {
                if (item == state.linkmanList[i].value) {
                  recipientArr.push(
                    item + '-' + state.linkmanList[i].linkmanPost
                  );
                }
              }
            });
            state.form.contact.map(item => {
              for (let i = 0; i < state.dutymanList.length; i++) {
                if (item == state.dutymanList[i].value) {
                  recipientArr.push(
                    item + '-' + state.dutymanList[i].linkmanPost
                  );
                }
              }
            });
            paramsObj.recipientList = recipientArr;
          }
          if (state.isEdit) {
            // 编辑
            paramsObj.id = state.form.id;
            paramsObj.detailId = state.detailId;
            updateStrategy(paramsObj).then(res => {
              if (res.code == 0) {
                // 成功
                Message({
                  type: 'success',
                  message: res.msg || '操作成功！'
                });
                onCloseDialogR();
              } else {
                Message({
                  type: 'error',
                  message: res.msg || '操作失败'
                });
                return false;
              }
            });
          } else {
            createStrategy(paramsObj).then(res => {
              if (res.code == 0) {
                // 成功
                Message({
                  type: 'success',
                  message: res.msg || '操作成功！'
                });
                onCloseDialogR();
              } else {
                Message({
                  type: 'error',
                  message: res.msg || '操作失败'
                });
                return false;
              }
            });
          }
        } else {
          console.log('err');
        }
      });
    };
    const resetData = () => {
      state.isEdit = false;
      state.isDel = false;
      state.isLoad = false;
      state.isCheckUnitDialog = false;
      state.form = {
        id: '',
        prodType: '2',
        customerType: '0',
        custCode: '',
        custId: '',
        custName: '',
        contact: [], // 联系人
        head: [], // 负责人
        name: '网站系统报告策略',
        dailyDate: '1',
        dailyTime: '09:00',
        weeklyDate: '1',
        weeklyTime: '09:00',
        monthlyDate: '3',
        monthlyTime: '09:00',
        wxReceive: '2',
        emailReceive: '1',
        telReceive: '1'
      };
      state.detailId = '';
      state.custmerList = [];
      state.linkmanList = [];
      state.dutymanList = [];
      for (let i in state.motionList) {
        state.motionList[i] = false;
      }
      for (let i in state.motionDisList) {
        state.motionDisList[i] = false;
      }
    };
    const onCloseDialogR = () => {
      resetData();
      emit('closeDialog');
    };
    const onCloseDialog = () => {
      emit('closeDialog');
      resetData();
    };

    const onInit = () => {
      if (!props.strategyData.id) {
        state.title = '添加系统报告策略';
        return;
      }
      state.isEdit = true;
      if (props.strategyData.isDel == -1) {
        state.isDel = true;
        state.title = '查看系统报告策略';
      } else {
        state.title = '编辑系统报告策略';
      }
      getStrategyDetail({ id: props.strategyData.id }).then(res => {
        if (res.code == 0) {
          // 回显数据
          let strategyData = res.data;
          console.log(strategyData);
          state.detailId = strategyData.detailId;
          state.form.id = strategyData.id;
          state.form.name = strategyData.strategyName;
          state.form.prodType = strategyData.prodId.toString();
          state.form.customerType = strategyData.custLevel;
          if (strategyData.custLevel == 0) {
            //  0 组织单位
            onSelectCust({
              id: strategyData.custId,
              custName: strategyData.custName,
              custCode: strategyData.custCode
            });
          } else {
            // 1 填报单位
            onSelectCust({
              custId: strategyData.custId,
              custName: strategyData.custName,
              custCode: strategyData.custCode
            });
          }
          state.form.strategyType = strategyData.strategyType;
          state.form.wxReceive = strategyData.wxReceive;
          state.form.emailReceive = strategyData.emailReceive;
          state.form.telReceive = strategyData.telReceive;
          // 策略项
          strategyData.monitorList.map(item => {
            state.motionList[item] = true;
          });
          // 选择器里的数字
          strategyData.dailyDate &&
            (state.form.dailyDate = strategyData.dailyDate);
          strategyData.dailyTime &&
            (state.form.dailyTime = strategyData.dailyTime);
          strategyData.weeklyDate &&
            (state.form.weeklyDate = strategyData.weeklyDate);
          strategyData.weeklyTime &&
            (state.form.weeklyTime = strategyData.weeklyTime);
          strategyData.monthlyDate &&
            (state.form.monthlyDate = strategyData.monthlyDate);
          strategyData.monthlyTime &&
            (state.form.monthlyTime = strategyData.monthlyTime);
          // 查询目前客户可以使用的产品策略监测项
          // getMonitorOption({
          //   neId: state.form.id,
          //   custId: state.form.custId,
          //   strategyType: 1,
          //   prodId: state.form.prodType
          // }).then(res => {
          //   if (res.code == 0) {
          //     res.data.map(item => {
          //       for (let i in state.motionDisList) {
          //         i == item.id && (state.motionDisList[i] = !item.check);
          //       }
          //     });
          //   }
          // });
          // 客户消息接收人
          if (
            strategyData.recipientList &&
            strategyData.recipientList.length > 0
          ) {
            strategyData.recipientList.map(item => {
              if (item.linkmanPost == 1) {
                state.form.contact.push(item.id);
              } else {
                state.form.head.push(item.id);
              }
            });
          }
        }
      });
    };

    const onShowCheckUnit = () => {
      state.isCheckUnitDialog = true;
    };
    const onChangeProdType = val => {
      /*
       *  2 网站监测
       *  4 新媒体监测
       */
      onChangeCustomerType();
      if (val == 2) {
        state.form.name = '网站系统报告策略';
      } else {
        state.form.name = '新媒体系统报告策略';
      }
    };
    // 更改客户类型触发事件
    const onChangeCustomerType = val => {
      /*
       *  0 组织单位 树状结构
       *  1 填报单位 查询
       */
      // 清空选中的客户 负责人 联系人
      state.form.custCode = '';
      state.form.custId = '';
      state.form.custName = '';
      state.form.contact = [];
      state.form.head = [];
      // 清空填报单位选择列表
      state.custmerList = [];
      state.linkmanList = [];
      state.dutymanList = [];
      // 放开所有策略项的禁用
      for (let i in state.motionDisList) {
        state.motionDisList[i] = false;
      }
      for (let i in state.motionList) {
        state.motionList[i] = false;
      }
    };
    const onSelectCust = val => {
      if (val) {
        // 查询客户下的联系人和负责人
        getContactInfoList({
          custId: state.form.customerType == '0' ? val.id : val.custId
        }).then(res => {
          if (res.code == 0) {
            if (res.data && res.data.length > 0) {
              res.data.map(item => {
                if (item.linkmanPost == 1) {
                  state.linkmanList.push({
                    label: item.linkmanName,
                    value: item.id,
                    linkmanPost: item.linkmanPost
                  });
                } else {
                  state.dutymanList.push({
                    label: item.linkmanName,
                    value: item.id,
                    linkmanPost: item.linkmanPost
                  });
                }
              });
            } else {
              state.linkmanList = [];
              state.dutymanList = [];
            }
          }
        });

        // 查询目前客户可以使用的产品策略监测项
        let paraObj = {
          custId: val.custId || val.id,
          strategyType: 2,
          prodId: state.form.prodType
        };
        state.form.id && (paraObj.neId = state.form.id);
        getMonitorOption(paraObj).then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              for (let i in state.motionDisList) {
                i == item.id && (state.motionDisList[i] = !item.check);
              }
            });
          }
        });

        state.form.custId = val.id || val.custId;
        state.form.custName = val.custName;
        state.form.custCode = val.custCode;
      }
    };
    // 查询填报单位
    const remoteMethod = query => {
      listByCustInfo({ custInfo: query }).then(res => {
        console.log(res);
        if (res.code == 0) {
          if (res.data && res.data.length > 0) {
            state.custmerList = res.data;
          }
        }
      });
    };

    return {
      dicList,
      prodList,
      refForm,
      ...toRefs(state),
      onCloseDialogR,
      onCloseDialog,
      onSubmit,
      onInit,
      onShowCheckUnit,
      onChangeProdType,
      onChangeCustomerType,
      onSelectCust,
      remoteMethod,
      resetData
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.main {
  ::v-deep {
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #fff;
      color: var(--primary);
    }
    .el-date-editor.el-input {
      width: 192px;
    }
    .el-date-editor.el-input--small {
      .el-input__inner {
        background: transparent;
        padding-right: 0;
      }
      .el-input__prefix {
        display: none;
      }
    }
  }
  .line {
    margin: 40px 0 8px;
    border-bottom: 1px solid #e5e5e5;
  }
  .block {
    height: 16px;
  }
  .title {
    margin-bottom: 10px;
  }
  .radio ::v-deep {
    .el-form-item__content {
      flex: 1;
      .el-radio {
        margin-bottom: 8px;
      }
      .el-radio.is-bordered {
        margin-left: 0;
        margin-right: 8px;
      }
    }
  }
  .trigger {
    margin-bottom: 8px;
  }
  .check-select {
    margin: 0 0 14px 24px;
  }
  .kp-min-select {
    margin: 0 8px;
  }
  .m-bottom {
    margin-bottom: 8px;
  }
  .trigger-main {
    .day {
      margin-bottom: 40px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .context {
      margin-left: 16px;
      color: rgba(0, 0, 0, 0.45);
    }
    .trigger-date {
      margin: 8px 0 0 22px;
      background: #f0f4f5;
      padding: 16px 16px 1px;
      border-radius: 4px;
    }
  }
  .unit-list {
    ::v-deep {
      .el-form-item__label {
        width: 78px;
        text-align: right;
      }
    }
    .icon {
      font-size: 14px;
      margin-right: 4px;
    }
    .check-length {
      background: #fff;
      border: 1px solid #dcdfe6;
      margin-left: 8px;
    }
  }
}
</style>
