<template>
  <div v-if="data" class="page">
    <!-- 头部 -->
    <div class="flex align-center justify-between kp-block-title">
      <span class="flex align-center name">
        数据统计状态：
        <span v-if="loading">统计中...</span>
        <span v-else>已完成</span>
      </span>
      <div class="flex">
        <el-button type="primary" @click="reportCalculate">重新统计</el-button>
      </div>
    </div>
    <!-- 主体 -->
    <div class="main">
      <div class="view-table">
        <table>
          <thead class="bg-level-1">
            <tr class="bg-level-1">
              <td colspan="5" align="center">单项否决</td>
            </tr>
            <tr class="bg-level-2">
              <td style="width: 10%" align="center">检查对象</td>
              <td style="width: 16%" align="center">指标</td>
              <td style="width: 56%" align="center">描述</td>
              <td style="width: 9%" align="center">问题统计</td>
              <td style="width: 9%" align="center">单否情况</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="bg-level-3" rowspan="23" align="center">政府网站</td>
              <td rowspan="7">安全、泄密事故等严重问题</td>
              <td>1.出现严重表述错误；</td>
              <td align="center">{{ data.seriousProblem.count_2 }}</td>
              <td align="center">{{ data.seriousProblem.single_2 }}</td>
            </tr>
            <tr>
              <td>2.泄露国家秘密。</td>
              <td align="center">{{ data.seriousProblem.count_3 }}</td>
              <td align="center">{{ data.seriousProblem.single_3 }}</td>
            </tr>
            <tr>
              <td>3.发布或链接反动、暴力、色情等内容；</td>
              <td align="center">{{ data.seriousProblem.count_4 }}</td>
              <td align="center">{{ data.seriousProblem.single_4 }}</td>
            </tr>
            <tr>
              <td>
                4.对安全攻击（如页面被挂马、内容被篡改等）没有及时有效处置造成严重安全事故；
              </td>
              <td align="center">{{ data.seriousProblem.count_5 }}</td>
              <td align="center">{{ data.seriousProblem.single_5 }}</td>
            </tr>
            <tr>
              <td>5.存在弄虚作假行为（如伪造发稿日期等）；</td>
              <td align="center">{{ data.seriousProblem.count_6 }}</td>
              <td align="center">{{ data.seriousProblem.single_6 }}</td>
            </tr>
            <tr>
              <td>6.因网站建设管理工作不当而引发严重负面舆情。</td>
              <td align="center">{{ data.seriousProblem.count_7 }}</td>
              <td align="center">{{ data.seriousProblem.single_7 }}</td>
            </tr>
            <tr>
              <td>上述情况出现任意一种，即单项否决。</td>
              <td colspan="2" align="center">-</td>
            </tr>
            <tr>
              <td>站点无法访问</td>
              <td>
                监测1周，每天间隔性访问20次以上，超过（含）15秒网站仍打不开的次数累计占比超过（含）5%，即单项否决。
              </td>
              <td align="center">{{ data.siteCannotAccessed.count_137 }}</td>
              <td align="center">{{ data.siteCannotAccessed.single_137 }}</td>
            </tr>
            <tr>
              <td rowspan="3">首页不更新</td>
              <td>监测2周，首页无信息更新的，即单项否决。</td>
              <td rowspan="2" align="center">
                {{ data.homePageNotUp.count_homePageNotUp }}
              </td>
              <td rowspan="2" align="center">
                {{ data.homePageNotUp.single_homePageNotUp }}
              </td>
            </tr>
            <tr>
              <td>
                如首页仅为网站栏目导航入口，所有二级页面无信息更新的，即单项否决。
              </td>
            </tr>
            <tr>
              <td>（注：稿件发布页未注明发布时间的视为不更新，下同。）</td>
              <td colspan="2" align="center">-</td>
            </tr>
            <tr>
              <td rowspan="4">栏目不更新</td>
              <td>
                1.监测时间点前2周内的动态、要闻类栏目，以及监测时间点前6个月内的通知公告、政策文件类一级栏目，累计超过（含）5个未更新；
              </td>
              <td align="center">{{ data.columnNotUp.count_185 }}</td>
              <td align="center">{{ data.columnNotUp.single_185 }}</td>
            </tr>
            <tr>
              <td>2.应更新但长期未更新的栏目数超过（含）10个；</td>
              <td align="center">{{ data.columnNotUp.count_188 }}</td>
              <td align="center">{{ data.columnNotUp.single_188 }}</td>
            </tr>
            <tr>
              <td>3.空白栏目数量超过（含）5个。</td>
              <td align="center">{{ data.columnNotUp.count_189 }}</td>
              <td align="center">{{ data.columnNotUp.single_189 }}</td>
            </tr>
            <tr>
              <td>上述情况出现任意一种，即单项否决。</td>
              <td colspan="2" align="center">-</td>
            </tr>
            <tr>
              <td rowspan="3">互动回应差</td>
              <td>
                1.未提供网上有效咨询建言渠道（网上信访、纪检举报等专门渠道除外）；
              </td>
              <td align="center">{{ data.poorInteractive.count_13 }}</td>
              <td align="center">{{ data.poorInteractive.single_13 }}</td>
            </tr>
            <tr>
              <td>
                2.监测时间点前1年内，对网民留言应及时答复处理的政务咨询类栏目（在线访谈、调查征集、网上信访、纪检举报类栏目除外）存在超过3个月未回应有效留言的现象。
              </td>
              <td align="center">{{ data.poorInteractive.count_14 }}</td>
              <td align="center">{{ data.poorInteractive.single_14 }}</td>
            </tr>
            <tr>
              <td>上述情况出现任意一种，即单项否决。</td>
              <td colspan="2" align="center">-</td>
            </tr>
            <tr>
              <td rowspan="5">服务不实用</td>
              <td>1.未提供办事服务；</td>
              <td align="center">{{ data.serviceNotPractical.count_16 }}</td>
              <td align="center">{{ data.serviceNotPractical.single_16 }}</td>
            </tr>
            <tr>
              <td>
                2.办事指南重点要素类别（包括事项名称、设定依据、申请条件、办理材料、办理地点、办理机构、收费标准、办理时间、联系电话、办理流程）缺失4类及以上的事项数量超过（含）5个。
              </td>
              <td align="center">{{ data.serviceNotPractical.count_17 }}</td>
              <td align="center">{{ data.serviceNotPractical.single_17 }}</td>
            </tr>
            <tr>
              <td>
                3.事项总数不足5个的，每个事项办事指南重点要素类别（包括事项名称、设定依据、申请条件、办理材料、办理地点、办理机构、收费标准、办理时间、联系电话、办理流程）均缺失4类及以上。
              </td>
              <td align="center">{{ data.serviceNotPractical.count_18 }}</td>
              <td align="center">{{ data.serviceNotPractical.single_18 }}</td>
            </tr>
            <tr>
              <td>上述情况出现任意一种，即单项否决。</td>
              <td colspan="2" align="center">-</td>
            </tr>
            <tr>
              <td>（注：对没有对外服务职能的部门，不检查其网站该项指标）</td>
              <td colspan="2" align="center">-</td>
            </tr>

            <tr class="bg-level-3">
              <td colspan="2" align="center">单项否决</td>
              <td>
                如网站出现单项否决指标中的任意一种情形，即判定为不合格网站，不再对其他指标进行评分。如网站不存在单项否决问题，则对扣分指标进行评分。
              </td>
              <td colspan="2" align="center">{{ data.result }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as inputReportApi from '@/api/website/order/input-report';
export default {
  data() {
    return {
      loading: false,
      data: null
    };
  },
  inject: ['param'],
  methods: {
    async reportCalculate() {
      this.loading = true;
      let { code, data } = await inputReportApi.reportCalculate({
        siteId: this.param.taskDetail.siteId,
        taskId: this.param.taskDetail.taskId,
        orderId: this.param.taskDetail.orderId,
        startTime: this.param.task.startTime,
        endTime: this.param.task.endTime
      });
      this.loading = false;
      if (code === 0) {
        this.data = data.singleQuestion;
      }
    }
  },
  created() {
    this.reportCalculate();
  }
};
</script>

<style src="../common.scss" lang="scss" scoped></style>
<style lang="scss" scoped></style>
