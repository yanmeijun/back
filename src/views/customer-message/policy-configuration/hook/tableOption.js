export const tableOption = {
  menu: true, // 隐藏操作
  menuWidth: 84,
  tip: false,
  stripe: true, // 斑马线
  index: true,
  indexWidth: 56,
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '产品类型',
      prop: 'prodType',
      width: 100,
      align: 'left',
      slot: true
    },
    {
      label: '消息类型',
      prop: 'strategyType',
      width: 90,
      align: 'center',
      slot: true
    },
    {
      label: '客户编码',
      prop: 'custCode',
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
      label: '策略名称',
      prop: 'strategyName',
      align: 'left',
      minWidth: 150,
      showOverflow: true
    },
    {
      label: '发生单位',
      prop: 'fillType',
      width: 100,
      align: 'center',
      slot: true
    },
    {
      label: '触发条件',
      prop: 'triggerCount',
      width: 90
      // slot: true
    },
    {
      label: '发送渠道',
      prop: 'where',
      align: 'left',
      width: 170,
      slot: true
    },
    {
      label: '是否启用',
      prop: 'status',
      width: 100,
      slot: true
    },
    {
      label: '状态',
      prop: 'isDel',
      width: 90,
      slot: true
    },
    {
      label: '最后操作人',
      prop: 'updatedByName',
      align: 'left',
      showOverflow: true,
      width: 100
    },
    {
      label: '创建时间',
      prop: 'createdTime',
      width: 180
    },
    {
      label: '修改时间',
      prop: 'updatedTime',
      width: 180
    }
  ]
};
