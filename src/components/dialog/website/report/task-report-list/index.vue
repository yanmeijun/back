<template>
  <el-dialog
    class="viewReportClass"
    title="查看报告"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">报告列表</span>
      <el-button type="primary" disabled @click="onDownloadAll"
        >全部下载</el-button
      >
    </div>
    <div>
      <ex-table
        :data="tableData"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="fileSize" slot-scope="{ row }">
          <div class="flex center">{{ row.fileSize || 0 }}M</div>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="下载"
              placement="top"
              :enterable="false"
            >
              <i
                :class="[
                  'iconfont icontubiaozhizuomoban8',
                  {
                    disabled: row.reportStatus !== '2' || !row.fileUrl
                  }
                ]"
                @click="onDownload(row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </div>
  </el-dialog>
</template>
<script>
import { getReportListByTask } from '@/api/website/report';
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    // 任务id
    taskId: {
      type: String | Number,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      tableOption: {
        menu: true, // 隐藏操作
        menuWidth: 60,
        height: 250,
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '标识码',
            prop: 'siteCode',
            width: 160
          },
          {
            label: '文件名',
            prop: 'fileName',
            showOverflow: true,
            minWidth: 150
          },
          {
            label: '文件格式',
            prop: 'fileModeMeaning',
            width: 100
          },
          {
            label: '文件大小',
            prop: 'fileSize',
            width: 100,
            slot: true
          }
        ]
      },
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onLoad(page) {
      console.log(page);
      this.getList();
    },
    async getList() {
      this.loading = true;
      const { code, data } = await getReportListByTask({
        taskId: this.taskId,
        status: 1,
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        }
      });
      this.loading = false;
      if (code !== 0) {
        this.page.total = 0;
        this.tableData = [];
        return;
      }
      this.page.total = data.total;
      this.tableData = data.records;
    },
    // 下载-单个
    onDownload(row) {
      if (row.reportStatus !== '2' || !row.fileUrl) {
        return;
      }
      window.open(row.fileUrl, '_blank');
    },
    // 下载-全部
    onDownloadAll() {},
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.viewReportClass {
  border-radius: 2px;
  /deep/ .el-dialog {
    width: 633px;
  }
  /deep/ .el-dialog__body {
    padding: 20px 30px 30px 30px;
    height: 401px;
  }
}
</style>
