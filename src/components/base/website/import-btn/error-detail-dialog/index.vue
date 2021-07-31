<template>
  <el-dialog
    class="error-detail-dialog"
    title="错误详情"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <div class="flex align-center justify-between kp-block-title">
        <p class="flex align-center name">
          正确{{ data.rightNum }}条，错误<span class="kp-color-error">{{
            data.errorNum
          }}</span
          >条
        </p>
        <el-button type="primary" size="mini" @click="onDownFile"
          >下载</el-button
        >
      </div>
      <ex-table
        :data="cData"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="msg" slot-scope="scope">
          <div class="kp-color-error">{{ scope.row.msg }}</div>
        </template>
      </ex-table>
    </div>
    <!-- <div slot="footer">
      <div class="flex justify-between footer-btn">
        <div class="btn">
          <el-button @click="onCancle">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </div>
    </div> -->
  </el-dialog>
</template>

<script>
import { toRefs, reactive, onMounted, computed } from '@vue/composition-api';
import { getFile } from '@/api/new-media/common';
export default {
  name: 'error-detail-dialog',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const { url, data: errData } = toRefs(props);
    // data
    const state = reactive({
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        menu: false, // 隐藏操作
        height: 280,
        stripe: true, // 斑马线
        page: false, // 分页
        align: 'center',
        column: [
          {
            label: '行号',
            prop: 'line',
            width: 56
          },
          {
            label: '错误详情',
            prop: 'msg',
            showOverflow: true,
            align: 'left',
            minWidth: 150,
            slot: true
          }
        ]
      }
    });

    const cData = computed(() => errData.value.errorMessageList);

    onMounted(() => {
      // getList();
    });
    // 方法
    const getList = async () => {
      //   state.loading = true;
      //   const { data, total } = await getReportTaskIdList({
      //     current: state.page.currentPage,
      //     size: state.page.pageSize
      //   });
      //   state.loading = false;
      //   state.page.total = total;
      //   state.data = data;
    };
    const onLoad = () => {
      getList();
    };
    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onDownFile = async () => {
      await getFile({ url: url.value });
    };
    // 返回
    return {
      cData,
      ...toRefs(state),
      onLoad,
      onCloseDialog,
      onDownFile
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.error-detail-dialog {
  ::v-deep {
    .el-dialog {
      width: 650px;
    }
  }
  .form-main {
    // padding: 0 30px;
  }
}
</style>
