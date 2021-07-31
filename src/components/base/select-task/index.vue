<template>
  <div class="select-website flex">
    <el-button type="primary" @click="showWebDialog" size="small"
      >选择</el-button
    >

    <div class="noPay">
      <el-tooltip
        class="item"
        effect="dark"
        :content="`已选交付任务站点${websiteList.length}个`"
        placement="top"
      >
        <span class="kp-disabled no-pay-vip"
          >已选{{ websiteList.length }}项</span
        >
      </el-tooltip>
    </div>
    <selectTaskDialog
      ref="selectWebDialog"
      v-if="ifshowWebDialog"
      :isOpen="ifshowWebDialog"
      @closeDialog="closeWebDialog"
      @selectWeb="selectWeb"
    />
  </div>
</template>

<script>
import selectTaskDialog from '@/components/dialog/website/order/task-select-dialog';

export default {
  name: 'select-website',
  components: {
    selectTaskDialog
  },
  data() {
    return {
      ifshowWebDialog: false,
      websiteList: []
    };
  },
  methods: {
    showWebDialog() {
      this.$nextTick().then(() => {
        this.$refs.selectWebDialog.init({});
      });
      this.ifshowWebDialog = true;
    },
    closeWebDialog() {
      this.ifshowWebDialog = false;
    },
    selectWeb(taskList) {
      console.log(taskList);
      this.closeWebDialog();
    }
  }
};
</script>
<style lang="scss" scoped>
.select-website {
  & > div {
    // margin-bottom: 8px;
    .label {
      width: 115px;
      text-align: right;
    }
  }
  .el-button--primary.el-button--small {
    width: 60px;
    height: 32px;
  }
  .no-pay-vip {
    position: relative;
    margin-left: 8px;
    // top: 4px;
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
