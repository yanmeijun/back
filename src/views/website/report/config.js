export const tableOption = {
  menu: true, // 隐藏操作
  menuWidth: 80,
  index: true,
  indexWidth: 80,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '任务号',
      prop: 'taskCode',
      width: 220,
      align: 'left',
      showOverflow: true
    },
    {
      label: '任务名称',
      prop: 'taskName',
      showOverflow: true,
      align: 'left',
      width: 160
    },
    {
      label: '状态',
      prop: 'reportStatus',
      slot: true,
      width: 220
    },
    {
      label: '报告数量',
      prop: 'reportNum',
      width: 80
    },
    {
      label: '交付人',
      prop: 'deliveryUsernameMeaning',
      width: 64,
      showOverflow: true
    },
    {
      label: '任务开始时间',
      prop: 'startTime',
      width: 180
    },
    {
      label: '任务结束时间',
      prop: 'endTime',
      width: 180
    },
    {
      label: '创建人',
      prop: 'createdByMeaning',
      width: 64,
      showOverflow: true
    },
    {
      label: '创建时间',
      prop: 'createdTime',
      width: 180
    }
  ]
};
