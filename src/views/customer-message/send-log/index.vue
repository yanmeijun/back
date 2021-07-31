<template>
  <div class="send">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        class="no-rules-form"
        :model="form"
        ref="refForm"
        label-width="80px"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-end">
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item label="客户信息 :" prop="accountInfo">
              <GetAccountInfo :limit="1" v-model="form.accountInfo" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8">
            <el-form-item label="发送渠道 :" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择">
                <el-option
                  v-for="item in dicList.msg_channel_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="接收地址 :" prop="info">
              <el-input
                v-model="form.info"
                placeholder="请输入接收地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="消息类型 :" prop="messageType">
              <el-select v-model="form.messageType" placeholder="请选择">
                <el-option
                  v-for="item in dicList.msg_message_type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
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
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="触发条件 :" prop="isBool">
              <el-select v-model="form.isBool" placeholder="请选择">
                <el-option
                  v-for="item in dicList.prod_id"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="发送状态 :" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in msgStatusList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="8" v-show="isPackUp">
            <el-form-item label="发送时间 :" prop="createTime">
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
          <!-- <el-button>添加产品预警策略</el-button>
          <el-button type="primary">添加系统报告策略</el-button> -->
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
        <template slot="type" slot-scope="scope">
          <div class="flex center">
            <span v-if="parseInt(scope.row.type)">成功</span>
            <el-tooltip v-else placement="top" content="失败">
              <span class="kp-color-main">失败...</span>
            </el-tooltip>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <div class="flex align-center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
              v-if="false"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="onShowLook(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="重新发送"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban6"
                @click="onShowEdit(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="发送记录"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="onShowHistory(scope.row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 删除 - 是 -->
    <TipDialog
      v-if="isTipShowDialog"
      ref="TipShowDialog"
      :tipContent="tipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onTipConfirm"
      @closeDialog="onCloseTip"
    />
    <!-- 流水弹窗 -->
    <FlowingWater
      ref="FlowingWater"
      :infoId="infoId"
      :isOpen="isFlowWater"
      @closeDialog="onCloseFlowingWater"
    />
  </div>
</template>

<script>
import { reactive, toRefs, computed } from '@vue/composition-api';
import GetAccountInfo from '@/components/base/get-account-text-info';
import TipDialog from '@/components/dialog/tip-dialog';
import FlowingWater from '@/components/dialog/flowing-water';

import useGetDicList from '@/hook/useGetDicList';
import useForm from './hook/useForm';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  diff: 148
});
export default {
  name: 'send',
  components: {
    GetAccountInfo,
    TipDialog,
    FlowingWater
  },
  mixins: [mixin],
  setup() {
    const state = reactive({
      isTipShowDialog: false,
      isPackUp: false,
      loading: false,
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
      updateOpen: '',
      infoId: '',
      isFlowWater: false,
      msgStatusList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '成功',
          value: 1
        },
        {
          label: '失败',
          value: 2
        }
      ]
    });
    /**
     * ---------------- useHook ----------------
     */
    // 获取字典
    const { dicList } = useGetDicList([
      'prod_id',
      'issue_type',
      'msg_channel_type',
      'msg_message_type',
      'msg_message_status'
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
    console.log(dicList.value);
    // form + 表格数据
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
    const onShowEdit = () => {};
    const onShowHistory = obj => {
      state.infoId = obj.id;
      state.isFlowWater = true;
      // this.$nextTick(() => {
      // console.log(refFlowingWater)
      // refFlowingWater.init(obj.id);
      // });
    };
    const onCloseFlowingWater = val => {
      state.isFlowWater = false;
    };
    const onShowLook = () => {};
    /**
     * 是否启用
     */
    const onSwitchChange = (val, row) => {
      console.log(val, row);
      state.tipContent = parseInt(val.value)
        ? state.openTipContent
        : state.stopTipContent;
      state.updateOpen = row;
      state.isTipShowDialog = true;
    };
    const onTipConfirm = () => {
      // 修改数据 + 更新列表本条数据
      console.log(state.updateOpen);
    };
    const onCloseTip = () => {
      state.updateOpen = '';
      state.isTipShowDialog = false;
    };
    // END 是否启用

    const onPackUp = () => {
      state.isPackUp = !state.isPackUp;
    };

    return {
      refForm,
      refCrud,
      ...toRefs(state),
      ...toRefs(formState),
      dicList,
      prodList,
      onPackUp,
      onQueryList,
      onResetQuery,
      onLoad,
      onShowHistory,
      onShowEdit,
      onShowLook,
      onSwitchChange,
      onTipConfirm,
      onCloseTip,
      onCloseFlowingWater
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.send {
}
</style>
