/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-05 10:30:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-07-23 10:43:28
 * @Description:
 */
import { formateOptions } from '@/utils';
import { ref } from 'vue';
const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
];

export const queryConfig = {
  search_name: '',
  page: 1,
  page_size: 20,
};

export const searchConfig = [{ type: 'input', label: '用户名称：', prop: 'search_name' }];

export const columnsConfig = [
  { type: 'selection', width: 55 },
  { prop: 'username', label: '用户名称' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'role_name', label: '角色', bind: { 'show-overflow-tooltip': false } },
  { prop: 'gender', label: '性别' },
  { prop: 'mobile', label: '手机号' },
  { prop: 'mail', label: '邮箱' },
  { prop: 'operator', label: '操作', width: 250 },
];

const editConfigRef = <any>ref({});

export const getEditConfig = async () => {
  const roleOpts = formateOptions('id', 'name', [
    { id: 'admin', name: '管理员' },
    { id: 'user', name: '普通用户' },
  ]);
  const config = {
    labelWidth: '100px',
    span: 12,
    list: [
      { type: 'input', label: '用户名称', prop: 'username', required: true },
      { type: 'input', label: '昵称', prop: 'nickname', required: true },
      { type: 'input', label: '密码', prop: 'password', required: true },
      { type: 'input', label: '密码确认', prop: 'verify_password', required: true },
      { type: 'select', label: '性别', prop: 'gender', required: true, options: genderOptions },
      { type: 'select', label: '角色', prop: 'role', bind: { multiple: true }, required: true, options: roleOpts },
      { type: 'input', label: '手机号', prop: 'mobile', required: true },
      { type: 'input', label: '邮箱', prop: 'mail', required: true },
    ],
  };
  editConfigRef.value = config;
  return config;
};

// 点击编辑按钮调用的函数
export const updateEditConfig = () => {
  editConfigRef.value.list.splice(2, 2);
};

// 关闭弹出框后调用的函数
export const initEditConfig = () => {
  if (editConfigRef.value.list.find((item: any) => item.prop === 'password') === undefined) {
    editConfigRef.value.list.splice(
      2,
      0,
      { type: 'input', label: '密码', prop: 'password', required: true },
      { type: 'input', label: '确认密码', prop: 'verify_password', required: true },
    );
  }
};
