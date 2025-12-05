/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-01-17 11:34:09
 * @Description: 角色类型
 */
export interface Role {
  id: number;
  name: string;
  key: string;
  status: boolean;
  permiss: string[];
}

/** 角色类型枚举 */
export type RoleId = keyof typeof FT_CONFIG.redirectPageMap;
