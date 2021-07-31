<template>
  <div>
    <!-- 查询 -->
    <el-form
      class="top-form"
      ref="filterFm"
      :model="filter.model"
      label-width="80px"
    >
      <el-row :gutter="10" type="flex" justify="end" class="flex flex-wrap">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="标签：">
            <el-input
              v-model="filter.model.search"
              placeholder="请输入标签名/编码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="标签分类：">
            <select-dict
              v-model="filter.model.type"
              type="label_type"
              show-all
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <div class="flex justify-end" style="margin-bottom: 6px">
            <el-button @click="onFilterReset">重置</el-button>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">标签列表</span>
      <div class="flex">
        <el-button type="primary" @click="onAdd">添加</el-button>
      </div>
    </div>

    <!--表格渲染-->
    <ex-table
      ref="refCrud"
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
    >
      <template slot="menu" slot-scope="scope">
        <div class="flex center icons">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <i
              class="iconfont icontubiaozhizuomoban22"
              @click="onDel(scope.row)"
            ></i>
          </el-tooltip>
        </div>
      </template>
    </ex-table>

    <add-dialog :visible.sync="addDialog.visible" @on-success="onAddSuccess" />

    <!-- 删除信息提示 -->
    <tip-info-dialog
      :tipContent="delTipDialog.tipContent"
      :isOpen="delTipDialog.visible"
      @closeDialog="delTipDialog.visible = false"
      @confirmFn="doDel"
    />
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import { tableOption } from './config';
import * as tagApi from '@/api/tag';
import AddDialog from '@/components/dialog/tag/add';
import TipInfoDialog from '@/components/dialog/tip-dialog/index'; // 提示弹框
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'table.option',
  list: ['.top-form'],
  diff: 60
});
export default {
  name: 'add',
  components: {
    AddDialog,
    TipInfoDialog
  },
  mixins: [mixin],
  setup(props, { root }) {
    let state = reactive({
      // 查询模块
      filter: {
        model: {
          search: '',
          type: ''
        }
      },
      // table列表
      table: {
        loading: false,
        option: tableOption,
        data: [],
        page: {
          currentPage: 1, // 当前页数
          pageSize: 100,
          pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
          total: 0,
          pageSizes: [100, 500, 1000]
        },
        selection: []
      },
      // 添加模态框
      addDialog: {
        visible: false
      },
      // 删除确认弹框
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        },
        ids: [] // 要删除的id集合
      }
    });

    // 获取列表数据
    const getList = async () => {
      state.table.data = [];
      state.table.loading = true;
      let { code, data, total } = await tagApi.getList({
        type: state.filter.model.type,
        search: state.filter.model.search,
        current: state.table.page.currentPage,
        size: state.table.page.pageSize
      });
      state.table.loading = false;
      if (code === 0) {
        state.table.data = data;
        state.table.page.total = total;
      }
    };
    // 添加
    const onAdd = () => {
      state.addDialog.visible = true;
    };
    // 添加成功回调
    const onAddSuccess = () => {
      getList();
    };
    // table加载数据
    const onLoad = page => {
      state.table.page = page;
      getList();
    };
    // 筛选重置
    const onFilterReset = () => {};
    // 检索
    const onQuery = () => {
      state.table.page.currentPage = 1;
      getList();
    };

    // 删除-单个
    const onDel = row => {
      state.delTipDialog.visible = true;
      state.delTipDialog.ids = [row.id];
    };
    // 执行删除-批量
    const doDel = async () => {
      let { code } = await tagApi.del(state.delTipDialog.ids);
      if (code === 0) {
        root.$message.success({
          message: '操作成功'
        });
        getList();
      }
    };

    return {
      ...toRefs(state),
      getList,
      onAdd,
      onAddSuccess,
      onLoad,
      onFilterReset,
      onQuery,
      onDel,
      doDel
    };
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped></style>
