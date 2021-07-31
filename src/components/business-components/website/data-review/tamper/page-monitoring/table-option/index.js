export const option1 = {
  menu: true, // 隐藏操作
  menuWidth: 108,
  selection: true,
  selectionWidth: 34,
  tip: false,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  search: false,
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '',
      prop: 'selection',
      headerSlot: true,
      width: 24,
      fixed: 'left',
      hiddenColumn: true
    },
    {
      label: '序号',
      prop: 'index',
      width: 56,
      slot: true,
      fixed: 'left'
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 160,
      fixed: 'left',
      align: 'left',
      showOverflow: true
    },
    {
      label: '所在地址',
      prop: 'url',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: 'IP指向地址',
      prop: 'domainLocation',
      align: 'left',
      width: 150,
      showOverflow: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '网站名称',
      prop: 'siteName',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站标识码',
      prop: 'siteCode',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站地址',
      prop: 'homePage',
      minWidth: 150,
      align: 'left',
      slot: true
    },
    {
      label: '填报单位名称',
      prop: 'custName',
      align: 'left',
      showOverflow: true,
      width: 150
    },
    {
      label: '填报单位编码',
      prop: 'custCode',
      width: 120
    },
    {
      label: '订单号',
      prop: 'orderCode',
      width: 160
    },
    {
      label: '任务号',
      prop: 'taskCode',
      width: 160
    },
    {
      label: '监测时间',
      prop: 'processingTime',
      width: 180
    },
    {
      label: '问题级别',
      prop: 'questionLevelMeaning',
      width: 120
    }
  ]
};

export const option2 = {
  menu: true, // 隐藏操作
  menuWidth: 78,
  selection: true,
  selectionWidth: 34,
  tip: false,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  search: false,
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '',
      prop: 'selection',
      headerSlot: true,
      width: 24,
      fixed: 'left',
      hiddenColumn: true
    },
    {
      label: '序号',
      prop: 'index',
      width: 56,
      slot: true,
      fixed: 'left'
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 160,
      fixed: 'left',
      align: 'left',
      showOverflow: true
    },
    {
      label: '所在地址',
      prop: 'url',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: 'IP指向地址',
      prop: 'domainLocation',
      align: 'left',
      width: 150,
      showOverflow: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '网站名称',
      prop: 'siteName',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站标识码',
      prop: 'siteCode',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站地址',
      prop: 'homePage',
      minWidth: 150,
      align: 'left',
      slot: true
    },
    {
      label: '填报单位名称',
      prop: 'custName',
      align: 'left',
      showOverflow: true,
      width: 150
    },
    {
      label: '填报单位编码',
      prop: 'custCode',
      width: 120
    },
    {
      label: '订单号',
      prop: 'orderCode',
      width: 160
    },
    {
      label: '任务号',
      prop: 'taskCode',
      width: 160
    },
    {
      label: '监测时间',
      prop: 'processingTime',
      width: 180
    },
    {
      label: '问题级别',
      prop: 'questionLevelMeaning',
      width: 120
    },
    {
      label: '修改时间',
      prop: 'updateTime',
      width: 180
    },
    {
      label: '修改人',
      prop: 'updatedUserName',
      align: 'left',
      showOverflow: true,
      width: 80
    },
    {
      label: '操作结果',
      prop: 'resultTypeMeaning',
      width: 100,
      align: 'left'
    }
  ]
};
