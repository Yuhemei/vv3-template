import { Menus } from '@/types/menu';
import templateMenuData from './template';
import systemMenuData from './system';
export const menuData: Menus[] = [templateMenuData, systemMenuData];

// 导出一个名为matchMenuByPath的函数，该函数接收两个参数：path和data，data为可选参数，默认为menuData
export const matchMenuByPath = (path: string, data: Menus[] = menuData): Menus => {
  // 定义一个菜单变量，默认为空菜单
  let menu: Menus = { id: '', title: '', index: '', icon: '' };
  // 遍历data数组
  for (let i = 0; i < data.length; i++) {
    // 如果data[i]的index属性等于path，则将data[i]赋值给menu
    if (data[i].index === path) {
      menu = data[i];
      break;
    }
    // 如果data[i]有子菜单，则递归调用matchMenuByPath函数，将path和data[i]的子菜单作为参数传递，并将结果赋值给menu
    if (data[i].children) {
      menu = matchMenuByPath(path, data[i].children);
      // 如果menu有title属性，则结束循环
      if (menu.title) {
        break;
      }
    }
  }
  return menu;
};
