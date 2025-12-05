/*
 * @Date: 2025-07-22 11:19:26
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { routes } from './routes';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  NProgress.start();

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
