export const tableOption = {
  menu: true, // 隐藏操作
  menuWidth: 84,
  tip: false,
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '序号',
      prop: 'index',
      width: 56,
      slot: true,
      fixed: 'left'
    },
    {
      label: '产品类型',
      prop: 'prodType',
      width: 100,
      align: 'left'
    },
    {
      label: '消息类型',
      prop: 'messageType',
      width: 90
    },
    {
      label: '触发条件',
      prop: 'trigger',
      align: 'left',
      width: 150
    },
    {
      label: '客户编码',
      prop: 'customerCode',
      align: 'left',
      width: 110
    },
    {
      label: '客户名称',
      prop: 'custName',
      align: 'left',
      width: 150,
      showOverflow: true
    },
    {
      label: '接收人',
      prop: 'updateName',
      align: 'left',
      showOverflow: true,
      width: 100
    },
    {
      label: '接收地址',
      prop: 'address',
      align: 'left',
      width: 150,
      showOverflow: true
    },
    {
      label: '发送渠道',
      prop: 'where',
      width: 90
    },
    {
      label: '发送内容',
      prop: 'context',
      minWidth: 150,
      showOverflow: true
    },
    {
      label: '发送时间',
      prop: 'sendTime',
      width: 180
    },
    {
      label: '发送状态',
      prop: 'type',
      width: 90,
      slot: true
    }
  ]
};
