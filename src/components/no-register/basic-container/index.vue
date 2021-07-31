<template>
  <div
    class="basic-container"
    :class="{
      'basic-container--block': block,
      'basic-container--border-left': border,
      'basic-container--mini': mini
    }"
  >
    <el-card>
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'basicContainer',
  props: {
    block: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
// 全局变量
@import '~@/styles/variables.scss';
.basic-container {
  padding: 16px;
  @media (max-width: 992.98px) {
    padding-top: 0;
  }
  &:not(:first-child) {
    padding-top: 0;
  }
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  .avue-crud {
    width: 100%;
  }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
  &--border-left {
    .el-card {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 6px;
        height: 100%;
        background-color: var(--primary);
      }
    }
  }
  &--mini {
    .el-card {
      .el-card__body {
        padding-bottom: 12px;
      }
    }
  }
}
</style>
