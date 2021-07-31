<template>
  <div class="import-btn">
    <el-button :type="primary" @click="onImport">{{ title }}</el-button>
    <ImportDialog
      ref="ImportDialog"
      v-if="isImportDialog"
      :title="title"
      :url="url"
      :modelUrl="modelUrl"
      :isOpen="isImportDialog"
      @update="onUpdate"
      @closeDialog="isImportDialog = false"
    />
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import ImportDialog from './import-dialog';
export default {
  name: 'import-btn',
  components: {
    ImportDialog
  },
  props: {
    title: {
      type: String,
      default: '批量添加'
    },
    url: {
      type: String,
      default: ''
    },
    modelUrl: {
      type: String,
      default: ''
    },
    primary: {
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      isImportDialog: false
    });

    const onImport = () => {
      state.isImportDialog = true;
    };

    const onUpdate = () => {
      emit('update');
    };

    return {
      ...toRefs(state),
      onImport,
      onUpdate
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.import-btn {
  margin-left: 10px;
}
</style>
