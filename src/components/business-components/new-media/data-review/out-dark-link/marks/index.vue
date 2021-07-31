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
    <TipDialog
      v-if="isTipShowDialog"
      ref="TipShowDialog"
      :tipContent="showTipContent"
      :isOpen="isTipShowDialog"
      @confirmFn="onTrustConfirm"
      @closeDialog="isTipShowDialog = false"
    />
    <!-- 拦截 -->
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
import ManagementMarksDialog from '@/components/business-components/new-media/data-review/out-dark-link/marks/management-marks-dialog';
import TipDialog from '@/components/dialog/tip-dialog';
import { reactive, toRefs, computed } from '@vue/composition-api';

export default {
  name: 'marks',
  components: {
    ManagementMarksDialog,
    TipDialog
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
      isInterceptTipShowDialog: false,
      isManagementMarksDialog: false,
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
      state.showInterceptTipContent = hasMarks.value
        ? hasMarkTitle
        : {
            title: '标记该链接为拦截，还要继续吗？',
            info: '标记后可通过筛选条件单独查看'
          };
      state.isInterceptTipShowDialog = true;
    };
    const onTrust = () => {
      const hasData = onNoData();
      if (!hasData) return;
      state.showTipContent = hasMarks.value
        ? hasMarkTitle
        : {
            title: '标记该链接为信任，还要继续吗？',
            info: '标记后可通过筛选条件单独查看'
          };
      state.isTipShowDialog = true;
    };
    const onTrustConfirm = () => {};
    const onInterceptConfirm = () => {};

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
