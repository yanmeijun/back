<!--调整挂靠组织单位-->
<template>
  <el-dialog
    class="dialog"
    title="调整挂靠组织单位"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <div class="form-main" v-loading="loading">
      <el-form :model="modelFm" ref="modelFm" label-width="110px">
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
              <el-col :xs="24">
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
                    placeholder="请选择挂靠单位"
                    @change="onAffiliatedUnitChange($event, item)"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24">
                <el-form-item
                  :prop="'customParentRelationList.' + index + '.layerType'"
                  :rules="{
                    required: true,
                    message: '请选择挂靠类型',
                    trigger: 'change'
                  }"
                  label="挂靠类型："
                >
                  <select-dict
                    v-model="item.layerType"
                    type="affiliated_unit"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { pattern } from '@/util/validate';
import * as custAccountApi from '@/api/cust-account';
import SelectOrganizationTree from '@/components/base/select-organization-tree'; // 下拉选择-组织树
export default {
  components: {
    SelectOrganizationTree
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 选中行数据
    selection: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      self_visible: this.visible,
      pattern, // 正则配置
      loading: false,
      modelFm: {
        // 填报单位id集合
        custIdList: [],
        // 挂靠单位集合
        customParentRelationList: [
          {
            layerType: '',
            parentId: '', // 挂靠组织单位id
            parentCode: '' // 挂靠组织单位标识码
          }
        ]
      }
    };
  },
  watch: {
    visible(val) {
      this.self_visible = val;
    },
    self_visible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    // 提交数据
    async doSubmit() {
      // 组装编辑行id集合
      this.modelFm.custIdList = this.selection.map(item => item.id);
      this.loading = true;
      let { code } = await custAccountApi.changeAffiliatedUnit(this.modelFm);
      this.loading = false;
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.self_visible = false;
        this.$emit('on-success');
      }
    },
    onSubmit() {
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
        layerType: '',
        parentId: '',
        parentCode: ''
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
    },
    onClose() {
      this.self_visible = false;
    },
    onClosed() {
      this.reset();
    },
    // 重置
    reset() {
      // 重置数据
      this.modelFm.custIdList = [];
      this.modelFm.customParentRelationList = [
        {
          layerType: '',
          parentId: '', // 挂靠组织单位id
          parentCode: '' // 挂靠组织单位标识码
        }
      ];
      // 重置验证
      this.$nextTick(() => {
        this.$refs['modelFm'].clearValidate();
      });
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dialog {
  ::v-deep {
    .el-dialog {
      width: 465px;
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
</style>
