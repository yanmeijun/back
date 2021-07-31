<template>
  <div class="export-checked" @click="onExportBySelection">
    <span v-if="isDropdown">按选中</span>
    <el-button v-else type="primary">按选中</el-button>
  </div>
</template>
<script>
import { reactive, computed, toRefs } from '@vue/composition-api';
import { exportTable } from '@/api/common';
export default {
  name: 'export-checked',
  props: {
    isDropdown: {
      type: Boolean,
      deault: false
    },
    isDisabled: Boolean,
    url: {
      type: String,
      default: ''
    },
    idList: {
      type: Array,
      default: () => []
    },
    args: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const { idList, url, args } = toRefs(props);
    const state = reactive({
      exportType: 1
    });

    const hasSekection = computed(() => {
      return idList.value.length > 0;
    });

    // 方法
    const onExportBySelection = async () => {
      if (!hasSekection.value) {
        root.$message({
          type: 'warning',
          message: '请选择导出列表项！'
        });
        return;
      }
      let params = Object.assign(
        {},
        {
          url: url.value,
          idList: idList.value,
          exportType: state.exportType
        },
        args.value
      );
      await exportTable(params);
    };

    // 返回
    return {
      ...toRefs(state),
      onExportBySelection
    };
  }
};
</script>
<style lang="scss" scoped>
.export-checked {
}
</style>
