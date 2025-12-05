/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-12-02 20:41:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-14 21:21:53
 * @Description:
 */
const templateMenuData = {
  title: '组件库',
  index: '/template',
  redirect: '/template/dashboard',
  icon: 'system',
  children: [
    { title: 'Dashboard', index: '/template/dashboard', icon: 'dashboard' },
    {
      title: '系统管理',
      index: '/system',
      redirect: '/system/user',
      icon: 'system',
      children: [
        { index: '/template/system/user', title: '用户管理', icon: 'user' },
        { index: '/template/system/role', title: '角色管理', icon: 'role' },
        { index: '/template/system/menu', title: '菜单管理', icon: 'menu' },
        { index: '/template/element/statistic', title: '统计', icon: 'count' },
      ],
    },
    {
      title: '组件',
      index: '/template/element',
      redirect: '/template/element/form',
      icon: 'comp',
      children: [
        { index: '/template/element/tableedit', title: 'TableEdit', icon: 'input' },
        { index: '/template/element/form', title: '表单', icon: 'input' },
        { index: '/template/element/upload', title: '上传', icon: 'upload' },
        { index: '/template/element/carousel', title: '走马灯', icon: 'carousel' },
        { index: '/template/element/calendar', title: '日历', icon: 'calendar' },
        { index: '/template/element/watermark', title: '水印', icon: 'water' },
        { index: '/template/element/tour', title: '分布引导', icon: 'guide' },
        { index: '/template/element/steps', title: '步骤条', icon: 'step' },
        {
          index: '/template/29',
          title: '三级菜单',
          icon: 'menu',
          children: [
            { index: '/template/pages/editor', title: '富文本编辑器', icon: 'richtext' },
            { index: '/template/pages/markdown', title: 'markdown编辑器', icon: 'markdown' },
          ],
        },
      ],
    },
    {
      title: '表格',
      index: '/template/table',
      redirect: '/table/basetable',
      icon: 'table',
      children: [
        { index: '/template/table/basetable', title: '基础表格', icon: 'table' },
        { index: '/template/table/templatetable', title: '模板表格', icon: 'table' },
        { index: '/template/table/tableeditor', title: '可编辑表格', icon: 'table_edit' },
        { index: '/template/table/import', title: '导入Excel', icon: 'import_excel' },
        { index: '/template/table/export', title: '导出Excel', icon: 'export_excel' },
      ],
    },
    {
      index: '/template/chart',
      redirect: '/chart',
      title: '图表',
      icon: 'charts',
      children: [{ index: '/template/chart', title: 'echarts图表', icon: 'charts' }],
    },
    { index: '/theme', title: '主题', icon: 'theme' },
    {
      index: '/template/pages',
      redirect: '/ucenter',
      title: '附加页面',
      icon: 'other_page',
      children: [
        { index: '/login', title: '登录' },
        { index: '/register', title: '注册' },
        { index: '/template/pages/resetpwd', title: '重设密码' },
        { index: '/403', title: '403' },
        { index: '/404', title: '404' },
      ],
    },
  ],
};

export default templateMenuData;
