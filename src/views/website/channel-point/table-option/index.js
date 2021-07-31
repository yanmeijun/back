export const options = {
  index: true,
  indexWidth: 50,
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
      label: '网站标识码',
      prop: 'siteCode',
      width: 116,
      showOverflow: true
    },
    {
      label: '栏目名称',
      minWidth: 150,
      prop: 'channelName',
      align: 'left',
      showOverflow: true
    },
    {
      label: '栏目地址',
      prop: 'channelAddress',
      width: 210,
      align: 'left',
      showOverflow: true,
      slot: true
    },
    {
      label: '一级分类',
      prop: 'firstClassificationName',
      align: 'left',
      width: 100,
      slot: true,
      showOverflow: true
    },
    {
      label: '二级分类',
      prop: 'secondaryClassificationName',
      align: 'left',
      width: 100,
      slot: true,
      showOverflow: true
    },
    {
      label: '监测状态',
      prop: 'monitoringStatusMeaning',
      width: 80
    },
    {
      label: '连通性监测频率',
      prop: 'monitoringFrequencyMeaning',
      width: 140,
      showOverflow: true
    },
    // {
    //   label: '更新期限',
    //   prop: 'monitoringFrequencyMeaning',
    //   width: 180
    // },
    {
      label: '更新监测频率',
      prop: 'updateMonitoringFrequencyMeaning',
      width: 140,
      showOverflow: true
    },
    {
      label: '是否渲染',
      prop: 'isRender',
      width: 100,
      slot: true
    },
    {
      label: '是否连通',
      prop: 'connectResult',
      align: 'left',
      width: 100,
      slot: true
    },
    {
      label: '未更新天数',
      prop: 'daysNotUpdated',
      width: 100
    },
    {
      label: '数据来源',
      prop: 'sourcesMeaning',
      width: 110,
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
      label: '修改人',
      prop: 'updatedByMeaning',
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
      label: '修改时间',
      prop: 'updatedTime',
      width: 180,
      showOverflow: true
    },
    {
      label: '监测时间',
      prop: 'monitoringTime',
      width: 180,
      showOverflow: true
    },
    {
      label: '最新更新时间',
      prop: 'lastUpdateTime',
      width: 180,
      showOverflow: true
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
