<template>
  <div class="pending">
    <basic-container :border="true" :mini="true" class="top-form">
      <el-form
        class="no-rules-form"
        :model="oneForm"
        ref="refOneForm"
        label-width="110px"
      >
        <el-row :gutter="10" type="flex" class="flex flex-wrap justify-between">
          <el-col :xs="24" :ms="24" :md="12">
            <el-form-item label="客户信息：">
              <div class="flex">
                <el-select
                  class="input-with-select"
                  v-model="oneForm.way"
                  placeholder="请选择"
                  @change="onChangeWay"
                >
                  <el-option label="订单号" value="1"></el-option>
                  <el-option label="组织单位编码" value="2"></el-option>
                  <el-option label="网站标识码" value="3"></el-option>
                  <el-option label="新媒体单位唯一标识" value="4"></el-option>
                </el-select>
                <avue-input-tree
                  v-if="oneForm.way === '2'"
                  class="input-with-tree"
                  :check-strictly="true"
                  multiple
                  v-model="oneForm.codeArray"
                  placeholder="请选择内容"
                  type="tree"
                  :dic="dic"
                >
                </avue-input-tree>
                <el-input
                  class="input-with-tree"
                  clearable
                  v-else
                  v-model="oneForm.code"
                  :disabled="!!!oneForm.way"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6">
            <el-form-item class="no-margin" prop="createdTime">
              <div class="flex">
                <el-select
                  class="input-with-select"
                  v-model="oneForm.time"
                  placeholder="请选择"
                >
                  <el-option label="监测时间" value="1"></el-option>
                  <el-option label="修改时间" value="2"></el-option>
                </el-select>
                <el-date-picker
                  class="kp-date-picker input-with-tree"
                  v-model="oneForm.createdTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :ms="24" :md="6">
            <el-form-item label="监测时间：">
              <el-date-picker
                class="kp-date-picker"
                v-model="oneForm.createdTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="内容类型：" prop="conType">
              <el-select v-model="oneForm.conType" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="12" v-show="isPackUp">
            <el-form-item label="账号类型：" prop="type">
              <el-select
                class="kp-select-multiple"
                v-model="oneForm.type"
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="账号信息：" prop="info">
              <el-input v-model="oneForm.info" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="问题级别：" prop="level">
              <el-select v-model="oneForm.level" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="12" v-show="isPackUp">
            <el-form-item label="问题类型：" prop="questionType">
              <el-select
                class="kp-select-multiple"
                v-model="oneForm.questionType"
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="外链暗链地址：" prop="url">
              <el-input v-model="oneForm.url" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="标记状态：" prop="markType">
              <el-select v-model="oneForm.markType" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :ms="24" :md="6" v-show="isPackUp">
            <el-form-item label="操作结果：" prop="result">
              <el-select v-model="oneForm.result" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
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
        <span class="flex align-center name">外链暗链</span>
        <div class="flex right">
          <ShowColumn
            v-model="showColumn"
            :allShowColumn="allShowColumn"
            :tableOption="tableOption"
          />
          <Marks :rows="checkTableList" />
          <!-- <el-button type="primary" :disabled="checkTableList.length === 0"
            >标记已删除</el-button
          > -->
          <el-button type="primary" :disabled="checkTableList.length === 0"
            >误报</el-button
          >
          <el-button type="primary" :disabled="checkTableList.length === 0"
            >预警并显示</el-button
          >
          <el-button type="primary" :disabled="checkTableList.length === 0"
            >仅显示</el-button
          >
          <ExportDropdown
            class="export-btn"
            :url="``"
            :idList="exportIdList"
            :pageSize="page.pageSize"
            :total="page.total"
          />
        </div>
      </div>
      <ex-table
        ref="refCrud"
        :data="data"
        :option="tableOption"
        :loading="loading"
        :show-column="showColumn"
        :page="page"
        @on-load="onLoad"
        @selection-change="onTableSelectionChange"
      >
        <template slot="outUrl" slot-scope="scope">
          <el-link type="primary">{{ scope.row.outUrl }}</el-link>
        </template>
        <template slot="url" slot-scope="scope">
          <el-link type="primary">{{ scope.row.url }}</el-link>
        </template>
        <template slot="imgUrl" slot-scope="scope">
          <div class="flex center icons">
            <el-link type="primary" :href="scope.row.imgUrl" :underline="false">
              <i class="iconfont icontubiaozhizuomoban59"></i>
            </el-link>
          </div>
        </template>
        <!-- <template slot="homeUrl" slot-scope="scope">
          <el-link
            v-if="scope.row.accountType !== '101'"
            type="primary"
            :underline="false"
            :href="scope.row.homeUrl"
          >
            <i class="iconfont icontubiaozhizuomoban59"></i>
          </el-link>
          <el-popover
            v-else
            placement="bottom"
            trigger="hover"
            :popper-class="`popper-ewm`"
          >
            <template>
              <div slot class="ewm-con kp-text-center">
                <img src="" alt="" />
                微信扫一扫
              </div>
            </template>
            <div slot="reference" class="icons">
              <i class="iconfont icontubiaozhizuomoban7"></i>
            </div>
          </el-popover>
        </template> -->
        <template slot="menu" slot-scope="scope">
          <div class="flex align-center icons">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
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
              content="预警并显示"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban25"
                @click="onShowWarning(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="仅显示"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban37"
                @click="onShowing(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="误报"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban12"
                @click="onShowMisInfo(scope.row)"
              ></i>
            </el-tooltip>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i
                class="iconfont icontubiaozhizuomoban22"
                @click="onShowDel(scope.row)"
              ></i>
            </el-tooltip> -->
          </div>
        </template>
      </ex-table>
    </basic-container>
    <!-- 删除 -->
    <DeleteReasonDialog
      v-if="isDeleteReasonDialog"
      ref="DeleteReasonDialog"
      :ids="delIds"
      :isOpen="isDeleteReasonDialog"
      @closeDialog="onCloseDelDialog"
    />
    <!-- 误报 -->
    <MisInfoReasonDialog
      v-if="isMisInfoReasonDialog"
      ref="MisInfoReasonDialog"
      :ids="misIds"
      :isOpen="isMisInfoReasonDialog"
      @closeDialog="onCloseMisInfoDialog"
    />
    <!-- 预警仅显示 -->
    <TipDialog
      v-if="isTipWarningDialog"
      ref="TipWarningDialog"
      :tipContent="warnTipContent"
      :isOpen="isTipWarningDialog"
      @confirmFn="onWarnConfirm"
      @closeDialog="isTipWarningDialog = false"
    />
    <!-- 仅显示 -->
    <TipDialog
      v-if="isTipShowDialog"
      ref="TipShowDialog"
      :tipContent="showTipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onShowConfirm"
      @closeDialog="isTipShowDialog = false"
    />
    <!-- 编辑 -->
    <EditReasonDialog
      v-if="isEditReasonDialog"
      ref="refEditReasonDialog"
      :isOpen="isEditReasonDialog"
      @closeDialog="onCloseEditReasonDialog"
    />
    <!-- 图片展示 -->
    <MoitorClipImgsDialog
      ref="moitorClipImgsDialog"
      v-if="isOpenImgsDialog"
      :isOpen="isOpenImgsDialog"
      :srcList="srcClipList"
      @closeDialog="onCloseImgsDialog"
    />
    <!-- 按序号选中 -->
    <SelectionByNumDialog
      ref="SelectionByNumDialog"
      v-if="isSelectionByNumDialog"
      :isOpen="isSelectionByNumDialog"
      :pageSize="data.length"
      @select="onSelectionChange"
      @closeDialog="isSelectionByNumDialog = false"
    />
  </div>
