import { OptionI } from '@/types/form-option.ts';
import { ElMessage } from 'element-plus';
import { isRef, Ref } from 'vue';

export const setProperty = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val);
};

export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
  let color = '#';
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16);
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16);
    const c = Math.round(c1 * weight + c2 * (1 - weight));
    color += c.toString(16).padStart(2, '0');
  }
  return color;
};

export const getFileName = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1);
};

// 随机12位的字符串
export const getRandomStr = (length: number = 12): string => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  if (length < 0) {
    length = 0;
  }
  for (let i = 0; i < length; i++) {
    result += str.charAt(Math.floor(Math.random() * str.length));
  }
  return result;
};

/**
 * 根据传入的数字得到24的约数的列数
 * 传1 返回24
 * 传2 返回12
 * 传3 返回8
 * 传4 返回6
 * 传5 返回4
 * 传6 返回4
 */
export const getSpans = (num: number): number => {
  let span = 6;
  if (num < 6) {
    span = Math.floor(24 / num);
  } else {
    span = 4;
  }
  return span;
};

/**
 * @description: 格式化选项
 * @param {any[] | Ref<any[]>} data 数据
 * @param {string} id 选项的value
 * @param {string} name 选项的label
 * @param {boolean} hasItem 是否返回原数据
 * @param {Function} disableFn 禁用函数
 * @returns {OptionI[]} 选项数组
 */
export const formateOptions = (
  data: any[] | Ref<any[]> | string,
  id: string = 'id',
  name: string | string[],
  hasItem: boolean = false,
  disableFn?: Function,
): OptionI[] => {
  if (typeof data === 'string') {
    // 如果data是字符串，则认为是旧版传参方式formateOptions(id,name,data,hasItem)，需要转换参数顺序
    const oldData = {
      data: name,
      id: data,
      name: id,
    };
    data = oldData.data;
    id = oldData.id;
    name = oldData.name;
  }
  let options: OptionI[] = [];
  if (isRef(data)) {
    data = data.value;
  }
  options = (data as any[]).map((item: any) => {
    const json: { value: any; label: any; item?: any; disabled?: boolean } = {
      value: item[id],
      label: item[name as string],
    };
    if (hasItem) {
      json.item = item;
    }
    if (disableFn) {
      json.disabled = disableFn(item);
    }
    return json;
  });
  return options;
};

export const downFileUrl = (url: string) => {
  if (typeof url !== 'string') return;
  const a = document.createElement('a');
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleMultipleDownloadRes = (res: any) => {
  if (typeof res.file_path === 'string') {
    downFileUrl(res.file_path);
  } else {
    console.warn('下载失败,file_path路径不对', res);
    ElMessage.error('下载失败!');
  }
};

/**
 * 拿到url中的文件名
 */
export const formateFileUrl = (url: string) => {
  const index = url.lastIndexOf('/');
  if (index > 0) {
    return url.substring(index + 1);
  }
  return url;
};

/**
 * 下载流文件
 */
export const downFile = (res: any, fileNameStr?: string) => {
  const blob = new Blob([res.data], {
    type: res.headers['content-type'],
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  //	文件名称
  const contentDisposition = res?.headers['content-disposition'];
  let fileName = fileNameStr; // 默认文件名
  if (!fileName) {
    fileName = '模板文件'; // 默认文件名
    if (
      contentDisposition &&
      (contentDisposition.indexOf('filename=') !== -1 || contentDisposition.indexOf('filename*=') !== -1)
    ) {
      // 解码文件名
      if (contentDisposition.indexOf('filename=') !== -1) {
        fileName = decodeURIComponent(contentDisposition.split('filename=')[1].replace(/['"]/g, ''));
      } else if (contentDisposition.indexOf('filename*=') !== -1) {
        fileName = decodeURIComponent(contentDisposition.split("filename*=UTF-8''")[1].replace(/['"]/g, ''));
      }
    }
  }
  a.download = window.decodeURI(fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 获取自增的id
 */
export const getOnlyId = (() => {
  const prefix = 'ft_';
  let id = 1;
  return () => {
    id++;
    return prefix + id;
  };
})();

/**
 * 导出小数转换成百分比的函数
 */
export const decimalToPercent = (num: number) => {
  if (num > 1) num = 1;
  if (num < 0) num = 0;
  return Number((num * 100).toFixed(2)) + '%';
};

/**
 * 大写名称转-连接
 */
export const nameToLine = (name: string) => {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * 首字母大写
 */
export const firstLetterUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 解决不在dom下必须使用 @ 来绑定事件的问题 将配置对象转换为v-on对象
 * @param {*} obj 配置对象 {change:() => {}, input:() => {}, ...}
 * @param {*} params 额外参数 这里在change事件中需要传递额外参数
 * @return {object} {change: (...args) => { change(params,...args)}}
 */
export const transformVOn = (obj: { [key: string]: Function } = {}, params: any) => {
  return Object.keys(obj || {}).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: (...args: any) => {
        // args 为事件的默认参数 例如select的change事件的默认参数是 改变的value值
        if (obj) {
          obj[cur](params, ...args);
        }
      },
    }),
    {},
  );
};

/** 请求全屏 */
export const requestFullScreen = element => {
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== 'undefined') {
    // eslint-disable-next-line no-undef
    var wscript = new ActiveXObject('WScript.Shell');
    if (wscript !== null) {
      wscript.SendKeys('{F11}');
    }
  }
};

/**
 * 将富文本转换为纯文本
 * @param html 富文本字符串
 * @returns 转换后的纯文本
 */
export const html2Text = (html: string): string => {
  if (!html) return '';

  // 创建一个临时的 div 元素
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // 替换一些特殊标签为空格
  const preprocessText = temp.innerHTML
    .replace(/<br\s*\/?>/gi, ' ') // 将换行标签转换为空格
    .replace(/<hr\s*\/?>/gi, ' '); // 将分隔线标签转换为空格

  temp.innerHTML = preprocessText;

  // 获取纯文本内容
  let text = temp.textContent || temp.innerText || '';

  // 清理多余空格
  text = text
    .replace(/\s+/g, ' ') // 将多个空格合并为一个
    .trim(); // 去除首尾空格

  return text;
};

/**
 * 将文件名中的点号替换为横线
 * @param fileName 文件名
 * @returns 替换后的文件名
 * @example
 * dotToLine('file.name.txt') // 返回 'file-name.txt'
 * dotToLine('my.file') // 返回 'my-file'
 */
export const dotToLine = (fileName: string): string => {
  if (!fileName) return '';

  // 获取最后一个点号的位置（保留文件扩展名）
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    // 如果没有扩展名，直接替换所有点号
    return fileName.replace(/\./g, '-');
  }

  // 分离文件名和扩展名
  const name = fileName.substring(0, lastDotIndex);
  const ext = fileName.substring(lastDotIndex);

  // 替换文件名中的点号，保留扩展名
  return name.replace(/\./g, '-') + ext;
};
