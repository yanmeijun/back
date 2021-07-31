<template>
  <div class="flex align-center company-main">
    <div class="company-select">
      <el-select v-model="company" placeholder="请选择">
        <el-option
          v-for="item in companyList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-button type="primary" class="kp-button" @click="showDialog"
      ><i class="iconfont icontubiaozhizuomoban40 icon-customer"></i
      >选择客户</el-button
    >
    <div v-if="isVip" class="flex align-center">
      <div class="noPay">
        <el-tooltip
          class="item"
          effect="dark"
          content="已选组织单位未付费134项"
          placement="top"
        >
          <span class="kp-disabled">未付费134项</span>
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
    <span class="kp-disabled" v-else>本部门全部</span>
    <component
      v-bind:is="asyncComponent"
      v-if="isOpen"
      :ref="asyncComponent"
      :isOpen="isOpen"
      :title="getTitle"
      :modal="modal"
      :isVip="isVip"
      :code="code"
      :type="company"
      @closeDialog="closeDialog"
      @getType="getType"
      @tree="companyHandle"
    ></component>
  </div>
</template>
<script>
import CompanyDialog from '@/components/dialog/unused/company-dialog';
import CompanyMediaDialog from '@/components/dialog/unused/company-media-dialog';
export default {
  name: 'select-company',
  components: {
    CompanyDialog,
    CompanyMediaDialog
  },
  data() {
    return {
      isOpen: false,
      asyncComponent: '',
      isCompany: true,
      company: 0,
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
      ]
    };
  },
  props: {
    isVip: {
      type: Boolean,
      default: false
    },
    code: {
      type: String | Number,
      default: ''
    },
    modal: Boolean
  },
  computed: {
    getTitle() {
      return this.companyList.find(ele => ele.value === this.company).label;
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
    },
    getType(type) {
      this.$emit('type', type);
    },
    showDialog() {
      let asyncComponent = '';
      switch (this.company) {
        case 0:
          asyncComponent = 'CompanyDialog';
          break;
        case 1:
          asyncComponent = 'CompanyMediaDialog';
          break;
        case 2:
          asyncComponent = 'CompanyMediaDialog';
          break;
        default:
          asyncComponent = 'CompanyDialog';
          break;
      }
      this.asyncComponent = asyncComponent;
      this.isOpen = true;
    },
    companyHandle(tree) {
      console.log('组织单位tree数据', tree);
    }
  }
};
</script>
<style lang="scss" scoped>
.company-main {
  & > * {
    margin-right: 8px;
  }
  .company-select {
    width: 130px;
  }
  .icon-customer {
    font-size: 14px;
    margin-right: 5px;
  }
  .no-pay-vip {
    position: relative;
    margin-left: 8px;
    .vip-icon {
      position: absolute;
      right: 0;
      top: -1px;
      color: #fd8f14;
      font-size: 14px;
    }
  }
}
</style>
