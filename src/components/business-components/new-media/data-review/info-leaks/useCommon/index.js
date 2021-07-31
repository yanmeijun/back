import { ref, nextTick, reactive, toRefs } from '@vue/composition-api';
export function useCommon() {
  // 定义ref
  const refEditReasonDialog = ref(null);
  // const refCrud = ref(null);
  // 定义state
  const state = reactive({
    isDeleteReasonDialog: false,
    isMisInfoReasonDialog: false,
    isTipWarningDialog: false,
    isTipShowDialog: false,
    isEditReasonDialog: false,
    isOpenImgsDialog: false,
    isSelectionByNumDialog: false,
    isPackUp: false,
    loading: false,
    delIds: [],
    misIds: [],
    warnIds: [],
    showIds: [],
    srcClipList: [],
    dic: [
      {
        label: '选项1',
        value: 0,
        children: [
          {
            label: '选项3',
            value: 2
          },
          {
            label: '选项4',
            value: 3
          }
        ]
      },
      {
        label: '选项2',
        value: 1
      }
    ],
    // checkTableList: [],
    exportIdList: [],
    // allShowColumn: ['index', 'selection', 'errWord'],
    page: {
      pageSize: 100,
      pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
      total: 0,
      pageSizes: [100, 500, 1000]
    },
    changePage: {
      currentPage: 1,
      pageSize: 100
    }
  });

  // 方法 ------------------------------

  // 查询
  // const onQueryList = () => {
  //   refOneForm.value.validate(valid => {
  //     if (valid) {
  //       console.log(state.oneForm);
  //     }
  //   });
  // };

  // 重置
  // const onResetQuery = () => {
  //   refOneForm.value.resetFields();
  // };

  // 搜索 - 切换
  // const onChangeWay = val => {
  //   state.oneForm.codeArray = [];
  // };

  // 选中结果
  // const onCheckAll = () => {
  //   onToggleSelection();
  //   if (state.checkTableList.length !== state.data.length) {
  //     onToggleSelection(state.data);
  //   }
  // };
  const onCheckNum = () => {
    state.isSelectionByNumDialog = true;
  };

  // const onToggleSelection = val => {
  //   // 设置表格默认选中值
  //   nextTick(() => {
  //     refCrud.value.toggleSelection(val);
  //   });
  // };
  // 根据序号选择
  // const onSelectionChange = val => {
  //   const [start, end] = val;
  //   let list = [];
  //   if (!end) {
  //     list = state.data.slice(parseInt(start) - 1, parseInt(start));
  //   } else {
  //     list = state.data.slice(parseInt(start) - 1, parseInt(end));
  //   }
  //   onToggleSelection();
  //   onToggleSelection(list);
  // };

  // 显示-弹框
  const onShowDel = row => {
    state.isDeleteReasonDialog = true;
    state.delIds = [row.id];
  };
  const onShowMisInfo = row => {
    state.isMisInfoReasonDialog = true;
    state.misIds = [row.id];
  };
  const onShowWarning = row => {
    state.isTipWarningDialog = true;
    state.warnIds = [row.id];
  };
  const onShowing = row => {
    state.isTipShowDialog = true;
    state.showIds = [row.id];
  };
  const onShowEdit = row => {
    state.isEditReasonDialog = true;
    nextTick(() => {
      if (!refEditReasonDialog.value) return;
      refEditReasonDialog.value.init(row);
    });
  };
  const onShowImgsDialog = list => {
    if (!list || !list.length) return;
    state.isOpenImgsDialog = true;
    state.srcClipList = list;
  };

  // 关闭 - 弹框
  const onCloseDelDialog = () => {
    state.delIds = [];
    state.isDeleteReasonDialog = false;
  };
  const onCloseMisInfoDialog = () => {
    state.misIds = [];
    state.isMisInfoReasonDialog = false;
  };
  const onCloseEditReasonDialog = () => {
    state.isEditReasonDialog = false;
  };
  const onCloseImgsDialog = () => {
    state.isOpenImgsDialog = false;
    state.srcClipList = [];
  };

  // -- 预警并显示 - 提示确认
  const onWarnConfirm = () => {
    console.log(state.warnIds);
  };
  const onShowConfirm = () => {
    console.log(state.showIds);
  };

  // 表格加载
  const onLoad = page => {
    state.changePage = page;
  };
  const onPackUp = () => {
    state.isPackUp = !state.isPackUp;
  };
  const onSpanCol = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
      return [1, 2];
    } else if (columnIndex === 1) {
      return [0, 0];
    }
  };

  // 返回
  return {
    // refOneForm,
    refEditReasonDialog,
    // refCrud,
    // cCheckTxt,
    ...toRefs(state),
    // showErrorSensitive,
    // 方法
    // onQueryList,
    // onResetQuery,
    onPackUp,
    // onChangeWay,
    onLoad,
    onShowDel,
    onShowWarning,
    onShowing,
    onShowEdit,
    onShowMisInfo,
    onShowImgsDialog,
    onCloseDelDialog,
    onCloseMisInfoDialog,
    onCloseEditReasonDialog,
    onCloseImgsDialog,
    onWarnConfirm,
    onShowConfirm,
    // onCheckAll,
    onCheckNum,
    // onTableSelectionChange,
    // onSelectionChange,
    onSpanCol
  };
}
