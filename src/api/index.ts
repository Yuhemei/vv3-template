/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-04 14:30:52
 * @Description:
 */
import http from '../utils/request';

import * as qs from 'qs';

export const fetchData = () => {
  return http.get<any>('./mock/table.json', {}, { baseURL: '' });
};

export const fetchUserData = () => {
  return http.get<any>('./mock/user.json', {}, { baseURL: '' });
};

export const fetchRoleData = () => {
  return http.get<any>('./mock/role.json', {}, { baseURL: '' });
};

// 图片导入
export const uploadApi = (data?: any, params?: any) => {
  return http.post<any>(`/api/common/image/upload/`, data, { params });
};

export const downTemplateFile = () => {
  return http.get<any>('/template.xlsx', {}, { baseURL: '', responseType: 'blob' });
};

export const getExportApi = (params: any) => {
  return http.get<any>(`/sso/api/cysso/user/export`, params, {
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    responseType: 'blob',
  });
};
