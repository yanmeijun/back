export const option1 = {
  menu: true, // 隐藏操作
  menuWidth: 176,
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
      label: '错敏词',
      prop: 'sensitiveWords',
      width: 120,
      align: 'left',
      // headerSlot: true,
      fixed: 'left',
      showOverflow: true
    },
    {
      label: '推荐修改',
      prop: 'recommendUpdate',
      width: 120,
      align: 'left',
      showOverflow: true
    },
    {
      label: '修改说明',
      prop: 'proposalDesc',
      align: 'left',
      minWidth: 150,
      showOverflow: true
    },
    {
      label: '所在上下文',
      prop: 'context',
      align: 'left',
      minWidth: 150,
      showOverflow: true,
      slot: true
    },
    {
      label: '所在文章',
      prop: 'url',
      align: 'left',
      showOverflow: true,
      minWidth: 150,
      slot: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '账号类型',
      prop: 'accountTypeMeaning',
      align: 'left',
      width: 120
    },
    {
      label: '账号名称',
      align: 'left',
      prop: 'accountName',
      showOverflow: true,
      width: 150
    },
    {
      label: '唯一标识',
      align: 'left',
      prop: 'uniqueCode',
      showOverflow: true,
      width: 150
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
      label: '主页地址',
      prop: 'homePage',
      width: 100,
      slot: true
    },
    {
      label: '填报单位编码',
      prop: 'custCode',
      width: 120
    },
    {
      label: '填报单位名称',
      prop: 'custName',
      align: 'left',
      showOverflow: true,
      width: 150
    },
    {
      label: '订单号',
      prop: 'orderCode',
      width: 150,
      align: 'left',
      showOverflow: true
    },
    {
      label: '文章采集时间',
      prop: 'scanDate',
      width: 180
    },
    {
      label: '监测时间',
      prop: 'processingTime',
      width: 180
    },
    {
      label: '数据显示时间',
      prop: 'storageTime',
      width: 180
    },
    {
      label: '发布时间',
      prop: 'publishDate',
      width: 180
    },
    {
      label: '内容类型',
      prop: 'contentTypeMeaning',
      width: 120
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 120
    },
    {
      label: '问题级别',
      prop: 'questionLevelMeaning',
      width: 120
    },
    {
      label: '数据来源',
      prop: 'sourceMeaning',
      width: 120
    },
    {
      label: '是否高频词',
      prop: 'isHighWordMeaning',
      width: 100
    }
  ]
};

export const option2 = {
  menu: true, // 隐藏操作
  menuWidth: 146,
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
      slot: 'true',
      fixed: 'left'
    },
    {
      label: '错敏词',
      prop: 'sensitiveWords',
      width: 120,
      align: 'left',
      // headerSlot: true,
      fixed: 'left',
      showOverflow: true
    },
    {
      label: '推荐修改',
      prop: 'recommendUpdate',
      width: 120,
      align: 'left',
      showOverflow: true
    },
    {
      label: '修改说明',
      prop: 'proposalDesc',
      align: 'left',
      minWidth: 150,
      showOverflow: true
    },
    {
      label: '所在上下文',
      prop: 'context',
      align: 'left',
      minWidth: 150,
      showOverflow: true,
      slot: true
    },
    {
      label: '所在文章',
      prop: 'url',
      align: 'left',
      showOverflow: true,
      minWidth: 150,
      slot: true
    },
    {
      label: '快照',
      prop: 'snapshot',
      width: 70,
      slot: true
    },
    {
      label: '账号类型',
      prop: 'accountTypeMeaning',
      align: 'left',
      width: 120
    },
    {
      label: '账号名称',
      align: 'left',
      prop: 'accountName',
      showOverflow: true,
      width: 150
    },
    {
      label: '唯一标识',
      align: 'left',
      prop: 'uniqueCode',
      showOverflow: true,
      width: 150
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
      label: '主页地址',
      prop: 'homePage',
      width: 100,
      slot: true
    },
    {
      label: '填报单位编码',
      prop: 'custCode',
      width: 120
    },
    {
      label: '填报单位名称',
      prop: 'custName',
      align: 'left',
      showOverflow: true,
      width: 150
    },
    {
      label: '订单号',
      prop: 'orderCode',
      width: 150,
      align: 'left',
      showOverflow: true
    },
    {
      label: '文章采集时间',
      prop: 'scanDate',
      width: 180
    },
    {
      label: '监测时间',
      prop: 'processingTime',
      width: 180
    },
    {
      label: '数据显示时间',
      prop: 'storageTime',
      width: 180
    },
    {
      label: '发布时间',
      prop: 'publishDate',
      width: 180
    },
    {
      label: '内容类型',
      prop: 'contentTypeMeaning',
      width: 120
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 120
    },
    {
      label: '问题级别',
      prop: 'questionLevelMeaning',
      width: 120
    },
    {
      label: '数据来源',
      prop: 'sourceMeaning',
      width: 120
    },
    {
      label: '是否高频词',
      prop: 'isHighWordMeaning',
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
