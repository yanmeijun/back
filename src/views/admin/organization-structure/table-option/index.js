export const options = {
  selection: true,
  selectionWidth: 34,
  menu: true, // 隐藏操作
  menuWidth: 98,
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
      label: '账号',
      prop: 'username',
      width: 100,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '姓名',
      prop: 'accountName',
      width: 100,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '手机号',
      prop: 'phone',
      width: 110
    },
    {
      label: '角色',
      prop: 'role',
      width: 150,
      slot: true,
      align: 'left'
    },
    {
      label: '职务',
      prop: 'postName',
      width: 150
    },
    {
      label: '部门',
      prop: 'department',
      minWidth: 100,
      showOverflow: true,
      align: 'left',
      slot: true
    },
    {
      label: '状态',
      prop: 'lockFlagMeaning',
      width: 70
    },
    {
      label: '邮箱',
      prop: 'email',
      showOverflow: true,
      width: 120,
      align: 'left'
    },
    {
      width: 100,
      label: '创建时间',
      prop: 'createTime',
      format: 'yyyy-MM-dd'
    }
  ]
};
