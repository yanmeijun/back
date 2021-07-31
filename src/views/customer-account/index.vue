<template>
  <basic-container :block="true" class="customer-basic">
    <!-- 左侧侧边栏 -->
    <el-row class="customer-row">
      <el-col :xs="24" :sm="5" class="aside">
        <organization-tree
          :current.sync="currentNode"
          head-fixed
          show-manage-org-btn
          show-node-menu
          :node-menu-option="['jump-front', 'detail', 'change-pwd', 'del']"
        />
      </el-col>
      <!-- 右侧主区域 -->
      <el-col :xs="24" :sm="19">
        <div class="customer-main" v-if="currentNode">
          <h2 class="title">{{ currentNode.custName }}</h2>
          <avue-tabs
            :option="mainTab.option"
            @change="onMainTabChange"
          ></avue-tabs>
          <div v-if="mainTab.value === 'site'">
            <website-account :orgNode="currentNode" />
          </div>
          <div v-else-if="mainTab.value === 'new-media'">
            <new-media-account :orgNode="currentNode" />
          </div>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
import OrganizationTree from '@/components/base/organization-tree'; // 组织机构树
import WebsiteAccount from '@/components/business-components/customer-account/website'; // 站点类型账户视图
import NewMediaAccount from '@/components/business-components/customer-account/new-media'; // 站点类型账户视图

export default {
  name: 'customer-account',
  components: {
    OrganizationTree,
    WebsiteAccount,
    NewMediaAccount
  },
  data() {
    return {
      treeData: [],
      currentNode: null,
      mainTab: {
        value: 'site',
        option: {
          column: [
            {
              label: '网站填报单位',
              value: 'site'
            },
            {
              label: '新媒体填报单位',
              value: 'new-media'
            }
          ]
        }
      }
    };
  },
  methods: {
    onMainTabChange(item) {
      this.mainTab.value = item.value;
    }
  }
};
</script>
<style lang="scss" scoped>
.customer-basic ::v-deep .el-card__body {
  height: 100%;
}
.customer-row {
  height: 100%;
  @media (max-width: 882.88px) {
    overflow-y: auto;
  }
}
.aside {
  padding-right: 17px;
  height: 100%;
  border-right: 3px solid #e5e5e5;
  overflow: auto;

  @media (max-width: 882.88px) {
    border-right: 0;
    height: auto;
  }
}
.customer-main {
  padding: 0 15px;
  ::v-deep {
    .avue-tabs {
      padding: 5px 5px 0;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .form {
    margin-bottom: 8px;
  }
}

::v-deep {
  .el-card .avue-crud__tip {
    display: none !important;
  }
}
</style>
