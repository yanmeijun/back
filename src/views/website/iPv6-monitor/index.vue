<template>
<div class="ipv6Monitor">
  <basic-container :border="true" :mini="true" class="top-form">
    <el-form
      ref="ipv6MonitorForm"
      :model="ipv6MonitorForm"
      label-width="114px"
      class="no-rules-form"
    >
     <el-col :xs="24" :sm="24" :md="7">
        <el-form-item label="网站信息 :" prop="channelName">
          <el-input
            v-model="ipv6MonitorForm.channelName"
            placeholder="请输入网站标识码/网站名称"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="7">
        <el-form-item label="任务状态 :" prop="channelName">
          <select-dict
            v-model="ipv6MonitorForm.updateMonitoringFrequency"
            :type="`is_flag`"
            show-all
          ></select-dict>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="7">
        <el-form-item label="创建人 :" prop="channelName">
          <el-input
            v-model="ipv6MonitorForm.channelName"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="3">
        <div class="flex justify-end padding-none">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="queryList">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="7">
        <el-form-item label="任务起止时间:" prop="rangeDate">
          <el-date-picker
            class="kp-date-picker"
            v-model="ipv6MonitorForm.rangeDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>

    </el-form>
  </basic-container>
  <basic-container>
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">监测任务列表</span>
      <div class="flex">
        <div class="download-Report">
          <el-button plain
          >下载报告</el-button
          >
        </div>
        <div class="import-btn">
          <el-button type="primary" @click="onAddOrEdit">添加</el-button>
        </div>
      </div>
    </div>

    <ex-table
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
        @selection-change="onTableSelectionChange"
      >

        <template slot="monitoringStatusMeaning" slot-scope="scope">
          <span></span>
        </template>

        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="onAddOrEdit(scope.row)"
              ></i>
            </el-tooltip>
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

  </basic-container>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
import ResetTable from '@/mixins/resetTableHeight';
import { options } from './table-option/index';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form']
});

export default {
  name: 'ipv6Monitor',
  data() {
    return {
      ipv6MonitorForm:{
        updateMonitoringFrequency:''
      },
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      loading: false,
      tableOption: options,
      data: [],
      table:{
        selection:[]
      }
    }
  },
  methods:{
    filterDict(options = []) {
      return [
        {
          label: '全部',
          value: ''
        },
        ...options
      ];
    },
    // table勾选变化
    onTableSelectionChange(selection) {
      this.table.selection = selection;
    },
    queryList() {
      this.resetParams();
      this.getList();
    },
    resetQuery() {
      this.resetParams();
      this.$refs['ipv6MonitorForm'].resetFields();
      this.getList();
    },
    resetParams() {
      this.page.currentPage = 1;
      this.page.pageSize = 100;
    },
    onAddOrEdit(){

    },
    onLoad(page) {
      this.page = page;
      this.getList();
    },
    getList(){

    }
  }
}
</script>
<style lang="scss" scoped>
  .download-Report{
    margin-right: 10px;
  }
</style>
