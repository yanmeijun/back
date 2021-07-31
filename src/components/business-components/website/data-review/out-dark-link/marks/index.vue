<template>
  <div class="mark">
    <el-dropdown trigger="click">
      <el-button>
        标记<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="kp-text-center" @click.native="onIntercept"
          >拦截</el-dropdown-item
        >
        <el-dropdown-item class="kp-text-center" @click.native="onTrust"
          >信任</el-dropdown-item
        >
        <el-dropdown-item
          class="kp-text-center"
          divided
          @click.native="onShowDialog"
          >管理标记</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 信任 -->
    <AuditTipDialog
      v-if="isAuditTipDialog"
      ref="TipShowDialog"
      :option="tipOption"
      :isOpen="isAuditTipDialog"
      @closeDialog="isAuditTipDialog = false"
    />
    <TipDialog
      v-if="isTipShowDialog"
      ref="InterceptTipShowDialog"
      :tipContent="showInterceptTipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onTrustConfirm"
      @closeDialog="isTipShowDialog = false"
    />
    <!-- 拦截 -->
    <InterceptDialog
      v-if="isInterceptDialog"
      ref="InterceptTipShowDialog"
      :rows="rows"
      :isOpen="isInterceptDialog"
      @closeDialog="isInterceptDialog = false"
    />
    <TipDialog
      v-if="isInterceptTipShowDialog"
      ref="InterceptTipShowDialog"
      :tipContent="showInterceptTipContent"
      :isOpen="isInterceptTipShowDialog"
      @confirmFn="onInterceptConfirm"
      @closeDialog="isInterceptTipShowDialog = false"
    />
    <ManagementMarksDialog
      v-if="isManagementMarksDialog"
      ref="ManagementMarksDialog"
      :isOpen="isManagementMarksDialog"
      @closeDialog="isManagementMarksDialog = false"
    />
  </div>
</template>

<script>
import ManagementMarksDialog from './management-marks-dialog';
import TipDialog from '@/components/dialog/tip-dialog';
import InterceptDialog from './intercept-dialog';
import AuditTipDialog from '../audit-tip-dialog';
import { reactive, toRefs, computed } from '@vue/composition-api';

export default {
  name: 'marks',
  components: {
    ManagementMarksDialog,
    TipDialog,
    InterceptDialog,
    AuditTipDialog
  },
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root }) {
    const { rows } = toRefs(props);
    const hasMarkTitle = {
      title: '数据有标记状态的，还要继续吗？'
    };
    const state = reactive({
      isTipShowDialog: false,
      isAuditTipDialog: false,
      isInterceptDialog: false,
      isInterceptTipShowDialog: false,
      isManagementMarksDialog: false,
      tipOption: {},
      showTipContent: {},
      showInterceptTipContent: {}
    });

    // 属性
    const hasMarks = computed(() => {
      const filterData = rows.value.filter(ele => ele.mark !== 0);
      return filterData.length > 0;
    });

    // 方法 ---------------------------

    // 标记
    const onIntercept = () => {
      const hasData = onNoData();
      if (!hasData) return;
      if (hasMarks.value) {
        state.showInterceptTipContent = hasMarks.value && hasMarkTitle;
        state.isInterceptTipShowDialog = true;
        return;
      }
      state.isInterceptDialog = true;
    };
    const onTrust = () => {
      const hasData = onNoData();
      if (!hasData) return;
      state.tipOption = {
        title: '添加为信任',
        tip: '标记后可通过筛选条件单独查看',
        rows: props.rows
      };
      if (hasMarks.value) {
        state.showInterceptTipContent = hasMarkTitle;
        state.isTipShowDialog = true;
        return;
      }
      state.isAuditTipDialog = true;
    };
    const onTrustConfirm = () => {
      state.isAuditTipDialog = true;
    };
    const onInterceptConfirm = () => {
      state.isInterceptDialog = true;
    };

    // 标记管理
    const onShowDialog = () => {
      state.isManagementMarksDialog = true;
    };

    const onNoData = () => {
      if (!rows.value || !rows.value.length) {
        root.$message({
          type: 'warning',
          message: '请选择列表项'
        });
        return;
      }
      return true;
    };

    return {
      ...toRefs(state),
      hasMarks,
      onIntercept,
      onTrust,
      onTrustConfirm,
      onInterceptConfirm,
      onShowDialog
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.mark {
  margin-right: 10px;
}
</style>
