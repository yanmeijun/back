<template>
  <div class="form-group">
    <div class="form-group_head">
      <div class="form-group_title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="form-group_right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="form-group_main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 标题
     */
    title: String
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.form-group {
  &_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 12px;
    font-size: 14px;
    color: $mainBlack85;
    background: rgba(0, 0, 0, 0.04);
  }
  &_title {
    font-weight: bold;
  }
  &_main {
    padding: 0 30px;
  }
}
</style>
