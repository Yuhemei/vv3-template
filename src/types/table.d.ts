/*
 * @Description:
 */
/*
 * @Description:
 */
import { OptionI } from '@/types/form-option';
import { Ref } from 'vue';

export interface TableItem {
  id: number;
  name: string;
  thumb: string;
  money: number;
  state: string;
  date: string;
  address: string;
  type?: string | number;
}

// 搜索element的类型
export type ElTypeT = 'input' | 'select' | 'daterange' | 'date';

// 上传文件配置
export type ListTypeT = 'text' | 'picture' | 'picture-card';

export interface QueryConfigI {
  type: ElTypeT;
  label: string;
  prop?: string;
  prop_start?: string;
  prop_end?: string;
  // 对应element-plus的组件的属性，会直接透传给组件
  bind?: object;
  //  对应element-plus的组件的事件，会直接透传给组件
  on?: { [key: string]: Function };
  options?: OptionI[] | Ref<OptionI[]>;
  format?: string;
}

export interface ColumnsConfigI {
  label: string;
  prop?: string;
  width?: number | string;
  type?: string;
  formatter?: (value: any, row: TableItem, column: ColumnsConfigI) => any;
  classFormatter?: (value: any, row: TableItem, column: ColumnsConfigI) => any;
  isHref?: boolean;
  isLink?: boolean;
  downloadProp?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Column {
  /** 列字段 */
  prop: string;
  /** 列标题 */
  label: string;
  /** 列宽度 */
  width?: number | string;
  /** 列类型 */
  type?: 'index' | 'expand' | 'slot' | 'callback' | 'image' | 'selection' | string;
  /** 列对齐方式 */
  align?: string;
  /** 列是否显示 */
  visible?: boolean;
  /** 下载字段 */
  downloadProp?: string;
  /** 是否是可点链接 */
  isHref?: boolean;
  /** 是否是可点链接 */
  isLink?: boolean;
  /** 自定义class */
  classFormatter?: Function;
  /** 自定义渲染 */
  formatter?: (propValue: any, row: any, prop: any) => any;
  /** 其他绑定 */
  bind?: any;
}
