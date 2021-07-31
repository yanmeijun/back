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
        <el-col :span="8" class="left-col tree-col">
          <el-input
            placeholder="组织单位名称/编码"
            v-model="filterText"
            class="search-input"
          >
            <i
              slot="suffix"
              class="iconfont el-input__icon icontubiaozhizuomoban21"
            ></i>
          </el-input>
          <ul class="main-base tree-list">
            <el-checkbox-group
              v-model="treeCheckList"
              @change="handleCheckedTreeChange"
            >
              <li v-for="(item, i) in filter1" :key="item.custCode + i">
                <el-checkbox :label="item.custCode"
                  >{{ item.custName }} {{ item.custCode }}</el-checkbox
                >
              </li>
            </el-checkbox-group>
          </ul>
        </el-col>
        <el-col :span="8" class="left-col tree-col">
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
                <el-checkbox :label="unit.custCode" :disabled="unit.disabled"
                  >{{ unit.custName }} {{ unit.custCode }}</el-checkbox
                >
              </li>
            </el-checkbox-group>
          </ul>
        </el-col>
        <el-col :span="8" class="tree-col">
          <!-- <el-input
            placeholder="组织单位名称/编码"
            v-model="filterText3"
            class="search-input"
          >
            <i
              slot="suffix"
              class="iconfont el-input__icon icontubiaozhizuomoban21"
            ></i>
          </el-input> -->
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
              :key="ele.custCode + Date.now() + i + ''"
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
        <!-- <el-button @click="checkedDefault">默认全部</el-button> -->
        <el-button type="primary" @click="result" :disabled="isSubmit">{{
          subTxt
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getCustomInfoByOrg,
  postInsertTaskCustomRelation
} from '@/api/new-media/common';
import TipAlert from '@/components/base/tip-alert/index';
import { getStore } from '@/util/store';
export default {
  name: 'organizational-media-dialog',
  components: {
    TipAlert
  },
  data() {
    return {
      isSubmit: false,
      subTxt: '确 定',
      filterText: '',
      filterText2: '',
      filterText3: '',
      treeCheckList: [],
      checkAllUnits: true,
      checkedUnits: [],
      unitsList: [],
      tree: [],
      type: [],
      custIdList: [],
      custIdPreList: [],
      hasOther: []
      //   {
      //     custName: '东城区发改委门户网站 1011028477',
      //     id: 6
      //   },
      //   {
      //     custName: '东城区发改委门户网 1011028477',
      //     id: 7
      //   }
      // ]
    };
  },
  props: {
    modal: Boolean,
    isTask: Boolean,
    title: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String | Number,
      default: ''
    },
    taskCode: {
      type: String | Number,
      default: ''
    },
    units: {
      type: Object,
      default: () => {}
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    checkedList() {
      return this.unitsList.filter(ele =>
        this.checkedUnits.includes(ele.custCode)
      );
    },
    isIndeterminate() {
      const len = this.checkedUnits.length;
      return len > 0 && len < this.unitsList.length;
    },
    filter1() {
      if (!this.filterText) return this.tree;
      return this.tree.filter(ele => {
        const { custCode = '', custName = '' } = ele;
        return (
          custName.indexOf(this.filterText) !== -1 ||
          custCode.indexOf(this.filterText) !== -1
        );
      });
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
    },
    filter3() {
      if (!this.filterText) return this.tree;
      return this.tree.filter(ele => {
        const { custCode = '', custName = '' } = ele;
        return (
          custName.indexOf(this.filterText) !== -1 ||
          custCode.indexOf(this.filterText) !== -1
        );
      });
    }
  },
  methods: {
    init(obj) {
      if (this.validatenull(obj)) return;
      const { units, type } = obj;
      this.tree = units.tree;
      // console.log(this.tree);
      this.treeCheckList = units.tree.map(ele => ele.custCode);
      this.type = type;
      this.custIdList = units[type].map(ele => ele + '');
      this.custIdPreList = units[type].map(ele => ele + '');
      this.hasOther = this.type === 'wzIds' ? units['bsIds'] : units['wzIds'];
      this.getCustomer();
    },
    async result() {
      if (this.checkedList.length === 0 && this.hasOther.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择网站/新媒体填报单位'
        });
        return;
      }
      this.isSubmit = true;
      this.subTxt = '提交中...';
      let custType = this.type === 'wzIds' ? 1 : 2;
      let custIdList = [];
      // 组织 - ids
      // let checkedTreeNodes = this.tree.filter(ele => {
      //   return this.treeCheckList.includes(ele.custCode);
      // });
      // let treeList = checkedTreeNodes.map(ele => {
      //   custIdList.push(ele.id);
      //   return {
      //     custCode: ele.custCode,
      //     custId: ele.id,
      //     custType: 0
      //   };
      // });
      // 填报单位 - ids
      let taskCustomRelationDtoList = this.checkedList.map(ele => {
        custIdList.push(ele.id);
        return {
          custCode: ele.custCode,
          custId: ele.id,
          custType
        };
      });
      // 只选一个填报单位情况
      if (taskCustomRelationDtoList.length === 0) {
        taskCustomRelationDtoList = [
          {
            custType
          }
        ];
      }
      const params = {
        taskCustCode: this.info.custCode,
        taskId: this.taskId,
        taskCustomRelationDtoList,
        saveType: custType,
        prodId: '4'
        // taskCustomRelationDtoList: [...treeLicst, ...taskCustomRelationDtoList]
      };
      // 保存 - 组织单位信息
      if (!this.isTask) {
        let { code, err } = await postInsertTaskCustomRelation(params);
        if (err || code) {
          this.$message({
            type: 'error',
            message: '填报单位保存失败，请重试!'
          });
          this.isSubmit = false;
          this.subTxt = '确 定';
          return;
        }
      }
      this.units[this.type] = custIdList;
      this.$emit('result', this.units);
      this.closeDialog();
    },
    async getCustomer() {
      let custCodeList = this.treeCheckList;
      if (custCodeList.length === 0) {
        this.unitsList = [];
        this.checkedUnits = [];
        return;
      }
      let source = this.type === 'wzIds' ? 'WZ' : 'BS';
      let { data } = await getCustomInfoByOrg({
        custCodeList,
        // isBasic: 0,
        source
      });
      if (this.isTask && this.taskId) {
        const units = getStore({
          name: this.taskId,
          type: 'session'
        });
        let arr = units[this.type] || [];
        data = data.map(ele => {
          if (arr.map(ele => ele + '').includes(ele.id + '')) {
            return ele;
          }
          ele.disabled = true;
          return ele;
        });
      }
      this.units[source] = data;
      this.unitsList = data.filter(ele => !ele.disabled);
      this.checkedUnits = data
        .filter(ele => {
          return this.custIdList.includes(ele.id + '') && !ele.disabled;
        })
        .map(ele => ele.custCode);
      // console.log(this.checkedUnits);
    },
    handleCheckedTreeChange(value) {
      // console.log(value);
      this.getCustomer();
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
        custCode => custCode !== value.custCode
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
