<template>
  <el-dialog
    class="management-marks-dialog"
    title="标记管理"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="onCloseDialog"
    :close-on-click-modal="false"
  >
    <avue-tabs
      class="kp-tabs max"
      :option="tabOption"
      @change="onTabHandleChangeMethod"
    ></avue-tabs>
    <div class="form-main">
      <el-form
        class="form no-rules-form"
        :key="isLoad"
        :model="form"
        ref="refForm"
        label-width="90px"
      >
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="9">
            <el-form-item label="添加时间：">
              <el-date-picker
                class="kp-date-picker"
                v-model="form.rangeDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="9">
            <el-form-item label="地址：">
              <el-input v-model="form.url" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <div class="flex justify-end">
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="onQuery">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">标记列表</span>
        <el-button type="primary">导出</el-button>
      </div>
      <ex-table
        ref="refCrud"
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="outUrl" slot-scope="scope">
          <el-link type="primary">{{ scope.row.outUrl }}</el-link>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex align-center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="信任"
              placement="top"
            >
              <i class="iconfont icontubiaozhizuomoban6"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i class="iconfont icontubiaozhizuomoban22"></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </div>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="onCancle">取消</el-button
        ><el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs
} from '@vue/composition-api';
import { option3 } from '../../table-option';
export default {
  name: 'management-marks-dialog',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    // data
    const refForm = ref(null);
    const state = reactive({
      isLoad: true,
      currentTab: {
        label: '拦截',
        prop: 'intercept'
      },
      tabOption: {
        column: [
          {
            label: '拦截',
            prop: 'intercept'
          },
          {
            label: '信任',
            prop: 'trust'
          }
        ]
      },
      form: {
        rangeDate: [],
        url: ''
      },
      loading: false,
      tableOption: option3,
      data: [
        {
          id: 0,
          username: '小米',
          outUrl: 'https://wwww.baidu.com',
          createTime: '2020-03-03',
          isTrust: 0
        },
        {
          id: 1,
          username: '小米2',
          outUrl: 'https://wwww.baidu.com',
          createTime: '2020-03-03',
          isTrust: 0
        }
      ],
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 100,
        pageSizes: [100, 500, 1000]
      }
    });

    // 属性
    onMounted(() => {
      state.isLoad = false;
      nextTick(() => {
        state.isLoad = true;
      });
    });

    // 方法
    const onSubmit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          console.log(state.form);
        } else {
          console.log('error');
        }
      });
    };
    const onCancle = () => {
      emit('closeDialog');
    };
    const onQuery = () => {};
    const onReset = () => {};
    // 表格加载
    const onLoad = page => {
      // 获取数据
      console.log(page);
    };

    const onCloseDialog = () => {
      emit('closeDialog');
    };
    const onTabHandleChangeMethod = val => {
      console.log(val);
      state.currentTab = val;
    };

    // 返回
    return {
      ...toRefs(state),
      refForm,
      onSubmit,
      onCancle,
      onQuery,
      onReset,
      onLoad,
      onCloseDialog,
      onTabHandleChangeMethod
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.management-marks-dialog {
  /deep/ .el-dialog {
    width: 860px;
    .el-dialog__body {
      padding-top: 10px;
    }
  }
  .form {
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
}
</style>
