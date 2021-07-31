export const options = {
  selection: true,
  selectionWidth: 34,
  menu: true, // 隐藏操作
  menuWidth: 80,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '',
      prop: 'selection',
      headerSlot: false,
      width: 24,
      hiddenColumn: false
    },
    {
      label: '序号',
      prop: 'index',
      width: 50,
      fixed: 'left'
    },
    {
      label: '网站标识码',
      prop: 'siteCode',
      width: 116,
      showOverflow: true
    },
    {
      label: '网站名称',
      minWidth: 150,
      prop: 'channelName',
      align: 'left',
      showOverflow: true
    },
    {
      label: '监测状态',
      prop: 'monitoringStatusMeaning',
      width: 80,
      slot: true,
      showOverflow: true
    },
    {
      label: '下载报告状态',
      prop: 'monitoringFrequencyMeaning',
      width: 140,
      showOverflow: true
    },
    {
      label: '创建人',
      prop: 'createdByMeaning',
      width: 70,
      align: 'left',
      showOverflow: true
    },
    {
      label: '创建时间',
      prop: 'createdTime',
      width: 170
    },
    {
      label: '结束时间',
      prop: 'updatedTime',
      width: 180,
      showOverflow: true
    },
  ]
};
