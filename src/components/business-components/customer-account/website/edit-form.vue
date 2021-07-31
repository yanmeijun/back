<template>
  <div class="form-main" v-loading="loading">
    <el-form :model="modelFm" ref="modelFm" :rules="rules" label-width="110px">
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="网站类型：">
            <el-select v-model="modelFm.siteType" placeholder="请选择">
              <el-option
                v-for="item in onFilterDic(dicList.site_type)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="网站标识码：" class="form-item-code">
            {{ modelFm.custCode }}
          </el-form-item>
        </el-col>
        <el-col v-if="modelFm.ex_custPassword" :xs="24" :sm="24" :md="12">
          <el-form-item label="密码：" prop="custPassword">
            <el-input
              v-model="modelFm.custPassword"
              :type="modelFm.ex_custPassword.isPlaintext ? 'text' : 'password'"
              disabled
            >
              <i
                slot="suffix"
                class="suffix-password iconfont icontubiaozhizuomoban37"
                :class="{ active: modelFm.ex_custPassword.isPlaintext }"
                @click="
                  modelFm.ex_custPassword.isPlaintext = !modelFm.ex_custPassword
                    .isPlaintext
                "
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="网站名称：" prop="custName">
            <el-input v-model="modelFm.custName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="地区：" prop="ex_addressValues">
            <select-address
              v-if="refreshFlag"
              v-model="modelFm.ex_addressValues"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="办公地址：" prop="address">
            <el-input v-model="modelFm.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="主办单位：" prop="director">
            <el-input v-model="modelFm.director"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="首页URL：" prop="url">
            <el-input v-model="modelFm.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="跳转URL：" prop="jumpUrl">
            <el-input v-model="modelFm.jumpUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="机构：" prop="ex_organValues">
            <select-organ-level
              v-if="refreshFlag"
              v-model="modelFm.ex_organValues"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="行业：">
            <select-trade
              v-if="refreshFlag"
              v-model="modelFm.ex_tradeValues"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">状态信息</h2>
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item
            class="form-item--is-flag"
            label="是否渲染："
            prop="isFlag"
          >
            <el-radio-group v-model="modelFm.isFlag">
              <el-radio-button class="el-radio-button--plain" label="1"
                >是</el-radio-button
              >
              <el-radio-button class="el-radio-button--plain" label="0"
                >否</el-radio-button
              >
            </el-radio-group>
            <el-link :underline="false"> 渲染判断 </el-link>
            <el-tooltip
              effect="dark"
              content="源码标签中无文章标题等有效信息时，是需要把状态切换成渲染哦！"
              placement="top"
            >
              <i class="iconfont icontubiaozhizuomoban12"></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item
            class="el-form-item--ex-border-radio"
            label="状态："
            prop="status"
          >
            <el-radio
              v-model="modelFm.status"
              label="1"
              border
              @change="onStatusChange"
              >启用</el-radio
            >
            <el-radio
              v-model="modelFm.status"
              label="0"
              border
              @change="onStatusChange"
              >禁用</el-radio
            >
          </el-form-item>
        </el-col>
        <el-col v-if="modelFm.ex_monitorRateShow" :xs="24" :sm="24" :md="12">
          <el-form-item label="监测频率：">
            <el-select v-model="modelFm.monitorRate" placeholder="请选择">
              <el-option
                v-for="item in onFilterDic(dicList.monitor_rate)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div
        class="part-con"
        v-for="(item, index) in modelFm.customParentRelationList"
        :key="item.key"
      >
        <h2 class="flex justify-between align-center kp-dialog-title">
          挂靠单位{{ index + 1 }}
          <div class="kp-dialog-title_action">
            <button
              v-if="index === 0"
              class="kp-add-remove kp-add-remove--small"
              @click="onAddAffiliatedUnit"
            >
              <i class="el-icon-plus"></i>
            </button>
            <button
              v-else
              class="kp-add-remove kp-add-remove--small kp-add-remove--plain kp-add-remove--danger kp-add-remove--circle"
              @click="onDelAffiliatedUnit(index)"
            >
              <i class="el-icon-minus"></i>
            </button>
          </div>
        </h2>
        <div class="one-form two-form">
          <el-row :gutter="10" class="row">
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                :prop="'customParentRelationList.' + index + '.parentId'"
                label="挂靠组织单位："
                :rules="{
                  required: true,
                  message: '挂靠组织不能为空',
                  trigger: 'change'
                }"
              >
                <select-organization-tree
                  v-model="item.parentId"
                  check-strictly
                  placeholder="请选择"
                  @change="onAffiliatedUnitChange($event, item)"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                :prop="'customParentRelationList.' + index + '.layerType'"
                :rules="{
                  required: true,
                  message: '请选择挂靠类型',
                  trigger: 'change'
                }"
                label="挂靠类型："
              >
                <el-select v-model="item.layerType" placeholder="请选择">
                  <el-option
                    v-for="item in onFilterDic(dicList.affiliated_unit)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
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
                <el-select v-model="item.linkmanPost" placeholder="请选择">
                  <el-option
                    v-for="item in onFilterDic(dicList.cust_linkman_post)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
