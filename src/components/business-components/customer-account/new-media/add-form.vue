<template>
  <div class="form-main" v-loading="loading">
    <el-form :model="modelFm" ref="modelFm" :rules="rules" label-width="123px">
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="单位名称：" prop="custName">
            <el-input v-model="modelFm.custName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="唯一标识：" prop="custCode">
            <el-input
              v-model="modelFm.custCode"
              :disabled="modelFm.ex_isAutoCustCode"
            >
              <template slot="suffix">
                <el-switch
                  class="el-switch--label-inside"
                  v-model="modelFm.ex_isAutoCustCode"
                  :width="60"
                  active-text="自动"
                  inactive-text="不自动"
                  @change="onIsCodeAutoChange"
                >
                </el-switch>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="密码：" prop="custPassword">
            <el-input
              v-model="modelFm.custPassword"
              :type="modelFm.ex_custPasswordIsPlain ? 'text' : 'password'"
              @blur="onCustPasswordBlur"
            >
              <i
                slot="suffix"
                class="suffix-password iconfont icontubiaozhizuomoban37"
                :class="{ active: modelFm.ex_custPasswordIsPlain }"
                @click="
                  modelFm.ex_custPasswordIsPlain = !modelFm.ex_custPasswordIsPlain
                "
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="地区：" prop="ex_addressValues">
            <select-address v-model="modelFm.ex_addressValues" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="机构：" prop="ex_organValues">
            <select-organ-level v-model="modelFm.ex_organValues" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="行业：">
            <select-trade v-model="modelFm.ex_tradeValues" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="状态：" prop="status">
            <el-switch
              class="el-switch--label-inside"
              v-model="modelFm.status"
              :width="60"
              active-value="1"
              active-text="启用"
              inactive-value="0"
              inactive-text="禁用"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <template v-for="(item, index) in modelFm.customParentRelationList">
          <el-col :xs="24" :sm="24" :md="index === 0 ? 24 : 12" :key="item.key">
            <el-row :gutter="10">
              <el-col :span="index === 0 ? 12 : 24">
                <el-form-item
                  class="form-item--affiliated"
                  :prop="'customParentRelationList.' + index + '.parentId'"
                  :label="`挂靠组织单位${index + 1}：`"
                  :rules="{
                    required: true,
                    message: '挂靠组织不能为空',
                    trigger: 'change'
                  }"
                >
                  <select-organization-tree
                    v-model="item.parentId"
                    check-strictly
                    :disabled="index === 0"
                    placeholder="请选择"
                    @change="onAffiliatedUnitChange($event, item)"
                  />
                  <button
                    v-if="index !== 0"
                    class="kp-add-remove kp-add-remove--mini kp-add-remove--danger kp-add-remove--circle"
                    @click="onDelAffiliatedUnit(index)"
                  >
                    <i class="el-icon-close"></i>
                  </button>
                </el-form-item>
              </el-col>
              <el-col v-if="index === 0" :span="12">
                <el-button
                  class="btn-dashed"
                  plain
                  icon="iconfont icontubiaozhizuomoban31"
                  @click="onAddAffiliatedUnit"
                >
                  添加
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </template>
      </el-row>
      <div class="concat-user-list">
        <el-button
          class="btn-dashed btn-add-concact"
          plain
          icon="iconfont icontubiaozhizuomoban31"
          @click="onAddContactUser"
          style="width: 100%"
        >
          添加联系人信息
        </el-button>
        <div v-for="(item, index) in modelFm.contactInfoList" :key="index">
          <h2 class="kp-dialog-title">
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
                :prop="`contactInfoList.${index}.linkmanName`"
                :rules="rules.linkmanName"
              >
                <el-input v-model="item.linkmanName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                label="职务："
                :prop="`contactInfoList.${index}.linkmanPost`"
                :rules="rules.linkmanPost"
              >
                <select-dict
                  v-model="item.linkmanPost"
                  type="cust_linkman_post"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                label="手机号："
                :prop="`contactInfoList.${index}.phone`"
                :rules="rules.linkmanPhone"
              >
                <el-input v-model="item.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                label="邮箱："
                :prop="`contactInfoList.${index}.email`"
                :rules="rules.linkmanEmail"
              >
                <el-input v-model="item.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { pattern } from '@/util/validate';
