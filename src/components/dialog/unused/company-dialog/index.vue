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
    <div>
      <div
        class="flex align-center justify-between vip-alert"
        v-if="vipTip && isVip"
      >
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
      <div class="flex align-center justify-between checked-all">
        <div class="flex align-center left" v-if="isVip">
          <el-checkbox v-model="isNoVipChecked" @change="setNoVipCheckedKeys"
            >{{ noVipKeys.length }}项未付费</el-checkbox
          >
          <el-checkbox v-model="isVipChecked" @change="setVipCheckedKeys">
            <div class="flex align-center vip-length">
              <span>{{ vipKeys.length }}项付费</span>
              <i class="iconfont icontubiaozhizuomoban4 vip-icon"></i>
            </div>
          </el-checkbox>
        </div>
        <div class="flex align-center left" v-else>
          <el-checkbox v-model="isAllChecked" @change="setCheckedKeys"
            >全选</el-checkbox
          >
          <span class="num">已选{{ isCheckedVal.length }}项</span>
        </div>
        <span class="right" @click="clearAll">全部清空</span>
      </div>
      <el-tree
        class="filter-tree"
        :data="treeDic"
        node-key="id"
        show-checkbox
        :props="defaultProps"
        :default-checked-keys="defaultTreeData"
        default-expand-all
        :filter-node-method="filterNode"
        @check-change="getCheckedKeys"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            >{{ node.label }}
            <i
              v-if="isVip && data.isVip"
              class="iconfont icontubiaozhizuomoban4 vip-icon"
              style="color: #FD8F14;"
            ></i>
          </span>
        </span>
      </el-tree>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <!-- <el-button @click="checkedDefault">默认全部</el-button> -->
        <el-button type="primary" @click="result">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getCustomerTree,
  postInsertTaskCustomRelation
} from '@/api/new-media/common';
export default {
  name: 'company-dialog',
  data() {
    return {
      vipTip: true,
      isNoVipChecked: false,
      isVipChecked: false,
      isAllChecked: true,
      isCheckedVal: [],
      filterText: '',
      defaultTreeData: [],
      treeDic: [],
      // dic: [
      //   {
      //     label: '选项1',
      //     value: 0,
      //     children: [
      //       {
      //         label: '选项3',
      //         value: 2,
      //         isVip: 0
      //       },
      //       {
      //         label: '选项4',
      //         value: 3,
      //         isVip: 1
      //       }
      //     ]
      //   },
      //   {
      //     label: '选项2',
      //     value: 1,
      //     isVip: 1
      //   }
      // ],
      defaultProps: {
        children: 'children',
        label: 'custName'
      },
      noVipKeys: [],
      vipKeys: []
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    code: {
      type: String | Number,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    },
    isVip: Boolean,
    modal: Boolean
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTreeOrgCustomInfo();
  },
  mounted() {
    this.checkedDefault();
    this.filterVip(this.treeDic);
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    async result() {
      this.$emit('tree', this.isCheckedVal);
      if (!this.isCheckedVal.length) {
        this.$message({
          type: 'error',
          message: '请选择组织单位！'
        });
        return;
      }
      let { code } = await postInsertTaskCustomRelation({
        data: {
          custCode: '',
          custId: this.isCheckedVal.join(','),
          taskId: this.code,
          custType: this.type
        }
      });
      if (code) {
        this.$message({
          type: 'error',
          message: '保存组织单位失败！'
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterVip(arr) {
      for (let ele of arr) {
        if (ele.children && ele.children.length > 0) {
          this.filterVip(ele.children);
          continue;
        }
        if (!ele.isVip) {
          this.noVipKeys.push(ele.value);
        } else {
          this.vipKeys.push(ele.value);
        }
      }
    },
    setCheckedKeys(val) {
      if (val) {
        this.$refs.tree.setCheckedKeys([0, 1]);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    setNoVipCheckedKeys(val) {
      let normal = [];
      if (this.isVipChecked) {
        normal = this.vipKeys;
      }
      if (val) {
        this.$refs.tree.setCheckedKeys(normal.concat(this.noVipKeys));
      } else {
        this.$refs.tree.setCheckedKeys(normal);
      }
    },
    setVipCheckedKeys(val) {
      let normal = [];
      if (this.isNoVipChecked) {
        normal = this.noVipKeys;
      }
      if (val) {
        this.$refs.tree.setCheckedKeys(normal.concat(this.vipKeys));
      } else {
        this.$refs.tree.setCheckedKeys(normal);
      }
    },
    getCheckedKeys() {
      // console.log(this.$refs.tree.getCheckedKeys(true));
      // console.log('-------------');
      let arr = this.$refs.tree.getCheckedKeys();
      console.log(arr);
      this.isCheckedVal = arr;
    },
    clearAll() {
      this.isVipChecked = false;
      this.isNoVipChecked = false;
      this.resetChecked([]);
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
    closeVipTip() {
      this.vipTip = false;
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
    max-width: 400px;
    .el-dialog__body {
      padding: 10px 20px;
    }
  }
  .vip-alert {
    margin-bottom: 12px;
    padding: 7px 12px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    .icontubiaozhizuomoban25 {
      color: rgb(24, 144, 255);
      margin-right: 8px;
      font-size: 16px;
    }
    .el-icon-close {
      cursor: pointer;
    }
  }
  .search-input {
    margin-bottom: 8px;
  }
  .filter-tree {
    height: 35vh;

    overflow: auto;
  }
  ::v-deep.el-tree-node__content {
    &:hover {
      background: $mainBgHover;
    }
  }
  .vip-icon {
    font-size: 14px;
    color: #fd8f14;
    margin: 0 0 0 4px;
  }
  .checked-all {
    padding: 7px 12px;
    background: $mainBgHover;
    border: 1px solid $mainBorderColor;
    border-radius: 4px;
    margin-bottom: 12px;
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
