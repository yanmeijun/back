<template>
  <div>
    <NotUpdate class="section" />
  </div>
</template>

<script>
export default {
  components: {
    NotUpdate: () => import('./child/not-update') // 首页不更新
  }
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
