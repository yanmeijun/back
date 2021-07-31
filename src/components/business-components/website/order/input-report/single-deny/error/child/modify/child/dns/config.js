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
  column: [
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      minWidth: 206,
      showOverflow: true
    },
    {
      label: '所在地址',
      prop: 'url',
      minWidth: 140,
      showOverflow: true,
      align: 'left',
      slot: true
    },
    {
      label: 'IP指向地址',
      prop: 'domainIp',
      minWidth: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '网站名称',
      prop: 'siteName',
      minWidth: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '网站标识码',
      prop: 'siteCode',
      minWidth: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '监测时间',
      prop: 'scanDate',
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
