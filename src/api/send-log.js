import apiRequest from '@/router/apiAxios';

// 查询列表
export const getLogList = data => {
  return apiRequest({
    url: '/messagecenter/msg/getMsgDataPushRecordList',
    method: 'post',
    data: data
  });
};
