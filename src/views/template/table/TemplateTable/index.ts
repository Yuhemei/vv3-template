import { FormOption } from '@/types/form-option';
import { ColumnsConfigI, QueryConfigI } from '@/types/table';
import { ref } from 'vue';

const typeOptions = [
  { label: '禁止', value: 0 },
  { label: '允许', value: 1 },
  { label: '暂停', value: 2 },
];

export const queryConfig = {
  name: '',
  page: 1,
  page_size: 20,
};

export const searchConfig: QueryConfigI[] = [
  { type: 'input', label: '用户名称：', prop: 'name' },
  { type: 'select', label: '状态：', prop: 'status', opts: typeOptions },
];

export const columnsConfig: ColumnsConfigI[] = [
  { prop: 'name', label: '用户名称' },
  { prop: 'status', type: 'slot', label: '状态' },
  { prop: 'date', label: '创建时间' },
  { prop: 'desc', label: '描述' },
  { prop: 'tp1', type: 'slot', label: '提示' },
  { prop: 'operator', label: '操作', width: 300 },
];

const editConfigRef = ref<FormOption>();
export const getEditConfig = () => {
  const config: FormOption = {
    defaultValue: {
      status: 1,
    },
    labelWidth: '120px',
    span: 12,
    list: [
      { type: 'input', label: '用户名称', prop: 'name', required: true },
      {
        type: 'select',
        label: '状态',
        prop: 'status',
        required: true,
        opts: typeOptions,
        on: {
          change: (form: any) => {
            console.log(40, form);
          },
          blur: (form: any) => {
            console.log(42, form);
          },
        },
      },
      { type: 'input', label: '密码', span: 12, prop: 'password', required: true },
      { type: 'slot', label: '', span: 12, prop: 'tp1', labelWidth: '10' },
      { type: 'input', label: '确认密码', prop: 'verify_password', required: true },
      { type: 'textarea', span: 24, label: '描述', prop: 'desc', required: true },
      // {
      //   type: 'upload',
      //   label: '头像',
      //   prop: 'avatar',
      //   required: true,
      //   ckeditorType: 'user'
      // }
      // {
      //   type: 'upload',
      //   listType: 'text',
      //   label: '上传文件',
      //   prop: 'archive_file',
      //   fileType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'],
      //   required: true,
      //   ckeditorType: 'simulation_range'
      // }
    ],
  };
  editConfigRef.value = config;
  return editConfigRef;
};

/**
 * 点击编辑按钮调用的函数
 */
export const updateEditConfig = () => {
  editConfigRef.value?.list.splice(2, 2);
};

/**
 * 关闭弹出框后调用的函数
 */
export const initEditConfig = () => {
  if (editConfigRef.value?.list.find((item: any) => item.prop === 'password') === undefined) {
    editConfigRef.value?.list.splice(
      2,
      0,
      { type: 'input', label: '密码', prop: 'password', required: true },
      { type: 'input', label: '确认密码', prop: 'verify_password', required: true },
    );
  }
};
