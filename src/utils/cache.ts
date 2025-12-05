import Cookies from 'js-cookie';
import { ElMessageBox } from 'element-plus';
const TOKEN_KEY = 'ft-sso-token';
const USER_KEY = 'user_id';
const USER = 'user';
const THEME_KEY = 'theme';

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 */
export const localGet = (key: string): string => {
  const value = window.localStorage.getItem(key) || '';
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    console.log(error);
    return value;
  }
};

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 */
export const localSet = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 */
export const localRemove = (key: string) => {
  localStorage.removeItem(key);
};

//  清除所有localStorage
export const localClear = () => {
  localStorage.clear();
};

/**
 * 储存cookie
 */
export const setCookie = (cName: any, value: any, expiredays: any) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    cName +
    '=' +
    escape(value) +
    (expiredays === null ? '' : ';expires=' + exdate.toString()) +
    ';path=/;' +
    'SameSite=None;Secure;';
};

/** 获取cookie */
export const getCookie = (cName: string) => {
  return Cookies.get(cName);
};

export const setCookieToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};

export const setToken = (token: string) => {
  localSet(TOKEN_KEY, token);
};

export const getToken = () => {
  return localGet(TOKEN_KEY);
};

export const removeToken = () => {
  localRemove(TOKEN_KEY);
};

export const getUser = () => {
  return localGet(USER);
};

export const setUser = (userId: string) => {
  localSet(USER, userId);
};

export const removeUser = () => {
  localRemove(USER);
  localRemove(USER_KEY);
};

export const setUserId = (userId: string) => {
  localSet(USER_KEY, userId);
};

export const removeUserId = () => {
  localRemove(USER_KEY);
};

export const getTheme = () => {
  return localGet(THEME_KEY);
};

export const setTheme = (theme: string) => {
  localSet(THEME_KEY, theme);
};

export const getSimulationToken = () => {
  return localGet(window.FT_CONFIG.simulationId);
};

/** 解析window.location.href */
export const parseUrl = (fullUrl: string) => {
  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = new URL(fullUrl);
  return {
    hash, // '#/redirect?xxx'
    host, // 'localhost:5173'
    hostname, // 'localhost'
    href, // 'http://localhost:5173/#/redirect?xxx'
    origin, // 'http://localhost:5173'
    pathname, // '/'
    port, // '5173'
    protocol, // 'http:'
    search, // ''
  };
};

/** 跳转登录 */
export const goLogin = (source: 'logout' | 401 = 401, redirectHashVal = '') => {
  removeUser();
  localClear();
  console.log(`output->source`, source);
  if (source === 401) {
    let redirectHash;
    if (!redirectHashVal) {
      const { hash } = parseUrl(window.location.href); // 获取当前路由
      redirectHash = hash;
    } else {
      redirectHash = redirectHashVal;
    }
    ElMessageBox.alert('您好！您的登录身份已失效，请您重新登录', '重新登录提醒', {
      confirmButtonText: '点此跳转',
      autofocus: false,
      callback: () => {
        window.location.href = `${FT_CONFIG.loginUrl}?appKey=${FT_CONFIG.appKey}&redirect=${encodeURIComponent(redirectHash)}`;
      },
    });
  } else {
    ElMessageBox.confirm('确定退出登录?', '提示', {
      confirmButtonText: '确认退出',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        window.location.href = `${FT_CONFIG.loginUrl}?appKey=${FT_CONFIG.appKey}`;
      })
      .catch(() => {});
  }
};

/** 登录认证流程 */
export const makeLogin = async (ssoToken: string, urlHash: string) => {
  setToken(ssoToken);
  const { origin, pathname } = parseUrl(window.location.href); // 获取当前url的hash和host
  window.location.href = `${origin}${pathname}${urlHash}`; // 重定向到目标页面
};
