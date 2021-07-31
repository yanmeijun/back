<template>
  <div v-loading="loading">
    <el-form class="form" :model="modelFm" ref="modelFm" label-width="110px">
      <div class="concat-user-list">
        <h2 class="kp-dialog-title">树结构排序</h2>
        <el-row :gutter="10" class="row">
          <!-- eslint-disable -->
          <el-col v-if="parent" :xs="24" :sm="24" :md="12">
            <el-form-item label="父级节点：">
              {{ parent.parentCode }}
            </el-form-item>
          </el-col>
          <!-- eslint-enable -->
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="节点编号：">
              {{ modelFm.custCode }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="排序：" prop="sort">
              {{ modelFm.sort }}
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
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="密码：">
              <div class="form-item_password">
                <span class="form-item_password_text">
                  {{
                    modelFm.ex_custPasswordIsPlain
                      ? modelFm.custPassword
                      : '*'.repeat(6)
                  }}
                </span>
                <i
                  class="form-item_password_toggle iconfont icontubiaozhizuomoban37"
                  :class="{ active: modelFm.ex_custPasswordIsPlain }"
                  @click="
                    modelFm.ex_custPasswordIsPlain = !modelFm.ex_custPasswordIsPlain
                  "
                ></i>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="名称：">
              {{ modelFm.custName }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="地区：">
              {{ modelFm.ex_addressLabels }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="行业：">
              {{ modelFm.ex_tradeLabels }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="状态：">
              <el-switch
                class="el-switch--label-inside"
                v-model="modelFm.status"
                :width="60"
                active-value="1"
                active-text="启用"
                inactive-value="0"
                inactive-text="禁用"
                disabled
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="机构：">
              {{ modelFm.ex_organLabels }}
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="concat-user-list">
        <div v-for="(item, index) in modelFm.contactInfoList" :key="index">
          <h2 class="kp-dialog-title">
            <span>联系人信息{{ index + 1 }}</span>
          </h2>
          <el-row :gutter="10" class="row">
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="姓名：">
                {{ item.linkmanName }}
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="职务：">
                {{ item.linkmanPostName }}
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="手机号：">
                {{ item.phone }}
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="邮箱：">
                {{ item.email }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as custAccountApi from '@/api/cust-account';
export default {
  props: {
    // 数据标识
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isEdit: false, // 是否编辑
      loading: false,
      modelFm: {}
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

        let exObj = {
          // 扩展密码
          ex_custPasswordIsPlain: false // 是否明文
        };
        // 地区扩展处理
        exObj.ex_addressLabels = [
          model.provDistName,
          model.cityDistName,
          model.countyDistName
        ]
          .filter(item => item)
          .join('/');
        // 机构类型扩展处理
        exObj.ex_organLabels = [
          model.organPname,
          model.organSname,
          model.organGname
        ]
          .filter(item => item)
          .join('/');
        // 行业扩展处理
        exObj.ex_tradeLabels = [
          model.tradePname,
          model.tradeSname,
          model.tradeGname
        ]
          .filter(item => item)
          .join('/');
        this.modelFm = Object.assign({}, model, exObj);
      }
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
  // 密码显隐
  .form-item_password {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // &_text {}
    &_toggle {
      color: #c0c4cc;
      cursor: pointer;
      &.active {
        color: #606266;
      }
    }
  }
}
</style>
