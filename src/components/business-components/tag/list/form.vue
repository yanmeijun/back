<template>
  <div class="form-main" v-loading="loading">
    <el-form ref="form" :model="model" :rules="rules" label-width="80px">
      <el-row :gutter="10" class="row">
        <el-col :xs="24">
          <el-form-item label="标签分类：" prop="type">
            <el-select v-model="model.type">
              <el-option label="地区" value="region"></el-option>
              <el-option label="机构" value="org"></el-option>
              <el-option label="行业" value="trade"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="标签名称：" prop="typeId">
            <select-tag-type-tree
              ref="selectTagTypeTree"
              :type="model.type"
              v-model="model.typeId"
              show-all-levels
              separator="_"
              :all-level-code.sync="model.code"
              :all-level-name.sync="model.name"
              clearable
              @clear="onSelectTagTypeClear"
            ></select-tag-type-tree>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="标签编码：" prop="code">
            <el-input :value="model.code" readonly disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import * as tagApi from '@/api/tag';
import { reactive, toRefs } from '@vue/composition-api';
import SelectTagTypeTree from '@/components/business-components/tag/common/select-tag-type-tree';
export default {
  components: {
    SelectTagTypeTree
  },
  props: {},
  watch: {
    // 'model.type'(val) {
    //   this.$refs['form'].clearValidate();
    // }
  },
  setup(props, { root, refs, emit }) {
    let state = reactive({
      loading: false,
      model: {
        type: 'region',
        typeId: '',
        name: '',
        code: ''
      },
      rules: {
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        typeId: [{ required: true, message: '请输入', trigger: 'change' }],
        code: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    });

    // 执行向后台提交数据
    async function doSubmit() {
      let typeMap = {
        region: 1,
        trade: 2,
        org: 3
      };
      state.loading = true;
      let { code, msg } = await tagApi.add({
        type: typeMap[state.model.type],
        name: state.model.name,
        code: state.model.code
      });
      state.loading = false;
      if (code === 0) {
        root.$message.success({
          message: '添加成功'
        });
        emit('on-success');
      } else {
        root.$message.error({
          message: msg
        });
      }
    }

    // 提交方法
    function submit() {
      refs['form'].validate(async valid => {
        if (!valid) {
          return;
        }
        doSubmit();
      });
    }

    // 标签类型下拉值清空
    function onSelectTagTypeClear() {
      state.model.typeId = '';
      state.model.code = '';
      state.model.name = '';
    }

    return {
      ...toRefs(state),
      submit,
      doSubmit,
      onSelectTagTypeClear
    };
  }
};
</script>
<style lang="scss" scoped>
.form-main {
  .row {
    padding: 0 30px;
  }
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 46vh;
}
</style>