import useGetDicList from '@/hook/useGetDicList';

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
    // 数据标识
    id: {
      type: Number,
      required: true,
      default: null
    }
  },
  data() {
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
      refreshFlag: true, // 刷新标识 针对表单组件需刷新后回显问题
      pattern, // 正则配置
      loading: false,
      modelFm: {},
      rules: {
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
        address: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        director: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入', trigger: 'blur' }],
        // jumpUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        ex_organValues: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        organLevelId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isFlag: [{ required: true, message: '请选择', trigger: 'change' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }],
        monitorRate: [{ required: true, message: '请选择', trigger: 'change' }],
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
  setup() {
    const { dicList } = useGetDicList(
      ['site_type', 'monitor_rate', 'affiliated_unit', 'cust_linkman_post'],
      false
    );
    const onFilterDic = (options = []) => {
      return options.filter(ele => ele.value);
    };
    return { dicList, onFilterDic };
  },
  methods: {
    // 获取当前编辑实体
    async getModel() {
      this.loading = true;
      let { code, data } = await custAccountApi.get(this.id);
      this.loading = false;
      if (code === 0) {
        let model = data;
        let exObj = {
          // 扩展密码
          ex_custPassword: {
            isPlaintext: false // 是否明文
          },
          ex_monitorRateShow: model.status == '1' // 监测频率是否显示
        };
        // 地区扩展处理
        exObj.ex_addressValues = [];
        if (model.provDistId || model.cityDistId || model.countyDistId) {
          let values = [
            model.provDistId,
            model.cityDistId,
            model.countyDistId
          ].filter(item => item);
          values = values.map(item => parseInt(item));
          exObj.ex_addressValues = values;
        }
        // 机构类型扩展处理
        exObj.ex_organValues = [];
        if (model.organPid) {
          let values = [model.organPid, model.organSid, model.organGid].filter(
            item => item
          );
          values = values.map(item => parseInt(item));
          exObj.ex_organValues = values;
        }
        // 行业扩展处理
        exObj.ex_tradeValues = [];
        if (model.tradePid) {
          let values = [model.tradePid, model.tradeSid, model.tradeGid].filter(
            item => item
          );
          values = values.map(item => parseInt(item));
          exObj.ex_tradeValues = values;
        }

        this.modelFm = Object.assign({}, model, exObj);
        this.refreshFlag = false;
        this.$nextTick(() => {
          this.refreshFlag = true;
        });
      }
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
      let { code } = await custAccountApi.update(data);
      this.loading = false;
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.$emit('on-success');
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
    // 状态改变回调
    onStatusChange(val) {
      let show = val === '1';
      this.modelFm.ex_monitorRateShow = show;
    },
    // 添加挂靠单位
    onAddAffiliatedUnit() {
      let model = {
        layerType: '',
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
    }
  },
  created() {
    this.getModel();
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
.form-item--is-flag {
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
    .el-radio-group {
      flex: 0 0 auto;
    }
    .el-link {
      margin-left: 12px;
      margin-right: 4px;
      color: var(--primary);
      &:hover {
        text-decoration: none;
      }
    }
    .iconfont {
      cursor: pointer;
      &:hover {
        color: var(--primary);
      }
    }
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
.btn-add-concact + div {
  margin-top: 16px;
}
/deep/ .el-button.btn-dashed {
  border-style: dashed;
  padding: 7px 13px;
  i {
    font-size: 12px;
    margin-right: 3px;
  }
}
// 密码显隐
.suffix-password {
  cursor: pointer;
  &.active {
    color: #606266;
  }
}
</style>
