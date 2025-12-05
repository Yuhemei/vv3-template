/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-12-02 20:41:06
 * @LastEditors: kim
 * @LastEditTime: 2024-12-05 10:04:33
 * @Description:
 */
const menuData = {
  title: '系统管理',
  index: '/system',
  icon: 'system',
  children: [
    { index: '/system/user', title: '用户管理', icon: 'user' },
    { index: '/system/role', title: '角色管理', icon: 'role' },
    { index: '/system/menu', title: '菜单管理', icon: 'menu' },
  ],
};

export default menuData;
