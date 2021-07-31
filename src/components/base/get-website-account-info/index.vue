<template>
  <el-popover
    popper-class="kp-popper-select"
    placement="bottom"
    width="320"
    trigger="click"
    @hide="onHidePopper"
  >
    <div class="select-main">
      <el-input
        class="input"
        placeholder="网站标识码/网站名称"
        v-model="inputVal"
        @input="onRemoteMethod"
        clearable
      >
      </el-input>
    </div>

    <ul class="search-list">
      <li
        class="flex justify-between align-center item"
        :class="{ selected: item.selected, disabled: item.disabled }"
        v-for="item in searchList"
        :key="item.label"
        @click="onGetItem(item)"
      >
        <span class="word-ellipsis-1">{{ item.label }}</span>
        <i class="el-icon-check icon"></i>
      </li>
    </ul>
    <el-select
      class="kp-select-multiple"
      slot="reference"
      v-model="selectVal"
      popper-class="select-popper"
      multiple
      clearable
      placeholder="请选择"
      @remove-tag="onRemove"
      @clear="onClear"
    >
      <el-option value=""></el-option>
      <span slot="empty"></span>
    </el-select>
  </el-popover>
</template>

<script>
import { findByAccountNameOrUniqueCode } from '@/api/website/data-review';
import { reactive, toRefs, watch } from '@vue/composition-api';

export default {
  name: 'account-info',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const { value, limit } = toRefs(props);
    const state = reactive({
      loading: false,
      optionVal: '',
      selectVal: [],
      searchList: [],
      inputVal: '',
      timer: null
    });

    // const cLimit = computed(() => {
    //   return limit.value > 0;
    // })

    watch(value, val => {
      state.selectVal = val;
    });

    watch(
      () => state.selectVal,
      val => {
        if (limit.value > 0) {
          state.searchList = state.searchList.map(ele => {
            ele.disabled = val.length >= limit.value;
            return ele;
          });
        }
      }
    );

    const onClear = () => {
      state.selectVal = [];
      state.searchList.forEach(ele => (ele.selected = false));
      emit('input', state.selectVal);
    };

    const onRemove = value => {
      state.selectVal = state.selectVal.filter(val => val !== value);
      const index = state.searchList.findIndex(ele => ele.value === value);
      if (index !== -1) {
        state.searchList.splice(index, 1, {
          selected: false,
          label: value,
          value: value
        });
      }
      emit('input', state.selectVal);
    };

    const onGetItem = item => {
      if (item.disabled && !item.selected) return;
      if (item.selected) {
        state.selectVal = state.selectVal.filter(val => item.value !== val);
      } else {
        state.selectVal.push(item.value);
      }
      item.selected = !item.selected;
      emit('input', state.selectVal);
    };

    // 客户信息 - 模糊查询
    const onRemoteMethod = async query => {
      if (!query) return;
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      state.timer = setTimeout(async () => {
        clearTimeout(state.timer);
        state.timer = null;
        state.loading = true;
        const { data } = await findByAccountNameOrUniqueCode({
          siteInfo: query
        });
        state.loading = false;
        state.searchList = data.map(ele => {
          const selected = state.selectVal.includes(ele);
          return {
            selected,
            label: ele,
            value: ele,
            disabled: false
          };
        });
      }, 300);
    };

    const onHidePopper = () => {
      state.inputVal = '';
      state.searchList = [];
    };

    return {
      ...toRefs(state),
      onHidePopper,
      onRemoteMethod,
      onGetItem,
      onRemove,
      onClear
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.account-info {
}
.select-main {
  padding: 0 16px;
}
.search-list {
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  .item {
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .icon {
      opacity: 0;
    }
    &.disabled {
      cursor: no-drop;
      color: #ccc;
    }
    &.selected {
      color: var(--primary);
      .icon {
        opacity: 1;
      }
    }
  }
}
</style>
<style>
.kp-popper-select {
  padding: 16px 0 8px;
}
.select-popper {
  display: none !important;
}
</style>
