/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-23 15:49:55
 * @LastEditors: kim
 * @LastEditTime: 2024-11-24 10:50:32
 * @Description:
 */

/** 笔记内容 */
export interface Mark {
  /** 时间点 */
  time_point: number;
  /** 课程id */
  curriculum: number;
  /** 笔记内容 */
  content?: string;
  /** 图片路径 */
  picture_path?: string;
}
