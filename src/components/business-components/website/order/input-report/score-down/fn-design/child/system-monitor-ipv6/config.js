export const tableOption = {
  height: 292,
  // selection: true,
  selectionWidth: 34,
  index: true,
  indexWidth: 80,
  menu: false, // 隐藏操作
  menuWidth: 120,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  column: [
    {
      label: '页面类型',
      prop: 'name',
      minWidth: 236,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '问题页面URL',
      prop: 'firstClassificationMeaning',
      minWidth: 236,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '缺失标签',
      prop: 'secondaryClassificationMeaning',
      minWidth: 100,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '快照',
      prop: 'url',
      minWidth: 80,
      showOverflow: true
    },
    {
      label: '监测时间',
      prop: 'monitorTime',
      minWidth: 180,
      showOverflow: true
    },
    {
      label: '是否纳入报告',
      prop: 'isIncludeReport',
      minWidth: 110,
      slot: true,
      fixed: 'right',
      showOverflow: true
    }
  ]
};