import * as custAccountApi from '@/api/cust-account';
import SelectAddress from '@/components/base/select-address'; // 下拉选择-地区
import SelectOrganLevel from '@/components/base/select-organ-level'; // 下拉选择-机构级别
import SelectTrade from '@/components/base/select-trade'; // 下拉选择-行业
import SelectOrganizationTree from '@/components/base/select-organization-tree'; // 下拉选择-组织树
export default {
  components: {
    SelectAddress,
    SelectOrganLevel,
    SelectTrade,
    SelectOrganizationTree
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
    let validateCustCode = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入'));
      }
      if (!/^[A-Za-z0-9]{10}$/.test(value)) {
        return callback(new Error('请输入10位字母/数字/字母数字组合'));
      }
      // 手动输入进行是否存在验证
      if (!this.modelFm.ex_isAutoCustCode) {
        // 验证code是否存在
        let { data } = await custAccountApi.customCodeIsExist(value);
        if (data === true) {
          return callback(new Error('系统已经存在相同标识码'));
        }
      }
      callback();
    };
    let validateLinkmanName = (rule, value, callback) => {
      const data = this.modelFm.contactInfoList.filter(
        item => item.linkmanName === value
      );
      if (data.length > 1) {
        callback(new Error('姓名已存在'));
      } else {
        callback();
      }
    };
    let validateLinkmanPhone = (rule, value, callback) => {
      const data = this.modelFm.contactInfoList.filter(
        item => item.phone === value
      );
      if (data.length > 1) {
        callback(new Error('手机号已存在'));
      } else {
        callback();
      }
    };
    let validateLinkmanEmail = (rule, value, callback) => {
      const data = this.modelFm.contactInfoList.filter(
        item => item.email === value
      );
      if (data.length > 1) {
        callback(new Error('邮箱已存在'));
      } else {
        callback();
      }
    };
    return {
      pattern, // 正则配置
      loading: false,
      modelFm: {
        source: 'BS', // 来源：网站报送单位
        custCode: '', // 标识码
        ex_isAutoCustCode: true, // 是否自动生成标识码
        ex_autoCustCode: '', // 自动生成code
        ex_inputCustCode: '', // 手动生成code
        custLevel: '1', // 单位级别 0 组织 1 填报
        custPassword: '', // 密码
        ex_autoCustPassword: '', // 自动生成的密码(编辑后失去光标为空时则自动填充初始系统生成的密码)
        ex_custPasswordIsPlain: false, // 是否明文
        custName: '', // 单位名称 /网站名称
        ex_addressValues: [], // 地区
        provDistId: '', // 地区-省
        cityDistId: '', // 地区-市
        countyDistId: '', // 地区-县
        ex_organValues: [],
        organId: '', // 机构
        organLevelId: '', // 级别
        ex_tradeValues: [],
        tradeId: '', // 行业
        status: '1', // 状态
        // 挂靠单位集合
        customParentRelationList: [
          {
            layerType: '-1',
            parentId: this.orgNode.id, // 挂靠组织单位id
            parentIds: this.orgNode.parentIds,
            parentCode: this.orgNode.custCode, // 挂靠组织单位标识码
            parentCodes: this.orgNode.parentCodes
          }
        ],
        // 联系人信息集合
        contactInfoList: [
          // {
          //   linkmanName: '', // 姓名
          //   linkmanPost: '', // 职务
          //   phone: '', // 手机
          //   email: '' // email
          // }
        ]
      },
      rules: {
        custCode: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: validateCustCode,
            trigger: 'blur'
          }
        ],
        custName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
        ],
        custPassword: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: pattern.password,
            message: '6-16位的字母/数字/组合',
            trigger: 'blur'
          }
        ],
        ex_addressValues: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        director: [{ required: true, message: '请输入', trigger: 'blur' }],
        url: [{ required: true, message: '请输入', trigger: 'blur' }],
        jumpUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        ex_organValues: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        organLevelId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择', trigger: 'change' }],
        linkmanName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateLinkmanName, trigger: 'blur' }
        ],
        linkmanPost: [{ required: true, message: '请选择', trigger: 'change' }],
        linkmanPhone: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: pattern.phone,
            message: '手机号格式不正确',
            trigger: 'blur'
          },
          { validator: validateLinkmanPhone, trigger: 'blur' }
        ],
        linkmanEmail: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
          { validator: validateLinkmanEmail, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取客户自动编码(含密码)
    async getCustomerAutoCode() {
      let { code, data } = await custAccountApi.getCustomAutoCode({
        type: 1, // 填报单位
        siteType: 0
      });
      if (code !== 0) {
        this.$message.error({
          message: '获取自动编码失败'
        });
        return;
      }
      this.modelFm.ex_autoCustCode = data.custCode;
      this.modelFm.custCode = data.custCode;
      this.modelFm.custPassword = data.custPassword;
      this.modelFm.ex_autoCustPassword = data.custPassword;
      this.validate(['custCode', 'custPassword']);
    },
    // 提交数据
    async doSubmit() {
      let data = JSON.parse(JSON.stringify(this.modelFm));
      // 地区处理
      let [
        provDistId = '',
        cityDistId = '',
        countyDistId = ''
      ] = data.ex_addressValues;
      data.provDistId = provDistId;
      data.cityDistId = cityDistId;
      data.countyDistId = countyDistId;
      // 行业处理
      if (data.ex_tradeValues.length) {
        let [p = '', s = '', g = ''] = data.ex_tradeValues;
        data.tradePid = p;
        data.tradeSid = s;
        data.tradeGid = g;
      }
      // 机构类处理
      if (data.ex_organValues.length) {
        let [p = '', s = '', g = ''] = data.ex_organValues;
        data.organPid = p;
        data.organSid = s;
        data.organGid = g;
      }
      // 去除自定义扩展属性
      Object.keys(data).forEach(k => {
        if (k.startsWith('ex_')) {
          delete data[k];
        }
      });
      this.loading = true;
      let { code } = await custAccountApi.add(data);
      this.loading = false;
      if (code === 0) {
        this.$message.success({
          message: '添加成功'
        });
        this.$emit('on-success');
      }
    },
    // 是否自动生成标识码改变回调
    onIsCodeAutoChange(val) {
      // 自动生成并且已经生成
      if (val && this.modelFm.ex_autoCustCode) {
        this.modelFm.ex_inputCustCode = this.modelFm.custCode;
        this.modelFm.custCode = this.modelFm.ex_autoCustCode;
        this.validate(['custCode']);
        return;
      }
      // 自动生成并且没有生成
      if (val && !this.modelFm.ex_autoCustCode) {
        this.modelFm.ex_inputCustCode = this.modelFm.custCode;
        this.getCustomerAutoCode();
        return;
      }
      // 自定义
      if (!val) {
        this.modelFm.custCode = this.modelFm.ex_inputCustCode;
        // 触发验证
        this.validate(['custCode']);
      }
    },
    // 密码失去光标回调
    onCustPasswordBlur() {
      // 无密码时默认填充自动生成的
      if (!this.modelFm.custPassword) {
        this.modelFm.custPassword = this.modelFm.ex_autoCustPassword;
      }
    },
    submit() {
      this.$refs['modelFm'].validate(async valid => {
        if (!valid) {
          return;
        }
        this.doSubmit();
      });
    },
    // 添加挂靠单位
    onAddAffiliatedUnit() {
      let model = {
        layerType: '-1',
        parentId: '',
        parentCode: '',
        parentIds: '',
        parentCodes: ''
      };
      this.modelFm.customParentRelationList.push(model);
    },
    // 删除挂靠单位
    onDelAffiliatedUnit(index) {
      this.modelFm.customParentRelationList.splice(index, 1);
    },
    /**
     * 挂靠单位改变
     * data: 子组件emit数据
     * model: 当前挂靠单位对象
     */
    onAffiliatedUnitChange(data, model) {
      model.parentCode = data ? data.custCode : '';
      model.parentCodes = data ? data.parentCodes : '';
      model.parentIds = data ? data.parentIds : '';
    },
    // 添加联系人
    onAddContactUser() {
      let model = {
        linkmanName: '', // 姓名
        linkmanPost: '', // 职务
        phone: '', // 手机
        email: '' // email
      };
      this.modelFm.contactInfoList.push(model);
    },
    // 删除联系人
    onDelContactUser(index) {
      this.modelFm.contactInfoList.splice(index, 1);
    },
    // 验证
    validate(fields) {
      // 触发验证
      this.$nextTick(() => {
        this.$refs['modelFm'].validateField(fields);
      });
    }
  },
  created() {
    this.getCustomerAutoCode();
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.form-main {
  .row {
    padding: 0 30px;
  }
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 46vh;
}
.view-tip {
  height: 32px;
  margin-bottom: 18px;
  .view-link {
    color: var(--primary);
  }
  i {
    margin-left: 5px;
    color: rgba(0, 0, 0, 0.45);
  }
}
/deep/ .el-input__suffix-inner {
  .el-switch {
    top: -2px;
  }
}

.kp-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_action {
    /deep/ .el-button {
      padding: 0;
      height: 20px;
      width: 20px;
      line-height: 18px;
      text-align: center;
      .iconfont {
        font-size: 12px;
      }
    }
  }
}
// 密码显隐
.suffix-password {
  cursor: pointer;
  &.active {
    color: #606266;
  }
}
/deep/ .el-button.btn-dashed {
  border-style: dashed;
  padding: 7px 13px;
  i {
    font-size: 12px;
    margin-right: 3px;
  }
}
.btn-add-concact + div {
  margin-top: 16px;
}
.form-item--affiliated {
  .kp-add-remove {
    position: absolute;
    top: -8px;
    right: -8px;
  }
}
</style>
