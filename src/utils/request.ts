import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { goLogin } from '@/utils/cache.ts';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径
  /** 60分钟 */
  timeout: 60 * 60 * 1000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  },
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 判断是否为流文件 流文件需要读取header的内容
    if (response.config.responseType === 'blob') {
      return response;
    }
    // 删除成功的状态码是204
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = '';
    // HTTP 状态码
    const status = error.response?.status;
    if (status === 401) {
      message = '用户认证失败！请重新登录';
      goLogin(401);
      return Promise.reject(error);
    }
    // 如果后端有错误提示
    if ((error?.response?.data as any)?.msg) {
      message = (error?.response?.data as any).msg;
    } else {
      // 没有报错信息使用默认报错信息
      switch (status) {
        case 302:
          message = '接口重定向了！';
          break;
        case 400:
          message = '参数不正确！';
          break;
        case 401:
          message = '用户认证失败！请重新登录';
          break;
        case 403:
          message = '您没有权限操作！';
          break;
        case 404:
          message = `请求地址出错: ${error.config?.url}`;
          break; // 在正确域名下
        case 408:
          message = '请求超时！';
          break;
        case 409:
          message = '系统已存在相同数据！';
          break;
        case 422:
          message = '请求失败';
          break;
        case 500:
          message = '服务器内部错误！';
          break;
        case 501:
          message = '服务未实现！';
          break;
        case 502:
          message = '网关错误！';
          break;
        case 503:
          message = '服务不可用！';
          break;
        case 504:
          message = '服务暂时无法访问，请稍后再试！';
          break;
        case 505:
          message = 'HTTP版本不受支持!';
          break;
        default:
          message = '网络异常，请联系管理员！';
          break;
      }
    }
    ElMessage.error({
      message,
      showClose: true,
    });
    return Promise.reject(error);
  },
);

export default {
  get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },

  getJson<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },

  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { data, ...config });
  },
};
