export const tableOption = {
  // height: 292,
  selectionWidth: 34,
  stripe: false, // 斑马线
  page: false, // 分页
  align: 'left',
  menuAlign: 'left',
  column: [
    {
      label: '首页连通性',
      prop: 'name',
      minWidth: 206,
      showOverflow: true
    },
    {
      label: '连接次数',
      prop: 'num',
      minWidth: 236,
      showOverflow: true,
      align: 'left'
    },
    {
      label: '占比',
      prop: 'ratio',
      minWidth: 206,
      showOverflow: true,
      align: 'left',
      slot: true
    }
  ]
};
