export const tableOption = {
  height: 295,
  selection: true,
  selectionWidth: 34,
  menu: false, // 隐藏操作
  menuWidth: 120,
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
      minWidth: 210,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '任务名称',
      prop: 'taskName',
      minWidth: 200,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '单位名称',
      prop: 'siteName',
      minWidth: 200,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '检查结果',
      prop: 'checkResultMeaning',
      minWidth: 120,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '开始时间',
      prop: 'startTime',
      minWidth: 120,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '结束时间',
      prop: 'endTime',
      minWidth: 120,
      align: 'left'
    }
  ]
};
