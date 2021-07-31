export const tableOption = {
  height: 292,
  selection: true,
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
      label: '资源类型',
      prop: 'resourceTypeMeaning',
      minWidth: 100,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '链接标题',
      prop: 'title',
      minWidth: 200,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '不可用链接',
      prop: 'url',
      minWidth: 200,
      showOverflow: true,
      align: 'left',
      slot: true
    },
    {
      label: '上一级地址',
      prop: 'parentUrl',
      minWidth: 200,
      showOverflow: true,
      slot: true
    },
    {
      label: '返回码',
      prop: 'httpCode',
      minWidth: 140,
      showOverflow: true
    },
    {
      label: '链接范围',
      prop: 'urlScopeMeaning',
      minWidth: 160,
      showOverflow: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      minWidth: 90,
      showOverflow: true,
      slot: true
    },
    {
      label: '是否删除',
      prop: 'isJoin',
      minWidth: 100,
      showOverflow: true,
      slot: true
    },
    {
      label: '监测时间',
      prop: 'monitorTime',
      minWidth: 180,
      showOverflow: true
    }
  ]
};
