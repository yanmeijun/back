<template>
  <div>
    <el-tabs v-model="tabs.value" class="el-tabs--ex-theme1 bottom-border">
      <el-tab-pane label="DNS篡改监测" name="dns" />
      <el-tab-pane label="页面篡改监测" name="page" />
    </el-tabs>
    <transition name="el-fade-in" mode="out-in">
      <component :is="tabs.value"></component>
    </transition>
  </div>
</template>

<script>
// import Dns from './child/dns';
// import Page from './child/page';
export default {
  components: {
    Dns: () => import('./child/dns'),
    Page: () => import('./child/page')
  },
  data() {
    return {
      tabs: {
        value: 'dns'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.el-tabs--ex-theme1 {
  padding: 0;
}
</style>
