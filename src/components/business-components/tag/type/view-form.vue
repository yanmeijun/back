<template>
  <div class="form-main" v-loading="loading">
    <el-form v-if="model" ref="form" :model="model" label-width="80px">
      <h2 class="kp-dialog-title">树结构排序</h2>
      <el-row :gutter="10" class="row">
        <el-col v-if="model.parent" :xs="24" :sm="12" :md="12">
          <el-form-item label="父级节点：">
            {{ model.parent.code }}
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="节点编号：">
            {{ model.code }}
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="排序：" prop="sort">
            {{ model.sort }}
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="row">
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item :label="`${mapping.type[type]}名称：`" prop="name">
            {{ model.name }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <el-form-item label="编号：" prop="code">
            {{ model.code }}
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
    /**
     * 实体标识
     */
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      mapping: {
        ...mapping,
        // api映射
        api: {
          edit: {
            region: commonApi.districtEdit,
            org: commonApi.organEdit,
            trade: commonApi.tradeEdit
          },
          get: {
            region: commonApi.districtGet,
            org: commonApi.organGet,
            trade: commonApi.tradeGet
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
      model: null
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && this.getModel();
      }
    }
  },
  methods: {
    // 获取实体
    async getModel() {
      this.loading = true;
      let { code, data } = await this.mapping.api.get[this.type](this.id);
      this.loading = false;
      if (code === 0) {
        let keyMap = this.mapping.key[this.type];
        let model = {
          id: data.id,
          code: data[keyMap.code],
          name: data[keyMap.name],
          sort: data[keyMap.sort]
        };
        if (data.parentId) {
          model.parent = {
            id: data.parentId,
            code: data.parentCode
          };
        }
        this.model = model;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form-main {
  min-height: 230px;
  .row {
    padding: 0 30px;
  }
}
</style>
