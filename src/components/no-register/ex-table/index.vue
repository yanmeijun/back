<template>
  <div class="ex-table">
    <vxe-table
      class="mytable mytable-scrollbar"
      ref="xTable"
      :border="border"
      :stripe="option.stripe"
      :align="option.align"
      :height="option.height"
      :max-height="option.maxHeight"
      :data="data"
      :highlight-hover-row="true"
      :tooltip-config="{ enterable: true }"
      v-loading="loading"
      :span-method="spanMethod"
      :cell-style="cellStyle"
      @checkbox-all="onSelectAllEvent"
      @checkbox-change="onSelectChangeEvent"
      @scroll="onScrollChangeEvent"
    >
      <vxe-table-column
        type="seq"
        title="序号"
        v-if="option.index"
        :fixed="`left`"
        :width="option.indexWidth"
      ></vxe-table-column>
      <vxe-table-column
        v-if="option.selection"
        type="checkbox"
        :fixed="`left`"
        :width="option.selectionWidth"
      >
        <!-- 自定义头 -->
        <!-- <template #header="{ column }" v-if="option.selectionHeader">
          <slot name="selectionHeader" :column="column"></slot>
        </template> -->
      </vxe-table-column>

      <!-- <vxe-table-column field="name" title="Name"></vxe-table-column>
      <vxe-table-column field="sex" title="Sex"></vxe-table-column>
      <vxe-table-column field="age" title="Age"></vxe-table-column> -->
      <vxe-table-column
        v-for="col in option.column"
        :key="col.prop"
        :show-overflow="col.showOverflow"
        :align="col.align"
        :header-align="col.headerAlign"
        :field="col.prop"
        :title="col.label"
        :fixed="col.fixed"
        :width="col.width"
        :min-width="col.minWidth"
        :visible="!col.hide && showColumn && showColumn.includes(col.prop)"
      >
        <!-- 自定义头 -->
        <template #header="{ column }" v-if="col.headerSlot">
          <slot :name="`${col.prop}Header`" :column="column"></slot>
        </template>
        <!-- 自定义列 -->
        <template #default="{ row, rowIndex }">
          <slot
            :name="col.prop"
            :row="{ ...row, rowIndex }"
            v-if="col.slot"
          ></slot>
          <span class="line" v-else>
            {{
              col.format
                ? formatTime(row[col.prop], col.format)
                : row[col.prop] || '-'
            }}
          </span>
        </template>
      </vxe-table-column>
      <!-- 自定义操作：menu -->
      <vxe-table-column
        v-if="option.menu"
        field="menu"
        :title="option.menuTitle ? option.menuTitle : '操作'"
        fixed="right"
        :width="option.menuWidth"
      >
        <template #default="{ row }">
          <slot name="menu" :row="row"></slot>
        </template>
      </vxe-table-column>
      <!-- 自定义空 -->
      <template #empty>
        <div class="empty" v-if="isEmpty">
          <img width="130" src="@/assets/img/empty.png" />
          <p>暂无数据</p>
        </div>
      </template>
    </vxe-table>
    <vxe-pager
      v-if="option.page && pageTotal"
      class="mypage"
      border
      :loading="loading"
      :current-page.sync="tablePage.currentPage"
      :page-size.sync="tablePage.pageSize"
      :page-sizes="tablePage.pageSizes"
      :total="tablePage.total"
      :pager-count="5"
      :layouts="tablePage.layouts"
      @page-change="onHandlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script>
