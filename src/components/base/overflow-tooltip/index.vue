<template>
  <div class="flex overflow-tooltip word-ellipsis-1" ref="refTooltip">
    <el-tooltip
      class="item"
      effect="dark"
      v-if="isTip"
      :content="content"
      :placement="placement"
    >
      <div class="con word-ellipsis-1">{{ content }}</div>
    </el-tooltip>
    <div v-else>{{ content }}</div>
  </div>
</template>
<script>
export default {
  name: 'overflow-tooltip',
  data() {
    return {
      isTip: false
    };
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  computed: {},
  watch: {},
  beforeDestroy() {
    let t = this;
    window.removeEventListener('resize', t.showTip);
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      let t = this;
      window.addEventListener('resize', t.showTip);
      t.showTip();
    },
    showTip() {
      const refTooltip = this.$refs.refTooltip;
      if (!refTooltip) {
        this.isTip = false;
      }
      const w = refTooltip.clientWidth;
      const cW = this.content.length * 12;
      this.isTip = cW > w ? true : false;
    }
  }
};
</script>
<style lang="scss" scoped>
.overflow-tooltip {
  flex: 1;
  .con {
    flex: 1;
  }
}
</style>
