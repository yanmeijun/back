<template>
  <div class="form-main" v-loading="loading">
    <el-form :model="modelFm" ref="modelFm" :rules="rules" label-width="110px">
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="栏目名称：" prop="channelName">
            <el-input
              v-model="modelFm.channelName"
              clearable
              placeholder="请输入栏目名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="网站标识码：" prop="siteCode">
            <!-- <el-input v-model="modelFm.colCode"></el-input> -->
            <select-website
              class="input-with-tree"
              :value.sync="modelFm.siteCode"
              v-model="modelFm.siteCode"
            >
            </select-website>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="栏目分类：" prop="classification">
            <select-column v-model="modelFm.classification" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="栏目地址：" prop="channelAddress">
            <el-input
              v-model="modelFm.channelAddress"
              clearable
              placeholder="请输入栏目地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" v-if="editData && editData.id">
          <el-form-item label="能否连通：" prop="connectResultMeaning">
            <el-input
              v-model="modelFm.connectResultMeaning"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="监测状态：" prop="monitoringStatus">
            <el-select v-model="modelFm.monitoringStatus" placeholder="请选择">
              <el-option
                v-for="item in onFilterDic(dicList.monitoring_status)"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="连通性监测频率" prop="monitoringFrequency">
            <el-select
              v-model="modelFm.monitoringFrequency"
              placeholder="请选择"
            >
              <el-option
                v-for="item in onFilterDic(dicList.monitoring_frequency)"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="更新监测频率" prop="updateMonitoringFrequency">
            <el-select
              v-model="modelFm.updateMonitoringFrequency"
              placeholder="请选择"
            >
              <el-option
                v-for="item in onFilterDic(dicList.update_monitoring_frequency)"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" v-if="editData && editData.id">
          <el-form-item label="是否渲染：">
            <el-input v-model="modelFm.isRenderMeaning" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="更新期限" prop="updateTimeLimit">
            <el-select v-model="modelFm.updateTimeLimit" placeholder="请选择">
              <el-option
                v-for="item in onFilterDic(dicList.update_time_limit)"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { pattern } from '@/util/validate';
import * as columnApi from '@/api/website/column-monitor/column';
import SelectWebsite from '@/components/business-components/website/column-monitor/select-website';
import SelectColumn from '@/components/base/select-column'; // 下拉选择-分类
import useGetDicList from '@/hook/useGetDicList';

