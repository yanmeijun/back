<template>
  <div>
    <ManualCheck class="section" />
  </div>
</template>

<script>
export default {
  components: {
    ManualCheck: () => import('./child/manual-check') // 人工检查
  }
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
