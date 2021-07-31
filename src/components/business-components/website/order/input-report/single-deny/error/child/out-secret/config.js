export const tableOption = {
  height: 292,
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
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 150,
      align: 'left',
      showOverflow: true
    },
    {
      label: '问题级别',
      prop: 'questionLevelMeaning',
      width: 120
    },
    {
      label: '问题URL',
      prop: 'url',
      minWidth: 150,
      showOverflow: true,
      align: 'left',
      slot: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 90,
      slot: true
    },
    {
      label: '监测时间',
      prop: 'updateTime',
      minWidth: 160
    },
    {
      label: '是否单否',
      prop: 'isJoin',
      minWidth: 90,
      slot: true,
      align: 'center',
      fixed: 'right'
    }
  ]
};