import {
  checkSiteCodeApi,
  checkChannelAddressApi
} from '@/api/website/column-monitor/column-monitor';
import { isURL } from '@/util/validate';
export default {
  name: 'add-or-edit-form',
  components: { SelectWebsite, SelectColumn },
  props: {
    // 数据标识
    editData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    let validatecolCode = async (rule, value, callback) => {
      if (!this.modelFm.siteCode) {
        return callback(new Error('网站标识码不能为空'));
      }
      if (!/^[A-Za-z0-9]{10}$/.test(value)) {
        return callback(new Error('请输入10位字母/数字/字母数字组合'));
      }
      // 中文网站
      // if (!value.startsWith('N')) {
      //   return callback(new Error('中文网站必须N开头'));
      // } else if (!value.startsWith('E')) {
      //   // 英文网站
      //   return callback(new Error('英文网站必须E开头'));
      // }

      // 手动输入进行是否存在验证
      if (this.modelFm.siteCode) {
        // 验证code是否存在
        let { data } = await checkSiteCodeApi({
          siteCode: this.modelFm.siteCode
        });
        if (!data) {
          return callback(new Error('系统中不存在相同标识码'));
        }
      }
      callback();
    };
    let validateChannelAddress = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('栏目地址不能为空'));
      }
      //pattern.url
      if (!isURL(value)) {
        return callback(new Error('url格式不正确'));
      }
      if (this.editData && this.editData.id) {
        if (this.oldChannelAddress) {
          if (this.oldChannelAddress !== value) {
            let { data } = await checkChannelAddressApi({ url: value });
            if (data) {
              return callback(new Error('系统中已经存在相同栏目地址'));
            }
          }
        }
      } else {
        if (value) {
          let { data } = await checkChannelAddressApi({ url: value });
          if (data) {
            return callback(new Error('系统中已经存在相同栏目地址'));
          }
        }
      }
      callback();
    };
    let validateClassification = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('栏目分类不能为空'));
      }
      if (value.length === 1) {
        return callback(new Error('栏目第二分类不能为空'));
      }
      callback();
    };
    return {
      pattern, // 正则配置
      loading: false,
      modelFm: {
        channelName: '',
        siteCode: '', // 网站标识码
        channelAddress: '', // 办公地址
        classification: [],
        isRender: '0', // 是否渲染
        isRenderMeaning: '',
        monitoringStatus: '1', // 状态
        monitoringFrequency: '2', //监测频率
        updateMonitoringFrequency: '2',
        updateTimeLimit: '',
        connectResultMeaning: ''
      },
      rules: {
        channelName: [
          { required: true, message: '栏目名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur'
          }
        ],
        siteCode: [
          { required: true, message: '网站标识码不能为空', trigger: 'blur' },
          {
            validator: validatecolCode,
            trigger: 'blur'
          }
        ],
        channelAddress: [
          { required: true, message: '栏目地址不能为空', trigger: 'blur' },
          {
            validator: validateChannelAddress,
            trigger: 'blur'
          }
          // { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        classification: [
          { required: true, message: '栏目分类不能为空', trigger: 'change' },
          {
            validator: validateClassification,
            trigger: 'blur'
          }
        ],
        //isRender: [{ required: true, message: '请选择', trigger: 'change' }],
        monitoringStatus: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        monitoringFrequency: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        updateMonitoringFrequency: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        updateTimeLimit: [
          { required: true, message: '更新期限不能为空', trigger: 'change' }
        ]
      },
      oldChannelAddress: ''
    };
  },
  setup() {
    const onFilterDic = (options = []) => {
      return options.filter(ele => ele.value);
    };
    const { dicList } = useGetDicList(
      [
        'monitoring_status',
        'monitoring_frequency',
        'update_monitoring_frequency',
        'update_time_limit'
      ],
      false
    );
    return { dicList, onFilterDic };
  },
  methods: {
    // 提交数据
    async doSubmit() {
      let data = JSON.parse(JSON.stringify(this.modelFm));
      //update 修改接口
      let [
        firstClassificationId = '',
        secondaryClassificationId = ''
      ] = data.classification;
      data.firstClassificationId = firstClassificationId;
      data.secondaryClassificationId = secondaryClassificationId;
      delete data.classification;
      if (!secondaryClassificationId) {
        this.$message({
          message: '栏目第二分类不能为空',
          type: 'warning'
        });
        return;
      }
      this.loading = true;
      let editOrAddApi = '';
      if (this.editData.id) {
        editOrAddApi = 'update';
      } else {
        editOrAddApi = 'insertRetByDto';
      }
      let { code } = await columnApi[editOrAddApi](data);
      this.loading = false;
      if (code === 0) {
        this.$message.success({
          message: this.editData.id ? '编辑成功' : '添加成功'
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
    // 验证
    validate(fields) {
      // 触发验证
      this.$nextTick(() => {
        this.$refs['modelFm'].validateField(fields);
      });
    },
    getEditData() {
      Object.assign(this.modelFm, this.editData);
      this.modelFm.classification.push(this.modelFm.firstClassificationId);
      this.modelFm.classification.push(this.modelFm.secondaryClassificationId);
      this.modelFm.monitoringStatus = this.modelFm.monitoringStatus.toString();
      this.modelFm.monitoringFrequency = this.modelFm.monitoringFrequency.toString();
      this.modelFm.updateMonitoringFrequency = this.modelFm.updateMonitoringFrequency.toString();
      this.modelFm.updateTimeLimit = this.modelFm.updateTimeLimit.toString();
      this.oldChannelAddress = this.modelFm.oldChannelAddress;
    }
  },
  created() {
    if (this.editData && this.editData.id) {
      this.getEditData();
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dialog {
  ::v-deep {
    .el-dialog {
      width: 55%;
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
  .form-item--border-radio {
    /deep/ .el-form-item__content {
      .el-radio {
        margin: 0;
        & + .el-radio {
          margin-left: 4px;
        }
      }
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
}
.btn-add-concact + div {
  margin-top: 16px;
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
</style>
