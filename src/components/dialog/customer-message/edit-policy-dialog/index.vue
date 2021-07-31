<template>
  <el-drawer
    :title="title"
    :visible="isLoad"
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
                :disabled="isDel"
                @change="onChangeCustomerType"
              >
                <el-option label="组织单位" value="0"></el-option>
                <el-option label="填报单位" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item class="error-left" label="选择客户：" prop="custCode">
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
          <el-col :xs="24" :sm="24" :md="24" v-show="ifDetailShow">
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
        <!-- 组织 -->
        <el-row :gutter="16" v-show="ifDetailShow && form.customerType == '0'">
          <el-col :xs="24" :sm="24" :md="24">
            <div class="block"></div>
            <el-form-item class="flex radio" label="发生单位：" prop="unit">
              <el-radio-group v-model="form.unit">
                <el-radio-button
                  label="0"
                  :disabled="ifAllUnitDisabled || isDel"
                  >全部单位</el-radio-button
                >
                <el-radio-button label="1" :disabled="ifAllCusDisabled || isDel"
                  >自定义单位</el-radio-button
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.unit == '1'">
            <el-form-item class="flex unit-list" label="单位：" prop="unitList">
              <div class="flex">
                <el-button plain @click="onShowCheckUnit"
                  ><i class="iconfont icontubiaozhizuomoban40 icon"></i
                  >选择</el-button
                >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="所选择组织单位下填报单位"
                  placement="top"
                >
                  <span class="kp-disabled check-length"
                    >已选{{ selectedFullUnitList.length }}项</span
                  >
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              class="flex radio"
              label="单位消息接收人："
              prop="unitHead"
            >
              <el-checkbox-group v-model="form.unitHead" :disabled="isDel">
                <el-checkbox label="2">负责人</el-checkbox>
                <el-checkbox label="1">联系人</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              class="flex radio"
              label="网站消息接收人："
              prop="webHead"
            >
              <el-checkbox-group v-model="form.webHead" :disabled="isDel">
                <el-checkbox label="2">负责人</el-checkbox>
                <el-checkbox label="1">联系人</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="line"></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" v-show="ifDetailShow">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item class="error-left" label="策略名称：" prop="name">
              <el-input
                v-model="form.name"
                maxlength="60"
                placeholder="请输入"
                :disabled="isDel"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="trigger" v-show="ifDetailShow">触发条件：</p>
        <el-row :gutter="16" v-show="ifDetailShow">
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[7]"
                :disabled="unitMotionOption[7] || isDel"
              ></el-checkbox>
              首页确定不连通
            </div>
            <div class="flex align-center check-select">
              <span>异常连续出现</span>
              <el-select
                class="kp-min-select"
                v-model="form.confirmException"
                :disabled="isDel"
              >
                <el-option
                  v-for="item in monitorListOptions.oneToTen"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span>次进行预警；最多发出</span>
              <el-select
                class="kp-min-select"
                v-model="form.confirmWarning"
                :disabled="isDel"
              >
                <el-option
                  v-for="item in monitorListOptions.oneToFive"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span>次进行预警信息</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[8]"
                :disabled="unitMotionOption[8] || isDel"
              ></el-checkbox>
              首页疑似不连通
            </div>
            <div class="flex align-center check-select">
              <span>异常连续出现</span>
              <el-select
                class="kp-min-select"
                v-model="form.suspectedException"
                :disabled="isDel"
              >
                <el-option
                  v-for="item in monitorListOptions.oneToTen"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span>次进行预警；最多发出</span>
              <el-select
                class="kp-min-select"
                v-model="form.suspectedWarning"
                :disabled="isDel"
              >
                <el-option
                  v-for="item in monitorListOptions.oneToFive"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span>次进行预警信息</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[9]"
                :disabled="unitMotionOption[9] || isDel"
              ></el-checkbox>
              <div>
                <span>栏目更新不及时</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[10]"
                :disabled="unitMotionOption[10] || isDel"
              ></el-checkbox>
              <div>
                <span>首页确定不连通率达到</span>
                <el-select
                  class="kp-min-select"
                  v-model="form.confirmRate"
                  :disabled="isDel"
                >
                  <el-option
                    v-for="item in monitorListOptions.percentOneToFive"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span>进行预警</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[11]"
                :disabled="unitMotionOption[11] || isDel"
              ></el-checkbox>
              <div>
                <span>首页疑似不连通率达到</span>
                <el-select
                  class="kp-min-select"
                  v-model="form.suspectedRate"
                  :disabled="isDel"
                >
                  <el-option
                    v-for="item in monitorListOptions.percentOneToFive"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span>进行预警</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[12]"
                :disabled="unitMotionOption[12] || isDel"
              ></el-checkbox>
              <div>
                <span>首页超过</span>
                <el-select
                  class="kp-min-select"
                  v-model="form.noUpdateDay"
                  :disabled="isDel"
                >
                  <el-option
                    v-for="item in monitorListOptions.oneToFourteen"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span>天未更新</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[14]"
                :disabled="unitMotionOption[14] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">错敏信息</span>
                <span class="context"
                  >领导人姓名/职务/排序、涉及港/澳/台领土主权、政治敏感信息、法律法规、民族宗教等内容错别字、敏感词问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[15]"
                :disabled="unitMotionOption[15] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">信息泄密</span>
                <span class="context"
                  >涉密信息、军队番号、内部日常性不宜公开信息泄露问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[16]"
                :disabled="unitMotionOption[16] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">隐私泄露</span>
                <span class="context"
                  >公民个人隐私泄露、不宜被公开报道姓名的群体问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[17]"
                :disabled="unitMotionOption[17] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">篡改监测</span>
                <span class="context"
                  >内容被篡改，域名被劫持、含有色情图片等问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[18]"
                :disabled="unitMotionOption[18] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">外链暗链</span>
                <span class="context"
                  >商业广告外链、钓鱼网址、恶意网址、暗链等问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[19]"
                :disabled="unitMotionOption[19] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">负面信息</span>
                <span class="context"
                  >辱骂、造谣国家、政府及国家领导人等的负面信息。</span
                >
              </div>
            </div>
            <!-- <div class="line" v-if="form.prodType == '4'"></div> -->
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[20]"
                :disabled="unitMotionOption[20] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">关停域名/链接</span>
                <span class="context"
                  >被其他注册或恶意篡改成不良内容等问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '2'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[21]"
                :disabled="unitMotionOption[21] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">其他问题</span>
                <span class="context"
                  >其他可能存在潜在风险问题，如域名即将到期通知。</span
                >
              </div>
            </div>
            <div class="line"></div>
          </el-col>
          <!-- 新媒体部分的触发条件 -->
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex align-center m-bottom">
              <el-checkbox
                v-model="monitorList[22]"
                :disabled="unitMotionOption[22] || isDel"
              ></el-checkbox>
              <div>
                <span>新媒体账号超过</span>
                <el-select
                  class="kp-min-select"
                  v-model="form.noUpdateDay"
                  :disabled="isDel"
                >
                  <el-option
                    v-for="item in monitorListOptions.oneToFourteen"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span>天未更新</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[24]"
                :disabled="unitMotionOption[24] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">错敏信息</span>
                <span class="context"
                  >领导人姓名/职务/排序、涉及港/澳/台领土主权、政治敏感信息、法律法规、民族宗教等内容错别字、敏感词问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[25]"
                :disabled="unitMotionOption[25] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">信息泄密</span>
                <span class="context"
                  >涉密信息、军队番号、内部日常性不宜公开信息泄露问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[26]"
                :disabled="unitMotionOption[26] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">隐私泄露</span>
                <span class="context"
                  >公民个人隐私泄露、不宜被公开报道姓名的群体问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[27]"
                :disabled="unitMotionOption[27] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">外链暗链</span>
                <span class="context"
                  >商业广告外链、钓鱼网址、恶意网址、暗链等问题。</span
                >
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-show="form.prodType == '4'">
            <div class="flex algin-top m-bottom">
              <el-checkbox
                v-model="monitorList[28]"
                :disabled="unitMotionOption[28] || isDel"
              ></el-checkbox>
              <div class="flex info">
                <span class="name">负面信息</span>
                <span class="context"
                  >辱骂、造谣国家、政府及国家领导人等的负面信息。</span
                >
              </div>
            </div>
            <div class="line"></div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="接收日期：" prop="date">
              <el-select v-model="form.receiveDateType" :disabled="isDel">
                <el-option label="周一到周五" value="0"></el-option>
                <el-option label="每天" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item class="error-left" label="有效时间段：" prop="time">
              <el-time-picker
                is-range
                v-model="form.timeRange"
                range-separator="至"
                value-format="HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                :disabled="isDel"
              >
              </el-time-picker>
            </el-form-item>
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
      :custId="form.custId"
      :strategyId="form.id"
      :prodId="form.prodType == 2 ? 1 : 2"
      :units="selectedFullUnitList"
      @closeDialog="isCheckUnitDialog = false"
      @result="getCheckedUnits"
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
import { computedStrLen } from '@/util/util';
import useGetDicList from '@/hook/useGetDicList';
import SelectOrganizationTree from '@/components/base/select-organization-tree';
import {
  listByCustInfo,
  getContactInfoList,
  getMonitorOption,
  getFillType,
  createStrategy,
  getStrategyDetail,
  getFillUnitList,
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
      ifDetailShow: false,
      form: {
        id: '',
        prodType: '2',
        customerType: '0',
        custCode: '',
        custId: '',
        custName: '',
        unit: '0',
        name: '网站监测预警策略',
        unitHead: [], // 单位消息接收人
        webHead: [], // 网站消息接收人
        contact: [], // 联系人
        head: [], // 负责人
        confirmException: 1, // 确定不连通连续出现次数阀值
        confirmWarning: 1, // 确定不连通预警次数阀值
        confirmRate: '3', // 确定不连通率阀值
        suspectedException: 2, // 疑似不连通连续出现次数阀值
        suspectedWarning: 1, // 疑似不连通预警次数阀值
        suspectedRate: '3', // 疑似不连通率阀值
        noUpdateDay: 10, // 不更新天数
        receiveDateType: '1', // 接收消息类型 1:每天、2:周一到周五
        timeRange: ['00:00:00', '23:59:59'], // 有效时间段
        wxReceive: '2',
        emailReceive: '1',
        telReceive: '1'
      },
      detailId: '',
      rules: {
        custCode: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        name: { validator: validateName, required: true, trigger: 'blur' }
      },

      // 填报单位待选列表
      custmerList: [],
      linkmanList: [], // 联系人列表
      dutymanList: [], //责任人列表
      selectedFullUnitList: [], // 发生单位已选列表
      ifAllUnitDisabled: false, // 是否禁用全部单位按钮
      ifAllCusDisabled: false, // 是否禁用自定义单位按钮
      // 触发条件
      monitorList: {
        // 网站部分
        7: false, // 首页确定不连通
        8: false, // 首页疑似不连通
        9: false, // 栏目更新不及时
        10: false, // 首页确定不连通率
        11: false, // 首页疑似不连通率
        12: false, // 首页指定天数未更新
        // 13: false, // 空白栏目
        14: false, // 错敏信息
        15: false, // 信息泄密
        16: false, // 隐私泄露
        17: false, // 篡改监测
        18: false, // 外链暗链
        19: false, // 负面信息
        20: false, // 关停域名/链接
        21: false, // 其他问题
        // 新媒体部分
        22: false, // 新媒体账号超过指定天数未更新
        24: false, // 错敏信息
        25: false, // 信息泄密
        26: false, // 隐私泄露
        27: false, // 外链暗链
        28: false // 负面评论
      },
      // 填报单位策略监测项禁用情况
      unitMotionOption: {
        // 网站部分
        7: false, // 首页确定不连通
        8: false, // 首页疑似不连通
        9: false, // 栏目更新不及时
        10: false, // 首页确定不连通率
        11: false, // 首页疑似不连通率
        12: false, // 首页指定天数未更新
        14: false, // 错敏信息
        15: false, // 信息泄密
        16: false, // 隐私泄露
        17: false, // 篡改监测
        18: false, // 外链暗链
        19: false, // 负面信息
        20: false, // 关停域名/链接
        21: false, // 其他问题
        // 新媒体部分
        22: false, // 新媒体账号超过指定天数未更新
        24: false, // 错敏信息
        25: false, // 信息泄密
        26: false, // 隐私泄露
        27: false, // 外链暗链
        28: false // 负面评论
      },
      // 触发条件中的option
      monitorListOptions: {
        oneToTen: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 },
          { label: 7, value: 7 },
          { label: 8, value: 8 },
          { label: 9, value: 9 },
          { label: 10, value: 10 }
        ],
        oneToFive: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 }
        ],
        oneToFourteen: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 },
          { label: 7, value: 7 },
          { label: 8, value: 8 },
          { label: 9, value: 9 },
          { label: 10, value: 10 },
          { label: 11, value: 11 },
          { label: 12, value: 12 },
          { label: 13, value: 13 },
          { label: 14, value: 14 }
        ],
        percentOneToFive: [
          { label: '1%', value: '1' },
          { label: '2%', value: '2' },
          { label: '3%', value: '3' },
          { label: '4%', value: '4' },
          { label: '5%', value: '5' }
        ]
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
          let ifCheck = false;
          for (let i in state.monitorList) {
            if (state.monitorList[i]) {
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
          // 如果是组织单位 则至少选一个发生单位
          if (
            state.form.customerType == '0' &&
            state.form.unit == 1 &&
            state.selectedFullUnitList.length == 0
          ) {
            Message({
              type: 'warning',
              message: '请至少选择一个发生单位'
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
            strategyType: '1',
            wxReceive: state.form.wxReceive,
            emailReceive: state.form.emailReceive,
            telReceive: state.form.telReceive,
            receiveDateType: state.form.receiveDateType,
            startTime: state.form.timeRange[0],
            endTime: state.form.timeRange[1],
            confirmException: state.form.confirmException,
            confirmWarning: state.form.confirmWarning,
            suspectedException: state.form.suspectedException,
            suspectedWarning: state.form.suspectedWarning,
            confirmRate: state.form.confirmRate,
            suspectedRate: state.form.suspectedRate,
            noUpdateDay: state.form.noUpdateDay,
            monitorList: [] // 监测项集合
          };
          // 发生单位 1-自己单位 2-全部单位 3-部分单位
          if (state.form.customerType == 1) {
            paramsObj.fillType = '1';
          } else {
            if (state.form.unit == 0) {
              paramsObj.fillType = '2';
            } else {
              paramsObj.fillType = '3';
            }
          }
          // 填报单位消息接收者类型 和 网站/新媒体消息接收人
          if (state.form.unitHead.length > 0) {
            paramsObj.fillReceiver = state.form.unitHead.join(',');
          }
          if (state.form.webHead.length > 0) {
            paramsObj.accountReceiver = state.form.webHead.join(',');
          }
          // 监测项集合
          for (let id in state.monitorList) {
            // 判断是网站还是新媒体
            if (state.form.prodType == '2') {
              // 网站
              id < 22 &&
                state.monitorList[id] &&
                !state.unitMotionOption[id] &&
                paramsObj.monitorList.push(id);
            } else {
              // 新媒体
              id >= 22 &&
                state.monitorList[id] &&
                !state.unitMotionOption[id] &&
                paramsObj.monitorList.push(id);
            }
          }
          // 单位集合 custInfoList
          if (state.form.customerType == '0' && state.form.unit == 1) {
            let unitArr = [];
            state.selectedFullUnitList.map(item => {
              unitArr.push(item.custId + '-' + item.custCode);
            });
            paramsObj.custInfoList = unitArr;
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
            // 新增
            console.log(paramsObj);
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
      state.isCheckUnitDialog = false;
      state.isLoad = false;
      state.ifDetailShow = false;
      state.form = {
        id: '',
        prodType: '2',
        customerType: '0',
        custCode: '',
        custId: '',
        custName: '',
        unit: '0',
        name: '网站监测预警策略',
        unitHead: [], // 单位消息接收人
        webHead: [], // 网站消息接收人
        contact: [], // 联系人
        head: [], // 负责人
        confirmException: '1', // 确定不连通连续出现次数阀值
        confirmWarning: '1', // 确定不连通预警次数阀值
        confirmRate: '3', // 确定不连通率阀值
        suspectedException: '2', // 疑似不连通连续出现次数阀值
        suspectedWarning: '1', // 疑似不连通预警次数阀值
        suspectedRate: '3', // 疑似不连通率阀值
        noUpdateDay: '10', // 不更新天数
        receiveDateType: '1', // 接收消息类型 1:每天、2:周一到周五
        timeRange: ['00:00:00', '23:59:59'], // 有效时间段
        wxReceive: '2',
        emailReceive: '1',
        telReceive: '1'
      };
      state.detailId = '';
      state.custmerList = [];
      state.linkmanList = [];
      state.dutymanList = [];
      state.selectedFullUnitList = [];
      state.ifAllUnitDisabled = false;
      state.ifAllCusDisabled = false;
      for (let i in state.monitorList) {
        state.monitorList[i] = false;
      }
      for (let i in state.unitMotionOption) {
        state.unitMotionOption[i] = false;
      }
    };
    const onCloseDialogR = () => {
      emit('closeDialogR');
      resetData();
    };
    const onCloseDialog = () => {
      emit('closeDialog');
      resetData();
    };
    // 初始化
    const onInit = () => {
      if (!props.strategyData.id) {
        state.title = '添加产品预警策略';
        return;
      }
      state.isEdit = true;
      if (props.strategyData.isDel == -1) {
        state.isDel = true;
        state.title = '查看产品预警策略';
      } else {
        state.title = '编辑产品预警策略';
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
          if (strategyData.fillType == 2) {
            state.form.unit = '0';
          } else if (strategyData.fillType == 3) {
            state.form.unit = '1';
          }
          state.form.timeRange[0] = strategyData.startTime
            ? strategyData.startTime
            : '00:00:00';
          state.form.timeRange[0] = strategyData.endTime
            ? strategyData.endTime
            : '23:59:59';
          state.form.receiveDateType = strategyData.receiveDateType
            ? strategyData.receiveDateType
            : '1';
          // 策略项
          strategyData.monitorList.map(item => {
            state.monitorList[item] = true;
          });
          // 选择器里的数字
          strategyData.confirmException &&
            (state.form.confirmException = strategyData.confirmException);
          strategyData.confirmWarning &&
            (state.form.confirmWarning = strategyData.confirmWarning);
          strategyData.confirmRate &&
            (state.form.confirmRate = strategyData.confirmRate);
          strategyData.suspectedException &&
            (state.form.suspectedException = strategyData.suspectedException);
          strategyData.suspectedWarning &&
            (state.form.suspectedWarning = strategyData.suspectedWarning);
          strategyData.suspectedRate &&
            (state.form.suspectedRate = strategyData.suspectedRate);
          strategyData.noUpdateDay &&
            (state.form.noUpdateDay = strategyData.noUpdateDay);
          // 单位消息接收人 和 网站/新媒体消息接收人
          if (strategyData.accountReceiver) {
            state.form.webHead = strategyData.accountReceiver.split(',');
          }
          if (strategyData.fillReceiver) {
            state.form.unitHead = strategyData.fillReceiver.split(',');
          }
          // 如果是自定义单位 需要获得选中的发生单位
          if (
            strategyData.strategyCustCount > 0 &&
            strategyData.fillType == 3
          ) {
            getFillUnitList({
              strategyId: state.form.id,
              custId: state.form.custId,
              // 1：产品预警，2：系统报告
              strategyType: 1,
              // 1：网站监测，2：新媒体监测
              prodId: state.form.prodType
            }).then(res => {
              // console.log(res);
              let selectedUnit = [];
              res.data.map(item => {
                item.echoType == 2 && selectedUnit.push(item);
              });
              state.selectedFullUnitList = selectedUnit;
            });
          }
          // 如果当前是填报单位 查询目前客户可以使用的产品策略监测项
          if (state.form.customerType == '1') {
            getMonitorOption({
              neId: state.form.id,
              custId: state.form.custId,
              strategyType: 1,
              prodId: state.form.prodType
            }).then(res => {
              if (res.code == 0) {
                res.data.map(item => {
                  for (let i in state.unitMotionOption) {
                    i == item.id && (state.unitMotionOption[i] = !item.check);
                    // 如果当前项被禁，就将其改为未选中
                    !!state.unitMotionOption[i] &&
                      (state.monitorList[i] = false);
                  }
                });
              }
            });
          }
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
      if (state.form.custCode && !state.isDel) {
        state.isCheckUnitDialog = true;
      } else {
        Message({
          type: 'warning',
          message: '请选择客户'
        });
      }
    };
    // 更改产品类型触发事件
    const onChangeProdType = val => {
      /*
       *  2 网站监测
       *  4 新媒体监测
       */
      onChangeCustomerType();
      if (val == 2) {
        state.form.name = '网站监测预警策略';
      } else {
        state.form.name = '新媒体监测预警策略';
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
      state.ifAllUnitDisabled = false;
      state.ifAllCusDisabled = false;
      state.ifDetailShow = false;

      // 放开所有策略项的禁用
      for (let i in state.unitMotionOption) {
        state.unitMotionOption[i] = false;
      }
      console.log(val, state.form.customerType);
    };
    // 选中组织/填报单位
    const onSelectCust = val => {
      console.log(val);
      state.ifDetailShow = true;
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
        // 如果当前是组织单位 查询目前客户可以使用的发生单位类型
        if (state.form.customerType == '0') {
          state.form.custId = val.id;
          state.form.custName = val.custName;
          state.form.custCode = val.custCode;
          getFillType({
            custId: val.id,
            // 1：产品预警，2：系统报告
            strategyType: 1,
            // 1：网站监测，2：新媒体监测
            prodId: state.form.prodType
          }).then(res => {
            if (res.code == 0) {
              res.data.map(item => {
                if (item.fillType === '2') {
                  // 全部
                  state.ifAllUnitDisabled = !item.check;
                } else if (item.fillType === '3') {
                  // 部分
                  state.ifAllCusDisabled = !item.check;
                }
              });
              if (state.ifAllUnitDisabled && state.ifAllCusDisabled) {
                // 都禁了
                state.form.unit = '';
              } else if (!state.ifAllUnitDisabled && state.ifAllCusDisabled) {
                // 禁了自定义
                state.form.unit = '0';
              } else if (!state.ifAllUnitDisabled && state.ifAllCusDisabled) {
                // 禁了全部
                state.form.unit = '1';
              }
            }
          });
          // 放开所有策略项的禁用
          for (let i in state.unitMotionOption) {
            state.unitMotionOption[i] = false;
          }
        } else if (state.form.customerType == '1') {
          state.form.custId = val.custId;
          state.form.custName = val.custName;
          state.form.custCode = val.custCode;
          // 如果当前是填报单位 查询目前客户可以使用的产品策略监测项
          getMonitorOption({
            custId: val.custId,
            strategyType: 1,
            prodId: state.form.prodType
          }).then(res => {
            if (res.code == 0) {
              res.data.map(item => {
                for (let i in state.unitMotionOption) {
                  i == item.id && (state.unitMotionOption[i] = !item.check);
                  // 如果当前项被禁，就将其改为未选中
                  !!state.unitMotionOption[i] && (state.monitorList[i] = false);
                }
              });
            }
          });
        }
      } else {
        onChangeCustomerType();
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
    // 接收自定义选中的发生单位
    const getCheckedUnits = list => {
      state.selectedFullUnitList = list;
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
      getCheckedUnits,
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
  .info {
    flex: 1;
    .name {
      flex: 0 0 120px;
    }
    .context {
      flex: 1;
      color: rgba(0, 0, 0, 0.45);
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
