<template>
  <el-dialog
    class="change-depart-dialog"
    title="调整所属部门"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
  >
    <div class="form-main">
      <el-form
        :model="departForm"
        :rules="rules"
        ref="departForm"
        label-width="80px"
      >
        <el-form-item label="所属部门" prop="part">
          <el-cascader
            v-model="departForm.part"
            :show-all-levels="false"
            :options="options"
            :props="{
              emitPath: false,
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'name',
              value: 'id'
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getTreeList, updateUserDept } from '@/api/admin/organization';
// import { putUserInfo } from '@/api/admin/user';
export default {
  name: 'edit-pass-dialog',
  components: {},
  data() {
    return {
      departForm: {
        part: ''
      },
      rules: {
        part: {
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }
      },
      options: []
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    checkedList: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  mounted() {
    this.getTreeList();
  },
  methods: {
    submitHandle() {
      this.$refs['departForm'].validate(async valid => {
        if (valid) {
          const ids = this.checkedList.map(ele => ele.userId);
          console.log(ids);
          const { code, msg } = await updateUserDept({
            userIds: ids,
            deptIds: [this.departForm.part]
          });
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '修改失败！'
            });
            return;
          }
          this.$message({
            type: 'success',
            message: msg || '修改成功！'
          });
          this.$emit('update');
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async getTreeList() {
      const { data, code } = await getTreeList();
      if (code) {
        this.options = [];
        return;
      }
      this.options = this.resetTreeData(data);
    },
    resetTreeData(data) {
      return data.map(ele => {
        if (ele.children && ele.children.length > 0) {
          this.resetTreeData(ele.children);
          return ele;
        }
        ele.children = undefined;
        return ele;
      });
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.change-depart-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 497px;
    }
  }
  .form-main {
    padding: 0 30px;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 46vh;
  }
  .add-btn {
    width: 100%;
    margin-bottom: 10px;
    border-style: dashed;
  }
  .del-icon {
    cursor: pointer;
    position: absolute;
    right: -24px;
    top: 8px;
    font-size: 18px;
  }
}
</style>
