<template>
  <div class="list-box">
    <div class="list-box-top">
      <div class="slogan"></div>
      <div class="firm"></div>
      <div class="prod">新媒体监测</div>
      <div class="export-btn">导出</div>
    </div>
    <div class="list-box-bottom">
      <div class="list-container">
        <el-table stripe :data="tabelData">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            label="错敏词"
            prop="wrongWord"
            width="98"
            align="center"
          ></el-table-column>
          <el-table-column
            label="推荐修改"
            prop="recommendWord"
            width="141"
            align="center"
          ></el-table-column>
          <el-table-column label="所在文章" width="85" align="center">
            <template slot-scope="scope">
              <a
                class="lk lk1"
                :href="scope.row.articleLink"
                target="_blank"
              ></a>
            </template>
          </el-table-column>
          <el-table-column label="快照" width="54" align="center">
            <template slot-scope="scope">
              <a class="lk lk2" :href="scope.row.snopShoot" target="_blank"></a>
            </template>
          </el-table-column>
          <el-table-column
            label="新媒体类型"
            prop="mediaType"
            width="97"
            align="center"
          ></el-table-column>
          <el-table-column
            label="账号名称"
            prop="accountName"
            width="97"
            align="center"
          ></el-table-column>
          <el-table-column
            label="唯一标识"
            prop="uniCode"
            width="166"
            align="center"
          ></el-table-column>
          <el-table-column
            label="问题类型"
            prop="problemType"
            width="106"
            align="center"
          ></el-table-column>
          <el-table-column
            label="单位名称"
            prop="unitName"
            width="139"
            align="center"
          ></el-table-column>
          <el-table-column
            label="单位标识码"
            prop="siteCode"
            width="111"
            align="center"
          ></el-table-column>
          <el-table-column
            label="发现时间"
            prop="findTime"
            width="168"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
export default {
  name: 'model',
  props: {},
  setup() {
    const state = reactive({
      tabelData: [
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        },
        {
          wrongWord: '国家林业局',
          recommendWord: '国家林业和草原局',
          articleLink: 'https://www.baidu.com',
          snopShoot: 'https://www.baidu.com',
          mediaType: '微信公众号',
          accountName: '开普云微信',
          uniCode: 'MzI0NTE0NDg4Ng==',
          problemType: '常见错误词库',
          unitName: '开普云表单官网21',
          siteCode: 'N000000547',
          findTime: '2021-02-17 12:00:00'
        }
      ]
    });

    return {
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss" scoped>
.list-box {
  width: 1427px;
  margin: 30px auto 0;
  position: relative;
  .list-box-top {
    position: relative;
    height: 196px;
    background: #478bff;
    .slogan {
      position: absolute;
      top: 24px;
      left: 50%;
      width: 264px;
      height: 23px;
      margin-left: -132px;
      background: url(../../assets/img/model-icon/pic-slogan.png) center
        no-repeat;
      background-size: 100%;
    }
    .firm {
      position: absolute;
      left: 19px;
      top: 14px;
      width: 135px;
      height: 46px;
      background: url(../../assets/img/model-icon/icon-firm.png) center
        no-repeat;
      background-size: 100%;
    }
    .prod {
      position: absolute;
      left: 166px;
      top: 27px;
      height: 23px;
      line-height: 23px;
      font-size: 22px;
      color: #fff;
    }
    .export-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 72px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #478bff;
      font-size: 14px;
      background: #ffffff;
      box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .list-box-bottom {
    padding-bottom: 38px;
    background: #f8f8f9;
    .list-container {
      position: relative;
      top: -111px;
      width: 1351px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 4px 4px 0px 0px;
      box-sizing: border-box;
      .lk {
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: text-top;
        cursor: pointer;
      }
      .lk1 {
        background: url(../../assets/img/model-icon/icon-link.png) center
          no-repeat;
        background-size: 100%;
      }
      .lk2 {
        background: url(../../assets/img/model-icon/icon-snapshoot.png) center
          no-repeat;
        background-size: 100%;
      }
    }
  }
}
</style>
