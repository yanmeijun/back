<template>
  <el-dialog
    class="add-depart-dialog"
    title="添加部门信息"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :modal="true"
  >
    <el-form label-width="80px" ref="form" :model="form" :rules="rules">
      <h2 class="kp-dialog-title">树结构排序</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="父级节点：" prop="parentId">
            <el-cascader
              v-if="form.parentId !== 0"
              v-model="form.parentId"
              :show-all-levels="false"
              :options="departOptions"
              :props="{
                emitPath: false,
                checkStrictly: true,
                expandTrigger: 'hover',
                label: 'name',
                value: 'id'
              }"
            ></el-cascader>
            <span v-else>{{ form.parentId }}</span>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="节点编号：">
            {{ form.deptId }}
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="排序：" prop="sort">
            <el-input type="number" v-model.number="form.sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getTreeList, hasDept, createDept } from '@/api/admin/organization';
export default {
  name: 'add-depart-dialog',
  data() {
    // var checkNum = (rule, value, callback) => {
    //   setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //       callback(new Error('请输入数字值'));
    //     } else {
    //       callback();
    //     }
    //   }, 500);
    // };
    // let validateName = (rule, value, callback) => {
    //   if (this.hasName) {
    //     callback(new Error('账号已存在'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      hasName: false,
      form: {
        parentId: '',
        deptId: '',
        sort: '',
        name: ''
      },
      rules: {
        parentId: [
          { required: true, message: '请输入父节点编号', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请输入节点编号', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序编号', trigger: 'blur' },
          {
            type: 'number',
            message: '请输入数字值',
            trigger: ['blur']
          }
        ],
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
          // {
          //   validator: validateName,
          //   trigger: ['blur']
          // }
        ]
      },
      departOptions: [],
      currentNode: {}
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
    // currentNode: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  created() {
    this.getData();
  },
  methods: {
    init(level, currentNode) {
      if (this.validatenull(currentNode)) return;
      console.log(currentNode);
      this.currentNode = currentNode;
      if (level === 'sub') {
        // 子集
        this.form.parentId = currentNode.id;
        return;
      }
      if (currentNode.isRootNode === 0) {
        // 根节点
        this.form.parentId = 0;
        console.log('root', this.form);
        return;
      }
      this.form.parentId = currentNode.parentId;
    },
    submitHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          console.log(this.form);
          const { code, msg } = await createDept(this.form);
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
    closeDialog() {
      this.$emit('closeDialog');
    },
    getData() {
      this.getTreeList();
    },
    async checkName() {
      const { data } = await hasDept({
        name: this.form.name
      });
      this.hasName = data.length > 0 ? true : false;
      this.$refs.form.validateField('name');
    },
    async getTreeList() {
      const { data, code } = await getTreeList();
      if (code) {
        this.departOptions = [];
        return;
      }
      this.departOptions = this.resetTreeData(data);
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
    }
  }
};
</script>
