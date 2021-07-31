export const option1 = {
  menu: true, // 隐藏操作
  menuWidth: 88,
  height: 240,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  stripe: true, // 斑马线
  page: false, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '问题URL',
      prop: 'questionUrl',
      minWidth: 100,
      align: 'left',
      slot: true,
      showOverflow: true
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 200,
      align: 'left',
      showOverflow: true
    },
    {
      label: '问题描述',
      prop: 'questionCont',
      minWidth: 100,
      align: 'left',
      showOverflow: true
    },
    {
      label: '截图',
      prop: 'imgUrlList',
      width: 60,
      slot: true
    },
    {
      label: '监测时间',
      prop: 'monitorTime',
      width: 180
    },
    {
      label: '修改时间',
      prop: 'updatedTime',
      width: 180
    }
  ]
};

export const option2 = {
  menu: true, // 隐藏操作
  menuTitle: '是否加入报告',
  menuWidth: 110,
  height: 300,
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
      label: '错敏词',
      prop: 'wrongTerm',
      width: 260,
      slot: true
    },
    {
      label: '问题描述',
      prop: 'problemDesc',
      width: 260,
      slot: true
    },
    {
      label: '错敏词类型',
      prop: 'typeMeaning',
      width: 120
    },
    {
      label: '问题级别',
      prop: 'correctTypeMeaning',
      width: 120
    },
    {
      label: '问题URL',
      prop: 'url',
      minWidth: 100,
      slot: true
    },
    {
      label: '快照',
      prop: 'imgUrl',
      width: 90,
      slot: true
    },
    {
      label: '审核时间',
      prop: 'modifyTime',
      width: 180
    }
  ]
};

export const option3 = {
  menu: true, // 隐藏操作
  menuTitle: '是否加入报告',
  menuWidth: 110,
  height: 300,
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
      label: '问题类型',
      prop: 'checkTypeMeaning',
      width: 120,
      align: 'left',
      showOverflow: true
    },
    {
      label: '问题级别',
      prop: 'levelMeaning',
      align: 'left',
      width: 100
    },
    {
      label: '问题URL',
      prop: 'url',
      minWidth: 150,
      align: 'left',
      slot: true
    },
    {
      label: '快照',
      prop: 'snapShot',
      width: 80,
      slot: true
    },
    {
      label: '审核时间',
      prop: 'modifyTime',
      width: 180
    }
  ]
};

export const option4 = {
  menu: true, // 隐藏操作
  menuWidth: 88,
  height: 300,
  editBtn: false, // 添加按钮
  delBtn: false, // 添加按钮
  addBtn: false, // 添加按钮
  columnBtn: false, // 列显隐按钮
  refreshBtn: false, // 刷新按钮
  stripe: true, // 斑马线
  page: false, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '问题URL',
      prop: 'questionUrl',
      minWidth: 100,
      align: 'left',
      slot: true,
      showOverflow: true
    },
    {
      label: '问题类型',
      prop: 'questionTypeMeaning',
      width: 200,
      align: 'left',
      showOverflow: true
    },
    {
      label: '问题描述',
      prop: 'questionCont',
      minWidth: 100,
      align: 'left',
      showOverflow: true
    },
    {
      label: '截图',
      prop: 'imgUrlList',
      width: 60,
      slot: true
    },
    {
      label: '监测时间',
      prop: 'monitorTime',
      width: 180
    },
    {
      label: '修改时间',
      prop: 'updatedTime',
      width: 180
    }
  ]
};
