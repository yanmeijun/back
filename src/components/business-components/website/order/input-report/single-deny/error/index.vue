<template>
  <div>
    <ManualCheck class="section" />
    <ErrorWord class="section" />
    <OutSecret class="section" />
    <Revolt class="section" />
    <Modify class="section modify" />
  </div>
</template>

<script>
export default {
  components: {
    ManualCheck: () => import('./child/manual-check'), // 人工检查
    ErrorWord: () => import('./child/error-word'), // 严重表述错误-错敏信息
    OutSecret: () => import('./child/out-secret'), // 泄密国家秘密
    Revolt: () => import('./child/revolt'), // 发布或链接反动、暴力、色情内容
    Modify: () => import('./child/modify') // 篡改监测
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" src="../../style.scss" scoped></style>
<style lang="scss" scoped>
.section.modify {
  padding-top: 0;
}
</style>
