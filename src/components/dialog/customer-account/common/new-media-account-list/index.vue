<template>
  <el-dialog
    class="dialog"
    title="新媒体账号"
    width="550"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <!--表格渲染-->
    <avue-crud
      class="table-no-menu"
      :data="table.data"
      :option="table.option"
      :table-loading="table.loading"
      :page.sync="table.page"
    >
    </avue-crud>
  </el-dialog>
</template>
<script>
import { tableOption } from './config';
import { getAccountListByCustId } from '@/api/new-media/account-pool';
export default {
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 当前实体
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      self_visible: this.visible,
      // table列表
      table: {
        loading: false,
        option: tableOption,
        data: [],
        page: {
          currentPage: 1,
          pageSize: 100,
          pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
          total: 0
        },
        selection: []
      }
    };
  },
  watch: {
    visible(val) {
      this.self_visible = val;
    },
    self_visible(val) {
      this.$emit('update:visible', val);
    },
    'model.id': {
      immediate: true,
      handler(val) {
        if (!val) {
          return;
        }
        this.getData();
      }
    }
  },
  methods: {
    // 获取列表数据
    async getData() {
      this.table.data = [];
      this.table.loading = true;
      let { data, total } = await getAccountListByCustId({
        custId: this.model.id,
        size: this.table.page.pageSize,
        current: this.table.page.currentPage,
        prodId: '4'
      });
      this.table.loading = false;
      this.table.data = data;
      this.table.total = total;
    },
    onClose() {
      this.self_visible = false;
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dialog {
  ::v-deep {
    .el-dialog__body {
      padding-top: 16px;
    }
  }
  .form-main {
    .row {
      padding: 0 30px;
    }
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 46vh;
  }
}
</style>
