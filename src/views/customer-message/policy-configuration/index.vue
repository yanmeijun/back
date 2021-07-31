<template>
  <div class="policy">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        class="no-rules-form"
        :model="form"
        ref="refForm"
        label-width="80px"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-end">
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item label="产品类型 :" prop="prodType">
              <el-select v-model="form.prodType" placeholder="请选择">
                <el-option
                  v-for="item in prodList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item label="消息类型 :" prop="messageType">
              <el-select v-model="form.messageType" placeholder="请选择">
                <el-option
                  v-for="item in dicList.strategy_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="客户信息 :" prop="accountInfo">
              <!-- <GetAccountInfo :limit="5" v-model="form.accountInfo" /> -->
              <el-input
                v-model="form.accountInfo"
                placeholder="请输入标识码/名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="发生单位 :" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择">
                <el-option
                  v-for="item in dicList.fill_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="是否启用 :" prop="isBool">
              <el-select v-model="form.isBool" placeholder="请选择">
                <el-option
                  v-for="item in dicList.strategy_status"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="状态 :" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in dicList.is_del"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="创建时间 :" prop="createTime">
              <el-date-picker
                class="kp-date-picker"
                v-model="form.createTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="修改时间 :" prop="updateTime">
              <el-date-picker
                class="kp-date-picker"
                v-model="form.updateTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <div class="flex justify-end">
              <pack-button
                @packClick="onPackUp"
                :packUp="isPackUp"
              ></pack-button>
              <el-button @click="onResetQuery">重置</el-button>
              <el-button type="primary" @click="onQueryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <basic-container>
      <div class="flex align-center justify-between kp-block-title">
        <span class="flex align-center name">消息策略</span>
        <div class="flex right">
          <!-- <ShowColumn
            v-model="showColumn"
            :allShowColumn="allShowColumn"
            :tableOption="tableOption"
          /> -->
          <el-button @click="onShowEditPolicy">添加产品预警策略</el-button>
          <el-button @click="onShowEditReport" type="primary"
            >添加系统报告策略</el-button
          >
        </div>
      </div>
      <ex-table
        ref="refCrud"
        :data="data"
        :option="tableOption"
        :loading="loading"
        :page="page"
        @on-load="onLoad"
      >
        <template slot="index" slot-scope="scope">
          <div class="kp-text-center">{{ scope.row.rowIndex + 1 }}</div>
        </template>
        <template slot="prodType" slot-scope="scope">
          <div class="flex">{{ getProdName(scope.row.prodId) }}</div>
        </template>
        <template slot="strategyType" slot-scope="scope">
          <div class="">{{ getStrategyType(scope.row.strategyType) }}</div>
        </template>
        <template slot="fillType" slot-scope="scope">
          <div class="">{{ fillType(scope.row.fillType) }}</div>
        </template>
        <template slot="where" slot-scope="scope">
          <div class="flex">
            <!-- <el-tag v-for="tag in scope.row.where" :key="tag">{{ tag }}</el-tag> -->
            <el-tag v-if="scope.row.wxReceive == 1">{{ '微信' }}</el-tag>
            <el-tag v-if="scope.row.emailReceive == 1">{{ '邮件' }}</el-tag>
            <el-tag v-if="scope.row.telReceive == 1">{{ '短信' }}</el-tag>
          </div>
        </template>
        <template slot="status" slot-scope="scope">
          <div class="flex center">
            <vxe-switch
              v-model="scope.row.status"
              open-label="是"
              open-value="1"
              close-label="否"
              close-value="2"
              size="mini"
              @change="
                val => {
                  onSwitchChange(val, scope.row);
                }
              "
            ></vxe-switch>
          </div>
        </template>
        <template slot="isDel" slot-scope="scope">
          <div class="flex center">
            <el-tag :type="parseInt(scope.row.isDel) == 1 ? '' : 'info'">{{
              parseInt(scope.row.isDel) == 1 ? '正常' : '删除'
            }}</el-tag>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex align-center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              v-if="scope.row.isDel == -1"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="onShowLook(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              v-else
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="onShowEdit(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="onShowDel(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 启用 - 是 -->
    <TipDialog
      v-if="isTipShowDialog"
      ref="TipShowDialog"
      :tipContent="tipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onTipConfirm"
      @closeDialog="onCloseTip"
    />
    <!-- 删除 - 是 -->
    <TipDialog
      v-if="isDelTipShowDialog"
      ref="DelTipShowDialog"
      :tipContent="delTipContent"
      :isOpen="isDelTipShowDialog"
      @confirmFn="onDelTipConfirm"
      @closeDialog="onCloseTip"
    />
    <!-- 预警策略 -->
    <EditPolicyDialog
      v-if="isEditPolicyDialog"
      ref="refEditPolicyDialog"
      :isOpen="isEditPolicyDialog"
      :strategyData="strategyData"
      @closeDialogR="closeAndRefresh(1)"
      @closeDialog="closeAndRefresh(0)"
    />
    <!-- 报告策略 -->
    <EditReportDialog
      v-if="isEditReportDialog"
      ref="refEditReportDialog"
      :isOpen="isEditReportDialog"
      :strategyData="strategyData"
      @closeDialogR="closeAndRefresh(1)"
      @closeDialog="closeAndRefresh(0)"
    />
  </div>
</template>

<script>
import {
  nextTick,
  reactive,
  ref,
  toRefs,
  computed
} from '@vue/composition-api';
import GetAccountInfo from '@/components/base/get-account-info';
import TipDialog from '@/components/dialog/tip-dialog';
import EditPolicyDialog from '@/components/dialog/customer-message/edit-policy-dialog';
import EditReportDialog from '@/components/dialog/customer-message/edit-report-dialog';
import { toggleStatus, removeById } from '@/api/cust-message';
import useGetDicList from '@/hook/useGetDicList';
import useForm from './hook/useForm';
import { Message } from 'element-ui';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  diff: 148
});
export default {
  name: 'policy',
  components: {
    GetAccountInfo,
    TipDialog,
    EditPolicyDialog,
    EditReportDialog
  },
  mixins: [mixin],
  setup() {
    const refEditPolicyDialog = ref(null);
    const refEditReportDialog = ref(null);
    const state = reactive({
      isTipShowDialog: false,
      isDelTipShowDialog: false,
      isEditPolicyDialog: false,
      isEditReportDialog: false,
      isPackUp: false,
      // loading: false,
      tipContent: {
        title: '',
        info: ''
      },
      stopTipContent: {
        title: '是否停用消息策略',
        info: '停用后客户将无法收到该策略的任何消息'
      },
      openTipContent: {
        title: '是否启用消息策略',
        info: '启用后客户将收到该策略的消息'
      },
      delTipContent: {
        title: '是否删除该消息策略',
        info: '删除后客户将无法收到该策略的任何消息且无法恢复'
      },
      updateOpen: '',
      del: '',
      strategyData: {
        id: '',
        isDel: 1
      },
      isClick: true
    });
    /**
     * ---------------- useHook ----------------
     */
    // 获取字典
    const { dicList } = useGetDicList([
      'prod_id',
      'issue_type',
      'strategy_status',
      'strategy_type',
      'fill_type',
      'is_del'
    ]);
    // 筛选产品类型
    const prodList = computed(() => {
      if (!dicList.value || !dicList.value.prod_id) {
        return [];
      }
      return dicList.value.prod_id.filter(item => {
        return item.value !== '3';
      });
    });

    // form + 表格数据s
    const {
      refForm,
      refCrud,
      onQueryList,
      onResetQuery,
      onLoad,
      formState
    } = useForm();
    // ---------------------end hook -------------

    // 表格 - 操作项
    // 编辑
    const onShowEdit = row => {
      if (!state.isClick) {
        return false;
      }
      state.isClick = false;
      state.strategyData.id = row.id;
      state.strategyData.isDel = row.isDel;
      if (row.strategyType == 1) {
        onShowEditPolicy();
      } else {
        onShowEditReport();
      }
    };
    // 查看
    const onShowLook = row => {
      if (!state.isClick) {
        return false;
      }
      state.isClick = false;
      state.strategyData.id = row.id;
      state.strategyData.isDel = row.isDel;
      if (row.strategyType == 1) {
        onShowEditPolicy();
      } else {
        onShowEditReport();
      }
    };
    const onShowDel = row => {
      state.del = row;
      state.isDelTipShowDialog = true;
    };
    const onDelTipConfirm = () => {
      // 修改数据 + 更新列表本条数据
      console.log(state.del);
      removeById({
        id: state.del.id
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          // 成功
          Message({
            type: 'success',
            message: res.msg || '删除成功！'
          });
          onQueryList();
        }
      });
    };

    // 编辑/添加预警策略弹框
    const onShowEditPolicy = () => {
      state.isEditPolicyDialog = true;
      nextTick(() => {
        if (!refEditPolicyDialog.value) return;
        refEditPolicyDialog.value.onInit();
      });
    };
    // 编辑/添加报告策略弹框
    const onShowEditReport = () => {
      state.isEditReportDialog = true;
      nextTick(() => {
        if (!refEditReportDialog.value) return;
        refEditReportDialog.value.onInit();
      });
    };

    /**
     * 是否启用
     */
    const onSwitchChange = (val, row) => {
      if (val.value == 1) {
        state.tipContent = {
          title: '是否启用消息策略',
          info: '启用后客户将收到该策略的消息'
        };
      } else {
        state.tipContent = {
          title: '是否停用消息策略',
          info: '停用后客户将无法收到该策略的任何消息'
        };
      }
      state.updateOpen = row;
      state.isTipShowDialog = true;
    };
    const onTipConfirm = () => {
      // 修改数据 + 更新列表本条数据
      toggleStatus({
        id: state.updateOpen.id,
        status: state.updateOpen.status == 1 ? 1 : 2
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          // 成功
          Message({
            type: 'success',
            message: res.msg || '操作成功！'
          });
        } else {
          Message({
            type: 'error',
            message: res.msg
          });
        }
        onQueryList();
      });
    };
    const onCloseTip = () => {
      state.updateOpen = '';
      state.isTipShowDialog = false;
      state.del = '';
      state.isDelTipShowDialog = false;
    };
    // END 是否启用
    const getProdName = prodId => {
      // 此处应该从字典里取
      if (prodId == '2') {
        return '网站监测';
      } else {
        return '新媒体监测';
      }
    };
    const getStrategyType = type => {
      return type == 1 ? '产品预警' : '系统报告';
    };
    const fillType = type => {
      return type == 1 ? '自己单位' : type == 2 ? '全部单位' : '部分单位';
    };
    const onPackUp = () => {
      state.isPackUp = !state.isPackUp;
    };
    const closeAndRefresh = ifRefresh => {
      state.isEditPolicyDialog = false;
      state.isEditReportDialog = false;
      state.strategyData.id = '';
      state.strategyData.isDel = '';
      state.isClick = true;
      if (ifRefresh == 1) {
        onQueryList();
      }
    };

    return {
      refForm,
      refCrud,
      refEditPolicyDialog,
      refEditReportDialog,
      ...toRefs(state),
      ...toRefs(formState),
      dicList,
      prodList,
      onPackUp,
      onQueryList,
      onResetQuery,
      onLoad,
      onShowDel,
      onDelTipConfirm,
      onShowEdit,
      onShowLook,
      onSwitchChange,
      onTipConfirm,
      onCloseTip,
      onShowEditPolicy,
      onShowEditReport,
      getProdName,
      getStrategyType,
      fillType,
      closeAndRefresh
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.policy {
}
</style>
