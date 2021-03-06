/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
export const tableOption = {
  border: false,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 128,
  editBtn: false,
  delBtn: false,
  searchMenuSpan: 6,
  align: 'center',
  addBtn: false,
  viewBtn: false,
  refreshBtn: false,
  columnBtn: false, // 列显隐按钮
  column: [
    {
      label: '角色名称',
      width: 220,
      prop: 'roleName',
      span: 24,
      align: 'left',
      rules: [
        {
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
      ]
    },
    {
      width: 240,
      label: '角色标识',
      prop: 'roleCode',
      span: 24,
      editDisabled: true,
      align: 'left',
      rules: [
        {
          required: true,
          message: '角色标识不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 100,
          message: '长度在 3 到 100 个字符',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '角色描述',
      prop: 'roleDesc',
      overHidden: true,
      span: 24,
      align: 'left',
      rules: [
        {
          required: true,
          message: '角色描述不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 100,
          message: '长度在 3 到 100 个字符',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisplay: false,
      addDisplay: false,
      span: 24,
      width: 180
    }
  ]
};
