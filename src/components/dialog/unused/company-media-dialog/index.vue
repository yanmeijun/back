<template>
  <el-dialog
    class="company-dialog"
    :title="title"
    :visible.sync="isOpen"
    :modal="modal"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="flex company-con">
      <div class="vip-alert" v-if="isVipTip && isVip">
        <div class="flex align-center justify-between">
          <div class="flex align-center">
            <i class="iconfont icontubiaozhizuomoban25"></i>
            <span
              >选中单独付费客户可直接批量修改检测结果，未单独付费客户需要进入人工录入页面逐个检查！</span
            >
          </div>
          <i
            class="iel-dialog__close el-icon el-icon-close"
            @click="closeVipTip"
          ></i>
        </div>
      </div>
      <div class="tree" :class="{ 'is-vip': isVipTip && isVip }">
        <el-input
          placeholder="组织单位名称/编码"
          v-model="filterText"
          class="search-input"
        >
          <i
            slot="suffix"
            class="iconfont el-input__icon icontubiaozhizuomoban21 "
          ></i>
        </el-input>
        <!-- <div class="flex align-center justify-between checked-all">
        <div class="flex align-center left">
          <el-checkbox v-model="isAllChecked" @change="setCheckedKeys"
            >全选</el-checkbox
          >
          <span class="num">已选{{ isCheckedVal.length }}项</span>
        </div>
        <span class="right" @click="clearAll">全部清空</span>
      </div> -->
        <el-tree
          class="filter-tree"
          :data="treeDic"
          node-key="custCode"
          :props="defaultProps"
          :default-checked-keys="defaultTreeData"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @current-change="getCurrentKey"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }} </span>
          </span>
        </el-tree>
      </div>
      <Transfer
        filterable
        :isVip="isVip"
        :isVipTip="isVipTip"
        :filter-method="filterMethod"
        filter-placeholder="请输入城市拼音"
        v-model="value"
        :data="transferData"
        @clearMethod="clearMethod"
      >
        <!-- <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span> -->
      </Transfer>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="checkedDefault">默认全部</el-button>
        <el-button type="primary" @click="result">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getCustomerTree,
  getCustomInfoByOrg,
  postInsertTaskCustomRelation
} from '@/api/new-media/common';
import Transfer from '@/components/base/transfer';
export default {
  name: 'company-dialog',
  components: {
    Transfer
  },
  data() {
    // const generateData = _ => {
    //   let data = [];
    //   const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
    //   const pinyin = [
    //     'shanghai',
    //     'beijing',
    //     'guangzhou',
    //     'shenzhen',
    //     'nanjing',
    //     'xian',
    //     'chengdu'
    //   ];
    //   cities.forEach((city, index) => {
    //     let isVip = 0;
    //     if (index > 4) {
    //       isVip = 1;
    //     }
    //     data.push({
    //       label: city,
    //       key: index,
    //       pinyin: pinyin[index],
    //       isVip
    //     });
    //   });
    //   return data;
    // };
    return {
      isVipTip: true,
      isLeftAllChecked: false,
      isRightAllChecked: true,
      leftCheckList: [],
      rightCheckList: [],
      switchVal: false,
      isCheckedVal: [],
      filterText: '',
      defaultTreeData: [0, 1],
      treeDic: [],
      // dic: [
      //   {
      //     label: '选项1',
      //     value: 0,
      //     children: [
      //       {
      //         label: '选项3',
      //         value: 2
      //       },
      //       {
      //         label: '选项4',
      //         value: 3
      //       }
      //     ]
      //   },
      //   {
      //     label: '选项2',
      //     value: 1
      //   }
      // ],
      defaultProps: {
        children: 'children',
        label: 'custName'
      },
      transferData: [],
      value: [],
      filterMethod(query, levalKey, levalBool, isLeft, item) {
        if (levalBool && isLeft) {
          return item.label.indexOf(query) > -1 && item.key === levalKey;
        }
        return item.label.indexOf(query) > -1;
      },
      levalMethod(bool, item) {
        console.log(9);
        return bool ? item.key.indexOf(1) > -1 : item;
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: true
    },
    code: {
      type: String | Number,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    },
    modal: Boolean,
    isVip: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTreeOrgCustomInfo();
    this.getCustomInfoByOrg();
  },
  mounted() {
    this.checkedDefault();
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    async result() {
      this.$emit('tree', this.value);
      if (!this.value.length) {
        this.$message({
          type: 'error',
          message: '请选择网站填报单位！'
        });
        return;
      }
      let { code } = await postInsertTaskCustomRelation({
        data: {
          custCode: '',
          custId: this.value.join(','),
          taskId: this.code,
          custType: this.type
        }
      });
      if (code) {
        this.$message({
          type: 'error',
          message: '保存网站填报单位失败！'
        });
      } else {
        this.closeDialog();
        this.$emit('getType', this.type);
      }
    },
    async getTreeOrgCustomInfo() {
      let { data = [] } = await getCustomerTree({
        isAll: 1
      });
      this.treeDic = data;
    },
    async getCustomInfoByOrg(custCode = '') {
      let values = [];
      let { data = [] } = await getCustomInfoByOrg({
        custCode,
        source: 'BS'
      });
      if (!Array.isArray(data)) {
        data = [];
      }
      this.transferData = data.map(ele => {
        values.push(ele.id);
        ele.label = ele.custName;
        ele.key = ele.id;
        return ele;
      });
      this.value = values;
    },
    getCurrentKey() {
      let key = this.$refs.tree.getCurrentKey();
      this.getCustomInfoByOrg(key);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setCheckedKeys(val) {
      if (val) {
        this.$refs.tree.setCheckedKeys([0, 1]);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.isAllChecked = val;
    },
    checkedDefault() {
      this.isCheckedVal = this.defaultTreeData;
    },
    resetChecked(list) {
      this.isAllChecked = false;
      this.$nextTick().then(() => {
        this.$refs.tree.setCheckedKeys(list);
      });
    },
    clearMethod() {
      this.value = [];
    },
    closeVipTip() {
      this.isVipTip = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.company-dialog {
  ::v-deep.el-dialog {
    width: auto;
    min-width: 400px;
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-dialog__footer {
      padding-top: 0;
    }
  }
  .company-con {
    position: relative;
    .vip-alert {
      position: absolute;
      z-index: 2;
      left: 0;
      top: 14px;
      width: 100%;
      & > div {
        padding: 7px 12px;
        background: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
      }
      .icontubiaozhizuomoban25 {
        color: rgb(24, 144, 255);
        margin-right: 8px;
        font-size: 16px;
      }
      .el-icon-close {
        cursor: pointer;
      }
    }
  }
  .search-input {
    margin-bottom: 8px;
  }
  .filter-tree {
    height: 44vh;
    overflow: auto;
  }
  ::v-deep.el-tree-node__content {
    &:hover {
      background: $mainBgHover;
    }
  }
  .tree {
    padding: 10px 20px 0 0;
    border-right: 1px solid rgba(232, 232, 232, 1);
    min-width: 200px;
    &.is-vip {
      padding-top: 62px;
    }
  }
  .checked-all {
    padding: 6px 12px;
    border-radius: 4px;
    &.checked-all2 {
      background: $mainBgHover;
      border: 1px solid $mainBorderColor;
    }
    ::v-deep.el-switch {
      .el-switch__core {
        width: 28px !important;
        height: 16px;
        &:after {
          width: 14px;
          height: 14px;
          top: 0;
        }
      }
      &.is-checked {
        .el-switch__core {
          &:after {
            margin-left: -14px !important;
          }
        }
      }
    }
    .left {
      .num {
        font-size: 12px;
        margin-left: 17px;
      }
    }
    .right {
      color: var(--primary);
      cursor: pointer;
    }
  }
}
</style>
