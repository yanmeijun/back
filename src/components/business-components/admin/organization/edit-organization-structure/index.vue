<template>
  <div class="edit-organization-structure">
    <el-form :model="form" label-width="80px" v-if="isDetail">
      <h2 class="kp-dialog-title">树结构排序</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="8" v-if="form.isRootNode !== 0">
          <el-form-item label="父级节点：">
            <el-cascader
              v-model="form.parentId"
              disabled
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
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="节点编号：">
            {{ form.deptId }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="排序：">
            {{ form.sort }}
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="部门名称：">
            <span class="word-ellipsis-1">{{ form.name || '--' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" v-if="deptManager_btn_edit">
          <div class="flex center">
            <el-button type="primary" @click="editMethod">编辑</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width="80px" ref="form" v-else :model="form" :rules="rules">
      <h2 class="kp-dialog-title">树结构排序</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="父级节点：" prop="parentId">
            <el-cascader
              v-if="form.isRootNode !== 0"
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
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="节点编号：">
            {{ form.deptId }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="排序：" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="kp-dialog-title">基础信息</h2>
      <el-row :gutter="10" class="form-con">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <div class="flex center">
            <el-button type="primary" @click="submitMethod">确定</el-button>
            <el-button @click="cancleMethod">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDeptId, getTreeList, updateDept } from '@/api/admin/organization';
import { mapGetters } from 'vuex';
export default {
  name: 'edit-organization-structure',
  data() {
    var checkNum = (rule, value, callback) => {
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      isDetail: true,
      form: {
        parentId: '',
        deptId: '',
        sort: '',
        name: ''
      },
      preForm: {},
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
            validator: checkNum,
            trigger: ['blur']
          }
        ],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      deptManager_btn_edit: false,
      departOptions: []
    };
  },
  props: {
    currentNode: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    currentNode() {
      this.getData();
    },
    permissions: {
      handler() {
        this.setPermissions();
      },
      deep: true
    }
  },
  created() {
    this.getData();
    this.setPermissions();
  },
  methods: {
    setPermissions() {
      // this.deptManager_btn_add = this.permissions['sys_dept_add'];
      this.deptManager_btn_edit = this.permissions['sys_dept_edit'];
      // this.deptManager_btn_del = this.permissions['sys_dept_del'];
    },
    getData() {
      this.getInfo();
      this.getTreeList();
    },
    async getInfo() {
      if (this.validatenull(this.currentNode)) return;
      const { data } = await getDeptId({
        id: this.currentNode.id
      });
      const {
        parentId = 0,
        sort = 0,
        deptId = 0,
        name = '',
        isRootNode
      } = data;
      this.form = { parentId, sort, deptId, name, isRootNode };
      this.preForm = { parentId, sort, deptId, name, isRootNode };
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
    },
    submitMethod() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          console.log(this.form);
          const { parentId, sort, deptId, name } = this.form;
          const { code, msg } = await updateDept({
            parentId,
            sort,
            deptId,
            name
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
          this.isDetail = true;
          this.$emit('update');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editMethod() {
      this.isDetail = false;
    },
    cancleMethod() {
      this.isDetail = true;
      this.form = Object.assign({}, this.preForm);
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-organization-structure {
  .form-con {
    padding: 0 30px;
  }
}
</style>
