import {
  ref,
  reactive,
  onBeforeMount
} from '@vue/composition-api';
import {
  tableOption
} from './tableOption';
import {
  getLogList
} from '@/api/send-log';
// import { getDictDetailMap } from '@/api/common';
export default function () {
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
      info: '',
      createTime: []
    },
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
    data: [{
        prodType: '新媒体监测',
        messageType: '产品预警',
        trigger: '新媒体账号未更新',
        customerCode: '141033000',
        custName: '蒲县人民政府门户网站',
        updateName: '改改',
        address: '996507989@qq.com',
        where: '微信',
        context: '【开普云】发现微信:开普云网站，共有1条【错敏信息】',
        type: 1,
        sendTime: '2020-06-06 00:00:00'
      },
      {
        prodType: '网站监测',
        messageType: '系统报告',
        trigger: '错敏信息',
        customerCode: '429004',
        custName: '蒲县人民政府门户网站',
        updateName: '改改',
        address: '15101645808',
        where: '短信',
        context: '【开普云】发现微信:开普云网站，共有1条【错敏信息】',
        isBool: 1,
        type: 0,
        sendTime: '2020-06-06 00:00:00'
      }
    ],
    tableOption
  });

  onBeforeMount(() => {
    onQueryList();
  });

  const onGetList = () => {};
  // --重置页码
  const onResetParams = () => {
    state.page.currentPage = 1;
    state.page.pageSize = 100;
  };

  const onQueryList = () => {
    let paramsObj = {
      page: {
        size: state.page.pageSize,
        current: state.page.currentPage,
      }
    };
    state.form.unit !== '' && (paramsObj.channelType = state.form.unit);
    state.form.accountInfo !== '' && (paramsObj.custSearch = state.form.accountInfo);
    state.form.info !== '' && (paramsObj.receiveUserCodes = state.form.info);
    state.form.messageType !== '' && (paramsObj.messageType = state.form.messageType);
    state.form.prodType !== '' && (paramsObj.source = state.form.prodType);
    state.form.type !== 0 && (paramsObj.isSuccess = (state.form.type == 1 ? true : false));
    if (state.form.createTime.length > 0) {
      paramsObj.pushTimeStart = state.form.createTime[0];
      paramsObj.pushTimeEnd = state.form.createTime[1];
    }
    console.log(paramsObj)
    getLogList(paramsObj).then(res => {
      console.log(res)
      if (res.code == 0) {
        state.page.total = res.data.total;
        state.page.currentPage = res.data.current;
      }
    })
  };
  const onResetQuery = () => {
    onResetParams();
    refForm.value.resetFields();
  };

  // 表格加载
  const onLoad = page => {
    state.page = page;
    onQueryList();
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
