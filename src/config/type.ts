/*
 * @Description: 关于全局配置文件类型的定义
 */
interface TabItem {
  /** 路由fullPath */
  path: string;
  /** 页签meta信息 */
  meta: {
    /** 页签标题 */
    title: string;
    /** 页签图标 */
    icon: string;
  };
}
