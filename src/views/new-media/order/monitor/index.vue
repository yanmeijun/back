<template>
  <div class="order monitor task-Info">
    <!-- <taskInfo :info='info'/> -->
    <monitorInfo
      :monitorOrnotmonitInfo="monitorOrnotmonitInfo"
      @update="updateTaskInfo"
    />
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">内容发布情况</span>
        <div>
          <span class="jianceResult">检查结果:</span>
          <el-radio-group
            v-model="isQualified.contIsQualified"
            @change="val => changeQualified(val, 'contIsQualified')"
            size="small"
          >
            <el-radio label="0" border>合格</el-radio>
            <el-radio label="1" border>不合格</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="19" class="echartInfo">
          <lineChart :setData="lineData" />
        </el-col>
        <el-col :span="5" style="padding-left: 25px;">
          <p class="monTitle">内容发布情况</p>
          <div class="flex align-center updata">
            <span v-if="contentInfo.questionType === 'XCT_CUSTOM'">{{
              contentInfo && contentInfo.remark
            }}</span>
            <span v-else>{{
              contentInfo && contentInfo.questionTypeMeaning
            }}</span>
            <div
              class="icon-img"
              v-if="contentInfo.imgUrlList && contentInfo.imgUrlList.length > 0"
              @click="openImgsDialog(contentInfo.imgUrlList)"
            >
              <i class="iconfont icontubiaozhizuomoban23 updataIcon"></i>
              <i class="radioYellow"></i>
            </div>
          </div>
          <div class="flex monTime">
            <span class="label">监测时间：</span>
            <OverflowTooltip :content="contentInfo.monitorTime" />
            <!-- <span class="value">{{ contentInfo.monitorTime }}</span> -->
          </div>
          <p class="monTime" v-if="contentInfo.lastUpdated">
            <span class="label">最后更新时间：</span>
            <span class="value">{{
              contentInfo.lastUpdated | replaceFormatTime
            }}</span>
          </p>
          <el-button class="editBtn" @click="openMonitorEditDialog"
            >编辑</el-button
          >
        </el-col>
      </el-row>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">互动回应问题</span>
        <div class="flex align-center">
          <span class="jianceResult">检查结果:</span>
          <el-radio-group
            v-model="isQualified.interactionIsQualified"
            size="small"
            @change="val => changeQualified(val, 'interactionIsQualified')"
          >
            <el-radio label="0" border>合格</el-radio>
            <el-radio label="1" border>不合格</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            class="addBtn"
            @click="showEditDialog('XMT_INTERACT')"
          >
            添加
          </el-button>
        </div>
      </div>
      <!--表格渲染-->
      <ex-table :data="data" :option="tableOption" :loading="loading">
        <template slot="questionUrl" slot-scope="scope">
          <el-link
            type="primary"
            target="_blank"
            class="word-ellipsis-1"
            :href="scope.row.questionUrl"
            >{{ scope.row.questionUrl }}</el-link
          >
        </template>
        <template slot="imgUrlList" slot-scope="scope">
          <span
            class="kp-color-main kp-hover-line"
            @click="openImgsDialog(scope.row.imgUrlList)"
            >{{ scope.row.imgNum > 0 ? `${scope.row.imgNum}` : 0 }}</span
          >
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
                @click="showEditDialog('XMT_INTERACT', scope.row)"
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
                @click="delQuestions('XMT_INTERACT', scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <basic-container>
      <div style="margin-bottom: 17px;border-bottom: 1px solid #E8E8E8;">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="formulationIsQualified"
            >严重错误描述</el-menu-item
          >
          <el-menu-item index="leakIsQualified">泄露国家秘密</el-menu-item>
          <el-menu-item index="vpIsQualified"
            >发动或链接反动暴力色情内容</el-menu-item
          >
          <el-menu-item index="otherIsQualified">其他</el-menu-item>
        </el-menu>
      </div>

      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">列表信息</span>
        <div class="flex align-center">
          <span class="jianceResult" v-if="activeIndex !== 'otherIsQualified'"
            >检查结果:</span
          >
          <el-radio-group
            v-if="activeIndex !== 'otherIsQualified'"
            v-model="isQualified[`${activeIndex}`]"
            size="small"
            @change="val => changeQualified(val, activeIndex)"
          >
            <el-radio label="0" border>合格</el-radio>
            <el-radio label="1" border>不合格</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            class="addBtn"
            v-if="activeIndex === 'otherIsQualified'"
            @click="showEditDialog('XMT_OTHER')"
          >
            添加
          </el-button>
        </div>
      </div>
      <!--表格渲染-->
      <ex-table
        v-if="activeIndex === 'formulationIsQualified'"
        :data="data2"
        :option="tableOption2"
        :loading="loading2"
        :page="page2"
        @on-load="onLoad2"
      >
        <template slot="wrongTerm" slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.wrongTerm"
            placement="top"
          >
            <div class="des word-ellipsis-1">{{ scope.row.wrongTerm }}</div>
          </el-tooltip>
        </template>
        <template slot="problemDesc" slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.problemDesc"
            placement="top"
          >
            <div class="des word-ellipsis-1">{{ scope.row.problemDesc }}</div>
          </el-tooltip>
        </template>
        <template slot="url" slot-scope="scope">
          <el-link
            type="primary"
            class="word-ellipsis-1"
            target="_blank"
            :href="scope.row.url"
            >{{ scope.row.url }}</el-link
          >
        </template>
        <template slot="imgUrl" slot-scope="scope">
          <div class="flex center icons">
            <el-link
              target="_blank"
              :href="scope.row.imgUrl[0]"
              :underline="false"
            >
              <i class="iconfont icontubiaozhizuomoban59"></i>
            </el-link>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-switch
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isJoin"
              @change="
                val => {
                  joinReport(val, scope.row);
                }
              "
            ></el-switch>
          </div>
        </template>
      </ex-table>
      <!-- 国家秘密 & 色情暴力内容 -->
      <ex-table
        v-if="
          activeIndex === 'leakIsQualified' || activeIndex === 'vpIsQualified'
        "
        :data="data3"
        :option="tableOption3"
        :loading="loading3"
        :page="page3"
        @on-load="onLoad3"
      >
        <template slot="url" slot-scope="scope">
          <el-link
            type="primary"
            class="word-ellipsis-1"
            target="_blank"
            :href="scope.row.url"
            >{{ scope.row.url }}</el-link
          >
        </template>
        <template slot="snapShot" slot-scope="scope">
          <div class="flex center icons">
            <el-link
              target="_blank"
              :underline="false"
              :href="scope.row.snapShot"
            >
              <i class="iconfont icontubiaozhizuomoban59"></i>
            </el-link>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex center icons">
            <el-switch
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isJoin"
              @change="
                val => {
                  joinReport(val, scope.row);
                }
              "
            ></el-switch>
          </div>
        </template>
      </ex-table>
      <!--表格渲染其他-->
      <ex-table
        v-if="activeIndex === 'otherIsQualified'"
        :data="data4"
        :option="tableOption4"
        :loading="loading4"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="questionUrl" slot-scope="scope">
          <el-link
            type="primary"
            target="_blank"
            class="word-ellipsis-1"
            :href="scope.row.questionUrl"
            >{{ scope.row.questionUrl }}</el-link
          >
        </template>
        <template slot="imgUrlList" slot-scope="scope">
          <span
            class="kp-color-main kp-hover-line"
            @click="openImgsDialog(scope.row.imgUrlList)"
            >{{ scope.row.imgNum > 0 ? `${scope.row.imgNum}` : 0 }}</span
          >
        </template>
        <!-- <template slot="imgUrl" slot-scope="scope">
          <div class="flex center icons">
            <el-link
              type="primary"
              target="_blank"
              :href="scope.row.imgUrl"
              :underline="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban59"
                style="margin-right: 16px;"
              ></i>
            </el-link>
          </div>
        </template> -->
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
                @click="showEditDialog('XMT_OTHER', scope.row)"
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
                @click="delQuestions('XMT_OTHER', scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <MoitorEditDialog
      ref="MoitorEditDialog"
      v-if="isOpenMonitorEditDialog"
      :isOpen="isOpenMonitorEditDialog"
      @update="getChartInfo"
      @closeDialog="isOpenMonitorEditDialog = false"
    />
    <MoitorClipImgsDialog
      ref="moitorClipImgsDialog"
      v-if="isOpenImgsDialog"
      :isOpen="isOpenImgsDialog"
      :srcList="srcClipList"
      @closeDialog="closeImgsDialog"
    />
    <MoitorQuestionDialog
      ref="MoitorQuestionDialog"
      v-if="isOpenQuestionDialog"
      :info="monitorOrnotmonitInfo"
      :title="questionTitle"
      :targetType="targetType"
      :isOpen="isOpenQuestionDialog"
      @update="updateQuestion"
      @closeDialog="isOpenQuestionDialog = false"
    />
    <TipInfoDialog
      v-if="errorTipShow"
      ref="errorTip"
      :tipContent="tipContent"
      :isOpen="errorTipShow"
      @confirmFn="delQustionFn"
      @closeDialog="closeTip"
    />
  </div>
