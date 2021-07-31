<template>
  <div>
    <el-form ref="form" :model="model" :rules="rules" label-width="135px">
      <el-row :gutter="10" class="row">
        <el-col :span="24">
          <el-form-item label="复制历史任务数据">
            <el-button
              type="primary"
              @click="openHistoryTaskSelector"
              style="margin-right: 4px"
            >
              选择
            </el-button>
            <el-tag
              v-if="model.taskDetailIds.length"
              class="el-tag--ex-default"
              closable
              @close="model.taskDetailIds = []"
            >
              历史任务{{ model.taskDetailIds.length }}项
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否有对外服务职能">
            <el-radio-group v-model="model.foreignService">
              <el-radio-button
                class="el-radio-button--plain"
                v-for="item in dicList.foreign_service"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="form-item--border-radio" label="检查范围">
            <el-radio
              v-model="model.isSingleVeto"
              v-for="item in dicList.is_single_veto"
              :key="item.value"
              :label="item.value"
              border
              >{{ item.label }}</el-radio
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <history-task-selector
      :visible.sync="historyTaskSelector.visible"
      :taskId="taskDetail.taskId"
      :siteId="taskDetail.siteId"
      @on-ok="onHistoryTaskSelectorOk"
    />
  </div>
</template>

<script>
import * as inputReportApi from '@/api/website/order/input-report';
import useGetDicList from '@/hook/useGetDicList';

import HistoryTaskSelector from '@/components/dialog/website/order/input-report/history-task-selector';
export default {
  components: {
    HistoryTaskSelector
  },
  props: {
    // 任务详情
    taskDetail: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      model: {
        taskDetailIds: [],
        foreignService: '1',
        isSingleVeto: '0'
      },
      rules: {},
      historyTaskSelector: {
        visible: false
      }
    };
  },
  setup() {
    let { dicList } = useGetDicList(
      ['is_single_veto', 'foreign_service'],
      false
    );
    return {
      dicList
    };
  },
  methods: {
    // 打开历史任务选择器
    openHistoryTaskSelector() {
      this.historyTaskSelector.visible = true;
    },
    // 历史任务选择确定回调
    onHistoryTaskSelectorOk(data) {
      this.model.taskDetailIds = data.map(item => item.id);
    },
    // 提交
    async doSubmit() {
      let { code, msg } = await inputReportApi.paramsSave({
        id: this.taskDetail.id, // 当前任务详情ID
        foreignService: this.model.foreignService, // 是否有对外职能1是0否
        isSingleVeto: this.model.isSingleVeto, // 检查范围0.全部；1.单否
        ids: this.model.taskDetailIds // 所选的历史任务详情ID
      });
      if (code === 0) {
        let path = `/website/order/input-report?taskId=${this.taskDetail.taskId}&taskDetailId=${this.taskDetail.id}`;
        this.$router.push(path);
        this.$emit('success');
      } else {
        this.$message.error(msg);
      }
    },
    submit() {
      this.$refs['form'].validate((valid, obj) => {
        if (valid) {
          this.doSubmit();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item--border-radio {
  /deep/ .el-form-item__content {
    .el-radio {
      margin: 0;
      & + .el-radio {
        margin-left: 4px;
      }
    }
  }
}
.el-tag.el-tag--ex-default {
  height: 32px;
  line-height: 30px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border: 1px solid #d9d9d9;
  /deep/ .el-icon-close {
    transform: scale(1);
    border-radius: 2px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
  /deep/ .el-tag__close {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
