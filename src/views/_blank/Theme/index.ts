import { ColorPaletteNumber, getColorPalette } from '@sa/color';

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface Themes {
  name: ButtonType;
  color: string;
  fontColor?: string;
}
/**
 *
 * @param color 颜色字符串
 * @returns 选择与背景对比度更高的颜色
 */
export const getFontColor = (color: string): string => {
  // 根据传入的颜色字符串获取颜色调色板
  const colorMap = getColorPalette(color, true);
  // 初始化颜色键值为50
  let colorKey: ColorPaletteNumber = 50;
  // 遍历颜色调色板，找到与传入颜色匹配的键值
  colorMap.forEach((palette: string, key: ColorPaletteNumber) => {
    if (palette === color) {
      colorKey = key;
    }
  });
  // 计算字体颜色，选择与背景对比度更高的颜色
  colorKey = 950 - colorKey > colorKey - 50 ? 950 : 50;
  // 返回计算后的颜色，如果找不到则返回空字符串
  return colorMap.get(colorKey) || '';
};

export const systemTheme = [
  { name: '默认', color: '#ffffff', fontColor: '' },
  { name: '健康', color: '#10b981', fontColor: '' },
  { name: '优雅', color: '#8b5cf6', fontColor: '' },
  { name: '热情', color: '#f43f5e', fontColor: '' },
  { name: '宁静', color: '#0ea5e9', fontColor: '' },
].map(item => {
  item.fontColor = getFontColor(item.color);
  return item;
});
