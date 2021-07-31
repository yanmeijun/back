export const options = {
  menu: true, // 隐藏操作
  index: true,
  indexWidth: 80,
  menuWidth: 68,
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
      label: '网站标识码',
      prop: 'siteCode',
      width: 150
    },
    {
      label: '网站名称',
      prop: 'accountName',
      showOverflow: true,
      minWidth: 150,
      align: 'left'
    },
    {
      label: '网站地址',
      prop: 'url',
      showOverflow: true,
      minWidth: 120,
      align: 'left',
      slot: true
    },
    {
      label: '网站类型',
      prop: 'siteTypeMeaning',
      width: 94,
      align: 'center',
      showOverflow: true
    },
    {
      label: '网站报送状态',
      prop: 'accountStatusMeaning',
      width: 120,
      align: 'center'
    },
    {
      label: '网站实际运行状态',
      prop: 'realStatusMeaning',
      width: 150,
      align: 'center'
    },
    {
      label: '地区',
      prop: 'location',
      width: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '机构',
      prop: 'organName',
      width: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '行业',
      prop: 'tradeName',
      width: 140,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '监测状态',
      prop: 'isScanMeaning',
      width: 100
    },
    {
      label: '监测异常原因',
      prop: 'abnormalReason',
      width: 120
    },
    {
      label: '连通性监测频率',
      prop: 'monitorRateMeaning',
      width: 120
    },
    {
      label: '是否渲染',
      prop: 'isFlag',
      width: 100,
      slot: true
    },
    {
      label: '是否校验错别字',
      prop: 'isCorrectMeaning',
      width: 130
    },
    {
      label: '是否报送',
      prop: 'isSubmitedMeaning',
      width: 100
    },
    {
      label: '创建时间',
      prop: 'createdTime',
      width: 180
    },
    {
      label: '修改时间',
      prop: 'updatedTime',
      width: 180
    },
    {
      label: '最后修改人',
      prop: 'updatedByMeaning',
      width: 100
    }
  ]
};

export const detailOptions = {
  menu: false, // 隐藏操作
  menuWidth: 56,
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
      label: '排名',
      prop: 'order',
      width: 80,
      slot: true
    },
    {
      label: '文章标题',
      prop: 'title',
      slot: true,
      minWidth: 100,
      align: 'left',
      showOverflow: true
    },
    {
      label: '发布时间',
      prop: 'pubTime',
      width: 170
    },
    {
      label: '点赞数',
      prop: 'loveNO',
      width: 100
    },
    {
      label: '评论数',
      prop: 'commentNO',
      width: 100
    },
    {
      label: '转发数',
      prop: 'readingNO',
      width: 100
    }
  ]
};
