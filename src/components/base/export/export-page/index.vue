<template>
  <div class="export-page" @click="onExportByPage">
    <span v-if="isDropdown">按页导出</span>
    <el-button v-else :type="type" :disabled="isDisabled">按页导出</el-button>
    <ExportPageDataDialog
      ref="ExportPageDataDialog"
      v-if="isExportPageDataDialog"
      :args="args"
      :url="url"
      :isOpen="isExportPageDataDialog"
      :pageSize="pageSize"
      :total="total"
      @closeDialog="isExportPageDataDialog = false"
    />
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import ExportPageDataDialog from '@/components/base/export/export-page-data-dialog';
export default {
  name: 'export-dropdown',
  components: {
    ExportPageDataDialog
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    pageSize: {
      type: Number,
      default: 100
    },
    total: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'default'
    },
    args: {
      type: Object,
      default: () => {}
    },
    isDropdown: Boolean,
    isDisabled: Boolean
  },
  setup() {
    const state = reactive({
      isExportPageDataDialog: false
    });
    // 方法
    const onExportByPage = () => {
      state.isExportPageDataDialog = true;
    };
    // 返回
    return {
      ...toRefs(state),
      onExportByPage
    };
  }
};
</script>
<style lang="scss" scoped>
.export-page {
}
</style>
