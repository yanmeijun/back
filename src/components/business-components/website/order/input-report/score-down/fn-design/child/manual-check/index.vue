<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">人工检查</span>
      <div class="flex">
        <el-button type="primary" @click="onAdd">录入</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <ex-table
      :data="table.data"
      :option="table.option"
      :loading="table.loading"
      :page="table.page"
      @on-load="onLoad"
    >
      <!-- 栏目url -->
      <template slot="questionUrl" slot-scope="{ row }">
        <el-link
          type="primary"
          class="word-ellipsis-1"
          :href="row.questionUrl"
          target="_blank"
        >
          <span>{{ row.questionUrl }}</span>
        </el-link>
      </template>
      <!-- 操作 -->
      <template slot="menu" slot-scope="{ row }">
        <div class="flex center icons">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"
          >
            <i class="iconfont icontubiaozhizuomoban6" @click="onEdit(row)"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <i class="iconfont icontubiaozhizuomoban22" @click="onDel(row)"></i>
          </el-tooltip>
        </div>
      </template>
    </ex-table>
    <!-- 添加 -->
    <AddDialog :visible.sync="addDialog.visible" @success="getList" />
    <!-- 编辑 -->
    <EditDialog
      :visible.sync="editDialog.visible"
      :data="editDialog.data"
      @success="getList"
    />
    <!-- 删除信息提示 -->
    <TipInfoDialog
      :tipContent="delTipDialog.tipContent"
      :isOpen="delTipDialog.visible"
      @closeDialog="delTipDialog.visible = false"
      @confirmFn="doDel"
    />
  </div>
</template>

<script>
import { tableOption } from './config';
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  components: {
    AddDialog: () => import('./add-dialog'),
    EditDialog: () => import('./edit-dialog'),
    TipInfoDialog: () => import('@/components/dialog/tip-dialog/index')
  },
  data() {
    return {
      // 添加
      addDialog: {
        visible: false
      },
      // 编辑
      editDialog: {
        visible: false,
        data: null
      },
      // 删除
      delTipDialog: {
        visible: false,
        tipContent: {
          title: '您确定要删除吗？删除后不可恢复.'
        },
        urlGroups: [] // 要删除的组标识集合
      },
      // 列表
      table: {
        loading: false,
        // 配置
        option: tableOption,
        // 数据
        data: [],
        // 分页
        page: {
          currentPage: 1,
          pageSize: 30,
          pagerCount: 5,
          total: 0,
          pageSizes: [30, 50, 100]
        }
      }
    };
  },
  inject: ['param'],
  methods: {
    // 数据加工
    transData(data = []) {
      data.forEach(item => {
        // 问题类型 存在多级情况
        item.ex_questionType = [item.questionName, item.secondQuestionName]
          .filter(val => val)
          .join('/');
      });
      return data;
    },
    // 获取列表数据
    async getList() {
      this.table.data = [];
      this.table.loading = true;
      let { code, data, total } = await inputReportApi.getList({
        taskId: this.param.taskDetail.taskId,
        orderId: this.param.taskDetail.orderId,
        targetType: 139,
        siteId: this.param.taskDetail.siteId,
        page: {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
      });
      this.table.loading = false;
      if (code === 0) {
        data = this.transData(data); // 数据加工
        this.table.data = data;
        this.table.page.total = total;
      }
    },
    // 加载回调
    onLoad(page) {
      this.table.page = page;
      this.getList();
    },
    // 添加
    onAdd() {
      this.addDialog.visible = true;
    },
    // 编辑
    onEdit(row) {
      this.editDialog.data = row;
      this.editDialog.visible = true;
    },
    // 删除
    onDel(row) {
      this.delTipDialog.visible = true;
      this.delTipDialog.urlGroups = [row.urlGroup];
    },
    // 执行删除-批量
    async doDel() {
      let { code } = await inputReportApi.inputDel(this.delTipDialog.urlGroups);
      if (code === 0) {
        this.$message.success({
          message: '操作成功'
        });
        this.getList();
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped></style>
