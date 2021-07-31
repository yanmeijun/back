export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  searchMenuSpan: 6,
  column: [
    {
      type: 'input',
      label: '自增主键',
      prop: 'id'
    },
    {
      type: 'input',
      label: '类型 1微博 2微信',
      prop: 'type'
    },
    {
      type: 'input',
      label: '名称',
      prop: 'name'
    },
    {
      type: 'input',
      label: '昵称',
      prop: 'nickAme'
    },
    {
      type: 'input',
      label: '第三方账号唯一标识',
      prop: 'uniqueId'
    },
    {
      type: 'input',
      label: '主页地址',
      prop: 'homePage'
    },
    {
      type: 'input',
      label: '是否认证 0未认证 1已认证',
      prop: 'isValidated'
    }
  ]
};
