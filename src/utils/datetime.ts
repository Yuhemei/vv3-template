/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-22 11:35:17
 * @LastEditors: kim
 * @LastEditTime: 2024-11-23 22:35:57
 * @Description:时间相关工具函数
 */
/** s或者ms换算时间字符串
 * @params unit s或者ms
 * @params seconds 时间戳
 * @returns 时间字符串xx小时xx分钟xx秒
 */
import dayjs from 'dayjs';
export function formatSeconds(seconds: number, unit: string = 's', timeFormat = { h: '小时', m: '分钟', s: '秒' }) {
  if (seconds == 0) return seconds + timeFormat.s;
  if (!seconds) return '--';
  // 计算小时、分钟、秒
  if (unit === 'ms') {
    seconds = seconds / 1000;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 格式化为字符串（补零）
  const hoursStr = hours > 0 ? hours.toString().padStart(2, '0') + timeFormat.h : '';
  const minutesStr = minutes > 0 ? minutes.toString().padStart(2, '0') + timeFormat.m : '';
  const secondsStr = remainingSeconds > 0 ? remainingSeconds.toString().padStart(2, '0') + timeFormat.s : '';

  // 返回格式化字符串
  return `${hoursStr}${minutesStr}${secondsStr}`;
}
/** 时间戳转时间字符串
 * @params timestamp 时间戳
 */
export function timestampToTime(timestamp: number, unit: string = 'ms') {
  if (!timestamp) return '--';
  if (unit === 's') {
    timestamp = timestamp * 1000;
  }
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
