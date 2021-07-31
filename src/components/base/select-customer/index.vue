<template>
  <div class="select-customer">
    <div class="flex align-center">
      <span class="label">组织单位：</span>
      <el-button type="primary" @click="showOrgDialog"
        ><i class="iconfont icontubiaozhizuomoban40 icon-customer"></i
        >选择客户</el-button
      >
      <!-- 是否分付费-未付费 -->
      <div v-if="units && units.tree && units.tree.length > 0">
        <div v-if="false">
          <div class="noPay">
            <el-tooltip
              class="item"
              effect="dark"
              content="已选组织单位未付费134项"
              placement="top"
            >
              <span class="kp-disabled no-pay-vip">未付费134项</span>
            </el-tooltip>
          </div>
          <div class="noPay">
            <el-tooltip
              class="item"
              effect="dark"
              content="已选组织单位付费122项"
              placement="top"
            >
              <span class="kp-disabled no-pay-vip"
                >付费122项
                <i class="iconfont icontubiaozhizuomoban5 vip-icon"></i>
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="noPay">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`已选组织单位${units.tree.length}项`"
            placement="top"
          >
            <span class="kp-disabled no-pay-vip"
              >已选{{ units.tree.length }}项</span
            >
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="flex align-center" v-if="hasWz">
      <span class="label">网站填报单位：</span>
      <el-button type="primary" @click="showOrgMediaDialog(1)"
        ><i class="iconfont icontubiaozhizuomoban40 icon-customer"></i
        >选择客户</el-button
      >
      <!-- 是否分付费-未付费 -->
      <!-- <div v-if="false">
        <div class="noPay">
          <el-tooltip
            class="item"
            effect="dark"
            content="已选组织单位未付费134项"
            placement="top"
          >
            <span class="kp-disabled no-pay-vip">未付费134项</span>
          </el-tooltip>
        </div>
        <div class="noPay">
          <el-tooltip
            class="item"
            effect="dark"
            content="已选组织单位付费122项"
            placement="top"
          >
            <span class="kp-disabled no-pay-vip"
              >付费122项
              <i class="iconfont icontubiaozhizuomoban5 vip-icon"></i>
            </span>
          </el-tooltip>
        </div>
      </div> -->
      <div class="noPay">
        <el-tooltip
          class="item"
          effect="dark"
          content="所选择组织单位下网站填报单位"
          placement="top"
        >
          <span class="kp-disabled no-pay-vip">{{ wzTxt }}</span>
        </el-tooltip>
      </div>
    </div>
    <div class="flex align-center" v-if="hasBs" :key="3">
      <span class="label">新媒体填报单位：</span>
      <el-button type="primary" @click="showOrgMediaDialog(2)"
        ><i class="iconfont icontubiaozhizuomoban40 icon-customer"></i
        >选择客户</el-button
      >
      <!-- 是否分付费-未付费 -->
      <!-- <div v-if="false">
        <div class="noPay">
          <el-tooltip
            class="item"
            effect="dark"
            content="已选组织单位未付费134项"
            placement="top"
          >
            <span class="kp-disabled no-pay-vip">未付费134项</span>
          </el-tooltip>
        </div>
        <div class="noPay">
          <el-tooltip
            class="item"
            effect="dark"
            content="已选组织单位付费122项"
            placement="top"
          >
            <span class="kp-disabled no-pay-vip"
              >付费122项
              <i class="iconfont icontubiaozhizuomoban5 vip-icon"></i>
            </span>
          </el-tooltip>
        </div>
      </div> -->
      <div class="noPay">
        <el-tooltip
          class="item"
          effect="dark"
          content="所选组织单位下新媒体填报单位"
          placement="top"
        >
          <span class="kp-disabled no-pay-vip">{{ bsTxt }}</span>
        </el-tooltip>
      </div>
    </div>
    <OrganizationalUnitsDialog
      v-if="isOrgUnitsDialog"
      ref="OrganizationalUnitsDialog"
      :isOpen="isOrgUnitsDialog"
      :title="`选择组织单位`"
      :taskId="taskId"
      :taskCode="taskCode"
      :info="info"
      :initTree="units.keys"
      :isTask="isTask"
      @result="getCheckedUnits"
      @closeDialog="isOrgUnitsDialog = false"
    />
    <OrganizationalMediaDialog
      v-if="isOrgMediaDialog"
      ref="OrganizationalMediaDialog"
      :isOpen="isOrgMediaDialog"
      :title="mediaTitle"
      :taskId="taskId"
      :taskCode="taskCode"
      :units="units"
      :info="info"
      :isTask="isTask"
      @result="getCheckedUnits"
      @closeDialog="isOrgMediaDialog = false"
    />
  </div>
