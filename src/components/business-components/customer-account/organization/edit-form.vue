<template>
  <div v-loading="loading">
    <el-form
      class="form"
      :model="modelFm"
      ref="modelFm"
      :rules="rules"
      label-width="110px"
    >
      <div class="concat-user-list">
        <h2 class="kp-dialog-title">树结构排序</h2>
        <el-row :gutter="10" class="row">
          <el-col v-if="parent" :xs="24" :sm="24" :md="12">
            <el-form-item label="父级节点：">
              {{ parent.parentCode }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="节点编号：">
              {{ modelFm.custCode }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="排序：" prop="sort">
              <el-input-number
                v-model="modelFm.sort"
                :min="0"
                :controls="false"
                step-strictly
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <h2 class="kp-dialog-title">基础信息</h2>
        <el-row :gutter="10" class="row">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="编码/用户名：">
              {{ modelFm.custCode }}
            </el-form-item>
          </el-col>
          <el-col v-if="modelFm.ex_custPassword" :xs="24" :sm="24" :md="12">
            <el-form-item label="密码：" prop="custPassword">
              <el-input
                v-model="modelFm.custPassword"
                :type="
                  modelFm.ex_custPassword.isPlaintext ? 'text' : 'password'
                "
              >
                <i
                  slot="suffix"
                  class="suffix-password iconfont icontubiaozhizuomoban37"
                  :class="{ active: modelFm.ex_custPassword.isPlaintext }"
                  @click="
                    modelFm.ex_custPassword.isPlaintext = !modelFm
                      .ex_custPassword.isPlaintext
                  "
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="名称：" prop="custName">
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
            <el-form-item label="行业：">
              <select-trade
                v-if="refreshFlag"
                v-model="modelFm.ex_tradeValues"
                clearable
              />
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
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="机构：" prop="ex_organValues">
              <select-organ-level
                v-if="refreshFlag"
                v-model="modelFm.ex_organValues"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
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
export default {
  components: {
    SelectAddress,
    SelectOrganLevel,
    SelectTrade
  },
  props: {
    // 数据标识
    id: {
      type: Number,
      default: 0
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
      isEdit: false, // 是否编辑
      pattern, // 正则配置
      loading: false,
      modelFm: {},
      rules: {
        sort: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        custCode: [{ required: true, message: '请输入', trigger: 'blur' }],
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
        ex_organValues: [
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
  computed: {
    parent() {
      let hasParent =
        this.modelFm.customParentRelationList &&
        this.modelFm.customParentRelationList.length &&
        this.modelFm.customParentRelationList[0].parentId;
      return hasParent ? this.modelFm.customParentRelationList[0] : null;
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getModel();
        }
      }
    }
  },
  methods: {
    // 获取当前编辑实体
    async getModel() {
      this.loading = true;
      let { code, data } = await custAccountApi.get(this.id);
      this.loading = false;
      if (code === 0) {
        let model = data;
        // 补全联系人信息
        if (!model.contactInfoList || !model.contactInfoList.length) {
          // 联系人信息集合
          model.contactInfoList = [
            // {
            //   linkmanName: '', // 姓名
            //   linkmanPost: '', // 职务
            //   phone: '', // 手机
            //   email: '' // email
            // }
          ];
        }
        let exObj = {
          // 扩展密码
          ex_custPassword: {
            isPlaintext: false // 是否明文
          }
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
    // 获取客户自动编码
    async getCustomerAutoCode() {
      this.loading = true;
      let { code, data } = await custAccountApi.getCustomAutoCode({
        type: 0 // 0:组织单位 1:填报单位
      });
      this.loading = false;
      if (code !== 0) {
        this.$message.error({
          message: '获取自动编码失败'
        });
        return;
      }
      this.modelFm.custCode = data;
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
        this.self_visible = false;
        this.$emit('on-success');
      }
    },
    // 是否自动生成标识码改变回调
    onIsCodeAutoChange(val) {
      let requiredRule = this.rules.custCode.find(item =>
        item.hasOwnProperty('required')
      );
      requiredRule.required = !val;
    },
    // 编辑
    onEdit() {
      this.isEdit = true;
    },
    // 编辑取消
    onEditCancle() {
      this.isEdit = false;
      this.$refs.modelFm.resetFields();
      this.getModel();
    },
    // 保存
    submit() {
      this.$refs['modelFm'].validate(async valid => {
        if (!valid) {
          return;
        }
        this.doSubmit();
      });
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
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.form {
  .row {
    padding: 0 30px;
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
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
