<template>
  <div>
    <div class="tabs-wrap center">
      <el-tabs v-model="tabs.value" class="el-tabs--ex-theme2">
        <el-tab-pane label="信息发布" name="pub-info" />
        <el-tab-pane label="办事服务" name="service" />
        <el-tab-pane label="互动交流" name="communication" />
        <el-tab-pane label="功能设计" name="fn-design" />
        <el-tab-pane label="创新发展" name="innovation" />
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
    PubInfo: () => import('./pub-info'), // 信息发布
    Service: () => import('./service'), // 办事服务
    Communication: () => import('./communication'), // 互动交流
    FnDesign: () => import('./fn-design'), // 功能设计
    Innovation: () => import('./innovation') // 创新发展
  },
  data() {
    return {
      tabs: {
        value: 'pub-info'
      }
    };
  }
};
</script>

<style src="../style.scss" lang="scss" scoped></style>
