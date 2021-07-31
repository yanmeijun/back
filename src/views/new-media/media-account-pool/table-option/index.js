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
      label: '账号类型',
      prop: 'accountTypeName',
      width: 94,
      align: 'left',
      showOverflow: true
    },
    {
      label: '账号名称',
      prop: 'accountName',
      showOverflow: true,
      width: 160,
      align: 'left'
    },
    {
      label: '头像',
      prop: 'photo',
      width: 56,
      slot: true
    },
    {
      label: '功能',
      prop: 'accountFuncName',
      width: 80,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '开设主体',
      prop: 'accountSubject',
      width: 100,
      showOverflow: true,
      align: 'left'
    },
    // {
    //   label: '归属类别',
    //   prop: 'classification',
    //   width: 100,
    //   showOverflow: true,
    //   align: 'left'
    // },
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
      label: '账号ID',
      prop: 'accountId',
      showOverflow: true,
      width: 130,
      align: 'left'
    },
    {
      label: '唯一标识',
      prop: 'uniqueCode',
      showOverflow: true,
      width: 160,
      align: 'left'
    },
    {
      label: '主页地址',
      prop: 'homePage',
      showOverflow: true,
      minWidth: 120,
      slot: true,
      align: 'left'
    },
    {
      label: '是否认证',
      prop: 'isCertifiedName',
      width: 80
    },
    {
      label: '账号状态',
      prop: 'accountStatusName',
      width: 80
    },
    {
      label: '来自报送',
      prop: 'source',
      width: 80,
      slot: true
    },
    {
      label: '添加时间',
      prop: 'createdTime',
      width: 180
    },
    {
      label: '修改人',
      prop: 'updatedByName',
      width: 70,
      align: 'left',
      showOverflow: true
    },
    {
      label: '修改时间',
      prop: 'updatedTime',
      width: 180
    },
    // {
    //   label: '账号级别',
    //   prop: 'accountLevelName',
    //   width: 80
    // },
    // {
    //   label: '是否门户',
    //   prop: 'isGatewayName',
    //   width: 80
    // },
    {
      label: '是否代表省/市/县(区)人民政府或国务院部门',
      prop: 'isGovName',
      width: 300
    }
  ]
};

export const detailOptions101 = {
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
      label: '阅读数',
      prop: 'readingNO',
      width: 100
    },
    {
      label: '在看数',
      prop: 'loveNO',
      width: 100
    },
    {
      label: '点赞数',
      prop: 'praisePoints',
      width: 100
    },
    {
      label: '评论数',
      prop: 'commentNO',
      width: 100
    }
  ]
};

// 头条
export const detailOptions102 = {
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
      prop: 'praisePoints',
      width: 100
    },
    {
      label: '评论数',
      prop: 'commentNO',
      width: 100
    },
    {
      label: '转发数',
      prop: 'forwardingNO',
      width: 100
    }
  ]
};

// 微博
export const detailOptions103 = {
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
      label: '阅读数',
      prop: 'readingNO',
      width: 100
    },
    {
      label: '点赞数',
      prop: 'praisePoints',
      width: 100
    },
    {
      label: '评论数',
      prop: 'commentNO',
      width: 100
    },
    {
      label: '转发数',
      prop: 'forwardingNO',
      width: 100
    }
  ]
};
