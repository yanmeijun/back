<template>
  <el-dialog
    class="look-dialog"
    title="被引用详情链接"
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
      >
        <template slot="url" slot-scope="scope">
          <el-link
            class="word-ellipsis-1"
            type="primary"
            :href="scope.row.url"
            target="_blank"
            >{{ scope.row.url }}</el-link
          >
        </template>
        <template slot="homeUrl" slot-scope="scope">
          <el-link
            class="word-ellipsis-1"
            type="primary"
            :href="scope.row.homeUrl"
            target="_blank"
            >{{ scope.row.homeUrl }}</el-link
          >
        </template>
        <template slot="snapshot" slot-scope="scope">
          <div class="flex center icons">
            <el-link
              type="primary"
              target="_blank"
              :href="scope.row.snapshot"
              :underline="false"
            >
              <i class="iconfont icontubiaozhizuomoban59"></i>
            </el-link>
          </div>
        </template>
      </ex-table>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, onMounted } from '@vue/composition-api';
export default {
  name: 'link-count-dialog',
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
            label: '外链/暗链地址',
            prop: 'url',
            minWidth: 120,
            align: 'left',
            slot: true
          },
          {
            label: '被引用父页面地址',
            prop: 'homeUrl',
            minWidth: 120,
            align: 'left',
            slot: true
          },
          {
            label: '父页面快照',
            prop: 'snapshot',
            width: 100,
            slot: true
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
