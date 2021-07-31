<template>
  <basic-container :block="true" class="department-basic">
    <el-row class="customer-row">
      <el-col :xs="24" :sm="24" :md="5" class="aside">
        <OrganizationTreeStucture
          ref="OrganizationTreeStucture"
          :showOperation="true"
          :isEdit="true"
          :expandedKeys="defaultKeys"
          @currentNode="currentNode"
        />
      </el-col>
      <el-col
        class="customer-main"
        v-if="currentNodeData && currentNodeData.id"
        :xs="24"
        :sm="24"
        :md="19"
      >
        <EditOrganizationStucture
          :currentNode="currentNodeData"
          @update="updateTree"
        />
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
import OrganizationTreeStucture from '@/components/base/organization-tree-structure';
import EditOrganizationStucture from '@/components/business-components/admin/organization/edit-organization-structure';
export default {
  name: 'organization',
  components: {
    OrganizationTreeStucture,
    EditOrganizationStucture
  },
  data() {
    return {
      currentNodeData: {},
      defaultKeys: []
    };
  },
  methods: {
    currentNode(node) {
      this.currentNodeData = node;
    },
    updateTree() {
      // console.log(this.currentNodeData);
      this.defaultKeys = [this.currentNodeData.id];
      this.$refs.OrganizationTreeStucture.getTreeData();
    }
  }
};
</script>
<style lang="scss" scoped>
.department-basic {
  ::v-deep .el-card__body {
    height: 100%;
  }
  .customer-row {
    height: 100%;
    @media (max-width: 882.88px) {
      overflow-y: auto;
    }
  }
  .aside {
    height: 100%;
    border-right: 3px solid #e5e5e5;
    overflow: auto;

    &_head {
      padding: 0 17px 0 0;
      margin-bottom: 20px;
      margin-top: -7px;
      .btn-group {
        width: 100%;
        > button,
        /deep/.el-dropdown {
          width: 50%;
        }
        button {
          padding: 0;
          height: 32px;
          line-height: 32px;
        }
        > button {
          border-radius: 0 3px 3px 0;
        }
        /deep/.el-dropdown button {
          width: 100%;
          border-radius: 3px 0 0 3px;
          border-right: 1px solid #eee;
        }
      }
    }

    @media (max-width: 882.88px) {
      border-right: 0;
      height: auto;
    }
  }
  .customer-main {
    padding: 0 15px;
    height: 100%;
    overflow: auto;
  }
}
</style>
