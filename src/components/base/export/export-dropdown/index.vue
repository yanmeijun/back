<template>
  <div class="export-dropdown">
    <el-dropdown>
      <el-button>
        导出<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          class="kp-text-center"
          v-if="!hideSelection"
          @click.native="onExportChecked"
        >
          <ExportChecked
            :args="args"
            :isDropdown="true"
            :idList="idList"
            :url="url"
          />
        </el-dropdown-item>
        <el-dropdown-item
          class="kp-text-center"
          :divided="true"
          v-if="!hidePage"
        >
          <ExportPage
            :args="args"
            :isDropdown="true"
            :url="url"
            :pageSize="pageSize"
            :total="total"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import ExportChecked from '@/components/base/export/export-checked';
import ExportPage from '@/components/base/export/export-page';
export default {
  name: 'export-dropdown',
  components: {
    ExportChecked,
    ExportPage
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    idList: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 100
    },
    total: {
      type: Number,
      default: 0
    },
    args: {
      type: Object,
      default: () => {}
    },
    hideSelection: {
      type: Boolean,
      deault: false
    },
    hidePage: {
      type: Boolean,
      deault: false
    }
  },
  setup() {
    const state = reactive({});

    // 方法
    const onExportChecked = event => {
      event.stopPropagation();
    };

    // 返回
    return {
      ...toRefs(state),
      onExportChecked
    };
  }
};
</script>
<style lang="scss" scoped>
.export-dropdown {
  margin: 0 10px;
}
</style>
