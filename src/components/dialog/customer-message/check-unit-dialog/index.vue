<template>
  <el-dialog
    class="organizational-media-dialog"
    :title="title"
    :visible.sync="isOpen"
    :modal="modal"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="tree-main">
      <el-row :gutter="40">
        <el-col :span="12" class="left-col tree-col">
          <el-input
            placeholder="组织单位名称/编码"
            v-model="filterText2"
            class="search-input"
          >
            <i
              slot="suffix"
              class="iconfont el-input__icon icontubiaozhizuomoban21"
            ></i>
          </el-input>
          <TipAlert>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAllUnits"
              @change="handleCheckAllUnitsChange"
              >全选</el-checkbox
            >
          </TipAlert>
          <ul class="main-base">
            <el-checkbox-group
              v-model="checkedUnits"
              @change="handleCheckedUnitsChange"
            >
              <li class="mid-item" v-for="unit in filter2" :key="unit.custCode">
                <el-checkbox
                  :label="unit.custCode"
                  :disabled="unit.echoType == 3"
                  >{{ unit.custName }} {{ unit.custCode }}</el-checkbox
                >
              </li>
            </el-checkbox-group>
          </ul>
        </el-col>
        <el-col :span="12" class="tree-col">
          <TipAlert>
            <div class="flex align-center justify-between right-tip">
              <span>已选{{ checkedUnits.length }}项</span>
              <span
                class="clear-btn"
                :class="{ 'no-unit': !checkedUnits.length }"
                disabled
                @click="clearAll"
                >全部清空</span
              >
            </div>
          </TipAlert>
          <ul class="main-base main-base2">
            <li
              class="flex align-center justify-between right-item"
              v-for="(ele, i) in checkedList"
              :key="i"
            >
              <p class="word-ellipsis-1">{{ ele.custName }}</p>
              <i class="el-icon-close" @click="delUnit(ele)"></i>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="result" :disabled="isSubmit">{{
          subTxt
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getFillUnitList } from '@/api/cust-message';
import TipAlert from '@/components/base/tip-alert/index';
export default {
  name: 'organizational-media-dialog',
  components: {
    TipAlert
  },
  data() {
    return {
      isSubmit: false,
      subTxt: '确 定',
      filterText2: '',
      checkAllUnits: false,
      checkedUnits: [], // 只包含custCode的数组
      unitsList: []
    };
  },
  props: {
    modal: Boolean,
    title: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    custId: {
      type: String | Number,
      require: true
    },
    prodId: {
      type: Number,
      require: true
    },
    strategyId: {
      type: Number | String,
      default: ''
    },
    units: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 全部的对象
    checkedList() {
      return this.unitsList.filter(ele =>
        this.checkedUnits.includes(ele.custCode)
      );
    },
    isIndeterminate() {
      const len = this.checkedUnits.length;
      return len > 0 && len < this.unitsList.length;
    },
    filter2() {
      if (!this.filterText2) return this.unitsList;
      return this.unitsList.filter(ele => {
        const { custCode = '', custName = '' } = ele;
        return (
          custName.indexOf(this.filterText2) !== -1 ||
          custCode.indexOf(this.filterText2) !== -1
        );
      });
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(obj) {
      // 根据custID获取客户列表
      let paramsObj = {
        custId: this.custId,
        // 1：产品预警，2：系统报告
        strategyType: 1,
        // 1：网站监测，2：新媒体监测
        prodId: this.prodId
      };
      this.strategyId && (paramsObj.strategyId = this.strategyId);
      getFillUnitList(paramsObj).then(res => {
        this.unitsList = res.data;
      });
      if (this.units.length > 0) {
        this.units.map(item => {
          this.checkedUnits.push(item.custCode);
        });
      }
    },
    result() {
      this.$emit('result', this.checkedList);
      this.closeDialog();
    },
    handleCheckAllUnitsChange(val) {
      let allIds = this.unitsList.map(ele => ele.custCode);
      this.checkedUnits = val ? allIds : [];
    },
    handleCheckedUnitsChange(value) {
      let checkedCount = value.length;
      this.checkAllUnits = checkedCount === this.unitsList.length;
    },
    delUnit(value) {
      this.checkAllUnits = false;
      this.checkedUnits = this.checkedUnits.filter(
        item => item !== value.custCode
      );
    },
    clearAll() {
      if (!this.checkedUnits.length) {
        return;
      }
      this.checkAllUnits = false;
      this.checkedUnits = [];
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.organizational-media-dialog {
  .search-input {
    margin-bottom: 20px;
  }
  .tree-col {
    padding: 10px 0;
  }
  .left-col {
    border-right: 1px solid #e8e8e8;
  }
  .main-base {
    height: 50vh;
    overflow-y: auto;
    &.main-base2 {
      height: 55vh;
    }
  }
  .tree-list {
    li {
      padding: 0 0 8px 0;
    }
  }
  .mid-item {
    &:first-child {
      border-top: 1px solid #f0f0f0;
    }
    padding: 5px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .right-tip {
    flex: 1;
    .clear-btn {
      cursor: pointer;
      color: var(--primary);
      &.no-unit {
        color: #9999;
      }
    }
  }
  .right-item {
    padding: 5px 0;
    &:hover {
      background: #f3f3f3;
      i {
        cursor: pointer;
        opacity: 1;
      }
    }
    p {
      flex: 1;
    }
    i {
      flex: 0 0 20px;
      opacity: 0;
    }
  }
  ::v-deep {
    .el-dialog {
      width: 890px;
    }
    .el-dialog__body {
      padding: 0 30px;
    }
    .el-dialog__footer {
      padding-top: 0;
    }
  }
}
</style>
