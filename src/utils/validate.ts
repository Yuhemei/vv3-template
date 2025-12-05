/*
 * @Date: 2023-05-13 11:43:16
 * @LastEditors: hemei
 * @LastEditTime: 2023-12-04 10:34:11
 * @FilePath: hemei-vue3/src/hooks/validate.ts
 * @Description: hemei-vue3
 */
export const useValidate = () => {
  const requiredText = (msg: string) => {
    const rule = {
      required: true,
      message: `请输入${msg}`,
      trigger: 'blur',
    };
    return rule;
  };
  const requiredRadio = (msg: string) => {
    const rule = {
      required: true,
      message: `请选择${msg}`,
      trigger: 'blur',
    };
    return rule;
  };
  const validateNum = (name: string, min: number, max: number) => {
    const rule = {
      min: min,
      max: max,
      message: `${name}请输入${min}-${max}个字符`,
      trigger: 'blur',
    };
    return rule;
  };
  const validateNumType = () => {
    return {
      type: 'number',
      trigger: 'change',
      message: '请输入数字',
    };
  };
  const validateIP = () => {
    return {
      pattern: /^((1?[1-9]?[0-9]|[1,2]?[0-4]\d|25[0-5])\.){3}(1?[1-9]?[0-9]|[1,2]?[0-4]\d|25[0-5])$/,
      message: '请输入合法的IP',
      trigger: ['change', 'blur'],
    };
  };
  return {
    requiredText,
    requiredRadio,
    validateNum,
    validateNumType,
    validateIP,
  };
};
