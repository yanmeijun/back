<template>
  <div class="sensitive">
    <avue-tabs
      class="kp-tabs"
      :option="tabOption"
      @change="onTabHandleChangeMethod"
    ></avue-tabs>
    <div v-if="currentTab.prop === 'pending'">
      <Pending />
    </div>
    <span v-else-if="currentTab.prop === 'audited'">
      <Audited />
    </span>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import Pending from '@/components/business-components/website/data-review/privacy-leaks/pending';
import Audited from '@/components/business-components/website/data-review/privacy-leaks/audited';

export default {
  name: 'privacy-leaks',
  components: {
    Pending,
    Audited
  },
  setup() {
    const state = reactive({
      currentTab: {
        label: '待审核',
        prop: 'pending'
      },
      tabOption: {
        column: [
          {
            label: '待审核',
            prop: 'pending'
          },
          {
            label: '已审核 ',
            prop: 'audited'
          }
        ]
      }
    });

    // 方法 --------------------------------------------------------------
    const onTabHandleChangeMethod = val => {
      console.log(val);
      state.currentTab = val;
    };
    // 返回
    return {
      ...toRefs(state),
      // 方法
      onTabHandleChangeMethod
    };
  }
};
</script>
<style lang="scss" scoped>
.sensitive {
  .top-tabs {
    padding: 20px 20px 0;
    margin-bottom: 16px;
    background: #fff;
    ::v-deep {
      .el-tabs__header {
        margin-bottom: 0;
      }
    }
  }
}
</style>
