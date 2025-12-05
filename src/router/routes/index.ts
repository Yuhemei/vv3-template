/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: kim
 * @LastEditTime: 2024-12-09 21:41:01
 * @Description:
 */
import type { ElegantRoute, CustomRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

const customRoutes: CustomRoute[] = [
  {
    name: 'root',
    path: '/',
    redirect: {
      name: 'home',
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];

let trulyRoutes: ElegantRoute[] = [...generatedRoutes];
/** 生产环境剔除组件库页面 */
if (import.meta.env.PROD) {
  trulyRoutes = trulyRoutes.filter(route => route.name !== 'template');
}

const elegantRoutes: ElegantRoute[] = [...customRoutes, ...generatedRoutes];

export const routes = transformElegantRoutesToVueRoutes(elegantRoutes, layouts, views);
