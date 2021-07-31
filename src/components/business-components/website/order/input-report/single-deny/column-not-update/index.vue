<template>
  <div>
    <ManualCheck class="section" />
    <SystemMonitor class="section" />
    <SystemMonitorBlankColumn class="section" />
  </div>
</template>

<script>
export default {
  components: {
    ManualCheck: () => import('./child/manual-check'), // 人工检查
    SystemMonitor: () => import('./child/system-monitor'), // 系统监测-栏目不更新
    SystemMonitorBlankColumn: () =>
      import('./child/system-monitor-blank-column') // 系统监测-空白栏目
  }
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
