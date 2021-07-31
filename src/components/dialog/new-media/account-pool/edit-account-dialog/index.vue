<template>
  <el-dialog
    class="edit-account-dialog"
    title="编辑"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form :model="form" ref="form" label-width="120px">
        <h2 class="kp-dialog-title">
          基础信息
        </h2>
        <el-row :gutter="10" class="no-rules-form2 row">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="头像：">
              <UploadAvatar
                class="account-avatar"
                :src="form.photo"
                @uploadSuccess="uploadSuccess"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="唯一标识：">
              <el-tooltip
                effect="dark"
                placement="top"
                v-if="form.uniqueCode"
                :content="form.uniqueCode"
              >
                <span class="word-ellipsis-1">{{ form.uniqueCode }}</span>
              </el-tooltip>
              <span v-else>{{ '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="修改人：">
              <span>{{ form.updatedByName || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="添加时间：">
              <el-tooltip
                effect="dark"
                placement="top"
                v-if="form.createdTime"
                :content="form.createdTime"
              >
                <span class="word-ellipsis-1">{{ form.createdTime }}</span>
              </el-tooltip>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="修改时间：">
              <el-tooltip
                effect="dark"
                placement="top"
                v-if="form.updatedTime"
                :content="form.updatedTime"
              >
                <span class="word-ellipsis-1">{{ form.updatedTime }}</span>
              </el-tooltip>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="同主体账号：">
              <MainAccountDropdown
                :tableData="data"
                :accountName="form.accountName"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="账号类型：">
              <span>{{ form.accountTypeName || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="账号ID：">
              <el-input
                v-model="form.accountId"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="账号名称：">
              <el-input
                v-model="form.accountName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="主页地址：">
              <el-input v-model="form.homePage" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-if="isWx">
            <el-form-item label="原始ID：">
              <el-input
                v-model="form.oldAccountId"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-if="isWx">
            <el-form-item label="文章地址：">
              <el-input
                v-model="form.articleAddress"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="是否认证：">
              <el-select v-model="form.isCertified" placeholder="请选择">
                <el-option
                  v-for="item in dicList.is_no"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="账号状态：">
              <el-select v-model="form.accountStatus" placeholder="请选择">
                <el-option
                  v-for="item in onFilterDic(dicList.account_status)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="认证信息：">
              <el-input
                v-model="form.authentication"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="账号级别：">
              <select-dict
                v-model="form.accountLevel"
                :type="`account_level`"
              ></select-dict>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="是否门户：">
              <select-dict
                v-model="form.isGateway"
                :type="`is_no`"
              ></select-dict>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="归属类别：">
              <el-input
                v-model="form.classification"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="地区：">
              <SelectAddress
                v-model="form.ex_szdValues"
                clearable
                v-if="resetEx"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="机构：">
              <SelectOrganLevel
                v-if="resetEx"
                v-model="form.ex_organValues"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="行业：">
              <SelectTrade
                v-if="resetEx"
                v-model="form.ex_tradeValues"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16">
            <el-form-item label="公众号简介：">
              <el-input
                class="textarea"
                v-model="form.accountInfo"
                placeholder="请输入"
                type="textarea"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-row>
              <el-col :xs="20" :sm="20" :md="12">
                <el-form-item label="关联客户：">
                  <el-select
                    v-if="resetEx"
                    v-model="form.accountList[0].value"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入"
                    :remote-method="remoteAccountMethod"
                    :loading="loading"
                  >
                    <el-option
                      v-for="item in accountOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="4" :sm="4" :md="8">
                <el-button
                  type="primary"
                  class="kp-button add-btn"
                  @click="addAccount"
                  >添加</el-button
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="form.accountList.length > 1">
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            v-for="(ele, index) in form.accountList.slice(1)"
            :key="ele.key"
          >
            <el-form-item
              ref="sel"
              :prop="`accountList.${index + 1}.value`"
              :rules="addRules"
              label="关联客户："
            >
              <el-select
                v-model="ele.value"
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteAccountMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in accountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <i
                class="el-icon-close del-role-icon"
                @click.prevent="removeAccount(ele)"
              ></i>
            </el-form-item>
          </el-col>
        </el-row>
        <h2 class="kp-dialog-title">
          新媒体报送字段
        </h2>
        <el-row class="row" :gutter="10">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="开设主体：">
              <el-input
                v-model="form.accountSubject"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="来自报送：">
              <el-select v-model="form.isSubmited" placeholder="请选择">
                <el-option
                  v-for="item in dicList.is_no"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="功能：">
              <el-select
                class="kp-select-multiple"
                multiple
                clearable
                v-model="form.accountFunc"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in onFilterDic(dicList.account_func)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24">
            <el-row>
              <el-col :xs="24" :sm="24" :md="16" class="flex align-center">
                <span class="label"
                  >是否代表省/市/县(区)人民政府或国务院部门：</span
                >
                <el-select v-model="form.isGov" placeholder="请选择">
                  <el-option
                    v-for="item in dicList.is_no"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="concat-user-list">
          <div class="concat-btn">
            <el-button
              class="btn-dashed btn-add-concact"
              plain
              icon="iconfont icontubiaozhizuomoban31"
              @click="onAddContactUser"
              style="width: 100%"
            >
              添加联系人信息
            </el-button>
          </div>
          <div v-for="(item, index) in form.mediaContactInfoList" :key="index">
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
                  label="姓名："
                  :prop="`mediaContactInfoList.${index}.linkmanName`"
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
                  label="角色："
                  :prop="`mediaContactInfoList.${index}.linkmanPost`"
                  :rules="{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                  }"
                >
                  <el-select v-model="item.linkmanPost" placeholder="请选择">
                    <el-option
                      v-for="item in dicList.linkman_post"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  label="手机号："
                  :prop="`mediaContactInfoList.${index}.phone`"
                  :rules="checkPhone"
                >
                  <el-input v-model="item.phone" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  label="邮箱："
                  :prop="`mediaContactInfoList.${index}.email`"
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
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getAccountInfo,
  putAccountInfo,
  getPoolList,
  getAccountList
} from '@/api/new-media/account-pool';
import { pattern } from '@/util/validate';
import useGetDicList from '@/hook/useGetDicList';

import UploadAvatar from '@/components/base/upload-avatar/index';
import MainAccountDropdown from '@/components/base/main-account-dropdown/index';
import SelectAddress from '@/components/base/select-address/index';
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业
export default {
  name: 'edit-account-dialog',
  components: {
    UploadAvatar,
    MainAccountDropdown,
    SelectAddress,
    SelectOrganLevel,
    SelectTrade
  },
  data() {
    var validateAdd = (rule, value, callback) => {
      const has = this.form.accountList.filter(ele => ele.value === value);
      if (value === '') {
        callback(new Error('请输入关联账号'));
      } else if (has.length > 1) {
        callback(new Error('账号已存在'));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      const has = this.form.mediaContactInfoList.filter(
        ele => ele.phone === value
      );
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (has.length > 1) {
        callback(new Error('手机号已存在'));
      } else {
        callback();
      }
    };
    return {
      pattern,
      accountOptions: [],
      loading: false,
      id: '',
      form: {
        photo: '',
        accountId: '',
        accountName: '',
        homePage: '',
        oldAccountId: '',
        articleAddress: '',
        isCertified: '',
        accountStatus: '',
        accountSubject: '',
        // accountLevel: '',
        // isGateway: '',
        // classification: '',
        accountInfo: '',
        account: '',
        accountList: [
          {
            key: Date.now(),
            value: ''
          }
        ],
        mediaContactInfoList: [],
        authentication: '',
        isSubmited: '',
        accountFunc: [],
        location: '',
        ex_szdValues: [],
        ex_organValues: [],
        ex_tradeValues: [],
        provDistId: '', // 地区-省
        cityDistId: '', // 地区-市
        countyDistId: '', // 地区-县
        organId: '', // 机构
        organLevelId: '', // 级别
        tradeId: '', // 行业
        isGov: ''
      },
      addRules: [
        {
          validator: validateAdd,
          required: true,
          trigger: 'change'
        }
      ],
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
      AuthOptions: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ],
      data: [],
      queryAccountList: [],
      resetEx: false
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改部门名称'
    }
  },
  computed: {
    isWx() {
      return this.form.accountType === '101';
    }
  },
  setup() {
    const { dicList } = useGetDicList(
      ['is_no', 'account_status', 'account_func', 'linkman_post'],
      false
    );
    const onFilterDic = (options = []) => {
      return options.filter(ele => ele.value);
    };
    return { dicList, onFilterDic };
  },
  methods: {
    async init(row) {
      if (this.validatenull(row)) {
        this.resetEx = true;
        return;
      }
      this.resetEx = false;
      let { data } = await getAccountInfo({ id: row.id });
      this.id = row.id;
      let custList = data.custList || [];
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
      if (accountList.length === 0) {
        accountList = [
          {
            value: '',
            key: Date.now()
          }
        ];
      }
      // 地区扩展处理
      let ex_szdValues = [];
      data.provDistId && ex_szdValues.push(parseInt(data.provDistId));
      data.cityDistId && ex_szdValues.push(parseInt(data.cityDistId));
      data.countyDistId && ex_szdValues.push(parseInt(data.countyDistId));
      // 机构类型扩展处理
      let ex_organValues = [];
      data.organPid && ex_organValues.push(parseInt(data.organPid));
      data.organSid && ex_organValues.push(parseInt(data.organSid));
      data.organGid && ex_organValues.push(parseInt(data.organGid));

      // 行业扩展处理
      let ex_tradeValues = [];
      data.tradePid && ex_tradeValues.push(parseInt(data.tradePid));
      data.tradeSid && ex_tradeValues.push(parseInt(data.tradeSid));
      data.tradeGid && ex_tradeValues.push(parseInt(data.tradeGid));

      data.isSubmited = data.source === 'BS' ? '0' : '1';
      let accountFunc = data.accountFunc || '';
      accountFunc = accountFunc ? accountFunc.split(',') : [];

      this.form = Object.assign({}, data, {
        accountList,
        // account,
        ex_szdValues,
        ex_organValues,
        ex_tradeValues,
        accountFunc
      });
      this.accountOptions = accountOptions;
      this.$nextTick().then(() => {
        this.resetEx = true;
      });

      let { data: poolData } = await getPoolList({
        authentication: '我是主体账号'
      });
      this.data = poolData;
    },
    uploadSuccess(url) {
      this.form.photo = url;
    },
    submitHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          // 地区处理
          const {
            ex_szdValues,
            ex_tradeValues,
            ex_organValues,
            accountList
          } = this.form;
          let custIdList = [];
          accountList.forEach(ele => {
            if (ele.value) {
              custIdList.push(ele.value);
            }
          });
          // 地区处理
          // if (ex_szdValues.length === 2) {
          //   // 市处理
          //   this.form.provDistId = '';
          //   this.form.cityDistId = ex_szdValues[0];
          //   this.form.countyDistId = ex_szdValues[1];
          // } else {

          // }
          let [
            provDistId = '',
            cityDistId = '',
            countyDistId = ''
          ] = ex_szdValues;
          this.form.provDistId = provDistId;
          this.form.cityDistId = cityDistId;
          this.form.countyDistId = countyDistId;
          // 行业处理
          let [x = '', y = '', z = ''] = ex_tradeValues;
          this.form.tradePid = x;
          this.form.tradeSid = y;
          this.form.tradeGid = z;
          // 机构类处理
          let [p = '', s = '', g = ''] = ex_organValues;
          this.form.organPid = p;
          this.form.organSid = s;
          this.form.organGid = g;
          this.form.source = this.form.isSubmited === '0' ? 'BS' : 'WZ';
          this.form.isSubmited = '';

          // const custCodeList = [this.form.account, ...accountList];
          let datas = Object.assign({}, this.form, {
            custIdList,
            id: this.id,
            prodId: '4',
            accountFunc: this.form.accountFunc.join(',')
          });
          Object.keys(datas).forEach(k => {
            if (k.startsWith('ex_')) {
              delete datas[k];
            }
          });
          console.log('datas', datas);
          let { code, msg } = await putAccountInfo(datas);
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '修改失败，请重试！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '修改成功！'
          });
          this.$emit('update');
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeAccount(item) {
      var index = this.form.accountList.indexOf(item);
      this.form.accountList.splice(index, 1);
      this.queryAccountList = this.queryAccountList.filter(
        ele => ele.custCode !== item.value
      );
    },
    addAccount() {
      this.form.accountList.push({
        value: '',
        key: Date.now()
      });
    },
    async remoteAccountMethod(queryString) {
      if (queryString.length < 4) {
        this.accountOptions = [];
        return;
      }
      this.loading = true;
      const { data } = await getAccountList({
        custCode: queryString
      });
      this.loading = false;
      let accountOptions = data.map(ele => {
        return {
          label: `${ele.custName}：${ele.custCode}`,
          value: ele.custId
        };
      });
      this.accountOptions = accountOptions;
    },
    // 添加联系人
    onAddContactUser() {
      let model = {
        linkmanName: '', // 姓名
        linkmanPost: '', // 职务
        phone: '', // 手机
        email: '' // email
      };
      this.form.mediaContactInfoList.push(model);
    },
    // 删除联系人
    onDelContactUser(index) {
      this.form.mediaContactInfoList.splice(index, 1);
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.edit-account-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 1000px;
    }
    .el-dialog__body {
      padding-top: 16px;
    }
  }
  .form-main {
    .row {
      padding: 0 30px;
    }
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 70vh;
    .account-avatar {
      ::v-deep {
        .el-upload {
          border-radius: 4px;
        }
        .avatar-uploader-icon {
          width: 120px;
          height: 120px;
        }
      }
    }
    .textarea {
      height: 71px;
      ::v-deep.el-textarea__inner {
        height: 100%;
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
    .label {
      flex: 0 0 290px;
    }
  }
  .concat-btn {
    padding: 0 30px 16px;
  }
  /deep/ .el-button.btn-dashed {
    border-style: dashed;
    padding: 7px 13px;
    i {
      font-size: 12px;
      margin-right: 3px;
    }
  }
}
</style>
<style>
.auto-complete {
  width: 280px !important;
}
</style>