</template>
<script>
import {
  reactive,
  ref,
  toRefs,
  computed,
  nextTick
} from '@vue/composition-api';

import ExportDropdown from '@/components/base/export/export-dropdown';
import ShowColumn from '@/components/base/show-column';
import Marks from '@/components/business-components/new-media/data-review/out-dark-link/marks';
import DeleteReasonDialog from '@/components/dialog/new-media/data-review/delete-reason-dialog';
import MisInfoReasonDialog from '@/components/dialog/new-media/data-review/misInfo-reason-dialog';
import EditReasonDialog from '@/components/dialog/new-media/data-review/edit-reason-dialog';
import MoitorClipImgsDialog from '@/components/dialog/new-media/order/monitor-clip-imgs-dialog';
import SelectionByNumDialog from '@/components/dialog/new-media/data-review/selection-by-num-dialog';
import TipDialog from '@/components/dialog/tip-dialog';

import { useCommon } from '../useCommon';
import { option2 } from '../table-option';
import ResetTable from '@/mixins/resetTableHeight';
let mixin = new ResetTable({
  name: 'tableOption',
  list: ['.top-form'],
  diff: 80
});
export default {
  name: 'info-audited',
  components: {
    ExportDropdown,
    ShowColumn,
    Marks,
    DeleteReasonDialog,
    MisInfoReasonDialog,
    EditReasonDialog,
    MoitorClipImgsDialog,
    SelectionByNumDialog,
    TipDialog
  },
  mixins: [mixin],
  setup() {
    // 定义ref
    const refOneForm = ref(null);
    // const refEditReasonDialog = ref(null);
    const refCrud = ref(null);
    // 定义state
    const common = useCommon();
    const state = reactive({
      warnTipContent: {
        title: '预警通知客户并显示到前台，还要继续吗？'
      },
      showTipContent: {
        title: '仅显示到前台，还要继续吗？'
      },
      oneForm: {
        time: '1',
        way: '1',
        code: '',
        codeArray: [],
        createdTime: '',
        type: '',
        info: '',
        conType: '',
        questionType: '',
        level: '',
        result: '',
        markType: '',
        url: ''
      },
      checkTableList: [],
      allShowColumn: ['questionType', 'result'],
      showColumn: [
        'questionType',
        'result',
        'url',
        'imgUrl',
        'accountTypeMeaning',
        'accountName',
        'homeUrl',
        'questionLevel',
        'vTime'
      ],
      data: [
        {
          id: 0,
          questionType: '发现泄密内容',
          result: '仅显示',
          url:
            'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          imgUrl:
            'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          accountTypeMeaning: '微信公众号',
          accountName: '北京交通',
          accountCode: 'SO#202003-0005',
          accountType: '101',
          homeUrl: 'https://wwww.baidu.com',
          unicode: '100000',
          custCode: '4310280001',
          questionLevel: '一般',
          markType: '北京交通',
          mark: 0,
          conType: '北京交通',
          changeTime: '2017-10-10 12:00',
          changeName: '小米',
          vTime: '2017-10-10 12:00'
        },
        {
          id: 1,
          questionType: '发现泄密内容',
          result: '预警并显示',
          url:
            'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          imgUrl:
            'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          accountTypeMeaning: '微信公众号',
          accountName: '北京交通',
          accountCode: 'SO#202003-0005',
          accountType: '100',
          homeUrl: 'https://wwww.baidu.com',
          unicode: '100000',
          custCode: '4310280001',
          questionLevel: '一般',
          conType: '北京交通',
          markType: '北京交通',
          mark: 1,
          changeTime: '2017-10-10 12:00',
          changeName: '小米',
          vTime: '2017-10-10 12:00'
        }
      ],
      tableOption: option2
    });

    // 属性
    const cCheckTxt = computed(() => {
      return state.checkTableList.length === state.data.length
        ? '取消当前页全选'
        : '当前页全选';
    });

    // 方法 ------------------------------

    // 查询
    const onQueryList = () => {
      refOneForm.value.validate(valid => {
        if (valid) {
          console.log(state.oneForm);
        }
      });
    };

    // 重置
    const onResetQuery = () => {
      console.log(9);
      state.oneForm.way = '1';
      state.oneForm.time = '1';
      state.oneForm.code = '';
      state.oneForm.codeArray = [];
      refOneForm.value.resetFields();
    };

    // 搜索 - 切换
    const onChangeWay = val => {
      state.oneForm.codeArray = [];
    };

    // 选中结果
    const onCheckAll = () => {
      onToggleSelection();
      if (state.checkTableList.length !== state.data.length) {
        onToggleSelection(state.data);
      }
    };
    // const onCheckNum = () => {
    //   state.isSelectionByNumDialog = true;
    // };
    const onTableSelectionChange = selection => {
      state.checkTableList = selection;
    };
    const onToggleSelection = val => {
      // 设置表格默认选中值
      nextTick(() => {
        refCrud.value.toggleSelection(val);
      });
    };
    // 根据序号选择
    const onSelectionChange = val => {
      const [start, end] = val;
      let list = [];
      if (!end) {
        list = state.data.slice(parseInt(start) - 1, parseInt(start));
      } else {
        list = state.data.slice(parseInt(start) - 1, parseInt(end));
      }
      onToggleSelection();
      onToggleSelection(list);
    };

    // 返回
    return {
      refOneForm,
      refCrud,
      cCheckTxt,
      ...common,
      ...toRefs(state),
      onQueryList,
      onResetQuery,
      onChangeWay,
      onSelectionChange,
      onTableSelectionChange,
      onCheckAll
    };
  }
};
</script>
<style lang="scss" scoped>
.pending {
  .input-with-select {
    width: 170px;
    ::v-deep {
      .el-input__suffix .el-input__suffix-inner {
        background: #fff;
      }
      .el-input .el-input__inner {
        border-radius: 4px 0 0 4px;
        border-right: 0;
      }
    }
  }
  .input-with-tree {
    ::v-deep {
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
  }
  .selection-dropdown {
    position: absolute;
    left: 24px;
    top: 14px;
    z-index: 5;
    cursor: pointer;
  }
  .el-dropdown-link-txt {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.85);
  }
  .err-icon {
    margin-right: 8px;
  }
  .export-btn {
    margin-right: 0;
  }
  .no-margin {
    ::v-deep {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .data-tabs {
    margin-bottom: 20px;
  }
}
</style>
<style>
.popper-ewm {
  min-width: 130px;
}
.popper-ewm .ewm-con {
  padding: 4px 0;
}

.popper-ewm img {
  display: block;
  margin: 0 auto 6px;
  width: 96px;
  height: 96px;
}
</style>
