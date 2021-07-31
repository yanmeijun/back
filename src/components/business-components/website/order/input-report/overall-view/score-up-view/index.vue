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
        <table border="1">
          <thead>
            <tr class="bg-level-1">
              <th colspan="7" align="center">加分指标</th>
            </tr>
            <tr class="bg-level-2">
              <th width="8%" align="center">一级指标</th>
              <th width="8%" align="center">二级指标</th>
              <th width="55%" align="center">评分细则</th>
              <th width="8%" align="center">加分统计</th>
              <th width="8%" align="center">单项加分</th>
              <th width="8%" align="center">上限分值</th>
              <th width="5%" align="center">加分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="bg-level-3" rowspan="5">信息发布（7分）</td>
              <td rowspan="4">数据发布</td>
              <td>
                1.开设数据发布类栏目并在监测时间点前3个月内有更新的，得2分；
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.count_106 }}
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.score_106 }}
              </td>
              <td rowspan="4" align="center">4</td>
              <td rowspan="4" align="center">
                {{ data.infoDeliveryBonus.dataRelease.score_105 }}
              </td>
            </tr>
            <tr>
              <td>
                开设数据发布类栏目并在监测时间点前3—6个月内有更新的，得1分。
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.count_107 }}
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.score_107 }}
              </td>
            </tr>
            <tr>
              <td>
                2.监测时间点前6个月内，通过图表图解等可视化方式展现和解读数据的，得1分。
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.count_109 }}
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.score_109 }}
              </td>
            </tr>
            <tr>
              <td>3.定期更新数据集，并提供下载功能或可用数据接口的，得1分。</td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.count_108 }}
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.dataRelease.score_108 }}
              </td>
            </tr>
            <tr>
              <td>解读回应</td>
              <td>
                随机抽查3个不同文件的解读稿，通过新闻发布会、图表图解、音视频或动漫等形式解读的，每个得1分。
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.interpretationResponse.count_111 }}
              </td>
              <td align="center">
                {{ data.infoDeliveryBonus.interpretationResponse.score_111 }}
              </td>
              <td align="center">3</td>
              <td align="center">
                {{ data.infoDeliveryBonus.interpretationResponse.score_111 }}
              </td>
            </tr>
            <tr>
              <td class="bg-level-3" rowspan="5">办事服务（6分）</td>
              <td rowspan="2">服务功能</td>
              <td>1.提供服务评价功能的，得1分。</td>
              <td align="center">
                {{ data.workServiceBonus.serviceFunction.count_116 }}
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceFunction.score_116 }}
              </td>
              <td rowspan="2" align="center">2</td>
              <td rowspan="2" align="center">
                {{ data.workServiceBonus.serviceFunction.score_113 }}
              </td>
            </tr>
            <tr>
              <td>2.公布服务评价结果的，得1分。</td>
              <td align="center">
                {{ data.workServiceBonus.serviceFunction.count_117 }}
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceFunction.score_117 }}
              </td>
            </tr>
            <tr>
              <td rowspan="2">服务内容</td>
              <td>
                针对重点服务事项，整合相关资源，细化办理对象、条件、流程等，提供专题或集成服务。提供3项及以上的，得2分；
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceContent.count_118 }}
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceContent.score_118 }}
              </td>
              <td rowspan="2" align="center">2</td>
              <td rowspan="2" align="center">
                {{ data.workServiceBonus.serviceContent.score_114 }}
              </td>
            </tr>
            <tr>
              <td>
                针对重点服务事项，整合相关资源，细化办理对象、条件、流程等，提供专题或集成服务。提供1至2项的，得1分。
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceContent.count_196 }}
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceContent.score_196 }}
              </td>
            </tr>
            <tr>
              <td>服务关联</td>
              <td>
                随机抽查2个办事服务事项，涉及到的政策文件依据均准确关联至本网站政策文件库的，得2分。
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceAssociation.count_120 }}
              </td>
              <td align="center">
                {{ data.workServiceBonus.serviceAssociation.score_120 }}
              </td>
              <td align="center">2</td>
              <td align="center">
                {{ data.workServiceBonus.serviceAssociation.score_120 }}
              </td>
            </tr>
            <tr>
              <td class="bg-level-3" rowspan="4">互动交流（8分）</td>
              <td rowspan="2">实时互动</td>
              <td>
                模拟用户进行1次简单常见问题咨询：咨询后一个工作日内答复且内容准确的，得3分；
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.realtimeInteraction
                    .count_124
                }}
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.realtimeInteraction
                    .score_124
                }}
              </td>
              <td rowspan="2" align="center">5</td>
              <td rowspan="2" align="center">
                {{
                  data.interactiveCommunicationBonus.realtimeInteraction
                    .score_122
                }}
              </td>
            </tr>
            <tr>
              <td>
                模拟用户进行1次简单常见问题咨询：提供实时智能答问功能且内容准确的，得2分。
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.realtimeInteraction
                    .count_125
                }}
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.realtimeInteraction
                    .score_125
                }}
              </td>
            </tr>
            <tr>
              <td rowspan="2">调查征集</td>
              <td>
                1.提供在线调查征集渠道（不含电子邮件形式），且监测时间点前1年内开展活动超过（含）6次的，得2分。
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.surveyCollection.count_126
                }}
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.surveyCollection.score_126
                }}
              </td>
              <td rowspan="2" align="center">3</td>
              <td rowspan="2" align="center">
                {{
                  data.interactiveCommunicationBonus.surveyCollection.score_123
                }}
              </td>
            </tr>
            <tr>
              <td>
                2.监测时间点前1年内开展的调查征集活动结束后1个月内均公开反馈结果的，得1分。
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.surveyCollection.count_127
                }}
              </td>
              <td align="center">
                {{
                  data.interactiveCommunicationBonus.surveyCollection.score_127
                }}
              </td>
            </tr>
            <tr>
              <td class="bg-level-3" rowspan="4">功能设计（6分）</td>
              <td rowspan="3">智能搜索</td>
              <td>1.提供关键词模糊搜索功能的，得1分。</td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.count_131 }}
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.score_131 }}
              </td>
              <td rowspan="3" align="center">4</td>
              <td rowspan="3" align="center">
                {{ data.functionalDesignBonus.intelligentSearch.score_129 }}
              </td>
            </tr>
            <tr>
              <td>
                2.根据搜索关键词聚合相关信息和服务功能，实现“搜索即服务”的，得1分。
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.count_132 }}
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.score_132 }}
              </td>
            </tr>
            <tr>
              <td>
                3.随机选取该地区、该部门下级网站上的2条信息或服务的标题：通过该地区、该部门政府门户网站搜索进行测试，能够在搜索结果第一页找到该内容的，每条得1分。
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.count_133 }}
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.intelligentSearch.score_133 }}
              </td>
            </tr>
            <tr>
              <td>用户空间</td>
              <td>
                注册用户可在用户主页下浏览其在本网站咨询问题、办事服务等历史信息的，得2分。
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.userSpace.count_134 }}
              </td>
              <td align="center">
                {{ data.functionalDesignBonus.userSpace.score_134 }}
              </td>
              <td align="center">2</td>
              <td align="center">
                {{ data.functionalDesignBonus.userSpace.score_134 }}
              </td>
            </tr>
            <tr>
              <td class="bg-level-3">创新发展（3分）</td>
              <td align="center">——</td>
              <td>
                通过政府网站服务中心工作、方便社会公众的做法突出，并获得本地区、本部门主要领导同志肯定的，加3分。
              </td>
              <td align="center">
                {{ data.innovationDevelopmentBonus.count_140 }}
              </td>
              <td align="center">
                {{ data.innovationDevelopmentBonus.score_140 }}
              </td>
              <td align="center">3</td>
              <td align="center">
                {{ data.innovationDevelopmentBonus.score_140 }}
              </td>
            </tr>
            <tr class="bg-level-3">
              <td colspan="2" align="center">总加分</td>
              <td colspan="3" align="center">-</td>
              <td colspan="2" align="center">{{ data.score }}</td>
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
        this.data = data.bonusQuestion;
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
