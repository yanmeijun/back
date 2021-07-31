<template>
  <el-dialog
    class="edit-member-dialog"
    :title="`${title}成员信息`"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main" v-loading="loading">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <h2 class="kp-dialog-title">基础信息</h2>
        <div class="one-form">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="username" label="账号：">
                <el-input
                  v-model="form.username"
                  autocomplete="off"
                  placeholder="账号: 3-16个字"
                  @input="checkUsername"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" v-if="!isEdit">
              <el-form-item prop="password" label="密码：">
                <el-input
                  type="password"
                  show-password
                  v-model="form.password"
                  autocomplete="off"
                  placeholder="6-16位的字母/数字/组合"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item label="姓名：" prop="accountName">
                <el-input
                  v-model="form.accountName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="phone" label="手机号：">
                <el-input
                  v-model="form.phone"
                  maxlength="11"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="email" label="邮箱：">
                <el-input v-model="form.email" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="role" label="角色：">
                <el-select
                  v-model="form.role"
                  multiple
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item label="状态：">
                <el-radio
                  class="no-margin"
                  v-model="form.lockFlag"
                  label="0"
                  border
                >
                  启用
                </el-radio>
                <el-radio v-model="form.lockFlag" label="9" border>
                  禁用
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item label="职务：">
                <el-input
                  v-model="form.postName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="part-con">
          <h2 class="kp-dialog-title">所属部门</h2>
          <div class="one-form two-form">
            <el-row :gutter="10">
              <template v-for="(item, index) in form.ex_depts">
                <template v-if="index === 0">
                  <el-col :xs="16" :sm="12" :md="12" :key="item.key">
                    <el-form-item
                      :prop="'ex_depts.' + index + '.part'"
                      label="部门："
                      :rules="{
                        required: true,
                        message: '部门不能为空',
                        trigger: 'change'
                      }"
                    >
                      <el-cascader
                        v-model="item.part"
                        :show-all-levels="false"
                        :options="deptOptions"
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
                  <el-col :xs="8" :sm="12" :md="12" :key="`${item.key}-add`">
                    <el-form-item label-width="0">
                      <el-button
                        class="btn-dashed"
                        plain
                        icon="iconfont icontubiaozhizuomoban31"
                        @click="addOrDelPart(item)"
                        >添加</el-button
                      >
                    </el-form-item>
                  </el-col>
                </template>
                <template v-else>
                  <el-col :xs="24" :sm="12" :md="12" :key="item.key">
                    <el-form-item
                      :prop="'ex_depts.' + index + '.part'"
                      label="部门："
                      :rules="{
                        required: true,
                        message: '部门不能为空',
                        trigger: 'change'
                      }"
                    >
                      <el-cascader
                        v-model="item.part"
                        :show-all-levels="false"
                        :options="deptOptions"
                        :props="{
                          emitPath: false,
                          checkStrictly: true,
                          expandTrigger: 'hover',
                          label: 'name',
                          value: 'id'
                        }"
                      ></el-cascader>
                      <button
                        class="kp-add-remove kp-add-remove--mini kp-add-remove--danger kp-add-remove--circle"
                        @click="addOrDelPart(item)"
                      >
                        <i class="el-icon-close"></i>
                      </button>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
              <el-col v-if="isCustomerAuth" :xs="24" :sm="24" :md="24">
                <el-form-item
                  class="form-item--auth"
                  prop="auth"
                  label="数据权限："
                >
                  <el-button
                    class="btn-dashed"
                    plain
                    icon="iconfont icontubiaozhizuomoban40"
                    @click="onSelectAuth"
                  >
                    选择
                  </el-button>
                  <el-tag
                    v-if="form.orgCustList.length"
                    class="el-tag--ex-default"
                    closable
                    @close="onAuthRemove('org')"
                  >
                    组织填报单位{{ form.orgCustList.length }}项
                  </el-tag>
                  <el-tag
                    v-if="form.webCustList.length"
                    class="el-tag--ex-default"
                    closable
                    @close="onAuthRemove('site')"
                  >
                    网站填报单位{{ form.webCustList.length }}项
                  </el-tag>
                  <el-tag
                    v-if="form.mediaCustList.length"
                    class="el-tag--ex-default"
                    closable
                    @close="onAuthRemove('newmedia')"
                  >
                    新媒体填报单位{{ form.mediaCustList.length }}项
                  </el-tag>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </div>
    <!-- 权限选择器 -->
    <member-auth-selector
      ref="memberAuthSelector"
      :visible.sync="memberAuthSelector.visible"
      :deptIds="beloneDeptIds"
      @on-ok="onMemberAuthSelectorOk"
    />
  </el-dialog>
