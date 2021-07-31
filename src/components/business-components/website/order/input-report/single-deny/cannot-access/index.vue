<template>
  <div>
    <SystemMonitor class="section" />
  </div>
</template>

<script>
export default {
  components: {
    SystemMonitor: () => import('./child/system-monitor') // 系统监测
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
