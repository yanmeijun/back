<template>
  <div>
    <ManualCheck class="section" />
    <SystemMonitorAvailability class="section" />
    <SystemMonitorPageTag class="section" />
    <SystemMonitorIPv6 class="section" />
  </div>
</template>

<script>
export default {
  components: {
    ManualCheck: () => import('./child/manual-check'), // 人工检查
    SystemMonitorAvailability: () =>
      import('./child/system-monitor-availability'), // 可用性系统监测
    SystemMonitorPageTag: () => import('./child/system-monitor-page-tag'), // 页面标签系统监测
    SystemMonitorIPv6: () => import('./child/system-monitor-ipv6') // 页面标签系统监测
  }
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
