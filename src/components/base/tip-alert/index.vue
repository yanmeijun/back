<template>
  <div class="flex align-center justify-between tip-alert" v-if="tipAlert">
    <div class="flex align-center" v-if="!$slots.default">
      <i class="iconfont icontubiaozhizuomoban25" v-if="showIcon"></i>
      <div v-html="content"></div>
    </div>
    <i
      class="iel-dialog__close el-icon el-icon-close"
      v-if="closable && !$slots.default"
      @click="closeTip"
    ></i>
    <slot v-if="$slots.default"></slot>
  </div>
</template>
<script>
export default {
  name: 'tip-alert',
  data() {
    return {
      tipAlert: true
    };
  },
  props: {
    content: {
      type: String,
      defautl: ''
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    closable: Boolean
  },
  computed: {
    hasBody() {
      console.log(this._slotContents);
      return !!this._slotContents.body;
    }
  },
  methods: {
    closeTip() {
      this.tipAlert = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.tip-alert {
  margin-bottom: 12px;
  padding: 6px 12px;
  background: rgba(var(--primary-opacity), 0.1);
  border: 1px solid rgba(var(--primary-opacity), 0.5);
  border-radius: 4px;
  .icontubiaozhizuomoban25 {
    color: var(--primary);
    margin-right: 8px;
    font-size: 16px;
  }
  .el-icon-close {
    cursor: pointer;
  }
}
</style>
