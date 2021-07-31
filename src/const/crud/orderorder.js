export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  searchMenuSpan: 6,
  column: [
    {
      type: 'input',
      label: '自增主键',
      prop: 'id'
    },
    {
      type: 'input',
      label: '创建时间',
      prop: 'createTime'
    },
    {
      type: 'input',
      label: '更新时间',
      prop: 'updateTime'
    },
    {
      type: 'input',
      label: '付费客户',
      prop: 'payUser'
    },
    {
      type: 'input',
      label: '订单号',
      prop: 'orderNum'
    },
    {
      type: 'input',
      label: '1.正式 2.试用',
      prop: 'type'
    },
    {
      type: 'input',
      label: '订单开始时间',
      prop: 'startTime'
    },
    {
      type: 'input',
      label: '订单结束时间',
      prop: 'finishTime'
    }
  ]
};
