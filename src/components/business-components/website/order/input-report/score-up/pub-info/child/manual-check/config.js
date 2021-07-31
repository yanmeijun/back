export const tableOption = {
  height: 292,
  selectionWidth: 34,
  index: true,
  indexWidth: 80,
  menu: true, // 隐藏操作
  menuWidth: 120,
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
      label: '栏目名称',
      prop: 'channelName',
      minWidth: 100,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '栏目地址',
      prop: 'questionUrl',
      minWidth: 206,
      slot: true,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '加分指标',
      prop: 'questionName',
      minWidth: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '加分类型',
      prop: 'secondQuestionName',
      minWidth: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '监测时间',
      prop: 'monitorTime',
      minWidth: 180
    }
  ]
};
