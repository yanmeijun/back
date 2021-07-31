<template>
  <el-dialog
    title="选择历史任务"
    class="select-task-dialog"
    :visible.sync="isOpen"
    :before-close="closeDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-width="80px"
      class="no-rules-form2"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-form-item label="网站层级" prop="tier">
            <select-dict
              v-model="searchForm.tier"
              :type="`task_level`"
              @change="queryData"
            ></select-dict>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ex-table
      ref="crud"
      :data="data"
      :option="option"
      :loading="loading"
      @selection-change="selectionChangeHandle"
    >
      <template slot="index" slot-scope="scope">
        <span>{{ scope.row.rowIndex + 1 }}</span>
      </template>
    </ex-table>
    <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="selectSite">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'select-task-dialog',
  data() {
    return {
      searchForm: {
        tier: '1'
      },
      data: [
        {
          uniqueCode: '123',
          accountName: '123',
          province: '123',
          town: '123',
          county: '123',
          level: '123',
          tier: '123',
          portal: '123'
        }
      ],
      loading: false,
      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        menu: false,
        height: 350,
        selection: true,
        selectionWidth: 34,
        rowKey: 'id',
        column: [
          {
            label: '序号',
            prop: 'index',
            width: 56,
            slot: true
          },
          {
            label: '任务号',
            prop: 'taskCode',
            width: 120,
            align: 'center',
            showOverflow: true
          },
          {
            label: '任务名称',
            prop: 'taskName',
            width: 160,
            align: 'left',
            showOverflow: true
          },
          {
            label: '单位名称',
            prop: 'unitName',
            width: 220,
            align: 'left',
            showOverflow: true
          },

          {
            label: '检查结果',
            prop: 'testResult',
            width: 90,
            align: 'center',
            showOverflow: true
          },
          {
            label: '开始时间',
            prop: 'startTime',
            width: 180,
            align: 'center',
            showOverflow: true
          },
          {
            label: '结束时间',
            prop: 'endTime',
            width: 180,
            align: 'center',
            showOverflow: true
          }
        ]
      },
      checkedList: []
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 初始化
    init() {
      console.log('opend');
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
    resetData() {
      this.searchForm.resetData = '';
      this.searchForm.level = 0;
      this.searchForm.tier = 0;
      this.searchForm.portal = 0;
    },
    // 选中对应的站点
    selectionChangeHandle(val) {
      this.checkedList = val;
    },
    // 查询列表
    queryData() {},
    selectSite() {
      this.$emit('selectWeb', this.checkedList);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-task-dialog {
  ::v-deep.el-dialog {
    width: 930px;
    .el-dialog__body {
      max-height: 80vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
</style>
