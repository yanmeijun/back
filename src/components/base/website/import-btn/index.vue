<template>
  <div class="import-btn">
    <el-button @click="onImport">{{ title }}</el-button>
    <ImportDialog
      ref="ImportDialog"
      v-if="isImportDialog"
      :title="title"
      :url="url"
      :modelUrl="modelUrl"
      :isOpen="isImportDialog"
      :argName="argName"
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
      default: '导入'
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
    },
    argName: {
      type: String,
      default: 'userFile'
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
  margin-right: 10px;
}
</style>
