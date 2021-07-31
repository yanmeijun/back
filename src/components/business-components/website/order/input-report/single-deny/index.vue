<template>
  <div>
    <div class="tabs-wrap center">
      <el-tabs v-model="tabs.value" class="el-tabs--ex-theme2">
        <el-tab-pane label="严重问题" name="error" />
        <el-tab-pane label="站点无法访问" name="cannot-access" />
        <el-tab-pane label="首页不更新" name="home-not-update" />
        <el-tab-pane label="栏目不更新" name="column-not-update" />
        <el-tab-pane label="互动回应差" name="interact-bad" />
        <el-tab-pane label="服务不实用" name="service-unuseful" />
      </el-tabs>
    </div>
    <div class="main">
      <transition name="el-fade-in" mode="out-in">
        <component :is="tabs.value"></component>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Error: () => import('./error'), // 严重问题
    CannotAccess: () => import('./cannot-access'), // 站点无法访问
    HomeNotUpdate: () => import('./home-not-update'), // 首页不更新
    ColumnNotUpdate: () => import('./column-not-update'), // 栏目不更新
    InteractBad: () => import('./interact-bad'), // 互动回应差
    ServiceUnuseful: () => import('./service-unuseful') // 服务不实用
  },
  data() {
    return {
      tabs: {
        value: 'error'
      }
    };
  }
};
</script>
<style src="../style.scss" lang="scss" scoped></style>