import XEUtils from 'xe-utils';
import {
  onMounted,
  reactive,
  toRefs,
  computed,
  watch,
  ref,
  nextTick
} from '@vue/composition-api';
export default {
  name: 'ex-table',
  props: {
    // 加载中 ------------------------
    loading: Boolean,
    spanMethod: Function,
    // 列样式
    cellStyle: Function,
    // 数据 --------------------------
    data: {
      type: Array,
      default: () => []
    },
    // 分页 --------------------------
    page: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 15, 20, 50, 100],
          total: 0
        };
      }
    },
    // 显/隐 --------------------------
    showColumn: {
      type: Array | null,
      default: null
    },
    // 配置项 ------------------------
    option: {
      menuTitle: '操作',
      border: {
        type: Boolean | String,
        default: 'inner'
      },
      page: Boolean,
      // 居中
      align: {
        type: String,
        default: 'center'
      },
      // 斑马线
      stripe: true,
      height: 'auto',
      maxHeight: 'auto',
      // 索引
      index: Boolean,
      // 索引宽度
      indexWidth: 56,
      // 多选
      selection: Boolean,
      selectionWidth: 60,
      // 操作
      menu: true,
      menuWidth: 80,
      // 每列配置项
      column: [
        {
          lable: '',
          prop: '',
          width: '',
          // 溢出隐藏
          showOverflow: false,
          // 自定义表头
          headerSlot: false,
          // 固定
          // fixed: 'left/right'
          align: 'center'
        }
      ]
    }
  },
  setup(props, { emit }) {
    const { page, option, showColumn, loading, data } = toRefs(props);
    const xTable = ref(null);

    const state = reactive({
      isEmpty: false,
      // tablePage: {
      //   currentPage: 1,
      //   pageSize: 10,
      //   pageSizes: [10, 20, 50, 100],
      //   total: 0
      // },
      prePage: {},
      pageTotal: true,
      border: computed(() => option.value.border || 'inner')
    });

    // watch
    watch(showColumn, () => {
      nextTick(() => {
        if (!xTable.value) return;
        xTable.value.refreshColumn();
      });
    });
    watch([loading, page, data], ([loadingVal, pageVal, dataVal]) => {
      // if (pageVal) {
      //   state.pageTotal = false;
      //   nextTick(() => {
      //     state.pageTotal = true;
      //     console.log(state.page);
      //   })
      // }
      if (!xTable.value) return;
      if (loadingVal || pageVal || dataVal) {
        xTable.value.clearScroll();
      }
      if (!loadingVal || !dataVal.length) {
        state.isEmpty = true;
      }
    });

    const tablePage = computed(() => {
      const pre = {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        layouts: [
          'Total',
          'Sizes',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'FullJump'
        ]
      };
      return { ...pre, ...page.value };
    });

    // onMounted
    onMounted(() => {
      state.prePage = page.value;
    });

    // 方法===========================
    // 多选
    const onSelectAllEvent = ({ checked, records }) => {
      // console.log('全选事件');
      // emit('checkboxAll', { checked, records, name: '全选事件' });
      emit('selection-change', records);
    };
    const onSelectChangeEvent = ({ records }) => {
      // console.log('单选事件');
      emit('selection-change', records);
    };
    const toggleCheckboxRow = val => {
      if (!val) return;
      xTable.value.toggleCheckboxRow(val);
    };
    // 清除所有多选
    const clearCheckboxRow = () => {
      xTable.value.clearCheckboxRow();
      emit('selection-change', []);
    };
    // 获取所以有选中
    const getSelectEvent = () => {
      return xTable.value.getCheckboxRecords();
    };
    // 设置选中项【】
    const setCheckboxRow = val => {
      // console.log('val');
      // console.log(val);
      xTable.value.setCheckboxRow(val, true);
      const records = getSelectEvent();
      emit('selection-change', records);
    };
    // 选中所有
    const setAllCheckboxRow = (bool = true) => {
      xTable.value.setAllCheckboxRow(bool);
      const records = getSelectEvent();
      emit('selection-change', records);
    };
    // 格式化
    const formatTime = (cellValue, format = 'yyyy-MM-dd HH:ss:mm') => {
      return XEUtils.toDateString(cellValue, format);
    };

    // 分页方法
    const onHandlePageChange = ({ currentPage, pageSize }) => {
      if (page.value.pageSize !== pageSize) {
        currentPage = 1;
      }
      state.prePage.currentPage = currentPage;
      state.prePage.pageSize = pageSize;

      // console.log('分页变化了...');
      // console.log(tablePage.value);
      emit('on-load', tablePage.value);
      xTable.value.clearScroll();
    };
    const onScrollChangeEvent = ({ type, scrollTop, scrollLeft, isX, isY }) => {
      // let obj = {
      //   type, scrollTop, scrollLeft, isX, isY
      // }
      let obj = xTable.value.getScroll();
      emit('scroll', obj);
    };

    return {
      xTable,
      tablePage,
      ...toRefs(state),
      onSelectAllEvent,
      onSelectChangeEvent,
      onHandlePageChange,
      onScrollChangeEvent,
      toggleCheckboxRow,
      clearCheckboxRow,
      setCheckboxRow,
      setAllCheckboxRow,
      getSelectEvent,
      formatTime
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.ex-table {
  width: 100%;
  height: 100%;
  /*滚动条整体部分*/
  .mytable-scrollbar ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /*滚动条的轨道*/
  .mytable-scrollbar ::-webkit-scrollbar-track {
    background-color: #ffffff;
  }
  /*滚动条里面的小方块，能向上向下移动*/
  .mytable-scrollbar ::-webkit-scrollbar-thumb {
    background-color: #dfdfdf;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }
  .mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }
  .mytable-scrollbar ::-webkit-scrollbar-thumb:active {
    background-color: #a8a8a8;
  }
  /*边角，即两个滚动条的交汇处*/
  .mytable-scrollbar ::-webkit-scrollbar-corner {
    background-color: #ffffff;
  }
  .mytable {
    ::v-deep {
      .vxe-header--row th {
        color: rgba(0, 0, 0, 0.85);
        height: 44px;
        background-color: #fafafa;
      }
    }
  }
  .mypage {
    margin-top: 16px;
    height: 30px;
  }
  .empty {
    padding: 40px 0;
    img {
      margin-left: 13px;
    }
  }
  .line {
    display: inline;
    white-space: nowrap;
  }
}
</style>
<style>
.ex-table .el-loading-mask .el-loading-spinner {
  /* opacity: 0.5; */
}
/*
.ex-table .vxe-loading .vxe-loading--spinner::after {
  display: none;
}
.ex-table .vxe-loading .vxe-loading--spinner::before {
  width: 34px;
  height: 34px;
  opacity: 1;
  left: -3px;
  top: -4px;
  transform: none;
  border: 4px solid var(--primary);
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  background: transparent;
  animation: spin 1s linear 0s infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
} */
</style>
