export const tableOption = {
  maxHeight: 400,
  menu: false, // 隐藏操作
  stripe: true, // 斑马线
  page: true, // 分页
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '账号类型',
      prop: 'accountTypeName',
      width: 150
    },
    {
      label: '账号名称',
      prop: 'accountName',
      width: 150
    },
    {
      label: '账号唯一标识',
      prop: 'uniqueCode',
      width: 180
    },
    {
      label: '创建时间',
      prop: 'createdTime'
    }
  ]
};
