<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">IPV6系统监测</span>
      <div>
        <el-radio
          v-model="data.result"
          label="1"
          border
          @change="update('result')"
          >改造未完成</el-radio
        >
        <el-radio
          v-model="data.result"
          label="2"
          border
          @change="update('result')"
          >改造完成</el-radio
        >
      </div>
    </div>

    <div>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 300px">基础指标</th>
            <th style="width: 260px">检查结果（仅供参考）</th>
            <th>参考依据</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="cell">网站www域名IPV6地址解析能力</div>
            </td>
            <td>
              <div class="cell">
                <el-select
                  v-model="data.urlIsAnalysis"
                  placeholder="请选择"
                  @change="update('urlIsAnalysis')"
                >
                  <el-option label="支持" :value="1"> </el-option>
                  <el-option label="不支持" :value="0"> </el-option>
                </el-select>
              </div>
            </td>
            <td>
              <div class="cell">
                <span>成功次数：{{ data.urlAnalysisSuccessCount }}次</span>
                <span style="margin-left: 30px"
                  >失败次数：{{ data.urlAnalysisFailCount }}次
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站首页IPV6可访问</div>
            </td>
            <td>
              <div class="cell">
                <el-select
                  v-model="data.urlIsVisit"
                  placeholder="请选择"
                  @change="update('urlIsVisit')"
                >
                  <el-option label="支持" :value="1"> </el-option>
                  <el-option label="不支持" :value="0"> </el-option>
                </el-select>
              </div>
            </td>
            <td>
              <div class="cell">
                <span>成功次数：{{ data.urlVisitSucessCount }}次</span>
                <span style="margin-left: 30px"
                  >失败次数：{{ data.urlVisitFailCount }}次
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站首页IPV6访问成功率</div>
            </td>
            <td>
              <div class="cell">{{ data.urlVisitSuccessRate }}</div>
            </td>
            <td>
              <div class="cell">访问成功次数/总次数</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站首页内容IPV6和IPV4的差异度</div>
            </td>
            <td>
              <div class="cell">{{ diffRate }}</div>
            </td>
            <td>
              <div class="cell">
                (ipv4差异数+ipv6差异数)/(ipv4 的A标签总个数+ipv6 的A标签总个数)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站首页布局IPV6和IPV4的差异度</div>
            </td>
            <td>
              <div class="cell">
                <el-select
                  v-model="data.urlIsDiff"
                  placeholder="请选择"
                  @change="update('urlIsDiff')"
                >
                  <el-option label="基本一致" :value="1"> </el-option>
                  <el-option label="不支持" :value="0"> </el-option>
                </el-select>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-link
                  type="primary"
                  :href="data.ipv4Snapshot"
                  target="_blank"
                  >ipv4快照地址</el-link
                >
                <el-link
                  type="primary"
                  :href="data.ipv6Snapshot"
                  target="_blank"
                  style="margin-left: 30px"
                  >ipv6快照地址</el-link
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <table class="table" style="margin-top: 16px">
        <thead>
          <tr>
            <th style="width: 300px">更多指标</th>
            <th>检查结果（仅供参考）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="cell">网站www域名具备完整的IPV6域名授权体系</div>
            </td>
            <td>
              <div class="cell">具备</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站二级页面访问率（不计算外链）</div>
            </td>
            <td>
              <div class="cell">90%</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站三级页面访问率（不计算外链）</div>
            </td>
            <td>
              <div class="cell">12.2%</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站www域名解析时延（ms）</div>
            </td>
            <td>
              <div class="cell">39</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">网站首页访问时延（ms）</div>
            </td>
            <td>
              <div class="cell">38</div>
            </td>
          </tr>
        </tbody>
      </table> -->
    </div>
  </div>
</template>

<script>
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  data() {
    return {
      old: {},
      data: {}
    };
  },
  inject: ['param'],
  computed: {
    // 网站首页内容IPV6和IPV4的差异度
    diffRate() {
      let data = this.data;
      let rate =
        ((data.urlIpv4Diff + data.urlIpv6Diff) /
          (data.ipv4ATagSum + data.ipv6ATagSum)) *
        100;
      rate = rate.toFixed(2) + '%';
      return rate;
    }
  },
  methods: {
    // 获取数据
    async getData() {
      let params = {
        siteCode: this.param.taskDetail.siteCode,
        orderId: this.param.taskDetail.orderId,
        taskId: this.param.taskDetail.taskId,
        startDate: this.param.task.startTime,
        endDate: this.param.task.endTime
      };
      let { code, data } = await inputReportApi.getIpv6(params);
      if (code === 0) {
        this.data = data;
        this.old = data;
      }
    },
    async update(prop) {
      let { code } = await inputReportApi.updateIpv6ByDto({
        id: this.data.id,
        tsakId: this.param.taskDetail.taskId,
        siteCode: this.param.taskDetail.siteCode,
        urlIsAnalysis: this.data.urlIsAnalysis,
        urlIsVisit: this.data.urlIsVisit,
        urlIsDiff: this.data.urlIsDiff,
        result: this.data.result
      });
      if (code === 0) {
        this.old = this.data;
      } else {
        this.$message.error('操作失败');
        this.data[prop] = this.old[prop];
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  th {
    padding: 0 10px;
    color: rgba(0, 0, 0, 0.85);
    text-align: left;
    line-height: 44px;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }
  td {
    border-bottom: 1px solid #f0f0f0;
  }
  .cell {
    padding: 4px 10px;
    min-height: 33px;
  }
  .el-select {
    width: 160px;
  }
}
</style>
