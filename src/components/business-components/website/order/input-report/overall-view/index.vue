<template>
  <div>
    <div class="tabs-wrap center">
      <el-tabs v-model="tabs.value" class="el-tabs--ex-theme2">
        <el-tab-pane label="单项否决问题一览表" name="single-deny-view" />
        <el-tab-pane label="扣分指标问题一览表" name="score-down-view" />
        <el-tab-pane label="加分指标问题一览表" name="score-up-view" />
      </el-tabs>
    </div>
    <transition name="el-fade-in" mode="out-in">
      <component :is="tabs.value" class="section"></component>
    </transition>
  </div>
</template>

<script>
export default {
  components: {
    SingleDenyView: () => import('./single-deny-view'), // 单项否决问题一览表
    ScoreDownView: () => import('./score-down-view'), // 扣分指标问题一览表
    ScoreUpView: () => import('./score-up-view') // 加分指标问题一览表
  },
  data() {
    return {
      tabs: {
        value: 'single-deny-view'
      }
    };
  }
};
</script>

<style src="../style.scss" lang="scss" scoped></style>
