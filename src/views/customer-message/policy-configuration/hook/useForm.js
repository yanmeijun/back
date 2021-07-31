import { ref, reactive, onBeforeMount } from '@vue/composition-api';
import { tableOption } from './tableOption';
// import { getDictDetailMap } from '@/api/common';
import { getStrategyList } from '@/api/cust-message';
export default function() {
  const refForm = ref(null);
  const refCrud = ref(null);
  const state = reactive({
    form: {
      prodType: '',
      messageType: '',
      accountInfo: '',
      unit: '',
      isBool: '',
      type: '',
      createTime: [],
      updateTime: []
    },
    loading: false,
    pickerOptions: {
      disabledDate: time => {
        return time.getTime() > Date.now() + 0 * 24 * 3600 * 1000;
      }
    },
    page: {
      pageSize: 100,
      pagerCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠
      total: 0,
      currentPage: 1,
      pageSizes: [100, 500, 1000]
    },
    data: [],
    tableOption
  });

  onBeforeMount(() => {
    onGetList();
  });

  const onGetList = () => {
    onQueryList();
  };
  // --重置页码
  const onResetParams = () => {
    state.page.currentPage = 1;
    state.page.pageSize = 100;
  };

  const onQueryList = () => {
    state.loading = true;
    let parmaObj = {
      page: {
        size: state.page.pageSize,
        current: state.page.currentPage,
        orders: [
          {
            asc: false,
            column: 'created_time'
          }
        ]
      },
      prodId: state.form.prodType, // 产品类型
      strategyType: state.form.messageType, // 预警策略类型
      fillType: state.form.unit, // 发生单位
      // status: state.form.isBool || '1',
      isDel: state.form.type, // 是否删除
      custInfo: state.form.accountInfo, // 客户信息
      createStartDate: state.form.createTime[0],
      createEndDate: state.form.createTime[1],
      updateStartDate: state.form.updateTime[0],
      updateteEndDate: state.form.updateTime[1]
    };
    // 策略状态
    state.form.isBool != 0 && (parmaObj.status = state.form.isBool);
    getStrategyList(parmaObj).then(res => {
      if (res.code == 0) {
        state.page.currentPage = res.data.current;
        state.page.total = res.data.total;
        state.data = res.data.records;
      }
      state.loading = false;
    });
  };
  const onResetQuery = () => {
    onResetParams();
    refForm.value.resetFields();
    onQueryList();
  };

  // 表格加载
  const onLoad = page => {
    state.page = page;
    onGetList();
  };

  return {
    refForm,
    refCrud,
    formState: state,
    onQueryList,
    onResetQuery,
    onLoad
  };
}
