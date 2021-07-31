export const tableOption = {
  // height: document.body.clientHeight - 360,
  // calcHeight: 700,
  // maxHeight: 500,
  selection: true,
  selectionWidth: 34,
  menu: true, // 隐藏操作
  menuWidth: 120,
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
      label: '网站类型',
      prop: 'siteTypeName',
      width: 80,
      showOverflow: true
    },
    {
      label: '网站标识码',
      prop: 'custCode',
      width: 110,
      slot: true,
      showOverflow: true,
      align: 'left'
    },
    // {
    //   label: '密码',
    //   prop: 'custPassword',
    //   width: 90,
    //   showOverflow: true,
    //   align: 'left'
    // },
    {
      label: '网站名称',
      prop: 'custName',
      width: 150,
      slot: true,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '地区',
      prop: 'addressName', // 省市县三个字段
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
      label: '挂靠组织单位',
      prop: 'customParentRelationList',
      width: 230,
      align: 'left',
      slot: true
    },
    {
      label: '状态',
      prop: 'statusName',
      width: 60
    },
    {
      label: '新媒体账号数',
      prop: 'mediaAccountCount',
      width: 110,
      slot: true
    },
    {
      label: '监测频率',
      prop: 'rate', // 暂无
      width: 80
    },
    {
      label: '是否渲染',
      prop: 'isFlag',
      width: 90,
      slot: true
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
      prop: 'updatedByName',
      width: 100,
      showOverflow: true,
      align: 'left'
    }
  ]
};
