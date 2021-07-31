<template>
  <div class="view-tag basic-container">
    <!-- 侧边 -->
    <div class="side">
      <ul class="menu">
        <li
          v-for="item in options"
          :key="item.value"
          :class="[
            'menu-item',
            {
              'menu-item--active': active === item.value
            }
          ]"
          @click="onMenuItemClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <!-- 主体 -->
    <div class="main">
      <list v-if="active === 'list'" />
      <connect v-else-if="active === 'connect'" />
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import List from '@/components/business-components/tag/list';
import Connect from '@/components/business-components/tag/connect';
export default {
  name: 'tag',
  components: {
    List,
    Connect
  },
  setup(props, cxt) {
    let state = reactive({
      options: [
        {
          label: '标签添加',
          value: 'list'
        },
        {
          label: '标签关联',
          value: 'connect'
        }
      ],
      active: 'list'
    });
    // 菜单项点击
    function onMenuItemClick(item) {
      state.active = item.value;
    }
    return {
      ...toRefs(state),
      onMenuItemClick
    };
  }
};
</script>
<style lang="scss" scoped>
.view-tag {
  display: flex;
  height: 100%;
  .side {
    flex: 0 0 82px;
    padding-top: 50px;
    background-color: #f5f9fb;
    .menu {
      font-size: 14px;
      &-item {
        position: relative;
        line-height: 50px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 4px;
          background-color: transparent;
          transition: all 0.2s ease;
        }
        &--active,
        &:hover {
          color: var(--primary);
        }
        &--active {
          background-color: rgba(var(--primary-opacity), 0.05);
          &::after {
            background-color: var(--primary);
          }
        }
      }
    }
  }
  .main {
    flex: 1 1 auto;
    padding: 20px;
    width: 0;
    background-color: #fff;
    overflow: auto;
  }
}
</style>
