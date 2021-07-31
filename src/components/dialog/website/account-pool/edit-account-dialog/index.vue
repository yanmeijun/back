<template>
  <el-drawer
    class="edit-account-dialog"
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
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="网站类型：" prop="siteType">
              <el-select
                v-model="form.siteType"
                @change="onChangeSiteType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in onFilterDic(dicList.site_type)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div style="visibility:hidden;">
              <el-form-item label="网站类型：">
                <!-- <select-dict :type="`site_type`"></select-dict> -->
                <el-input></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item
              label="网站标识码："
              prop="siteCode"
              class="error-left"
            >
              <el-input
                v-model="form.siteCode"
                :disabled="form.ex_isAutoCustCode || isEdit"
              >
                <template slot="suffix">
                  <el-switch
                    v-show="!isEdit"
                    class="el-switch--label-inside"
                    v-model="form.ex_isAutoCustCode"
                    :width="60"
                    active-text="自动"
                    inactive-text="不自动"
                    @change="onIsCodeAutoChange"
                  ></el-switch>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item
              label="网站名称："
              prop="accountName"
              class="error-left"
            >
              <el-input
                v-model="form.accountName"
                placeholder="请输入网站名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="网站地址：" prop="url" class="error-left">
              <el-input
                v-model="form.url"
                placeholder="请输入网站地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="地区：" prop="siteArea" class="error-left">
              <select-address v-model="form.siteArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="机构：" prop="orgArea" class="error-left">
              <select-organ-level v-model="form.orgArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="行业：" prop="tradeArea" class="error-left">
              <select-trade v-model="form.tradeArea" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="网站报送状态：" prop="accountStatus">
              <el-select
                v-model="form.accountStatus"
                placeholder="请选择网站报送状态"
              >
                <el-option
                  v-for="item in onFilterDic(dicList.website_account_status)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" v-if="isEdit">
            <el-form-item label="网站实际运行状态：" prop="realStatus">
              <el-select
                v-model="form.realStatus"
                placeholder="请选择网站实际运行状态"
              >
                <el-option
                  v-for="item in dicList.website_real_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" v-if="isEdit">
            <el-form-item label="监测状态：" prop="isScan">
              <el-select v-model="form.isScan" placeholder="请选择监测状态">
                <el-option
                  v-for="item in onFilterDic(dicList.is_scan)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="连通性监测频率：" prop="monitorRate">
              <el-select
                v-model="form.monitorRate"
                placeholder="请选择监测频率"
              >
                <el-option
                  v-for="item in dicList.monitor_rate"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="是否检查错别字：" prop="isCorrect">
              <el-select
                v-model="form.isCorrect"
                placeholder="请选择是否检查错别字"
              >
                <el-option
                  v-for="item in dicList.is_correct"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" v-if="isEdit">
            <el-form-item label="是否渲染：" prop="isFlag">
              <el-select v-model="form.isFlag" placeholder="请选择是否渲染">
                <el-option
                  v-for="item in onFilterDic(dicList.is_flag)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24"></el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item
              class="error-left"
              label="关联客户1："
              :prop="`accountList.0.value`"
              :rules="accountRules"
            >
              <el-select
                v-model="form.accountList[0].value"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关联客户"
                :remote-method="onRemoteAccountMethod"
                :loading="selectLoading"
              >
                <el-option
                  v-for="item in accountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-button
              type="primary"
              class="kp-button add-btn"
              @click="addAccount"
              >添加</el-button
            >
          </el-col>
        </el-row>
        <!-- 批量的关联客户 -->
        <el-row :gutter="10" v-show="form.accountList.length > 1">
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            v-for="(ele, index) in form.accountList.slice(1)"
            :key="index"
          >
            <el-form-item
              ref="sel"
              :prop="`accountList.${index + 1}.value`"
              :rules="accountRules"
              :label="`关联客户${index + 2}：`"
            >
              <el-select
                v-model="ele.value"
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="onRemoteAccountMethod"
                :loading="selectLoading"
              >
                <el-option
                  v-for="item in accountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <i
                class="el-icon-close del-role-icon"
                @click.prevent="removeAccount(ele)"
              ></i>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="concat-user-list">
          <div class="concat-btn">
            <el-button
              class="btn-dashed btn-add-concact"
              plain
              @click="onAddContactUser"
              style="width: 100%"
              >+ 添加联系人信息</el-button
            >
          </div>
          <div v-for="(item, index) in form.contactInfoList" :key="index">
            <h2 class="flex justify-between kp-dialog-title">
              <span>联系人信息{{ index + 1 }}</span>
              <div class="kp-dialog-title_action">
                <button
                  class="kp-add-remove kp-add-remove--small kp-add-remove--plain kp-add-remove--danger kp-add-remove--circle"
                  @click="onDelContactUser(index)"
                >
                  <i class="el-icon-minus"></i>
                </button>
              </div>
            </h2>
            <el-row :gutter="10" class="row">
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  class="error-left"
                  label="姓名："
                  :prop="`contactInfoList.${index}.linkmanName`"
                  :rules="{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                  }"
                >
                  <el-input v-model="item.linkmanName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  class="error-left"
                  label="职务："
                  :prop="`contactInfoList.${index}.linkmanPost`"
                  :rules="{
                    required: true,
                    message: '请选择职务',
                    trigger: 'change'
                  }"
                >
                  <!-- <select-dict v-model="item.linkmanPost" type="linkman_post" /> -->
                  <el-select v-model="item.linkmanPost" placeholder="请选择">
                    <el-option
                      v-for="item in postOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  class="error-left"
                  label="手机号："
                  :prop="`contactInfoList.${index}.phone`"
                  :rules="checkPhone"
                >
                  <el-input v-model="item.phone" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  label="邮箱："
                  :prop="`contactInfoList.${index}.email`"
                  :rules="[
                    {
                      type: 'email',
                      message: '邮箱格式不正确',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input v-model="item.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer-btn">
      <el-button @click="onCancle">取消</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {
  getAccountList,
  createWebSiteCode,
  addtWebsite,
  updateWebsite
} from '@/api/website/account-pool';
import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted
} from '@vue/composition-api';
import { computedStrLen } from '@/util/util';
import { pattern, isURL } from '@/util/validate';
import useGetDicList from '@/hook/useGetDicList';

