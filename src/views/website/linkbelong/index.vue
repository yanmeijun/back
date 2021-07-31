<template>
  <div class="linkbelong">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        ref="poolForm"
        :model="poolForm"
        label-width="100px"
        class="no-rules-form"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-between">
          <el-col :xs="24" :sm="24" :md="7">
            <el-form-item label="网站信息:" prop="keyWord">
              <el-input
                v-model="poolForm.keyWord"
                placeholder="请输入网站名称/标识码"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7">
            <el-form-item label="创建时间:" prop="rangeDate">
              <el-date-picker
                class="kp-date-picker"
                v-model="poolForm.rangeDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10">
            <el-form-item class="flex justify-end padding-none">
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <!-- 列表部分 -->
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">链接归属列表</span>
        <div class="flex">
          <!-- <el-button class="delete-btn" @click="showDeleteDialog">删除</el-button> -->
          <ExportPage
            class="export-page"
            :pageSize="page.pageSize"
            :total="page.total"
            :args="exportArgs"
            :url="`/cloud-website-back/websiteLinkBelong/export`"
          />
          <ImportBtn
            :url="`/cloud-website-back/websiteLinkBelong/checkLinkBelong`"
            :modelUrl="
              `/cloud-website-back/websiteLinkBelong/downloadTpl/网站链接归属导入表格模板.xlsx`
            "
            :argName="`file`"
            @update="resetQuery"
          />
          <el-button type="primary" @click="showEditDialog()">添加</el-button>
        </div>
      </div>
      <ex-table
        :data="data"
        :option="tableOption"
        :page="page"
        @selection-change="selectionChangeHandle"
      >
        <template slot="index" slot-scope="scope">
          <span>{{ scope.row.rowIndex + 1 }}</span>
        </template>
        <template slot="url" slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.url"
            placement="top"
            :enterable="false"
          >
            <el-link
              class="word-ellipsis-1"
              type="primary"
              target="_blank"
              :href="scope.row.url"
            >
              <span>{{ scope.row.url }}</span>
            </el-link>
          </el-tooltip>
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
                @click="showEditDialog(scope.row)"
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
                @click="showDeleteDialog(scope.row.id)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 删除弹窗 -->
    <TipInfoDialog
      v-if="isDeleteDiaShow"
      ref="isTipConfirmDialog"
      :tipContent="tipContent"
      :isOpen="isDeleteDiaShow"
      @confirmFn="confirmDeleteHandel"
      @closeDialog="closeDeleteTip"
    />
    <!-- 右侧抽屉 -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="isDrawerShow"
      direction="rtl"
      size="736px"
      :modal="true"
      :wrapperClosable="false"
      custom-class="addDialog"
      :before-close="closeDrawer"
    >
      <div class="main">
        <el-form ref="drawerForm" :model="drawerForm" :rules="drawerRules">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item
                label="网站标识码："
                prop="siteCode"
                class="error-left"
              >
                <!-- <el-input v-model="drawerForm.siteCode"></el-input> -->
                <select-website
                  class="input-with-tree"
                  :value.sync="drawerForm.siteCode"
                  :ifDisabled="ifDisabled"
                  v-model="drawerForm.siteCode"
                  @selectSite="selectSite"
                ></select-website>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <div style="visibility:hidden;">
                <el-form-item label="网站标识码：">
                  <select-dict :type="``"></select-dict>
                </el-form-item>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="网站名称：" prop="siteName">
                <el-input
                  v-model="drawerForm.siteName"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <el-form-item label="网站地址：" prop="url">
                <el-input v-model="drawerForm.url" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item
                label="白名单地址："
                prop="whiteUrl"
                class="error-left"
              >
                <el-input
                  v-model="drawerForm.whiteUrl"
                  placeholder="请输入您要包含的链接地址，多个地址请用英文“;”分割，请勿包含空格、中文、中文符号等非法字符"
                  type="textarea"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item
                label="黑名单地址："
                prop="blackUrl"
                class="error-left"
              >
                <el-input
                  v-model="drawerForm.blackUrl"
                  placeholder="请输入您要排除的链接地址，多个地址请用英文“;”分割，请勿包含空格、中文、中文符号等非法字符"
                  type="textarea"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="footer-btn">
        <el-button @click="closeDrawer">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getLinkBelongList,
  updateLinkBelongStatus,
  insertLinkBelong
} from '@/api/website/linkbelong';
import ResetTable from '@/mixins/resetTableHeight';
import ExportPage from '@/components/base/website/export/export-page';
import ImportBtn from '@/components/base/website/import-btn';
import TipInfoDialog from '@/components/dialog/tip-dialog/index';
import SelectWebsite from '@/components/business-components/website/column-monitor/select-website';

