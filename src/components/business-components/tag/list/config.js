export const tableOption = {
  // height: document.body.clientHeight - 360,
  // calcHeight: 700,
  // maxHeight: 500,
  selection: false,
  selectionWidth: 34,
  menu: true, // 隐藏操作
  menuWidth: 80,
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
      label: '标签名称',
      prop: 'name',
      headerAlign: 'center',
      align: 'left',
      minWidth: 300,
      showOverflow: true
    },
    {
      label: '标签编码',
      prop: 'code',
      align: 'left',
      minWidth: 200,
      showOverflow: true
    },
    {
      label: '标签分类',
      prop: 'typeMeaning',
      minWidth: 80,
      showOverflow: true
    },
    {
      label: '创建人',
      prop: 'createdByMeaning',
      minWidth: 80,
      showOverflow: true
    },
    {
      label: '创建时间',
      prop: 'createdTime',
      minWidth: 173,
      showOverflow: true
    }
  ]
};
