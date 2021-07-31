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
      <table class="view-table">
        <thead>
          <tr class="bg-level-1">
            <th colspan="7" align="center">扣分指标</th>
          </tr>
          <tr class="bg-level-2">
            <th width="8%" align="center">一级指标</th>
            <th width="8%" align="center">二级指标</th>
            <th width="55%" align="center">评分细则</th>
            <th width="8%" align="center">问题统计</th>
            <th width="8%" align="center">单项扣分</th>
            <th width="8%" align="center">上限分值</th>
            <th width="5%" align="center">扣分</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="bg-level-3" rowspan="21">发布解读（31分）</td>
            <td rowspan="3">概况信息</td>
            <td>1.未开设概况信息类栏目的，扣2分；</td>
            <td align="center">
              {{ data.releaseInterpretation.generalInfo.count_26 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.generalInfo.score_26 }}
            </td>
            <td rowspan="3" align="center">2</td>
            <td rowspan="3" align="center">
              {{ data.releaseInterpretation.generalInfo.score_20 }}
            </td>
          </tr>
          <tr>
            <td>2.概况信息更新不及时或不准确的，每发现一处，扣1分。</td>
            <td align="center">
              {{
                data.releaseInterpretation.generalInfo.count_untimelyInaccurate
              }}
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.generalInfo.score_untimelyInaccurate
              }}
            </td>
          </tr>
          <tr>
            <td>（注：对国务院部门门户网站不检查该项指标。）</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowspan="3">机构职能</td>
            <td>1.未开设机构职能类栏目的，扣2分；</td>
            <td align="center">
              {{ data.releaseInterpretation.institutionalFunctions.count_30 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.institutionalFunctions.score_30 }}
            </td>
            <td rowspan="3" align="center">2</td>
            <td rowspan="3" align="center">
              {{ data.releaseInterpretation.institutionalFunctions.score_21 }}
            </td>
          </tr>
          <tr>
            <td>2.机构职能信息不准确的，每发现一处；扣1分；</td>
            <td align="center">
              {{ data.releaseInterpretation.institutionalFunctions.count_145 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.institutionalFunctions.score_145 }}
            </td>
          </tr>
          <tr>
            <td>
              （注：国务院部门门户网站未开设机构职能类栏目扣4分，信息不准确的，每发现一处扣1分，最多扣4分。）
            </td>
            <td colspan="2" align="center">-</td>
          </tr>
          <tr>
            <td rowspan="2">领导信息</td>
            <td>1.未开设领导信息类栏目的，扣2分；</td>
            <td align="center">
              {{ data.releaseInterpretation.leadershipInfo.count_31 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.leadershipInfo.score_31 }}
            </td>
            <td rowspan="2" align="center">2</td>
            <td rowspan="2" align="center">
              {{ data.releaseInterpretation.leadershipInfo.score_22 }}
            </td>
          </tr>
          <tr>
            <td>2.领导姓名、简历等信息缺失或不准确的，每发现一处，扣1分。</td>
            <td align="center">
              {{
                data.releaseInterpretation.leadershipInfo.count_infoInaccurate
              }}
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.leadershipInfo.score_infoInaccurate
              }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">动态要闻</td>
            <td>1.未开设动态要闻类栏目的，扣5分；</td>
            <td align="center">
              {{ data.releaseInterpretation.dynamicNews.count_32 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.dynamicNews.score_32 }}
            </td>
            <td rowspan="2" align="center">5</td>
            <td rowspan="2" align="center">
              {{ data.releaseInterpretation.dynamicNews.score_23 }}
            </td>
          </tr>
          <tr>
            <td>2.监测时间点前2周内未更新的，扣5分；</td>
            <td align="center">
              {{ data.releaseInterpretation.dynamicNews.count_147 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.dynamicNews.score_147 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">政策文件</td>
            <td>1.未开设政策文件类栏目的，扣5分；</td>
            <td align="center">
              {{ data.releaseInterpretation.policyDocument.count_33 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.policyDocument.score_33 }}
            </td>
            <td rowspan="2" align="center">5</td>
            <td rowspan="2" align="center">
              {{ data.releaseInterpretation.policyDocument.score_24 }}
            </td>
          </tr>
          <tr>
            <td>2.监测时间点前6个月内政策文件类一级栏目未更新的，扣5分。</td>
            <td align="center">
              {{ data.releaseInterpretation.policyDocument.count_148 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.policyDocument.score_148 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">政策解读</td>
            <td>1.未开设政策解读类栏目的，扣5分。</td>
            <td align="center">
              {{ data.releaseInterpretation.policyInterpretation.count_34 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.policyInterpretation.score_34 }}
            </td>
            <td rowspan="2" align="center">5</td>
            <td rowspan="2" align="center">
              {{ data.releaseInterpretation.policyInterpretation.score_25 }}
            </td>
          </tr>
          <tr>
            <td>2.监测时间点前6个月内政策解读类一级栏目未更新的，扣5分。</td>
            <td align="center">
              {{ data.releaseInterpretation.policyInterpretation.count_149 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.policyInterpretation.score_149 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">解读比例</td>
            <td>
              随机抽查网站已发布的3个以本地区本部门或本地区本部门办公厅（室）名义印发的涉及面广、社会关注度高的政策文件，被解读的文件数量每少一个，扣1分
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.interpretationProportion
                  .count_interpretationProportion
              }}
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.interpretationProportion
                  .score_interpretationProportion
              }}
            </td>
            <td rowspan="2" align="center">3</td>
            <td rowspan="2" align="center">
              {{
                data.releaseInterpretation.interpretationProportion
                  .score_interpretationProportion
              }}
            </td>
          </tr>
          <tr>
            <td>（注：不足3个的则检查全部文件。）</td>
            <td colspan="2" align="center">-</td>
          </tr>
          <tr>
            <td rowspan="2">解读关联</td>
            <td>
              随机抽查网站已发布的3个解读稿：未与被解读的政策文件相关联的，每发现一处，扣0.5分；该政策文件未与被抽查解读稿相关联的，每发现一处，扣0.5分。
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.interpretationRelevance
                  .count_interpretationProportion
              }}
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.interpretationRelevance
                  .score_interpretationProportion
              }}
            </td>
            <td rowspan="2" align="center">3</td>
            <td rowspan="2" align="center">
              {{
                data.releaseInterpretation.interpretationRelevance
                  .score_interpretationProportion
              }}
            </td>
          </tr>
          <tr>
            <td>（注：不足3个的则检查全部解读稿。）</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowspan="3">其他栏目</td>
            <td>1.其他栏目存在空白的，每发现一个，扣2分；</td>
            <td align="center">
              {{ data.releaseInterpretation.otherColumns.count_179 }}
            </td>
            <td align="center">
              {{ data.releaseInterpretation.otherColumns.score_179 }}
            </td>
            <td rowspan="3" align="center">4</td>
            <td rowspan="3" align="center">
              {{ data.releaseInterpretation.otherColumns.score_178 }}
            </td>
          </tr>
          <tr>
            <td>2.其他栏目存在应更新未更新的，每发现一个，扣1分。</td>
            <td align="center">
              {{
                data.releaseInterpretation.otherColumns.count_otherInaccurate
              }}
            </td>
            <td align="center">
              {{
                data.releaseInterpretation.otherColumns.score_otherInaccurate
              }}
            </td>
          </tr>
          <tr>
            <td>
              （注：因空白、应更新未更新等原因已按其他指标扣分的，本指标项下不重复扣分。）
            </td>
            <td colspan="2" align="center">-</td>
          </tr>
          <tr>
            <td class="bg-level-3" rowspan="16">办事服务（25分)</td>
            <td>事项公开</td>
            <td>未对办事服务事项集中分类展示的，扣3分。</td>
            <td align="center">
              {{ data.workService.matterPublicity.count_55 }}
            </td>
            <td align="center">
              {{ data.workService.matterPublicity.score_55 }}
            </td>
            <td align="center">3</td>
            <td align="center">
              {{ data.workService.matterPublicity.score_55 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">在线申请</td>
            <td>
              1.未提供在线注册功能或提供注册功能但用户（含异地用户）无法注册的，扣5分。
            </td>
            <td align="center">
              {{ data.workService.onlineApplication.count_register }}
            </td>
            <td align="center">
              {{ data.workService.onlineApplication.score_register }}
            </td>
            <td rowspan="2" align="center">5</td>
            <td rowspan="2" align="center">
              {{ data.workService.onlineApplication.score_51 }}
            </td>
          </tr>
          <tr>
            <td>2.注册用户无法在线办事的，扣5分</td>
            <td align="center">
              {{ data.workService.onlineApplication.count_163 }}
            </td>
            <td align="center">
              {{ data.workService.onlineApplication.score_163 }}
            </td>
          </tr>
          <tr>
            <td rowspan="3">办事统计</td>
            <td>1.未公开办事统计数据的，扣2分。</td>
            <td align="center">
              {{ data.workService.workStatistics.count_57 }}
            </td>
            <td align="center">
              {{ data.workService.workStatistics.score_57 }}
            </td>
            <td rowspan="3" align="center">2</td>
            <td rowspan="3" align="center">
              {{ data.workService.workStatistics.score_52 }}
            </td>
          </tr>
          <tr>
            <td>2.监测时间点前1个月内未更新的，扣1分；</td>
            <td align="center">
              {{ data.workService.workStatistics.count_164 }}
            </td>
            <td align="center">
              {{ data.workService.workStatistics.score_164 }}
            </td>
          </tr>
          <tr>
            <td>3.监测时间点3个月内未更新的，扣2分。</td>
            <td align="center">
              {{ data.workService.workStatistics.count_165 }}
            </td>
            <td align="center">
              {{ data.workService.workStatistics.score_165 }}
            </td>
          </tr>
          <tr>
            <td rowspan="7">办事指南</td>
            <td>随机抽查5个办事服务事项：</td>
            <td colspan="2" align="center">-</td>
            <td rowspan="7" align="center">8</td>
            <td rowspan="7" align="center">
              {{ data.workService.businessGuide.score_53 }}
            </td>
          </tr>
          <tr>
            <td>1.事项无办事指南的，每发现一个，扣4分；</td>
            <td align="center">
              {{ data.workService.businessGuide.count_58 }}
            </td>
            <td align="center">
              {{ data.workService.businessGuide.score_58 }}
            </td>
          </tr>
          <tr>
            <td>
              2.提供办事指南，但重点要素类别（包括事项名称、设定依据、申请条件、办理材料、办理地点、办理机构、收费标准、办理时间、联系电话、办理流程）缺失的，每发现一处，扣0.5分；
            </td>
            <td align="center">
              {{ data.workService.businessGuide.count_158 }}
            </td>
            <td align="center">
              {{ data.workService.businessGuide.score_158 }}
            </td>
          </tr>
          <tr>
            <td>
              3.办理材料格式要求不明确的（如未说明原件/复印件、纸质版/电子版、份数等），每发现一个存在该问题的事项，扣1分；
            </td>
            <td align="center">
              {{ data.workService.businessGuide.count_159 }}
            </td>
            <td align="center">
              {{ data.workService.businessGuide.score_159 }}
            </td>
          </tr>
          <tr>
            <td>
              4.存在表述含糊不清的情形（如“根据有关法律法规规定应提交的其他材料”等表述），每发现一个存在该问题的事项，扣2分；
            </td>
            <td align="center">
              {{ data.workService.businessGuide.count_160 }}
            </td>
            <td align="center">
              {{ data.workService.businessGuide.score_160 }}
            </td>
          </tr>
          <tr>
            <td>
              5.办事指南中提到的政策文件仅有名称、未说明具体内容的，每发现一个存在该问题的事项，扣0.5分。
            </td>
            <td align="center">
              {{ data.workService.businessGuide.count_161 }}
            </td>
            <td align="center">
              {{ data.workService.businessGuide.score_161 }}
            </td>
          </tr>
          <tr>
            <td>（注：不足5个的则检查全部事项。）</td>
            <td colspan="2" align="center">-</td>
          </tr>
          <tr>
            <td rowspan="2">内容准确</td>
            <td>
              随机抽查5个办事指南，信息（如咨询电话、投诉电话等）存在错误，或与实际办事要求不一致的，每发现一处，扣1分。
            </td>
            <td align="center">
              {{ data.workService.contentAccurate.count_infoWrong }}
            </td>
            <td align="center">
              {{ data.workService.contentAccurate.score_infoWrong }}
            </td>
            <td rowspan="2" align="center">5</td>
            <td rowspan="2" align="center">
              {{ data.workService.contentAccurate.score_infoWrong }}
            </td>
          </tr>
          <tr>
            <td>（注：不足5个的则检查全部指南。）</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>表格样表</td>
            <td>
              随机抽查2个办事指南，要求办事人提供申请表、申请书等表单但未提供规范表格获取渠道的，每发现一个存在该问题的办事指南，扣1分。
            </td>
            <td align="center">{{ data.workService.tableSample.count_59 }}</td>
            <td align="center">{{ data.workService.tableSample.score_59 }}</td>
            <td align="center">2</td>
            <td align="center">{{ data.workService.tableSample.score_59 }}</td>
          </tr>
          <tr>
            <td class="bg-level-3" rowspan="10">互动交流（23分）</td>
            <td>信息提交</td>
            <td>
              存在网民（含异地用户）无法使用网站互动交流功能提交信息问题的，扣7分。
            </td>
            <td align="center">
              {{ data.interactiveCommunication.infoSubmission.count_67 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.infoSubmission.score_67 }}
            </td>
            <td align="center">7</td>
            <td align="center">
              {{ data.interactiveCommunication.infoSubmission.score_67 }}
            </td>
          </tr>
          <tr>
            <td>统一登录</td>
            <td>
              网站各个具有互动交流功能的栏目（网上信访、纪检举报等专门渠道除外）提供的注册登录功能，未实现统一注册登录的，扣3分。
            </td>
            <td align="center">
              {{ data.interactiveCommunication.unifiedLogin.count_68 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.unifiedLogin.score_68 }}
            </td>
            <td align="center">3</td>
            <td align="center">
              {{ data.interactiveCommunication.unifiedLogin.score_68 }}
            </td>
          </tr>
          <tr>
            <td rowspan="5">留言公开</td>
            <td>
              1.咨询建言类栏目（网上信访、纪检举报等专门渠道除外）对所有网民留言都未公开的，扣6分。
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.count_69 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.score_69 }}
            </td>
            <td rowspan="5" align="center">6</td>
            <td rowspan="5" align="center">
              {{ data.interactiveCommunication.messagePublic.score_65 }}
            </td>
          </tr>
          <tr>
            <td>
              2、随机抽查5条已公开的网民留言，未公开留言时间、答复时间、答复单位、答复内容的，每发现一处，扣1分。
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.count_70 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.score_70 }}
            </td>
          </tr>
          <tr>
            <td>3.监测时间点前2个月内未更新的，扣3分。</td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.count_171 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.score_171 }}
            </td>
          </tr>
          <tr>
            <td>4.未公开留言受理反馈情况统计数据的，扣3分。</td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.count_71 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.messagePublic.score_71 }}
            </td>
          </tr>
          <tr>
            <td>（注：不足5条的则检查全部留言。）</td>
            <td colspan="2" align="center">-</td>
          </tr>
          <tr>
            <td rowspan="3">办理答复</td>
            <td>模拟用户进行2次简单常见问题咨询：</td>
            <td colspan="2" align="center">-</td>
            <td rowspan="3" align="center">7</td>
            <td rowspan="3" align="center">
              {{ data.interactiveCommunication.handleReply.score_66 }}
            </td>
          </tr>
          <tr>
            <td>1.未在5个工作日内收到网上答复意见的，每发现一次，扣4分；</td>
            <td align="center">
              {{ data.interactiveCommunication.handleReply.count_72 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.handleReply.score_72 }}
            </td>
          </tr>
          <tr>
            <td>
              2.答复内容质量不高，有推诿、敷衍等现象的，每发现一次，扣4分。
            </td>
            <td align="center">
              {{ data.interactiveCommunication.handleReply.count_73 }}
            </td>
            <td align="center">
              {{ data.interactiveCommunication.handleReply.score_73 }}
            </td>
          </tr>
          <tr>
            <td class="bg-level-3" rowspan="18">功能设计（21分）</td>
            <td rowspan="3">域名名称</td>
            <td>1.域名不符合规范的，扣1分。</td>
            <td align="center">
              {{ data.functionalDesign.domainName.count_88 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.domainName.score_88 }}
            </td>
            <td rowspan="3" align="center">3</td>
            <td rowspan="3" align="center">
              {{ data.functionalDesign.domainName.score_73 }}
            </td>
          </tr>
          <tr>
            <td>2.网站未以本地区本部门名称命名的，扣1分。</td>
            <td align="center">
              {{ data.functionalDesign.domainName.count_176 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.domainName.score_176 }}
            </td>
          </tr>
          <tr>
            <td>3.网站名称未在全站页面头部区域显著展示的，扣1分。</td>
            <td align="center">
              {{ data.functionalDesign.domainName.count_87 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.domainName.score_87 }}
            </td>
          </tr>
          <tr>
            <td>网站标识</td>
            <td>
              未在全站页面底部功能区清晰列明党政机关网站标识，网站标识码、ICP备案编号、公安机关备案标识、网站主办单位、联系方式的，每缺一项，扣0.5分。
            </td>
            <td align="center">
              {{ data.functionalDesign.websiteLogo.count_177 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.websiteLogo.score_177 }}
            </td>
            <td align="center">3</td>
            <td align="center">
              {{ data.functionalDesign.websiteLogo.score_177 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">可用性</td>
            <td>
              1.首页上的链接（包括图片、附件、外部链接等）打不开或错误的，每发现一处，扣0.2分；如首页仅为网站栏目导航入口，则检查所有二级页面上的链接。
            </td>
            <td align="center">
              {{ data.functionalDesign.usability.count_homeLink }}
            </td>
            <td align="center">
              {{ data.functionalDesign.usability.score_homeLink }}
            </td>
            <td rowspan="2" align="center">1</td>
            <td rowspan="2" align="center">
              {{ data.functionalDesign.usability.score_home_other }}
            </td>
          </tr>
          <tr>
            <td>
              2.其他页面上的链接（包括图片、附件、外部链接等）打不开或错误的，每发现一处，扣0.1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.usability.count_otherLink }}
            </td>
            <td align="center">
              {{ data.functionalDesign.usability.score_otherLink }}
            </td>
          </tr>
          <tr>
            <td rowspan="4">“我为政府网站找错”</td>
            <td>
              1.未在首页底部功能区规范添加“我为政府网站找错”入口的，扣1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.count_173 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.score_173 }}
            </td>
            <td rowspan="2" align="center">1</td>
            <td rowspan="2" align="center">
              {{ data.functionalDesign.mistakeGovernment.score_ontOn }}
            </td>
          </tr>
          <tr>
            <td>
              2.未在其他页面底部功能区规范添加“我为政府网站找错”入口的，每发现一处，扣0.2分。
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.count_174 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.score_174 }}
            </td>
          </tr>
          <tr>
            <td>
              1.监测时间点前6个月内，存在网民留言超过3个工作日未答复的，每发现一条，扣1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.count_82 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.score_82 }}
            </td>
            <td rowspan="2" align="center">3</td>
            <td rowspan="2" align="center">
              {{ data.functionalDesign.mistakeGovernment.score_monitoring }}
            </td>
          </tr>
          <tr>
            <td>
              2.监测时间点前6个月内，存在答复内容质量不高，有推诿、敷衍等现象的，每发现一条，扣1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.count_83 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.mistakeGovernment.score_83 }}
            </td>
          </tr>
          <tr>
            <td rowspan="3">站内搜索</td>
            <td>1.未提供全站站内搜索功能或功能不可用的，扣4分</td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.count_searchNot }}
            </td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.score_searchNot }}
            </td>
            <td rowspan="3" align="center">4</td>
            <td rowspan="3" align="center">
              {{ data.functionalDesign.siteSearch.score_89 }}
            </td>
          </tr>
          <tr>
            <td>
              2.随机选取4条网站已发布的信息或服务的标题进行测试，在搜索结果第一页无法找到该内容的，每条扣1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.count_92 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.score_92 }}
            </td>
          </tr>
          <tr>
            <td>
              3.未对搜索结果进行分类展现的（如按照政策文件、办事指南等进行分类），扣1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.count_93 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.siteSearch.score_93 }}
            </td>
          </tr>
          <tr>
            <td>一号登录</td>
            <td>
              注册用户在各个功能板块（网上信访、纪检举报等专门渠道除外）无法一号登录的，扣2分。
            </td>
            <td align="center">
              {{ data.functionalDesign.loginNumberOne.count_100 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.loginNumberOne.score_100 }}
            </td>
            <td align="center">2</td>
            <td align="center">
              {{ data.functionalDesign.loginNumberOne.score_100 }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">页面标签</td>
            <td>
              1.随机抽查5个内容页面，无站点标签或内容标签的，每个扣0.1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.pageTags.count_75 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.pageTags.score_75 }}
            </td>
            <td rowspan="2" align="center">1</td>
            <td rowspan="2" align="center">
              {{ data.functionalDesign.pageTags.score_74 }}
            </td>
          </tr>
          <tr>
            <td>
              2.随机抽查5个栏目页面，无站点标签或栏目标签的，每个扣0.1分。
            </td>
            <td align="center">
              {{ data.functionalDesign.pageTags.count_76 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.pageTags.score_76 }}
            </td>
          </tr>
          <tr>
            <td>兼容性</td>
            <td>使用主流浏览器访问网站，不能正常显示页面内容的，每类扣1分</td>
            <td align="center">
              {{ data.functionalDesign.compatibility.count_95 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.compatibility.score_95 }}
            </td>
            <td align="center">2</td>
            <td align="center">
              {{ data.functionalDesign.compatibility.score_95 }}
            </td>
          </tr>
          <tr>
            <td>IPv6改造</td>
            <td>未按照要求完成IPv6改造的，扣1分。</td>
            <td align="center">
              {{ data.functionalDesign.ipv6Reform.count_102 }}
            </td>
            <td align="center">
              {{ data.functionalDesign.ipv6Reform.score_102 }}
            </td>
            <td align="center">1</td>
            <td align="center">
              {{ data.functionalDesign.ipv6Reform.score_102 }}
            </td>
          </tr>
          <tr class="bg-level-3">
            <td colspan="2" align="center">总扣分</td>
            <td colspan="3">
              如评分（100-总扣分）结果低于60分，判定为不合格网站，且不做加分指标相关检测；高于80分，则进入加分指标评分环节。
            </td>
            <td colspan="2" align="center">{{ data.score }}</td>
          </tr>
        </tbody>
      </table>
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
        this.data = data.deductionQuestion;
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