</template>
<script>
import { guid, flatTreeData } from '@/util/util';
import MemberAuthSelector from '../member-auth-selector-dialog';
import {
  getRoleList,
  getTreeList,
  getCheckUsername,
  getUserInfo,
  addUser,
  updateUser
} from '@/api/admin/organization';
import * as custAccountApi from '@/api/cust-account';
import { isPhone, isEmail, pattern } from '@/util/validate';
export default {
  name: 'edit-organization-member-dialog',
  components: {
    MemberAuthSelector
  },
  data() {
    let validatePass = (rule, value, callback) => {
      let reg = pattern.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!reg.test(value)) {
        callback(new Error('6-16位的字母/数字/组合'));
      } else {
        callback();
      }
    };
    let validatePhone = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error('手机号格式不正确'));
      } else {
        callback();
      }
    };
    let validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    };
    let validateUsername = (rule, value, callback) => {
      if (this.hasUser) {
        callback(new Error('账号已存在'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      isEdit: false,
      title: '添加',
      form: {
        username: '',
        password: '',
        accountName: '',
        phone: '',
        email: '',
        postName: '',
        role: [],
        part: '',
        lockFlag: '0',
        ex_depts: [
          {
            key: guid(),
            part: ''
          }
        ],
        orgCustList: [], // 权限-组织单位
        webCustList: [], // 权限-网站填报单位
        mediaCustList: [] // 权限-新媒体填报单位
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        accountName: [
          // { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '长度在 2 到 30 个字',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: validatePhone,
            trigger: ['blur']
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: validateEmail,
            trigger: ['blur']
          }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        part: [{ required: true, message: '请选择部门', trigger: 'change' }]
      },
      hasUser: false,
      roleOptions: [],
      deptOptions: [], // 部门数据-树结构
      deptOptionsFlatData: [], // 部门平铺数据
      authDetailList: [], // 权限详情
      memberAuthSelector: {
        visible: false,
        sectData: null // 选中的数据
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 所属部门集合
    beloneDepts() {
      if (!this.deptOptionsFlatData.length || !this.form.ex_depts) {
        return [];
      }
      let deptIds = this.form.ex_depts
        .filter(item => item.part)
        .map(item => item.part);
      let data = this.deptOptionsFlatData.filter(item => {
        return deptIds.includes(item.id);
      });
      return data;
    },
    // 所属部门id集合
    beloneDeptIds() {
      return this.beloneDepts.map(item => item.id);
    },
    /**
     * 成员是否自定义权限
     * 影响：页面是否显示选择权限
     * 赋值 = 所属部门都自定义了权限 ? true : false
     */
    isCustomerAuth() {
      // 注意理解：isAuthority属性代表是否启用了全部权限 0 全部权限 1 自定义权限
      return this.beloneDepts.every(item => item.isAuthority);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    init(row, currentNodeData) {
      if (this.validatenull(row)) {
        this.title = '添加';
        this.isEdit = false;
        if (!currentNodeData || !currentNodeData.id) return;
        this.form.ex_depts = [
          {
            key: guid(),
            part: currentNodeData.id
          }
        ];
        return;
      }
      // 初始化赋值
      this.title = '编辑';
      this.isEdit = true;
      this.getUserInfo(row.userId);
    },
    getData() {
      this.getRoleList();
      this.getTreeList();
    },
    submitHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let bool = false;
          const params = Object.assign({}, this.form, {
            deptList: this.beloneDeptIds
          });
          delete params.ex_depts;
          if (this.isEdit) {
            bool = await this.updateUser(params);
          } else {
            bool = await this.addUser(params);
          }
          bool && this.$emit('update', { isAddOrDel: !this.isEdit });
          bool && this.closeDialog();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addUser(params) {
      const { msg, code } = await addUser(params);
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '添加成员失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '添加成员成功！'
      });
      return true;
    },
    async updateUser(params) {
      const { msg, code } = await updateUser(params);
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '修改成员失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '修改成员成功！'
      });
      return true;
    },
    async getRoleList() {
      const { data } = await getRoleList();
      this.roleOptions = data;
    },
    async getTreeList() {
      const { data, code } = await getTreeList();
      if (code) {
        this.deptOptions = [];
        return;
      }
      this.deptOptions = this.resetTreeData(data);
      this.deptOptionsFlatData = flatTreeData(data);
    },
    async getUserInfo(id) {
      const { data } = await getUserInfo({
        id
      });
      const ex_depts = data.deptList.map((item, i) => {
        return {
          key: guid(),
          part: item.deptId
        };
      });
      const role = data.roleList.map(item => item.roleId);
      const {
        accountName,
        lockFlag,
        email,
        phone,
        username,
        postName,
        deptId,
        userId,
        dataAuthority
      } = data;
      this.form = Object.assign(
        {},
        {
          accountName,
          lockFlag,
          email,
          phone,
          username,
          postName,
          deptId,
          userId,
          // 权限相关
          orgCustList: dataAuthority.orgCustIdList
            ? dataAuthority.orgCustIdList
            : [],
          webCustList: dataAuthority.webCustIdList
            ? dataAuthority.webCustIdList
            : [],
          mediaCustList: dataAuthority.mediaCustIdList
            ? dataAuthority.mediaCustIdList
            : []
        },
        { ex_depts, role }
      );

      this.getAuthDetailList().then(data => {
        this.authDetailList = data;
        this.memberAuthSelectorSelectionSet(); // 初始化权限选择器选中数据
      });
    },
    checkUsername(username) {
      setTimeout(async () => {
        const { data } = await getCheckUsername({
          username
        });
        this.hasUser = data.userId || data.username ? true : false;
        this.$refs.form.validateField('username');
      }, 300);
    },
    resetTreeData(data) {
      return data.map(item => {
        if (item.children && item.children.length > 0) {
          this.resetTreeData(item.children);
          return item;
        }
        item.children = undefined;
        return item;
      });
    },
    addOrDelPart(item) {
      var index = this.form.ex_depts.indexOf(item);
      if (index !== -1 && index > 0) {
        this.form.ex_depts.splice(index, 1);
      } else {
        this.form.ex_depts.push({
          key: guid(),
          part: ''
        });
      }
    },
    // 选择权限
    onSelectAuth() {
      this.memberAuthSelector.visible = true;
      this.memberAuthSelectorSelectionSet(); // 重新赋值
    },
    // 成员权限选择回调
    onMemberAuthSelectorOk(data) {
      this.authDetailList = data.selection;
      this.form.orgCustList = data.org.map(item => item.id);
      this.form.webCustList = data.site.map(item => item.id);
      this.form.mediaCustList = data.newmedia.map(item => item.id);
    },
    // 权限移除
    onAuthRemove(type) {
      let ids = [];
      if (type === 'org') {
        ids = this.form.orgCustList;
      } else if (type === 'site') {
        ids = this.form.webCustList;
      } else if (type === 'newmedia') {
        ids = this.form.mediaCustList;
      }
      ids.forEach(id => {
        let index = this.authDetailList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.authDetailList.splice(index, 1);
        }
      });
      ids.splice(0, ids.length); // 清除表单对应权限
    },
    // 根据返回用户信息中单位权限ids获取详情集合
    async getAuthDetailList() {
      let ids = [
        ...this.form.orgCustList,
        ...this.form.webCustList,
        ...this.form.mediaCustList
      ];
      let { code, data } = await custAccountApi.getListByIds(ids);
      if (code) {
        return Promise.reject();
      }
      // 获取类型
      let getType = data => {
        let type = '';
        if (data.custLevel === '0') {
          type = 'org';
        } else if (data.source === 'WZ') {
          type = 'site';
        } else if (data.source === 'BS') {
          type = 'newmedia';
        }
        return type;
      };
      data.forEach(item => {
        item.ex_type = getType(item);
      });
      return Promise.resolve(data);
    },
    // 成员权限选择器选中数据
    memberAuthSelectorSelectionSet() {
      this.$refs.memberAuthSelector.selectionSet(this.authDetailList);
    },
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.edit-member-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 772px;
      .el-dialog__body {
        padding-top: 16px;
      }
    }
  }
  .form-main {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 46vh;
    .one-form {
      padding: 0 30px;
    }
    .no-margin {
      margin: 0;
    }
    .btn-dashed {
      border-style: dashed;
      /deep/ i {
        font-size: 12px;
        margin-right: 3px;
      }
    }
    .kp-add-remove {
      position: absolute;
      top: -8px;
      right: -8px;
    }
    .del-role-icon {
      position: absolute;
      right: -8px;
      top: -6px;
      padding: 2px 2px 2px 2px;
      background: $mainDanger;
      border-radius: 50%;
      color: #fff;
      font-size: 10px;
      cursor: pointer;
    }
    .add-part-icon {
      padding: 5px;
      border-radius: 4px;
      background: var(--primary);
      color: #fff;
      font-size: 10px;
      cursor: pointer;
      &.del-part-icon {
        background: transparent;
        color: $mainBlack45;
        font-size: 20px;
        padding: 0;
      }
    }
    .part-list {
      align-items: flex-start;
      & > * {
        margin: 0 8px 8px 0;
      }
    }
    .choise-item {
      max-width: 220px;
      font-size: 14px;
      line-height: 14px;
      padding: 8px 34px 8px 15px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      position: relative;
      &.is-all {
        padding-right: 15px;
      }
      i {
        position: absolute;
        right: 5px;
        top: 9px;
        cursor: pointer;
      }
    }

    .form-item--auth {
      /deep/ .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .el-tag--ex-default {
          margin-left: 8px;
          // margin-bottom: 8px;
          // &:nth-of-type(3) {
          //   margin-left: 0;
          //   margin-bottom: 0;
          // }
          .total {
            color: rgba(0, 0, 0, 0.25);
          }
        }
      }
    }
  }
}
.el-tag.el-tag--ex-default {
  margin-bottom: 4px;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border: 1px solid #d9d9d9;
  /deep/ .el-icon-close {
    transform: scale(1);
    border-radius: 2px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
  /deep/ .el-tag__close {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
