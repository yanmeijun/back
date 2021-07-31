<template>
  <el-dropdown placement="bottom">
    <span class="el-dropdown-link drop-menu left-label">
      <span class="kp-color-error">{{ tableData.length || 0 }}</span
      >个<i
        class="el-icon-arrow-down el-icon--right"
        v-show="tableData.length > 0"
      ></i>
    </span>
    <el-dropdown-menu
      class="info-tip"
      slot="dropdown"
      v-show="tableData.length > 0"
    >
      <el-dropdown-item>
        <div class="line-item">
          <p class="table-line">
            <span>{{ accountName || '名称' }}：</span>
            <span>{{
              (tableData[0] && tableData[0].authentication) || '--'
            }}</span>
          </p>
          <avue-crud
            class="table-no-menu"
            :data="tableData"
            :option="tableOption"
            :table-loading="loading"
          >
            <!-- <template slot="title" slot-scope="scope">
                <el-link type="primary" class="word-ellipsis-1">{{
                  scope.row.title
                }}</el-link>
            </template> -->
          </avue-crud>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: 'main-account-dropdown',
  data() {
    return {
      tableOption: {
        menu: false, // 隐藏操作
        menuWidth: 56,
        editBtn: false, // 添加按钮
        delBtn: false, // 添加按钮
        addBtn: false, // 添加按钮
        columnBtn: false, // 列显隐按钮
        refreshBtn: false, // 刷新按钮
        stripe: true, // 斑马线
        page: false, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '账号名称',
            prop: 'accountName',
            width: 180
          },
          {
            label: '唯一标识',
            prop: 'uniqueCode',
            width: 180
          },
          {
            label: '账号状态',
            prop: 'accountType'
          }
        ]
      }
    };
  },
  props: {
    loading: Boolean,
    tableData: {
      type: Array,
      default: () => []
    },
    accountName: {
      type: String | Number,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.left-label {
  margin-right: 30px;
}
.info-tip {
  .el-dropdown-menu__item {
    padding-top: 7px;
    cursor: auto;
    &:hover {
      background: transparent;
      i {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .line-item {
    font-size: 14px;
    line-height: 22px;
    span:nth-of-type(1) {
      color: $mainBlack85;
    }
    span:nth-of-type(2) {
      color: $mainBlack45;
      max-width: 200px;
    }
    .erweima {
      width: 96px;
      height: 97px;
    }
    .content-erweima {
      text-align: center;
      font-size: 12px;
      color: $mainBlack65;
      margin-top: -5px;
    }
  }
  .table-line {
    padding: 10px 0 15px;
  }
}
</style>
