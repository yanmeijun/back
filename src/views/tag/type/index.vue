<template>
  <div class="type basic-container">
    <!-- 左边 -->
    <div class="left">
      <type-tree
        ref="typeTree"
        :current.sync="current"
        :type="type"
        head-fixed
        show-operation
      />
    </div>
    <!-- 主体 -->
    <div class="main">
      <template v-if="current">
        <view-form v-if="fromMode === 'view'" :type="type" :id="current.id" />
        <edit-form
          ref="editForm"
          v-else
          :type="type"
          :id="current.id"
          @on-success="onEditSuccess"
        />
        <div class="main-foot">
          <el-button v-if="fromMode === 'view'" type="primary" @click="onEdit">
            编辑
          </el-button>
          <template v-else>
            <el-button type="primary" @click="onEditSubmit">确定</el-button>
            <el-button @click="onCancel">取消</el-button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapping } from '@/views/tag/config';
import { reactive, toRefs } from '@vue/composition-api';
import TypeTree from '@/components/business-components/tag/common/type-tree';
import ViewForm from '@/components/business-components/tag/type/view-form';
import EditForm from '@/components/business-components/tag/type/edit-form';
export default {
  components: {
    TypeTree,
    ViewForm,
    EditForm
  },
  computed: {
    // 根据路由末位获取类型 region org trade
    type() {
      let arr = this.$route.path.split('/');
      let type = arr[arr.length - 1];
      return type;
    }
  },
  setup(props, { root, refs }) {
    let state = reactive({
      mapping,
      current: null,
      fromMode: 'view'
    });

    function onEdit() {
      state.fromMode = 'edit';
    }
    function onEditSubmit() {
      refs['editForm'].submit();
    }
    function onEditSuccess() {
      state.fromMode = 'view';
      refs['typeTree'].reload();
    }
    function onCancel() {
      state.fromMode = 'view';
      refs['editForm'].clearValidate();
    }

    return {
      ...toRefs(state),
      onEdit,
      onEditSubmit,
      onCancel,
      onEditSuccess
    };
  }
};
</script>

<style lang="scss" scoped>
.type {
  display: flex;
  height: 100%;
  border: 1px solid #e8e8e8;
  .left {
    flex: 0 0 242px;
    overflow: auto;
    border-right: 1px solid #e8e8e8;
    background-color: #fff;
  }
  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 15px;
    overflow-x: hidden;
    background-color: #fff;

    &-foot {
      text-align: center;
    }
  }
}
</style>
