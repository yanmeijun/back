<template>
  <div class="form-main" v-loading="loading">
    <el-form ref="form" :model="model" :rules="rules" label-width="80px">
      <h2 class="kp-dialog-title">树结构排序</h2>
      <el-row :gutter="10" class="row">
        <el-col v-if="parent" :xs="24" :sm="12" :md="12">
          <el-form-item label="父级节点：">
            <template>{{ parent.code }}</template>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="节点编号：">
            <template>{{ model.code }}</template>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="排序：" prop="sort">
            <el-input-number
              v-model="model.sort"
              :min="0"
              :controls="false"
              step-strictly
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item :label="`${mapping.type[type]}名称：`" prop="name">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="编号：" prop="code">
            <el-input v-model="model.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapping } from '@/views/tag/config';
import * as commonApi from '@/api/common';
export default {
  components: {},
  props: {
    /**
     * 类别
     * region: 地区
     * org: 机构
     * trade: 行业
     */
    type: {
      type: String,
      require: true,
      validator(value) {
        return ['region', 'org', 'trade'].includes(value);
      }
    },
    // 父级
    parent: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      mapping: {
        ...mapping,
        // api映射
        api: {
          add: {
            region: commonApi.districtAdd,
            org: commonApi.organAdd,
            trade: commonApi.tradeAdd
          }
        },
        // 字段映射
        key: {
          region: {
            code: 'distCode',
            name: 'distName',
            sort: 'distSort'
          },
          org: {
            code: 'organCode',
            name: 'organName',
            sort: 'sort'
          },
          trade: {
            code: 'tradeCode',
            name: 'tradeName',
            sort: 'tradeSort'
          }
        }
      },
      loading: false,
      model: {
        id: '',
        code: '',
        name: '',
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 转换成提交实体
    getSubmitModel() {
      let parent = this.parent;
      let model = {
        parentId: parent ? parent.id : 0,
        parentCode: parent ? parent.code : ''
      };

      let keyMap = this.mapping.key[this.type];
      for (let key in keyMap) {
        model[keyMap[key]] = this.model[key];
      }

      return model;
    },
    // 执行添加
    async doAdd() {
      this.loading = true;
      let model = this.getSubmitModel();
      let { code } = await this.mapping.api.add[this.type](model);
      this.loading = false;
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.$emit('on-success');
      }
    },
    // 提交方法
    submit() {
      this.$refs['form'].validate(async valid => {
        if (!valid) {
          return;
        }
        this.doAdd();
      });
    },
    // 清空验证
    clearValidate() {
      this.$refs['form'].clearValidate();
    }
  }
};
</script>
<style lang="scss" scoped>
.form-main {
  .row {
    padding: 0 30px;
  }
  &--view {
    /deep/
      .el-form-item.is-required:not(.is-no-asterisk)
      > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk)
      .el-form-item__label-wrap
      > .el-form-item__label:before {
      display: none;
    }
  }
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
