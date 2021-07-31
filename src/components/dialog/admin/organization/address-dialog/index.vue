<template>
  <el-dialog
    class="edit-pass-dialog"
    title="选择地区"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :modal="false"
  >
    <div class="form-main">
      <el-form :model="addressForm" ref="addressForm" label-width="80px">
        <el-button plain class="add-btn" @click="addAddress"
          ><i class="el-icon-plus"></i> 添加</el-button
        >
        <el-form-item
          :label="`地区${index + 1}`"
          v-for="(ele, index) in addressForm.list"
          :key="ele.key"
          :prop="'list.' + index + '.value'"
          :rules="addRule"
        >
          <el-cascader
            v-model="ele.value"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
          <i
            class="el-icon-remove-outline del-icon"
            v-if="index > 0"
            @click="removeAddress(ele)"
          ></i>
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
  name: 'address-dialog',
  components: {},
  data() {
    let validatorAdd = (rule, value, callback) => {
      let has = this.addressForm.list.filter(
        ele => ele.value.join(',') === value.join(',')
      );
      if (!value || !value.length) {
        callback(new Error('请选择地址'));
      } else if (has.length > 1 && this.addressForm.list.length > 1) {
        callback(new Error('地址已存在!'));
      } else {
        callback();
      }
    };
    return {
      addressForm: {
        list: []
      },
      addRule: [
        {
          validator: validatorAdd,
          required: true,
          trigger: 'change'
        }
      ],
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        }
      ]
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    init(list) {
      if (!list || !list.length) {
        this.addressForm.list.push({
          value: [],
          key: Date.now()
        });
        return;
      }
      // 数据绑定：需要新对象
      this.addressForm.list = Object.assign([], list);
    },
    submitHandle() {
      this.$refs['addressForm'].validate(async valid => {
        if (valid) {
          console.log(this.addressForm);
          this.$emit('onChangeAddress', this.addressForm.list);
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
    handleChange(val) {
      console.log(val);
    },
    addAddress() {
      this.addressForm.list.push({
        value: [],
        key: Date.now()
      });
    },
    removeAddress(item) {
      var index = this.addressForm.list.indexOf(item);
      if (index !== -1) {
        this.addressForm.list.splice(index, 1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-pass-dialog {
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
