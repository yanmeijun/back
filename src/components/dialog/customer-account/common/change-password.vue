<template>
  <el-dialog
    class="dialog"
    title="修改密码"
    width="550"
    :visible.sync="self_visible"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <div class="form-main" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="10" class="row">
          <el-col :span="24">
            <el-form-item label="名称：">
              {{ form.custName }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编码/用户名：">
              {{ form.custCode }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码：" prop="password">
              <el-input
                v-model="form.password"
                placeholder="6-16位的字母/数字/组合"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码：" prop="rPassword">
              <el-input
                v-model="form.rPassword"
                placeholder="确认密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { pattern } from '@/util/validate';
import * as custAccountApi from '@/api/cust-account';
export default {
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 当前实体
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    let rPassowrdValidator = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      self_visible: this.visible,
      loading: false,
      form: {
        custCode: this.model.custCode,
        custName: this.model.custName,
        password: '',
        rPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: pattern.password,
            message: '6-16位的字母/数字/组合',
            trigger: 'blur'
          }
        ],
        rPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: rPassowrdValidator, trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    visible(val) {
      this.self_visible = val;
    },
    self_visible(val) {
      this.$emit('update:visible', val);
    },
    'model.id'() {
      this.form.custCode = this.model.custCode;
      this.form.custName = this.model.custName;
    }
  },
  methods: {
    // 提交数据
    async doSubmit() {
      this.loading = true;
      let { code, err } = await custAccountApi.changePassword({
        custId: this.model.id,
        custPassword: this.form.password
      });
      this.loading = false;
      if (code || err) {
        this.$message.error({
          message: '操作失败'
        });
        return;
      }
      this.$message.success({
        message: '操作成功'
      });
      this.self_visible = false;
      this.$emit('on-success');
    },
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (!valid) {
          return;
        }
        this.doSubmit();
      });
    },
    onClose() {
      this.self_visible = false;
    },
    onClosed() {
      this.reset();
    },
    reset() {
      this.$refs['form'].resetFields();
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dialog {
  ::v-deep {
    .el-dialog__body {
      padding-top: 16px;
    }
  }
  .form-main {
    .row {
      padding: 0 30px;
    }
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 46vh;
  }
}
</style>