import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业

export default {
  name: 'edit-account-dialog',
  components: {
    SelectAddress,
    SelectOrganLevel,
    SelectTrade
  },
  props: {
    isOpen: { type: Boolean, default: false }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    let validateAddAccount = (rule, value, callback) => {
      const has = state.form.accountList.filter(ele => ele.value === value);
      if (value === '') {
        callback(new Error('请输入关联账号'));
      } else if (has.length > 1) {
        callback(new Error('账号已存在'));
      } else {
        callback();
      }
    };
    let validateSiteCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入关联账号'));
      } else {
        if (state.isEdit) {
          callback();
        } else {
          if (parseInt(state.form.siteType) === 0) {
            // 中文
            if (value[0] != 'N') {
              callback(new Error('首字母必须是大写“N”'));
            } else if (value.length !== 10) {
              callback(new Error('网站标识码长度必须为10'));
            } else {
              callback();
            }
          } else {
            // 英文
            if (value[0] != 'E') {
              callback(new Error('首字母必须是大写“E”'));
            } else if (value.length !== 10) {
              callback(new Error('网站标识码长度必须为10'));
            } else {
              callback();
            }
          }
        }
      }
    };
    let validateAccountName = (rule, value, callback) => {
      let len = computedStrLen(value);
      if (value === '') {
        callback(new Error('网站名称不能为空'));
      } else if (len > 30) {
        callback(new Error('最长30个字符(一个汉字等于2个字符)'));
      } else {
        callback();
      }
    };
    let validateUrl = (rule, value, callback) => {
      let len = computedStrLen(value);
      if (value === '') {
        callback(new Error('网站地址不能为空'));
      } else if (len > 50) {
        callback(new Error('最长50个字符(一个汉字等于2个字符)'));
      } else if (!isURL(value)) {
        callback(new Error('请输入有效的url地址'));
      } else {
        callback();
      }
    };
    let validatePhone = (rule, value, callback) => {
      const has = state.form.contactInfoList.filter(ele => ele.phone === value);
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (has.length > 1) {
        callback(new Error('手机号已存在'));
      } else {
        callback();
      }
    };
    const state = reactive({
      title: '网站',
      isEdit: false,
      form: {
        siteType: '0',
        siteCode: '0',
        ex_isAutoCustCode: true,
        accountName: '',
        url: '',
        accountStatus: '',
        realStatus: '',
        siteArea: [],
        orgArea: [], // 机构
        tradeArea: [], // 行业
        isScan: '', // 监测状态
        monitorRate: '', // 监测频率
        isFlag: '', // 是否渲染
        isCorrect: '', // 是否检查错别字
        accountList: [
          {
            value: ''
          }
        ], // 关联客户
        contactInfoList: [] //联系人
      },
      isLoad: false,
      rules: {
        siteCode: {
          validator: validateSiteCode,
          required: true,
          trigger: 'change'
        },
        accountName: {
          validator: validateAccountName,
          required: true,
          trigger: 'blur'
        },
        url: {
          validator: validateUrl,
          required: true,
          trigger: 'blur'
        },
        siteArea: {
          message: '地区不能为空',
          required: true,
          trigger: 'change'
        },
        orgArea: {
          message: '机构不能为空',
          required: true,
          trigger: 'change'
        },
        tradeArea: {
          message: '行业不能为空',
          required: true,
          trigger: 'change'
        }
      },
      accountRules: {
        validator: validateAddAccount,
        required: true,
        trigger: 'change'
      },
      checkPhone: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          pattern: pattern.phone,
          message: '手机号格式不正确',
          trigger: 'blur'
        },
        {
          validator: validatePhone,
          trigger: 'blur'
        }
      ],
      postOptions: [
        { label: '责任人', value: '1' },
        { label: '联系人', value: '2' }
      ],
      selectLoading: false,
      accountOptions: [],
      id: '',
      zh: '',
      en: ''
    });

    // 属性
    onMounted(() => {
      // 防止 - 初次提交refs 为null
      state.isLoad = false;
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 方法
    const onInit = data => {
      if (!data) {
        state.title = '添加网站';
        state.isEdit = false;
        onCreatSiteCode();
        return;
      }
      state.isEdit = true;
      state.title = '编辑网站';
      const { id, accountOptions, ...args } = data;
      state.form = args;
      state.accountOptions = accountOptions;
      state.id = id;
    };
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          // 数据处理
          const { siteArea, orgArea, tradeArea, accountList } = state.form;
          // 关联人
          const custIdList = [];
          accountList.forEach(ele => {
            if (ele.value) {
              custIdList.push(ele.value);
            }
          });

          // 地区处理
          let [provDistId = '', cityDistId = '', countyDistId = ''] = siteArea;
          state.form.provDistId = provDistId;
          state.form.cityDistId = cityDistId;
          state.form.countyDistId = countyDistId;
          // 行业处理
          let [x = '', y = '', z = ''] = tradeArea;
          state.form.tradePid = x;
          state.form.tradeSid = y;
          state.form.tradeGid = z;
          // 机构类处理
          let [p = '', s = '', g = ''] = orgArea;
          state.form.organPid = p;
          state.form.organSid = s;
          state.form.organGid = g;
          state.form.source = state.form.isSubmited === '0' ? 'BS' : 'WZ';

          const params = {
            ...state.form,
            source: 'WZ',
            custIdList
          };
          if (state.id && state.isEdit) {
            update(params);
          } else {
            add(params);
          }
        } else {
          console.log('edit-account-dialog err');
        }
      });
    };
    const update = async params => {
      params.id = state.id;
      const { code, msg } = await updateWebsite(params);
      if (code) {
        root.$message({
          type: 'error',
          message: msg || '修改失败，请重试！'
        });
        return;
      }
      root.$message({
        type: 'success',
        message: msg || '修改成功！'
      });
      emit('update');
      onCloseDialog();
    };
    const add = async params => {
      const { code, msg } = await addtWebsite(params);
      if (code) {
        root.$message({
          type: 'error',
          message: msg || '添加失败，请重试！'
        });
        return;
      }
      root.$message({
        type: 'success',
        message: msg || '添加成功！'
      });
      emit('update');
      onCloseDialog();
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onCancle = () => {
      onCloseDialog();
    };
    const onCreatSiteCode = async () => {
      // 非自动
      if (!state.form.ex_isAutoCustCode) return;
      // 自动
      state.form.siteCode =
        parseInt(state.form.siteType) === 1 ? state.en : state.zh;
      if (state.form.siteCode) return;
      const { data } = await createWebSiteCode({ type: state.form.siteType });
      if (state.form.siteType === '0') {
        state.zh = data;
      } else {
        state.en = data;
      }
      state.form.siteCode = data;
    };
    // 网站类型 - 切换
    const onChangeSiteType = () => {
      onCreatSiteCode();
    };
    // 是否使用自动生成的siteCode
    const onIsCodeAutoChange = val => {
      if (val) {
        // 自动
        state.form.siteCode =
          parseInt(state.form.siteType) === 1 ? state.en : state.zh;
      } else {
        // 手动
        state.form.siteCode = '';
      }
    };
    const onRemoteAccountMethod = async queryString => {
      if (queryString.length < 4) {
        state.accountOptions = [];
        return;
      }
      state.selectLoading = true;
      const { data } = await getAccountList({
        custCode: queryString
      });
      let accountOptions = data.map(ele => {
        return {
          label: `${ele.custName}：${ele.custCode}`,
          value: ele.custId
        };
      });
      state.selectLoading = false;
      state.accountOptions = accountOptions;
    };
    // 添加关联客户
    const addAccount = () => {
      state.form.accountList.push({
        value: '',
        key: Date.now()
      });
    };
    //  删除关联客户
    const removeAccount = item => {
      var index = state.form.accountList.indexOf(item);
      state.form.accountList.splice(index, 1);
    };
    // 添加联系人
    const onAddContactUser = () => {
      state.form.contactInfoList.push({
        linkmanName: '', // 姓名
        linkmanPost: '', // 职务
        phone: '', // 手机
        email: '' // email
      });
    };
    // 删除联系人
    const onDelContactUser = index => {
      state.form.contactInfoList.splice(index, 1);
    };

    const onFilterDic = (options = []) => {
      return options.filter(ele => ele.value);
    };
    const { dicList } = useGetDicList(
      [
        'site_type',
        'is_flag',
        'website_account_status',
        'website_real_status',
        'is_scan',
        'monitor_rate',
        'is_correct'
      ],
      false
    );

    // 返回
    return {
      refForm,
      ...toRefs(state),
      dicList,
      onFilterDic,
      onInit,
      onSubmit,
      onCancle,
      onCloseDialog,
      onRemoteAccountMethod,
      addAccount,
      removeAccount,
      onAddContactUser,
      onDelContactUser,
      onChangeSiteType,
      onIsCodeAutoChange
    };
  }
};
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss'; //引入css类
.edit-account-dialog {
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
    margin-bottom: 16px;
    .btn-add-concact {
      font-weight: 400;
      border: 1px dashed #dcdfe6;
      color: #000;
    }
  }
  .add-btn {
    position: relative;
    top: 31px;
  }
}
</style>
