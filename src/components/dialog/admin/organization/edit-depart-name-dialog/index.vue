<template>
  <el-dialog
    class="edit-depart-dialog"
    :title="title"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <el-form :model="departForm" ref="departForm" label-width="80px">
        <el-form-item
          label="所属部门："
          prop="name"
          :rules="{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }"
        >
          <el-input v-model="departForm.name" placeholder="请输入"></el-input>
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
// import { putUserInfo } from '@/api/admin/user';
export default {
  name: 'edit-depart-name-dialog',
  components: {},
  data() {
    return {
      departForm: {
        name: ''
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改部门名称'
    }
  },
  computed: {},
  methods: {
    submitHandle() {
      this.$refs['departForm'].validate(async valid => {
        if (valid) {
          console.log(this.departForm);
          this.$emit('onChangeDepart', this.departForm);
          this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-depart-dialog {
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