</template>
<script>
import {
  getTaskCustomRelation,
  getCustomInfoByOrg
} from '@/api/new-media/common';
import OrganizationalUnitsDialog from '@/components/dialog/new-media/order/organizational-units-dialog/index';
import OrganizationalMediaDialog from '@/components/dialog/new-media/order/organizational-media-dialog/index';
import { setStore } from '@/util/store';
export default {
  name: 'select-customer',
  components: {
    OrganizationalUnitsDialog,
    OrganizationalMediaDialog
  },
  data() {
    return {
      isOrgUnitsDialog: false,
      isOrgMediaDialog: false,
      mediaTitle: '网站填报单位',
      companyList: [
        {
          label: '组织单位',
          value: 0
        },
        {
          label: '网站填报单位',
          value: 1
        },
        {
          label: '新媒体填报单位',
          value: 2
        }
      ],
      units: {
        tree: [],
        keys: [],
        wzIds: [],
        bsIds: [],
        WZ: [],
        BS: []
      },
      WZ: [],
      BS: []
    };
  },
  props: {
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
    isEdit: Boolean,
    isTask: Boolean
  },
  computed: {
    hasWz() {
      return this.units && this.units.wzIds && this.units.wzIds.length > 0;
    },
    hasBs() {
      return this.units && this.units.bsIds && this.units.bsIds.length > 0;
    },
    wzTxt() {
      const uLen = this.units.wzIds.length;
      // console.log('WZ', this.WZ);
      const WZLen = this.WZ.length;
      return uLen > 0 && uLen < WZLen
        ? `已选${uLen}项网站填报单位`
        : '已选全部网站填报单位';
    },
    bsTxt() {
      const uLen = this.units.bsIds.length;
      const BSLen = this.BS.length;
      return uLen > 0 && uLen < BSLen
        ? `已选${uLen}项新媒体填报单位`
        : '已选全部新媒体填报单位';
    }
  },
  watch: {
    taskId(val) {
      if (val && this.isTask) {
        this.getEditData();
      }
    }
  },
  mounted() {
    this.getEditData();
  },
  methods: {
    async getEditData() {
      if (!this.taskId) return;
      // 编辑 - 初始化数据
      let { data } = await getTaskCustomRelation({
        taskId: this.taskId
      });
      let tree = [];
      let keys = [];
      let WZ = [];
      let BS = [];
      for (let item of data) {
        switch (item.custType) {
          case '0':
            tree.push({
              id: item.custId,
              custName: item.custName,
              custCode: item.custCode,
              custType: item.custType
            });
            keys.push({
              custId: item.custId,
              custCode: item.custCode,
              custType: item.custType
            });
            break;
          case '1':
            WZ.push(item.custId);
            break;
          case '2':
            BS.push(item.custId);
            break;
        }
      }
      this.units = {
        tree,
        keys,
        wzIds: WZ,
        bsIds: BS,
        WZ: this.WZ,
        BS: this.BS
      };
      setStore({
        type: 'session',
        content: this.units,
        name: this.taskId
      });
      this.getCustomer('WZ');
      this.getCustomer('BS');
      // console.log(this.units);
      // 编辑初始化-查询
      this.$emit('query', this.units);
    },
    getCheckedUnits(units) {
      this.units = units;
      // console.log(units);
      this.WZ = units.WZ;
      this.BS = units.BS;
      // console.log('units', units);
      this.$emit('query', units);
    },
    showOrgDialog() {
      this.isOrgUnitsDialog = true;
    },
    showOrgMediaDialog(item) {
      let type = item === 1 ? 'wzIds' : 'bsIds';

      this.mediaTitle = this.companyList[item].label;
      this.isOrgMediaDialog = true;
      this.$nextTick().then(() => {
        this.$refs.OrganizationalMediaDialog.init({
          type,
          units: this.units
        });
      });
    },
    async getCustomer(source) {
      let custCodeList = this.units.tree.map(ele => ele.custCode);
      const { data } = await getCustomInfoByOrg({
        custCodeList,
        // isBasic: 0,
        source
      });
      // console.log(source);
      this[source] = data;
      this.units[source] = data;
      // console.log(this[source]);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-customer {
  & > div {
    margin-bottom: 8px;
    .label {
      width: 115px;
      text-align: right;
    }
  }
  .no-pay-vip {
    position: relative;
    margin-left: 8px;
  }
  .vip-icon {
    position: absolute;
    right: 0;
    top: -1px;
    color: #fd8f14;
    font-size: 14px;
  }
}
</style>
