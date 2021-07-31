export const option1 = {
  menu: true, // 隐藏操作
  menuWidth: 138,
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
      prop: 'questionType',
      width: 160,
      fixed: 'left',
      align: 'left',
      showOverflow: true
    },
    {
      label: '外链暗链地址',
      prop: 'url',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: '所在地址',
      prop: 'homeUrl',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: '误报次数',
      prop: 'count',
      width: 100,
      slot: true
    },
    {
      label: '链接被引用次数',
      prop: 'linkCount',
      width: 120,
      slot: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '网站名称',
      prop: 'websiteName',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站标识码',
      prop: 'websiteCode',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站地址',
      prop: 'websiteUrl',
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
      prop: 'accountCode',
      width: 160
    },
    {
      label: '任务号',
      prop: 'taskCode',
      width: 160
    },
    {
      label: '地区',
      align: 'left',
      prop: 'location',
      showOverflow: true,
      width: 150
    },
    {
      label: '行业',
      align: 'left',
      prop: 'tradeName',
      showOverflow: true,
      width: 150
    },
    {
      label: '机构',
      align: 'left',
      prop: 'organName',
      showOverflow: true,
      width: 150
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
      label: '标记状态',
      prop: 'markType',
      width: 100
    }
  ]
};

export const option2 = {
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
      prop: 'questionType',
      width: 160,
      fixed: 'left',
      align: 'left',
      showOverflow: true
    },
    {
      label: '外链暗链地址',
      prop: 'url',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: '所在地址',
      prop: 'homeUrl',
      align: 'left',
      minWidth: 150,
      slot: true
    },
    {
      label: '误报次数',
      prop: 'count',
      width: 100,
      slot: true
    },
    {
      label: '链接被引用次数',
      prop: 'linkCount',
      width: 120,
      slot: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '网站名称',
      prop: 'websiteName',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站标识码',
      prop: 'websiteCode',
      showOverflow: true,
      align: 'left',
      width: 150
    },
    {
      label: '网站地址',
      prop: 'websiteUrl',
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
      prop: 'accountCode',
      width: 160
    },
    {
      label: '任务号',
      prop: 'taskCode',
      width: 160
    },
    {
      label: '地区',
      align: 'left',
      prop: 'location',
      showOverflow: true,
      width: 150
    },
    {
      label: '行业',
      align: 'left',
      prop: 'tradeName',
      showOverflow: true,
      width: 150
    },
    {
      label: '机构',
      align: 'left',
      prop: 'organName',
      showOverflow: true,
      width: 150
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
      label: '标记状态',
      prop: 'markType',
      width: 100
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

export const option3 = {
  menu: true, // 隐藏操作
  menuWidth: 78,
  height: 220,
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
      label: '地址',
      prop: 'outUrl',
      minWidth: 100,
      showOverflow: true,
      slot: true
    },
    {
      label: '添加时间',
      prop: 'createTime',
      width: 140
    },
    {
      label: '添加人',
      prop: 'username',
      width: 140
    }
  ]
};
