<template>
  <el-dialog
    title="选择站点"
    class="select-website-dialog"
    :visible.sync="isOpen"
    :before-close="closeDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="8">
        <div class="vertical-content grid-content">
          <el-input placeholder="组织单位名称/编码" v-model="searchCode">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="vertical-content-clearall">
            <span @click="clearAllTree">全部清空</span>
          </div>
          <el-tree
            :data="treeData"
            ref="tree"
            node-key="custCode"
            :props="defaultProps"
            show-checkbox
            :filter-node-method="filterNode"
            :check-strictly="true"
            @check-change="getCheckedKeys"
          >
            <div
              class="flex align-center justify-between custom-tree-node"
              slot-scope="{ node, data }"
            >
              <span>{{ node.label }}</span>
              <div v-if="node.checked && data.children.length > 0">
                <el-checkbox
                  v-model="data.isCheckAll"
                  @change="
                    checked => {
                      isAllChecked(checked, node, data);
                    }
                  "
                  >全选</el-checkbox
                >
              </div>
            </div>
          </el-tree>
        </div>
      </el-col>
      <!-- 单位部分 -->
      <el-col :span="8" v-loading="unitLoading">
        <div class="vertical-content grid-content">
          <ul class="unit-list-checkboxes">
            <li class="unit-list-checkboxes-first">
              <el-checkbox
                :indeterminate="isIndeterminateUnit"
                v-model="checkAllUnit"
                @change="unitCheckAllChange"
                border
                :disabled="unitData.length == 0"
                >全选</el-checkbox
              >
            </li>
            <el-checkbox-group
              v-show="unitData.length > 0"
              v-model="selectedUnitData"
              @change="unitCheckChange"
              size="small"
            >
              <li v-for="unit in unitData" :key="unit.id">
                <el-checkbox
                  :label="unit.id"
                  border
                  @change="checked => toggleSelectUnit(checked, unit)"
                >
                  <el-tooltip
                    :content="unit.custName"
                    effect="dark"
                    placement="top-start"
                    class="unit-list-checkboxes-name"
                    ><span>{{ unit.custName }}</span></el-tooltip
                  >
                  <span class="unit-list-checkboxes-id">{{
                    unit.custCode
                  }}</span>
                </el-checkbox>
              </li>
            </el-checkbox-group>
            <li
              class="unit-list-checkboxes-nodata"
              v-show="unitData.length == 0"
            >
              <img src="@/assets/img/empty.png" alt />
              <p>暂无数据</p>
            </li>
          </ul>
        </div>
      </el-col>
      <!-- 站点部分 -->
      <el-col :span="8" v-loading="siteLoading">
        <div class="vertical-content">
          <ul class="unit-list-checkboxes">
            <li class="site-statistics clearfix">
              <div class="site-statistics-number">
                <span :class="selectedSiteData.length > 0 ? 'hasData' : ''">{{
                  selectedSiteData.length
                }}</span>
                /
                <span>{{ siteData.length }}</span>
              </div>
              <div class="site-statistics-clear" @click="siteCheckAllChange">
                全选
              </div>
            </li>
            <el-checkbox-group
              v-model="selectedSiteData"
              v-show="siteData.length > 0"
              size="small"
            >
              <li v-for="site in siteData" :key="site.id">
                <el-checkbox :label="site.id" border>
                  <el-tooltip
                    :content="site.accountName"
                    effect="dark"
                    placement="top-start"
                    class="unit-list-checkboxes-name"
                    ><span>{{ site.accountName }}</span></el-tooltip
                  >
                  <span class="unit-list-checkboxes-id">{{
                    site.siteCode
                  }}</span>
                </el-checkbox>
              </li>
            </el-checkbox-group>
            <li
              class="unit-list-checkboxes-nodata"
              v-show="siteData.length == 0"
            >
              <img src="@/assets/img/empty.png" alt />
              <p>暂无数据</p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="selectSite">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getCustomerTree,
  // postInsertTaskCustomRelation,
  getCustomInfoByOrg
} from '@/api/new-media/common';
import { getSiteListbyCustId } from '@/api/website/order';
export default {
  name: 'select-website-dialog',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'custName'
      },
      loading: false,
      timer1: null,
      timer2: null,
      checkedTreeKeys: [], // 选中的组织单位
      searchCode: '',
      treeData: [],
      unitData: [],
      selectedUnitData: [],
      unitLoading: false,
      checkAllUnit: false, // 是否全选了填报单位
      isIndeterminateUnit: false, // 是否非全选填报单位,
      siteData: [],
      selectedSiteData: [],
      siteLoading: false,
      trueVal: true,
      savedUnit: []
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 初始化
    async init() {
      const custCode = this.info.custCode;
      let params = {
        custCode,
        isAll: 1
      };
      let { data } = await getCustomerTree(params);
      console.log(data);

      this.treeData = data;
      this.loopData(this.treeData);
      if (this.selectedList.length > 0) {
        this.$set(this, 'selectedSiteData', this.selectedList);
        // this.selectedList.map(item => {
        //   this.selectedSiteData.push(item);
        // });
      }
      // this.checkedDefault();
    },
    loopData(arr) {
      // 给树加上isCheckAll属性
      let that = this;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children.length > 0) {
          arr[i].isCheckAll = false;
          that.loopData(arr[i].children);
        }
      }
    },
    //  筛选功能
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.custName.indexOf(value) !== -1 ||
        data.custCode.indexOf(value) !== -1
      );
    },
    checkedDefault() {
      this.$nextTick().then(() => {
        this.getCheckedKeys(null, null, null);
      });
    },
    isAllChecked(checked, node, data) {
      this.setChecked(data.children, checked, data);
    },
    clearAllTree() {
      this.$refs.tree.setCheckedKeys([]);
      this.checkedTreeKeys = this.$refs.tree.getCheckedKeys();
    },
    setChecked(children, bool, data) {
      if (children && children.length > 0) {
        let list = [];
        children.map(ele => {
          // ele.disabled = bool;
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
    getCheckedKeys(node, self, isLeaf) {
      // 组织单位选择变化触发函数
      if (!self && node) {
        node.isCheckAll = false;
        this.isAllChecked(false, null, node);
      }
      // 如果是取消选中 且有父节点，就让父节点的全选关闭
      if (node.parentCode && node.parentId && !self) {
        this.$refs.tree.getNode(node.parentCode).data.isCheckAll = false;
        // console.log(this.$refs.tree.getNode(node.parentCode));
      }
      // 获取所选中的keys
      this.checkedTreeKeys = this.$refs.tree.getCheckedKeys();
    },
    debounce(fn, wait) {
      // 防抖
      if (this.timer1 !== null) {
        clearTimeout(this.timer1);
      }
      this.timer1 = setTimeout(fn, wait);
    },
    debounce2(fn, wait) {
      // 防抖
      if (this.timer2 !== null) {
        clearTimeout(this.timer2);
      }
      this.timer2 = setTimeout(fn, wait);
    },
    // 查询列表
    async queryUnitData() {
      console.log(`请求一下单位`);
      if (this.checkedTreeKeys.length > 0) {
        this.unitLoading = true;
        let custCodeList = this.checkedTreeKeys;
        let { data } = await getCustomInfoByOrg({
          custCodeList,
          source: 'WZ'
        });
        this.unitData = data;
        if (this.selectedUnitData.length > 0) {
          this.isIndeterminateUnit = true;
        }
        this.unitLoading = false;
      } else {
        this.unitData = [];
        this.selectedUnitData = [];
        this.checkAllUnit = false;
        this.isIndeterminateUnit = false;
      }
    },
    // 查询站点
    async querySiteData() {
      console.log(`请求一下站点`);
      if (this.selectedUnitData.length > 0) {
        this.siteLoading = true;
        let custIdList = this.selectedUnitData;
        let { data } = await getSiteListbyCustId({
          prodId: '2',
          // sortFlag: false,
          custIdList
        });
        this.siteData = data;
        this.siteLoading = false;
      } else {
        this.siteData = [];
        this.selectedSiteData = [];
      }
    },
    unitCheckAllChange(val) {
      // 全选填报单位方法
      if (val) {
        this.unitData.map(item => {
          this.selectedUnitData.push(item.id);
        });
      } else {
        this.selectedUnitData = [];
      }
      this.isIndeterminateUnit = false;
    },
    unitCheckChange(val) {
      console.log(val);
      let checkCount = val.length;
      this.checkAllUnit = checkCount === this.unitData.length;
      this.isIndeterminateUnit =
        checkCount > 0 && checkCount < this.unitData.length;
    },

    //  全选当前的站点
    siteCheckAllChange() {
      this.selectedSiteData = [];
      this.siteData.map(site => {
        this.selectedSiteData.push(site.id);
      });
    },
    closeDialog() {
      // this.selectedSiteData = [];
      this.$set(this, 'selectedSiteData', this.selectedList);
      this.$emit('closeDialog');
    },
    toggleSelectUnit(checked, unit) {
      if (checked) {
        this.savedUnit.push({
          custCode: unit.custCode,
          custId: unit.id,
          custType: unit.custLevel,
          taskCustCode: this.info.custCode
        });
      } else {
        for (let i = 0; i < this.savedUnit.length; i++) {
          if (this.savedUnit[i].id == unit.id) {
            this.savedUnit.splice(i, 1);
          }
        }
      }
    },
    selectSite() {
      // savedUnit
      // console.log(this.$refs.tree.getCheckedNodes());
      let relationSaveDtos = []; // 关联表对象集合
      let treeNode = this.$refs.tree.getCheckedNodes();
      treeNode.map(item => {
        relationSaveDtos.push({
          custCode: item.custCode,
          custId: item.id,
          custType: '0',
          taskCustCode: this.info.custCode
        });
      });
      relationSaveDtos = relationSaveDtos.concat(this.savedUnit);
      this.$emit('selectWeb', {
        selectedSiteData: this.selectedSiteData,
        relationSaveDtos: relationSaveDtos
      });
    }
  },
  watch: {
    checkedTreeKeys(val) {
      this.debounce(this.queryUnitData, 700);
    },
    selectedUnitData(val) {
      this.debounce2(this.querySiteData, 700);
    },
    searchCode(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.select-website-dialog {
  ::v-deep.el-dialog {
    width: 958px;
    .el-dialog__body {
      height: 425px;
      overflow: hidden;
      .vertical-content {
        height: 425px;
        padding: 0px 20px 0;
        box-sizing: border-box;
        overflow-y: auto;
        .vertical-content-clearall {
          color: var(--primary);
          font-size: 14px;
          height: 24px;
          line-height: 24px;
          text-align: right;
          cursor: pointer;
        }
      }
      .grid-content {
        border-right: 1px solid #e8e8e8;
      }
      .custom-tree-node {
        flex: 1;
      }
      .unit-list-checkboxes {
        padding-bottom: 8px;
        li {
          margin-bottom: 4px;
          .el-checkbox {
            width: 100%;
            .el-checkbox__label {
              width: 100%;
              font-size: 14px;
              font-weight: 400;
            }
            .unit-list-checkboxes-name {
              display: inline-block;
              max-width: 109px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle;
            }
            .unit-list-checkboxes-id {
              float: right;
              padding-right: 9px;
            }
          }
        }
        .unit-list-checkboxes-first .el-checkbox {
          text-align: right;
          .el-checkbox__label {
            width: auto;
          }
        }
        .site-statistics {
          width: 100%;
          height: 32px;
          line-height: 32px;
          padding-left: 14px;
          padding-right: 10px;
          border-radius: 3px;
          border: 1px solid #91d5ff;
          font-size: 14px;
          background: #e6f7ff;
          .site-statistics-number {
            float: left;
            color: #000;
            .hasData {
              color: var(--primary);
            }
          }
          .site-statistics-clear {
            float: right;
            color: var(--primary);
            cursor: pointer;
          }
          .site-statistics-clear.nodata {
            color: #91d5ff;
          }
        }
        .unit-list-checkboxes-nodata {
          img {
            display: block;
            width: 130px;
            height: 130px;
            margin: 30px 0 0 70px;
          }
          p {
            height: 20px;
            line-height: 20px;
            color: #000;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.vertical-content .el-input__suffix {
  cursor: pointer;
}
</style>
