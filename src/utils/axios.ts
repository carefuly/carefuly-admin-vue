import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import router from "@/router";
import {LOGIN_URL} from "@/config";
import {network} from '@/config/network';
import NProgress from "@/utils/nprogress";
import {useUserStore} from "@/store";
import {getToken} from "@/utils/storage";
import {skyMsgError} from "@/utils/sky";

const {baseURL, contentType, requestTimeout, withCredentials} = network;

// axios配置
const config = {
  baseURL: baseURL,
  timeout: requestTimeout,
  withCredentials: withCredentials,
  headers: {
    'Content-Type': contentType,
  },
};

// 封装类Sky，方便简写
class Sky {

  private instance: AxiosInstance;

  // 初始化
  constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.instance = axios.create(config);
    // 配置拦截器
    this.interceptors();
  }

  // 拦截器
  interceptors() {
    // 请求发送之前的拦截器：携带token
    this.instance.interceptors.request.use(config => {
      // 1. 请求开始
      NProgress.start();
      // 获取token
      const token = getToken();
      // 如果实现挤下线功能，需要用户绑定一个uuid，uuid发生变化，token失效
      if (token) {
        config.headers['Authorization'] = "Bearer " + token;
      }
      // 2. 请求结束
      NProgress.done();
      return config;
    }, error => {
      // 2. 请求结束
      NProgress.done();
      error.data = {};
      error.data.msg = "服务器异常，请联系管理员🌻";
      return error;
    });
    // 请求返回之后的拦截器：数据或者状态
    this.instance.interceptors.response.use((response: AxiosResponse) => {
      const status = response.status || (response.data.status || response.data.code); // 后端返回数据状态
      if (status === 200) {
        if (response.data.code === 200) {
          return response.data;
        } else if (response.data.code === 401) {
          const userStore = useUserStore();
          // 清空token必须使用这个，不能使用session清空，因为登录的时候js会获取一遍token还会存在。
          // userStore.setToken("");
          // userStore.setUser({});
          skyMsgError("登录身份过期，请重新登录🌻");
          router.replace(LOGIN_URL);
          return Promise.reject(response.data);
        } else if ([400, 403, 500].includes(response.data.code)) {
          if (typeof response.data.msg === "object") {
            response.data.msg = JSON.stringify(response.data.msg);
          }
          skyMsgError(response.data.msg || "服务器偷偷跑到火星去玩了🌻");
          return Promise.reject(response.data.msg || "服务器偷偷跑到火星去玩了🌻");
        } else if (response.data) {
          return response.data;
        }
      } else if (status === 401) {
        const userStore = useUserStore();
        // 清空token必须使用这个，不能使用session清空，因为登录的时候js会获取一遍token还会存在。
        // userStore.setToken("");
        // userStore.setUser({});
        skyMsgError("登录身份过期，请重新登录🌻");
        router.replace(LOGIN_URL);
        return Promise.reject(response.data);
      } else {
        skyMsgError(response.data.msg + "🌻" || "服务器偷偷跑到火星去玩了🌻");
        return Promise.reject(response.data.msg + "🌻" || "服务器偷偷跑到火星去玩了🌻");
      }
    }, error => {
      // 2. 请求结束
      NProgress.done();
      // 处理网络错误，不是服务器响应的数据
      error.data = {};
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.data.msg = "错误请求🌻";
            skyMsgError(error.data.msg);
            break;
          case 401:
            error.data.msg = "未授权，请重新登录🌻";
            skyMsgError(error.data.msg);
            break;
          case 403:
            error.data.msg = "对不起，您没有权限访问🌻";
            skyMsgError(error.data.msg);
            break;
          case 404:
            error.data.msg = "请求错误,未找到请求路径🌻";
            skyMsgError(error.data.msg);
            break;
          case 405:
            error.data.msg = "请求方法未允许🌻";
            skyMsgError(error.data.msg);
            break;
          case 408:
            error.data.msg = "请求超时🌻";
            skyMsgError(error.data.msg);
            break;
          case 500:
            error.data.msg = "服务器又偷懒了，请重试🌻";
            skyMsgError(error.data.msg);
            break;
          case 501:
            error.data.msg = "网络未实现🌻";
            skyMsgError(error.data.msg);
            break;
          case 502:
            error.data.msg = "网络错误🌻";
            skyMsgError(error.data.msg);
            break;
          case 503:
            error.data.msg = "服务不可用🌻";
            skyMsgError(error.data.msg);
            break;
          case 504:
            error.data.msg = "网络超时🌻";
            skyMsgError(error.data.msg);
            break;
          case 505:
            error.data.msg = "http版本不支持该请求🌻";
            skyMsgError(error.data.msg);
            break;
          default:
            error.data.msg = `连接错误${error.response.status}`;
            skyMsgError(error.data.msg);
        }
      } else {
        error.data.msg = "连接到服务器失败🌻";
        skyMsgError(error.data.msg);
      }
      return Promise.reject(error);
    });
  }

  // Get请求
  get(url: string, params?: object) {
    return this.instance.get(url, {params});
  }

  // Post请求
  post(url: string, data?: object) {
    return this.instance.post(url, data);
  }

  // Put请求
  put(url: string, data?: object) {
    return this.instance.put(url, data);
  }

  // Delete请求  /system/role/1
  delete(url: string) {
    return this.instance.delete(url);
  }

  // 图片上传
  upload(url: string, params?: object) {
    return this.instance.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
  }

  // 导出Excel
  export(url: string, data?: object) {
    return this.instance.post(url, data, {
      "responseType": "blob",
    });
  }
}

export default new Sky(config);
