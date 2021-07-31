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
      label: '唯一标识',
      prop: 'id',
      search: true
    },
    {
      type: 'input',
      label: '错敏字',
      prop: 'wrongTerm',
      search: true
    },
    {
      type: 'input',
      label: '文章标题',
      prop: 'title'
    },
    {
      type: 'input',
      label: '网站标识码',
      prop: 'custCode',
      search: true
    }
  ]
};
