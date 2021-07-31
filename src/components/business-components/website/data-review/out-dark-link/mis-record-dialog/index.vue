<template>
  <el-dialog
    class="look-dialog"
    title="误报记录"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <ex-table
        :data="data"
        :option="tableOption"
        :page="page"
        @on-load="onLoad"
      ></ex-table>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, onMounted } from '@vue/composition-api';
export default {
  name: 'mis-record-dialog',
  props: {
    isOpen: { type: Boolean, default: false }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    const state = reactive({
      tableOption: {
        height: 300,
        menu: false, // 隐藏操作
        tip: false,
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        index: true,
        indexWidth: 66,
        column: [
          {
            label: '修改人',
            prop: 'name',
            minWidth: 120,
            align: 'left'
          },
          {
            label: '修改时间',
            prop: 'time',
            width: 180
          }
        ]
      },
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        currentPage: 1,
        pageSizes: [100, 500, 1000]
      },
      data: []
    });

    onMounted(() => {
      onGetList();
    });

    const onGetList = async () => {
      setTimeout(() => {
        state.data = [];
      }, 1000);
    };

    // 表格加载
    const onLoad = page => {
      // console.log('page', page);
      state.page = page;
      onGetList();
    };

    const onCloseDialog = () => {
      emit('closeDialog');
    };

    // 返回
    return {
      refForm,
      ...toRefs(state),
      onLoad,
      onCloseDialog
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.look-dialog {
}
</style>
