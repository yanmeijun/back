<template>
  <el-dialog
    class="edit-pass-dialog"
    title="按页码导出"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="form-main">
      <TipAlert :content="tipContent" />
      <el-form
        class="form"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
      >
        <el-form-item prop="page" label="导出页数：">
          <el-input
            class="page-input"
            v-model="ruleForm.page"
            placeholder="例如：1-5、6、8-10"
          >
            <div slot="suffix">
              <span
                :class="{
                  'kp-color-error': count.pageSize > pageSizes * pageSize
                }"
                >{{ count.pageSize }}条</span
              >/{{ pageSizes }}页
            </div>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitHandle" :disabled="disabled">{{
          subBtn
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import { getStore } from '@/util/store';
import { exportTable } from '@/api/common';
import TipAlert from '@/components/base/tip-alert/index';
export default {
  name: 'export-page-data-dialog',
  components: {
    TipAlert
  },
  data() {
    let validateData = (rule, value, callback) => {
      let val = this.checkDataLength(value);
      if (value === '') {
        callback(new Error('请输入页码'));
      } else if (val.msg) {
        callback(new Error(val.msg));
      } else {
        callback();
      }
    };
    return {
      disabled: false,
      subBtn: '确 定',
      exportType: 0,
      len: 50000,
      tipContent:
        '最大支持一次导出<span class="kp-color-main">5万</span>条数据',
      ruleForm: {
        page: ''
      },
      rules: {
        page: [{ validator: validateData, trigger: 'blur' }]
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 100
    },
    total: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    args: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    count() {
      return this.checkDataLength(this.ruleForm.page);
    },
    pageSizes() {
      return Math.floor(this.len / this.pageSize);
    }
  },

  methods: {
    submitHandle() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          // console.log(this.ruleForm);
          let [pageStart, pageEnd = pageStart] = this.ruleForm.page.split('-');
          if (!this.url) {
            console.log('丢失导出url!');
            return;
          }
          let args = this.validatenull(this.args) ? {} : this.args;
          let params = Object.assign(
            {},
            {
              url: this.url,
              exportType: this.exportType,
              pageStart,
              pageEnd,
              pageSize: this.pageSize
            },
            args
          );
          this.disabled = true;
          this.subBtn = '导出中...';
          let { code, msg } = await exportTable(params);
          this.disabled = false;
          this.subBtn = '确 定';
          if (code) {
            this.$message({
              type: 'error',
              message: msg || '导出失败！'
            });
            return;
          }
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
    checkDataLength(value) {
      let reg = /^\d+(-?\d+)?$/g;
      let reg2 = /-/;
      let msg = '页码格式不正确！';
      let pageSize = 0;
      if (!value || !reg.test(value)) {
        return {
          pageSize,
          msg
        };
      }
      let [one = 0, two = 0] = value.split('-');
      // 01-010;
      if (one.length > 0 && one[0] === '0') {
        return {
          pageSize: 0,
          msg
        };
      }
      if (two.length > 0 && two[0] === '0') {
        return {
          pageSize: 0,
          msg
        };
      }
      one = parseInt(one);
      two = parseInt(two);

      // 页码差值;
      if (one <= 0) {
        return {
          pageSize: 0,
          msg: '起始页码不能小于1！'
        };
      }
      if (two === 0 && !reg2.test(value)) {
        two = one;
      }
      pageSize = two - one + 1;
      // 多个页码
      if (pageSize <= 0) {
        return {
          pageSize: 0,
          msg: '开始页码不能大于结束页码！'
        };
      }

      if (pageSize > this.pageSizes) {
        return {
          pageSize: pageSize * this.pageSize,
          msg: '最大支持导出5万条数据！'
        };
      }

      // 超出页码
      let maxPage = Math.ceil(this.total / this.pageSize);
      if (one > maxPage || two > maxPage) {
        return {
          pageSize: 0,
          msg: '页码超出数据范围！'
        };
      }

      return {
        pageSize: pageSize * this.pageSize,
        msg: ''
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-pass-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 530px;
    }
    .el-dialog__body {
      padding-top: 16px;
    }
  }
  .form-main {
    overflow-x: hidden;
    overflow-y: auto;
    .form {
      padding: 0 30px 0;
    }
    .page-input {
      ::v-deep {
        .el-input__inner {
          padding-right: 90px;
        }
      }
    }
  }
  .form {
    padding-top: 10px;
  }
}
</style>
