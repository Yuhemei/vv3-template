/*
 * @Description:
 */
import { FormOption } from '@/types/form-option.ts';
import { useValidate } from '@/utils/validate.ts';

const { requiredText } = useValidate();

export const useTableEdit = () => {
  const formInitData = {
    name: '',
    age: '',
  };
  const formOptions: FormOption = {
    list: [
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        rules: [requiredText('姓名')],
      },
      {
        label: '年龄',
        prop: 'age',
        type: 'input',
        rules: [requiredText('年龄')],
      },
    ],
  };
  return {
    formInitData,
    formOptions,
  };
};
