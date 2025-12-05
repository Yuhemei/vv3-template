/*
 * @Description: 表单提交类型定义
 */
import { UploadUserFile } from 'element-plus';
import { ComputedRef, Ref } from 'vue';

export interface OptionI {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  item?: any;
  children?: any[];
}

// 编辑单项配置
export interface EditConfigRowI {
  /** 偏移量 */
  offset?: number;
  /** 是否只在编辑时显示 */
  onlyEditShow?: string;
  /** input输入框后缀 */
  suffix?: any;
  /** 对应type=select时的选项列表, 格式为[{label: '选项1', value: '1'}, {label: '选项2', value: '2'},...] */
  options?: Ref<OptionI[]> | OptionI[];
  /** 对某些输入数据进行格式化 */
  formatter?: any;
  //  element类型
  type:
    | 'input'
    | 'select'
    | 'date'
    | 'daterange'
    | 'richtext'
    | 'slot'
    | 'rate'
    | 'upload'
    | 'string'
    | 'cascader'
    | 'datetime'
    | 'switch'
    | 'radio'
    | 'textarea'
    | 'number'
    | 'password'
    | 'checkbox'
    | 'transfer';
  // 字段中文名称，只做展示用
  label: string;
  //  字段名，对应data中的key
  prop: string;
  /** 对应type=daterange时的开始日期字段 */
  prop_start?: string;
  /** 对应type=daterange时的结束日期字段 */
  prop_end?: string;
  // el-col 的 span 属性 如不设置则读取 FromOption 的 span 属性
  span?: number;
  /** 继承el-col的xs，<768px 响应式栅格数或者栅格属性对象 */
  xs?: number | object;
  /** 继承el-col的sm，≥768px 响应式栅格数或者栅格属性对象 */
  sm?: number | object;
  /** 继承el-col的md，≥992px 响应式栅格数或者栅格属性对象 */
  md?: number | object;
  /** 继承el-col的lg，≥1200px 响应式栅格数或者栅格属性对象 */
  lg?: number | object;
  /** 继承el-col的xl，≥1920px 响应式栅格数或者栅格属性对象 */
  xl?: number | object;
  /** el-col的v-bind透传 */
  colBind?: object;
  //  是否必填，默认false
  required?: boolean;
  // 对应element-plus的组件的属性，会直接透传给组件
  bind?: object;
  //  对应element-plus的组件的事件，会直接透传给组件
  on?: { [key: string]: Function };
  //  上传文件类型 对应 element-plus 的 el-upload 组件的 list-type 属性
  listType?: UploadUserFile;
  //  上传文件后缀名限制 例如：['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
  fileType?: string[];
  //  上传接口 参数ckeditor_type对应的值
  ckeditorType?: string;
  // 表单label的宽度,不设置则读取FromOption的labelWidth属性
  labelWidth?: string | number;
  /** 校验规则 */
  rules?: any[];
  /** 是否隐藏 */
  hidden?: boolean | (() => boolean | Ref<boolean>) | ComputedRef<boolean>;
  /** 日期范围的格式 */
  format?: string;
}

export interface FormOption {
  // 创建时使用的默认值
  initValue?: Function;
  // 表单label的宽度,属于整体设置,优先级低于单项里面的labelWidth属性设置
  labelWidth?: string | number;
  // 整体的el-col的span属性
  span?: number;
  /** 表单校验规则 */
  rules?: any[];
  // 表单项的配置
  list: EditConfigRowI[];
  /** 继承el-col的xs，<768px 响应式栅格数或者栅格属性对象 */
  xs?: number | object;
  /** 继承el-col的sm，≥768px 响应式栅格数或者栅格属性对象 */
  sm?: number | object;
  /** 继承el-col的md，≥992px 响应式栅格数或者栅格属性对象 */
  md?: number | object;
  /** 继承el-col的lg，≥1200px 响应式栅格数或者栅格属性对象 */
  lg?: number | object;
  /** 继承el-col的xl，≥1920px 响应式栅格数或者栅格属性对象 */
  xl?: number | object;
}
