/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-12-02 21:59:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-11 14:10:36
 * @Description:项目核心业务配置
 */
/** header中的菜单列表 */
interface HeaderMenu {
  /** 顶部菜单名称 */
  text: string;
  /** 路由名称 */
  name: string;
  /** 路由path */
  path: string;
  /** 点击头部菜单项，重定向到的路由path */
  redirect?: string;
  /** 是否在header中显示 */
  isHeaderVisible?: boolean;
  /** 是否在侧边栏中显示 */
  isSideBarMenuVisible?: boolean;
}

export const menuListConfig: HeaderMenu[] = [
  {
    text: '首页',
    name: 'home',
    path: '/home',
    redirect: '/home',
    isHeaderVisible: true,
    isSideBarMenuVisible: true,
  },
  {
    text: '组件库',
    name: 'template_dashboard',
    path: '/template',
    redirect: '/template/dashboard',
    isHeaderVisible: import.meta.env.DEV,
    isSideBarMenuVisible: true,
  },
  {
    text: '系统管理',
    name: 'system',
    path: '/system',
    redirect: '/system/user',
    isHeaderVisible: true,
    isSideBarMenuVisible: true,
  },
];

/** tabs页签路由path剔除项 */
export const tabsListExceptConfig = ['/redirect', '/403', '/404'];
/** tabs页签路由path添加项 */
export const tabsListAddConfig: TabItem[] = [
  {
    path: '/edu/course/section/edit',
    meta: {
      title: '课程小节编辑',
      icon: 'menu',
    },
  },
];
