<template>
  <el-dialog
    class="organizational-dialog"
    :title="title"
    :visible.sync="isOpen"
    :modal="modal"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="tree-main">
      <el-row :gutter="40">
        <el-col :span="14" class="tree-col left-col">
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
          <el-tree
            class="filter-tree"
            ref="tree"
            node-key="custCode"
            show-checkbox
            :data="treeData"
            :props="defaultProps"
            :default-checked-keys="defaultTreeData"
            :filter-node-method="filterNode"
            :check-strictly="true"
            default-expand-all
            @check-change="getCheckedKeys"
          >
            <div
              class="flex align-center justify-between custom-tree-node"
              slot-scope="{ node, data }"
            >
              <span
                >{{ node.label }}
                <i
                  v-if="isVip && data.isVip"
                  class="iconfont icontubiaozhizuomoban4 vip-icon"
                  style="color: #FD8F14;"
                ></i>
              </span>
              <div v-if="node.checked">
                <!-- <el-radio-group v-model="data.isBase">
                  <el-radio
                    :label="1"
                    @click.native="isLeaf($event, node, data)"
                    >仅本级</el-radio
                  >
                  <el-radio
                    :label="2"
                    @click.native="isAll($event, node, data)"
                    v-if="!node.isLeaf"
                    >搜全部</el-radio
                  >
                </el-radio-group> -->
                <el-checkbox
                  v-model="data.isBase"
                  v-if="!node.isLeaf && !isEdit && !isTask"
                  :disabled="data.disabled"
                  @change="
                    checked => {
                      isAllChecked(checked, node, data);
                    }
                  "
                  >搜全部</el-checkbox
                >
              </div>
            </div>
          </el-tree>
        </el-col>
        <el-col :span="10" class="tree-col">
          <TipAlert :content="tipContent" :showIcon="false" />
          <ul
            class="infinite-list"
            v-infinite-scroll="load"
            style="overflow:auto"
          >
            <li
              v-for="ele in checkedTreeNodes"
              :key="ele.custName"
              class="infinite-list-item"
            >
              {{ ele.custName }}
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
  getCustomerTree,
  postInsertTaskCustomRelation,
  getCustomInfoByOrg
} from '@/api/new-media/common';
import TipAlert from '@/components/base/tip-alert/index';
export default {
  name: 'organizational-units-dialog',
  components: {
    TipAlert
  },
  data() {
    return {
      isVip: false,
      subTxt: '确 定',
      defaultProps: {
        children: 'children',
        label: 'custName'
      },
      filterText: '',
      checkedTreeKeys: [],
      checkedTreeNodes: [],
      noVipKeys: [],
      vipKeys: [],
      // defaultTreeData: [],
      treeData: [],
      wzIds: [],
      bsIds: [],
      WZ: [],
      BS: [],
      isSubmit: false
    };
  },
  props: {
    modal: Boolean,
    title: {
      type: String,
      default: ''
    },
    taskId: {
      type: String | Number,
      default: ''
    },
    taskCode: {
      type: String | Number,
      default: ''
    },
    info: {
      type: Object,
      default: () => {}
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    isEdit: Boolean,
    isTask: Boolean,
    initTree: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tipContent() {
      return `已选${this.checkedTreeKeys.length}项`;
    },
    defaultTreeData() {
      let tree = this.initTree
        .filter(ele => parseInt(ele.custType) === 0)
        .map(ele => ele.custCode);
      return tree || [];
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.checkedDefault();
    if (this.isVip) {
      this.filterVip(this.treeData);
    }
  },
  methods: {
    async result() {
      if (!this.checkedTreeKeys.length) {
        this.$message({
          type: 'warning',
          message: '请选择组织单位！'
        });
        return;
      }
      this.isSubmit = true;
      this.subTxt = '提交中...';
      // 获取所有填报单位信息
      const tbList = await this.getCustomerInfo();

      // 修改组织单位数据格式
      let taskCustomRelationDtoList = this.checkedTreeNodes.map(ele => {
        return {
          custCode: ele.custCode,
          custId: ele.id,
          custType: 0
        };
      });
      let allList = [...taskCustomRelationDtoList, ...tbList];
      let params = {
        prodId: '4',
        taskCustCode: this.info.custCode,
        taskId: this.taskId,
        taskCustomRelationDtoList: allList,
        saveType: 3
      };
      console.log('sf', params);
      // 保存 - 组织单位信息
      if (!this.isTask) {
        let { code, err } = await postInsertTaskCustomRelation(params);
        if (err || code) {
          this.$message({
            type: 'error',
            message: '填报单位保存失败，请重试!'
          });
          this.isSubmit = false;
          this.subTxt = '提交中...';
          return;
        }
      }

      this.$emit('result', {
        tree: this.checkedTreeNodes,
        keys: taskCustomRelationDtoList,
        wzIds: this.wzIds,
        bsIds: this.bsIds,
        WZ: this.WZ,
        BS: this.BS
      });
      // this.closeDialog();
      this.$nextTick().then(() => {
        this.closeDialog();
      });
    },
    getCustomer(source) {
      let custCodeList = this.checkedTreeKeys;
      return getCustomInfoByOrg({
        custCodeList,
        // isBasic: 0,
        source
      });
    },
    async getCustomerInfo() {
      let [WZ, BS] = await Promise.all([
        this.getCustomer('WZ'),
        this.getCustomer('BS')
      ]);
      let wz = WZ['data'] || [];
      let bs = BS['data'] || [];
      let wzIds = [];
      let bsIds = [];
      let wzList = wz.map(ele => {
        wzIds.push(ele.id);
        return {
          custCode: ele.custCode,
          custId: ele.id,
          custType: 1
        };
      });
      let bsList = bs.map(ele => {
        bsIds.push(ele.id);
        return {
          custCode: ele.custCode,
          custId: ele.id,
          custType: 2
        };
      });
      this.wzIds = wzIds;
      this.bsIds = bsIds;
      this.BS = bsList;
      this.WZ = wzList;
      return [...wzList, ...bsList];
    },
    getData() {
      this.getTree();
    },
    async getTree() {
      const custCode = this.info.custCode;
      let params = {
        custCode,
        isAll: 1
      };
      let { data } = await getCustomerTree(params);
      if (this.isTask) {
        data = this.setDataDisabled(data);
      }
      this.treeData = data;
      this.checkedDefault();
    },
    isLeaf(e, node, data) {
      if (e) {
        e.stopPropagation();
      }
      let child = data.children ? data.children : [];
      let children = this.setDisabled(child, false);
      // let arr = this.$refs.tree.getCheckedKeys();
      this.$refs.tree.updateKeyChildren(data.custCode, children);
      // console.log(this.checkedTreeNodes);
    },
    isAll(e, node, data) {
      e.stopPropagation();
      let child = data.children ? data.children : [];
      let children = this.setDisabled(child, true);
      // let arr = this.$refs.tree.getCheckedKeys();
      this.$refs.tree.updateKeyChildren(data.custCode, children);
      // console.log(this.checkedTreeNodes);
    },
    isAllChecked(checked, node, data) {
      this.setChecked(data.children, checked, data);
    },
    getCheckedKeys(node, self, isLeaf) {
      // 重置本级
      // console.log(node);
      if (!self && node) {
        node.isBase = false;
        this.isAllChecked(false, null, node);
      }
      // 获取所选中的keys
      this.checkedTreeKeys = this.$refs.tree.getCheckedKeys();
      this.checkedTreeNodes = this.$refs.tree.getCheckedNodes();
      // console.log(this.checkedTreeKeys);
      // console.log(this.checkedTreeNodes);
    },
    setChecked(children, bool, data) {
      if (children && children.length > 0) {
        let list = [];
        children.map(ele => {
          ele.disabled = bool;
          if (ele.children && ele.children.length > 0) {
            this.setChecked(ele.children, bool, ele);
          }
          list.push(ele.custCode);
          return ele;
        });
        if (bool) {
          this.$refs.tree.setCheckedKeys([
            ...this.$refs.tree.getCheckedKeys(),
            ...list
          ]);
        } else {
          let keys = this.$refs.tree
            .getCheckedKeys()
            .filter(ele => !list.includes(ele));
          this.$refs.tree.setCheckedKeys(keys);
        }
        return;
      }
      if (bool) {
        this.$refs.tree.setCheckedKeys([
          ...this.$refs.tree.getCheckedKeys(),
          data.custCode
        ]);
      } else {
        let keys = this.$refs.tree
          .getCheckedKeys()
          .filter(ele => ele !== data.custCode);
        this.$refs.tree.setCheckedKeys(keys);
      }
      // return children;
    },
    setDisabled(children, bool) {
      if (children && children.length > 0) {
        children = children.map(ele => {
          ele.disabled = bool;
          if (bool) {
            // 清除选中
            // this.$refs.tree.setChecked(ele.custCode, false, false);
          }
          if (ele.children && ele.children.length > 0) {
            ele.children = this.setDisabled(ele.children, bool);
          }
          return ele;
        });
      }
      return children;
    },
    setDataDisabled(data) {
      return data.map(item => {
        item.disabled = true;
        if (this.defaultTreeData.includes(item.custCode)) {
          item.disabled = false;
        }
        if (item.children && item.children.length > 0) {
          item.children = this.setDataDisabled(item.children);
        }
        return item;
      });
    },
    checkedDefault() {
      // this.checkedTreeKeys = this.defaultTreeData;
      this.$nextTick().then(() => {
        this.getCheckedKeys(null, null, null);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.custName.indexOf(value) !== -1 ||
        data.custCode.indexOf(value) !== -1
      );
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
    closeDialog() {
      this.$emit('closeDialog');
    },
    load() {}
  }
};
</script>
<style lang="scss" scoped>
.organizational-dialog {
  .search-input {
    margin-bottom: 20px;
  }
  .tree-col {
    padding: 10px 0;
  }
  .custom-tree-node {
    flex: 1;
  }
  .left-col {
    border-right: 1px solid #e8e8e8;
  }
  .filter-tree {
    height: 50vh;
    overflow: auto;
  }
  .infinite-list {
    height: 50vh;
    .infinite-list-item {
      padding: 5px 0;
      font-size: 14px;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        background: #595959;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  ::v-deep {
    .el-dialog {
      width: 780px;
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
