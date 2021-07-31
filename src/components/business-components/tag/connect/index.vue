<template>
  <div class="tag-connect">
    <h2 class="title">标签分类树管理</h2>
    <ul class="tabs">
      <li
        :class="['item', { 'item--active': tab.value === item.value }]"
        v-for="item in tab.options"
        :key="item.value"
        @click="onTabChange(item)"
      >
        {{ item.label }}
      </li>
    </ul>
    <connect-main :type="tab.value" />
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import ConnectMain from './main';
export default {
  components: {
    ConnectMain
  },
  setup(props, cxt) {
    let state = reactive({
      tab: {
        value: 'region',
        options: [
          {
            label: '地区',
            value: 'region'
          },
          {
            label: '行业',
            value: 'trade'
          },
          {
            label: '机构',
            value: 'org'
          }
        ]
      }
    });
    // tab改变
    const onTabChange = item => {
      state.tab.value = item.value;
    };
    return {
      ...toRefs(state),
      onTabChange
    };
  }
};
</script>

<style lang="scss" scoped>
.tag-connect {
  display: flex;
  flex-direction: column;
  height: 100%;

  .tabs {
    display: flex;
    .item {
      position: relative;
      padding: 0 12px 14px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary);
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      &--active {
        color: var(--primary);
        &::after {
          opacity: 1;
        }
      }
    }
  }

  .title {
    margin-bottom: 20px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  .main {
    flex: 1 1 auto;
    height: 0;
    min-width: 900px;
  }
}
</style>
