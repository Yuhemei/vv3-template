/*
 * @Date: 2025-04-08 14:22:57
 */
import { defineStore } from 'pinia';
import { RoleId } from '@/types/role.ts';
import { putUserApi, ssoCheckTokenApi } from '@/api/user';
import type { Role, UserPlatformWithRole } from '@/api/user/type.d';
import { getToken, localClear, removeUser, setToken } from '@/utils/cache';
import { ElMessageBox } from 'element-plus';
import router from '@/router';

/** 解析hash参数
 * @param hash 哈希值
 * @returns 解析后的哈希值
 * @example
 * const hash = '#/login?redirect=%23/system/menu';
 * const { path, params } = parseHashParams(hash);
 * console.log(path, params);
 * // path: '/login', params: { redirect: '/system/menu' }
 */
const parseHashParams = (hash: string) => {
  // hash: '#/login?redirect=%23/system/menu'
  const [path, search = ''] = hash.replace(/^#/, '').split('?');
  const params: Record<string, string> = {};
  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }
  return {
    path: `${path}`,
    params,
  };
};
/** 解析window.location.href
 * @param fullUrl 完整的url
 * @returns 解析后的url
 * @example
 * const url = 'http://localhost:5173/#/redirect?xxx';
 * const { hash, host, hostname, href, origin, pathname, port, protocol, search } = parseUrl(url);
 * console.log(hash, host, hostname, href, origin, pathname, port, protocol, search);
 *
 * 返回结果：
 * {
 *   hash: '#/redirect?xxx',
 *   host: 'localhost:5173',
 *   hostname: 'localhost',
 *   href: 'http://localhost:5173/#/redirect?xxx',
 *   origin: 'http://localhost:5173',
 *   pathname: '/',
 *   port: '5173',
 *   protocol: 'http',
 *   search: '?xxx',
 *   params: {
 *     redirect: '/',
 *   },
 *   redirect: '/',
 */
const parseUrl = (fullUrl: string) => {
  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = new URL(fullUrl);
  // 解析 search 参数

  const { path, params } = parseHashParams(hash);
  if (params.redirect) {
    params.redirect = params.redirect.replace(/^#/, '');
  }
  return {
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
    params,
    redirect: path,
  };
};

/** 用户权限映射 */
const userPermissionMap = {
  manager: ['/system'],
  teacher: ['/system'],
  student: ['/system'],
};

/** 用户信息 */
interface UserInfo {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  username: string;
  account: string;
  phone_no: string;
  email: string;
  avatar: string;
  is_admin: boolean;
  is_single_login: boolean;
  platforms: null;
}
const whiteList = [
  '/403',
  '/404',
  '/500',
  '/redirect',
  '/layout',
  '/ucenter',
  '/401',
  '/knowledge',
  '/login',
  '/theme',
  '/topopage',
];
const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息 */
    user: {} as UserInfo,
    /** 角色id列表 */
    role: [] as RoleId[],
    /** 角色名称列表 */
    roleName: [] as string[],
    /** 权限列表 */
    permissionList: whiteList,
  }),
  getters: {
    getUser: state => state.user,
    getAvatar: state => state.user.avatar || '/assets/images/default_avatar.jpg',
    getRole: state => state.role,
    getRoleName: state => state.roleName,
    homePagePath: state => FT_CONFIG.redirectPageMap[state.role[0]],
    inPermissionList: state => (path: string) => state.permissionList.some(item => path.startsWith(item)),
    getWhiteList: () => whiteList,
    isLogin: () => !!getToken(),
    appKey: () => (import.meta.env.DEV ? FT_CONFIG.devAppKey : FT_CONFIG.appKey),
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    updateUser(data: any) {
      this.user = { ...this.user, ...data };
      putUserApi(this.user.id, this.user).then(() => {
        this.initUser();
      });
    },
    setRole(role: string[]) {
      this.role = role;
      // 根据用户角色列表获取权限列表
      this.permissionList = [...whiteList];
      role.forEach(item => {
        if (item in userPermissionMap) {
          this.permissionList.push(...userPermissionMap[item as keyof typeof userPermissionMap]);
        }
      });
      // 去重
      this.permissionList = Array.from(new Set(this.permissionList));
    },
    setRoleName(roleName: string[]) {
      this.roleName = roleName;
    },
    goHome() {
      router.push(this.homePagePath);
    },
    async initUser() {
      /** todo 获取用户信息 */
      const res = await ssoCheckTokenApi();
      this.setUser(res.data.user);
      /** 获取用户角色 */
      const currentApp = res.data.user_platform_with_roles.find(
        (app: UserPlatformWithRole) => app.app_key === this.appKey,
      );
      /** 设置用户角色 */
      this.setRole(currentApp?.roles?.map((item: Role) => item.flag) || []);
      this.setRoleName(currentApp?.roles?.map((item: Role) => item.role_name) || []);
    },
    async logout(source: 'logout' | 'login' | 401 = 401, redirectHashVal = '') {
      removeUser();
      localClear();
      let redirectHash = '';
      if (!redirectHashVal) {
        const { hash } = parseUrl(window.location.href); // 获取当前路由
        redirectHash = hash;
      } else {
        redirectHash = redirectHashVal;
      }
      if (redirectHash.includes('redirect')) {
        redirectHash = '';
      } else {
        redirectHash = `&redirect=${redirectHash}`;
      }
      if (source === 401) {
        ElMessageBox.alert('您好！您的登录身份已失效，请您重新登录', '重新登录提醒', {
          confirmButtonText: '点此跳转',
          autofocus: false,
          callback: () => {
            window.location.href = `${FT_CONFIG.ssoLoginUrl}?app_key=${this.appKey}${redirectHash}`;
          },
        });
      } else if (source === 'logout') {
        ElMessageBox.confirm('确定退出登录?', '提示', {
          confirmButtonText: '确认退出',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 跳转登录
            window.location.href = `${FT_CONFIG.ssoLoginUrl}?app_key=${this.appKey}`;
          })
          .catch(() => {});
      } else {
        window.location.href = `${FT_CONFIG.ssoLoginUrl}?app_key=${this.appKey}`;
      }
    },
    /** 登录认证流程 */
    async login(sso_token: string) {
      setToken(sso_token);
      await this.initUser();
      const { params } = parseUrl(window.location.href); // 获取当前url的hash和host
      if ('redirect' in params && params['redirect'].indexOf('redirect') === -1) {
        router.push(params['redirect']);
      } else {
        this.goHome();
      }
    },
  },
});

export default useUserStore;
