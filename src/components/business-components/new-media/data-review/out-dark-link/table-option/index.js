export const option1 = {
  menu: true, // 隐藏操作
  menuWidth: 168,
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
      label: '问题类型',
      prop: 'questionType',
      width: 160,
      fixed: 'left',
      showOverflow: true
    },
    {
      label: '外链地址',
      prop: 'outUrl',
      showOverflow: true,
      minWidth: 100,
      slot: true
    },
    {
      label: '所在地址',
      prop: 'url',
      showOverflow: true,
      minWidth: 100,
      slot: true
    },
    {
      label: '快照',
      prop: 'imgUrl',
      width: 70,
      slot: true
    },
    {
      label: '账号类型',
      prop: 'accountTypeMeaning',
      width: 120
    },
    {
      label: '账号名称',
      prop: 'accountName',
      width: 120
    },
    {
      label: '订单号',
      prop: 'accountCode',
      width: 160
    },
    // {
    //   label: '主页地址',
    //   prop: 'homeUrl',
    //   width: 70,
    //   slot: true
    // },
    {
      label: '唯一标识',
      prop: 'unicode',
      width: 140
    },
    {
      label: '网站标识码',
      prop: 'custCode',
      width: 160
    },
    {
      label: '标记状态',
      prop: 'markType',
      width: 120
    },
    {
      label: '问题级别',
      prop: 'questionLevel',
      width: 120
    },
    {
      label: '内容类型',
      prop: 'conType',
      width: 120
    },
    {
      label: '监测时间',
      prop: 'vTime',
      width: 140
    }
  ]
};

export const option2 = {
  menu: true, // 隐藏操作
  menuWidth: 168,
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
      label: '问题类型',
      prop: 'questionType',
      width: 160,
      fixed: 'left',
      showOverflow: true
    },
    {
      label: '修改结果',
      prop: 'result',
      fixed: 'left',
      width: 100
    },
    {
      label: '外链地址',
      prop: 'outUrl',
      showOverflow: true,
      minWidth: 100,
      slot: true
    },
    {
      label: '所在地址',
      prop: 'url',
      showOverflow: true,
      minWidth: 100,
      slot: true
    },
    {
      label: '快照',
      prop: 'imgUrl',
      width: 70,
      slot: true
    },
    {
      label: '账号类型',
      prop: 'accountTypeMeaning',
      width: 120
    },
    {
      label: '账号名称',
      prop: 'accountName',
      width: 120
    },
    {
      label: '订单号',
      prop: 'accountCode',
      width: 160
    },
    // {
    //   label: '主页地址',
    //   prop: 'homeUrl',
    //   width: 70,
    //   slot: true
    // },
    {
      label: '唯一标识',
      prop: 'unicode',
      width: 140
    },
    {
      label: '网站标识码',
      prop: 'custCode',
      width: 160
    },
    {
      label: '标记状态',
      prop: 'markType',
      width: 120
    },
    {
      label: '问题级别',
      prop: 'questionLevel',
      width: 120
    },
    {
      label: '内容类型',
      prop: 'conType',
      width: 120
    },
    {
      label: '修改时间',
      prop: 'changeTime',
      width: 140
    },
    {
      label: '修改人',
      prop: 'changeName',
      width: 140
    },
    {
      label: '监测时间',
      prop: 'vTime',
      width: 140
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