</template>
<script>
import {
  postResultItem,
  putResultItem,
  postQuestionList,
  getChartData,
  getContentReleaseByParams,
  sensitiveListByDto,
  disclosureListByDto,
  putJoinReport,
  delQuestion,
  getTaskInfo
} from '@/api/new-media/monitor';
import { getAccountInfo } from '@/api/new-media/account-pool';

import MoitorEditDialog from '@/components/dialog/new-media/order/monitor-edit-dialog/index';
import MoitorClipImgsDialog from '@/components/dialog/new-media/order/monitor-clip-imgs-dialog/index';
import MoitorQuestionDialog from '@/components/dialog/new-media/order/monitor-question-dialog/index';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';

import MonitorInfo from '@/components/business-components/new-media/order/monitor-info/index';
import LineChart from '@/components/echarts/line-chart';
import OverflowTooltip from '@/components/base/overflow-tooltip';

import { option1, option2, option3, option4 } from './table-option/index';
import { dateFormat } from '@/util/date';
export default {
  name: 'order',
  components: {
    MoitorEditDialog,
    MoitorClipImgsDialog,
    MoitorQuestionDialog,
    TipInfoDialog,
    MonitorInfo,
    LineChart,
    OverflowTooltip
  },
  data() {
    return {
      isOpenImgsDialog: false,
      isOpenMonitorEditDialog: false,
      isOpenQuestionDialog: false,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      questionTitle: '添加互动回应问题',
      targetType: 'XMT_OTHER',
      isQualified: {
        contIsQualified: '0',
        interactionIsQualified: '0',
        formulationIsQualified: '0',
        leakIsQualified: '0',
        vpIsQualified: '0',
        otherIsQualified: '0'
      },
      value1: '',
      activeIndex: 'formulationIsQualified',
      monitorOrnotmonitInfo: {},
      contentInfo: {},
      tableOption: option1,
      tableOption2: option2,
      tableOption3: option3,
      tableOption4: option4,
      data: [],
      data2: [],
      data3: [],
      data4: [],
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      page2: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      page3: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      lineData: {
        xData: [],
        yData: []
      },
      errorTipShow: false,
      isActive: true,
      tipContent: {
        title: '您确定要删除吗？删除之后将不可恢复.'
      },
      titles: {
        XMT_CONT: '内容发布情况',
        XMT_INTERACT: '互动回应问题',
        XMT_OTHER: '其他问题'
      },
      srcClipList: []
    };
  },
  watch: {
    $route(to, from) {
      if (
        to.fullPath !== from.fullPath &&
        to.path === '/new-media/order/monitor/index'
      ) {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    getData() {
      this.getInfo();
      // 检查结果
      this.getResultItem();
      // 互动问题
      this.postQuestion();
      // 其他
      this.postOther();
      // 内容发布情况 - 信息
      this.getChartInfo();
      // 获取折线图
      this.getChartLine();
      // 获取 - 严重错误描述
      this.getSensitiveList();
    },
    updateQuestion(type) {
      if (type === 'XMT_INTERACT') {
        this.postQuestion();
      } else {
        this.postOther();
      }
    },
    async postQuestion() {
      // 互动问题
      let { data } = await this.getQuestionList('XMT_INTERACT');
      this.data = data;
    },
    async postOther() {
      // 其他
      let { data } = await this.getQuestionList('XMT_OTHER');
      this.data4 = data;
    },
    getQuestionList(targetType) {
      let { orderId, taskId, uniqueCode } = this.$route.query;
      return postQuestionList({
        page: {
          current: 1,
          size: 100,
          orders: [
            {
              asc: false,
              column: 'created_time'
            }
          ]
        },
        taskId,
        orderId,
        uniqueCode,
        targetType
      });
    },
    async getResultItem() {
      let { orderId, taskId, uniqueCode } = this.$route.query;
      let { data } = await postResultItem({
        taskId,
        orderId,
        uniqueCode
      });
      this.isQualified = Object.assign({}, this.isQualified, data);
    },
    async getInfo() {
      let { id, startTime, endTime, accountId } = this.$route.query;
      let { data } = await getAccountInfo({ id: accountId });
      this.monitorOrnotmonitInfo = Object.assign(
        {
          startTime,
          endTime
        },
        data,
        { id }
      );
      this.getTaskInfo();
    },
    async getTaskInfo() {
      let { id } = this.$route.query;
      let { data } = await getTaskInfo({ id, time: Date.now() });
      this.monitorOrnotmonitInfo = Object.assign(
        {},
        this.monitorOrnotmonitInfo,
        data
      );
    },
    updateTaskInfo() {
      this.getTaskInfo();
    },
    async getChartInfo() {
      let { taskId, orderId, accountType, uniqueCode } = this.$route.query;
      let { data } = await getContentReleaseByParams({
        accountType,
        uniqueCode,
        taskId,
        orderId
      });
      this.contentInfo = data;
    },
    async getChartLine() {
      let { endTime, accountType, uniqueCode } = this.$route.query;
      let { data } = await getChartData({
        accountType,
        uniqueCode,
        endTime: this.diffDate(endTime)
      });
      let xData = [];
      let yData = [];
      for (let item of data) {
        xData.push(item.date);
        yData.push(item.amount);
      }
      this.lineData = {
        xData,
        yData
      };
    },
    async getSensitiveList() {
      let {
        taskId,
        orderId,
        accountType,
        uniqueCode,
        startTime,
        endTime
      } = this.$route.query;
      let { data, total } = await sensitiveListByDto({
        accountType,
        uniqueCode,
        taskId,
        orderId,
        isReport: 1,
        startTime,
        endTime,
        page: {
          current: this.page2.currentPage || 1,
          size: this.page2.pageSize
        }
      });
      this.data2 = data;
      this.page2.total = total;
    },
    async getDisclosureList() {
      let {
        taskId,
        orderId,
        accountType,
        uniqueCode,
        startTime,
        endTime
      } = this.$route.query;
      this.loading3 = true;
      let { data, total } = await disclosureListByDto({
        accountType,
        uniqueCode,
        taskId,
        orderId,
        isReport: 1,
        startTime,
        endTime,
        page: {
          current: this.page3.currentPage || 1,
          size: this.page3.pageSize
        }
      });
      this.loading3 = false;
      this.data3 = data;
      this.page3.total = total;
    },
    onLoad(page) {
      // 互动回应问题
      // this.getSensitiveList();
    },
    onLoad2(page) {
      // console.log(page);
      // 严重错误描述
      this.page2 = page;
      this.getSensitiveList();
    },
    onLoad3(page) {
      // console.log(page);
      this.page3 = page;
      if (this.activeIndex === 'leakIsQualified') {
        // 泄漏国家解密
        this.getDisclosureList();
      } else {
        // 暴力、涩情内容
        this.getDisclosureList();
      }
    },
    onLoad4(page) {
      // 其他
      // this.getSensitiveList();
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.activeIndex = key;
      switch (key) {
        case 'formulationIsQualified':
          this.getSensitiveList();
          break;
        case 'leakIsQualified':
          this.data3 = [];
          this.page3 = {
            pageSize: 100,
            pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
            total: 0,
            pageSizes: [100, 500, 1000]
          };
          this.getDisclosureList();
          break;
        case 'vpIsQualified':
          this.data3 = [];
          this.page3 = {
            pageSize: 100,
            pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
            total: 0,
            pageSizes: [100, 500, 1000]
          };
          break;
        case 'otherIsQualified':
          this.postOther();
          break;
      }
    },
    //内容发布情况
    openMonitorEditDialog() {
      let { id, imgUrlList } = this.contentInfo;
      const {
        accountId,
        orderId,
        taskId,
        accountType,
        orderCode,
        taskCode,
        uniqueCode
      } = this.monitorOrnotmonitInfo;
      this.isOpenMonitorEditDialog = true;
      if (this.validatenull(imgUrlList)) {
        imgUrlList = [
          // 'https://cloud3-front.oss-cn-hangzhou.aliyuncs.com/cloud_backweb/ewebeditor/uploadfile/1/20210118/50ac850107494b42896f0096686dc387.jpeg',
          // 'https://cloud3-front.oss-cn-hangzhou.aliyuncs.com/cloud_backweb/ewebeditor/uploadfile/1/20210118/51d7bbf0797e42a4abc0ef87fafacd47.jpeg'
        ];
      }
      imgUrlList = imgUrlList.map(ele => ({ url: ele }));
      // console.log(imgUrlList);
      const data = Object.assign({}, this.contentInfo, { imgUrlList });
      let info = {
        id,
        accountId,
        orderId,
        taskId,
        accountType,
        orderCode,
        taskCode,
        uniqueCode
      };
      this.$nextTick().then(() => {
        this.$refs.MoitorEditDialog.init(data, info);
      });
    },
    openImgsDialog(list) {
      if (this.validatenull(list)) return;
      this.isOpenImgsDialog = true;
      this.srcClipList = list;
    },
    closeImgsDialog() {
      this.isOpenImgsDialog = false;
      this.srcClipList = [];
    },
    addQuestion(mgs) {
      this.isOpenQuestionDialog = true;
      this.questionTitle = mgs;
    },
    changeQualified(val, name) {
      // 修改结果
      // let { id } = this.$route.query;
      let { code, msg } = putResultItem({
        business: name,
        result: val,
        id: this.isQualified.id
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '修改结果失败！'
        });
      }
    },
    joinReport(val, row) {
      let { taskId, orderId, uniqueCode } = this.$route.query;
      let { code, msg } = putJoinReport({
        uniqueCode,
        taskId,
        orderId,
        isJoin: val,
        questionId: row.id
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '修改结果失败！'
        });
      }
    },
    //编辑互动回应问题
    showEditDialog(title, row) {
      this.questionTitle = '添加' + this.titles[title];
      this.isOpenQuestionDialog = true;
      this.targetType = title;
      if (this.validatenull(row)) return;
      this.questionTitle = '编辑' + this.titles[title];
      this.$nextTick().then(() => {
        this.$refs.MoitorQuestionDialog.init(row);
      });
    },
    delQuestions(type, row) {
      this.delQustionRow = { id: row.id, type };
      this.errorTipShow = true;
    },
    async delQustionFn() {
      const { id, type } = this.delQustionRow;
      if (!this.delQustionRow || !id) return;
      const { code, msg } = await delQuestion({
        ids: [this.delQustionRow.id],
        status: 1
      });
      if (code) {
        this.$message({
          type: 'error',
          message: msg || '删除失败！'
        });
        return;
      }
      this.$message({
        type: 'success',
        message: msg || '删除成功！'
      });
      this.updateQuestion(type);
    },
    closeTip() {
      this.errorTipShow = false;
      this.delQustionRow = '';
    },
    diffDate(endTime) {
      endTime = endTime.replace(/\s.*/, '');
      const date = new Date();
      const diff = date.getTime() - new Date(endTime).getTime();
      if (diff > 0) {
        return endTime;
      }
      const yesterday = date.getTime() - 24 * 60 * 60 * 1000;
      return dateFormat(new Date(yesterday)).replace(/\s.*/, '');
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
@import '~@/styles/task.scss';
$MontionrColor: #000000;
.monitor {
  .des {
    text-align: left;
  }
  ::v-deep.monTitle {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    font-weight: 400;
    margin-top: 9px;
  }
  .echartInfo {
    height: 210px;
    border-right: 1px dashed #dadada;
  }
  .updata {
    font-size: 22px;
    font-weight: 500;
    color: $MontionrColor;
    margin: 10px 0 24px 0;
    .icon-img {
      position: relative;
      margin-left: 10px;
      cursor: pointer;
      &.opacity {
        opacity: 0.3;
        cursor: auto;
      }
    }
    .updataIcon {
      color: #2e8cf0;
      font-size: 24px;
    }
    .radioYellow {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ffdd15;
      top: 6px;
      left: 5.7px;
    }
  }
  .monTime {
    font-size: 14px;
    font-weight: 400;
    color: $MontionrColor;
    opacity: 0.65;
    line-height: 24px;
  }
  .editBtn {
    margin-top: 28px;
    width: 100%;
    color: var(--primary);
    border-color: var(--primary);
  }
  .jianceResult {
    font-size: 14px;
    font-weight: 400;
    color: $MontionrColor;
    opacity: 0.65;
    padding-right: 8px;
    position: relative;
    top: 2px;
  }
  .addBtn {
    margin-left: 20px;
  }
  /deep/ .el-radio--small.is-bordered {
    margin-right: 0px;
  }
  /deep/ .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-menu--horizontal > .el-menu-item {
    font-size: 14px;
    font-weight: 400;
    color: $MontionrColor;
    opacity: 0.65;
  }
  /deep/ .el-menu--horizontal > .el-menu-item.is-active {
    color: var(--primary);
    opacity: 1;
  }
  /deep/ .monitorTable {
    .el-table__row {
      td:last-child {
        opacity: 1;
      }
      td:nth-child(5) {
        opacity: 1;
      }
    }
  }
  /deep/ .monitorTable2 {
    .el-table__row {
      td:first-child {
        opacity: 1;
      }
    }
  }
}
</style>