let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 46
});
export default {
  name: 'link-belong',
  mixins: [mixin],
  components: {
    ExportPage,
    ImportBtn,
    TipInfoDialog,
    SelectWebsite
  },
  data() {
    return {
      poolForm: {
        keyWord: '',
        rangeDate: []
      },
      data: [],
      tableOption: {
        // selection: true,
        // selectionWidth: 34,
        menu: true, // 隐藏操作
        menuWidth: 68,
        stripe: true, // 斑马线
        page: true, // 分页
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '序号',
            prop: 'index',
            width: 56,
            slot: true
          },
          {
            label: '网站标识码',
            prop: 'siteCode',
            width: 150
          },
          {
            label: '网站名称',
            prop: 'siteName',
            minWidth: 150,
            align: 'left',
            showOverflow: true
          },
          {
            label: '首页地址',
            prop: 'url',
            width: 150,
            showOverflow: true,
            align: 'left',
            slot: true
          },
          {
            label: '白名单地址',
            prop: 'whiteUrl',
            width: 150,
            showOverflow: true,
            align: 'left'
          },
          {
            label: '黑名单地址',
            prop: 'blackUrl',
            width: 150,
            showOverflow: true,
            align: 'left'
          },
          {
            label: '创建用户',
            prop: 'createdByMeaning',
            width: 150,
            showOverflow: true
          },
          {
            label: '修改用户',
            prop: 'updatedByMeaning',
            width: 150,
            showOverflow: true
          },
          {
            label: '创建时间',
            prop: 'createdTime',
            width: 180
          },
          {
            label: '修改时间',
            prop: 'updatedTime',
            width: 180
          }
        ]
      },
      page: {
        pageSize: 100,
        pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      currentPage: 1,
      isDeleteDiaShow: false,
      tipContent: {
        title: '您确定要删除吗？删除之后扫描任务也同步停止。'
      },
      deleteId: [],
      selectedSites: [],
      drawerTitle: '添加栏目',
      isDrawerShow: false,
      drawerForm: {
        id: '',
        siteCode: '',
        siteName: '',
        url: '',
        whiteUrl: '',
        blackUrl: ''
      },
      ifDisabled: false,
      drawerRules: {
        siteCode: {
          message: '网站标识码不能为空',
          required: true,
          trigger: 'blur'
        },
        whiteUrl: {
          message: '白名单地址不能为空',
          required: true,
          trigger: 'blur'
        },
        blackUrl: {
          message: '黑名单地址不能为空',
          required: true,
          trigger: 'blur'
        }
      }
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {
    // 导出的参数
    exportArgs() {
      return {
        keyWord: this.poolForm.keyWord,
        startTime: this.poolForm.rangeDate[0],
        endTime: this.poolForm.rangeDate[1]
      };
    }
  },
  methods: {
    queryList() {
      let paramsObj = {
        keyWord: this.poolForm.keyWord,
        startTime: this.poolForm.rangeDate[0],
        endTime: this.poolForm.rangeDate[1],
        page: {
          current: this.currentPage,
          size: this.page.pageSize
        }
      };
      getLinkBelongList(paramsObj).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.currentPage = res.data.current;
          this.page.total = res.data.total;
          this.data = res.data.records;
        }
      });
    },
    resetQuery() {
      this.poolForm = {
        keyWord: '',
        rangeDate: []
      };
      this.queryList();
    },
    showEditDialog(obj) {
      if (obj) {
        this.drawerForm.id = obj.id;
        this.drawerForm.siteCode = obj.siteCode;
        this.drawerForm.siteName = obj.siteName;
        this.drawerForm.url = obj.url;
        this.drawerForm.whiteUrl = obj.whiteUrl;
        this.drawerForm.blackUrl = obj.blackUrl;
        this.ifDisabled = true;
      } else {
        this.drawerForm = {
          siteCode: '',
          siteName: '',
          url: '',
          whiteUrl: '',
          blackUrl: ''
        };
        this.ifDisabled = false;
      }
      this.isDrawerShow = true;
    },
    showDeleteDialog(id) {
      // 单个删除
      this.deleteId = [id];
      this.isDeleteDiaShow = true;
    },
    confirmDeleteHandel() {
      // 调用删除接口
      let paramsObj = {
        ids: this.deleteId,
        status: '-1'
      };
      updateLinkBelongStatus(paramsObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.msg || '删除成功！'
          });
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          });
        }
      });
    },
    selectionChangeHandle(val) {
      this.selectedSites = val;
    },
    closeDeleteTip() {
      this.isDeleteDiaShow = false;
    },
    closeDrawer() {
      this.isDrawerShow = false;
      this.$refs['drawerForm'].resetFields();
    },
    selectSite(siteInfo) {
      [this.drawerForm.url, this.drawerForm.siteName, this.drawerForm.id] = [
        siteInfo.url,
        siteInfo.accountName,
        siteInfo.id
      ];
    },
    onSubmit() {
      this.$refs['drawerForm'].validate(valid => {
        if (valid) {
          // alert('submit!');
          if (this.ifDisabled) {
            // 编辑
            let paramsObj = {
              id: this.drawerForm.id,
              whiteUrl: this.drawerForm.whiteUrl,
              blackUrl: this.drawerForm.blackUrl
            };
            updateLinkBelongStatus(paramsObj).then(res => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功！'
                });
                this.closeDrawer();
                this.resetQuery();
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                });
              }
            });
          } else {
            // 新增
            // insertLinkBelong
            let paramsObj = {
              siteId: this.drawerForm.id,
              siteName: this.drawerForm.siteName,
              siteCode: this.drawerForm.siteCode,
              url: this.drawerForm.url,
              whiteUrl: this.drawerForm.whiteUrl,
              blackUrl: this.drawerForm.blackUrl
            };
            insertLinkBelong(paramsObj).then(res => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '添加成功！'
                });
                this.closeDrawer();
                this.resetQuery();
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                });
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.linkbelong {
  ::v-deep.el-form {
    .btns {
      .el-button {
        @media (max-width: 992.98px) {
          margin-left: 10px;
        }
      }
    }
  }
  .export-page,
  .delete-btn {
    margin-right: 10px;
  }
}
</style>
