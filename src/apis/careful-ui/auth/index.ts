// 导入二次封装axios
import sky from "@/utils/axios";

// 统一管理接口
enum API {
  LOGIN = "/v1/auth/login",
  TYPE_LOGIN = "/v1/auth/type-login",
  REFRESH_TOKEN = "/v1/auth/refresh-token",
  LOGOUT = "/v1/auth/logout",
  USERINFO = "/v1/auth/userinfo",
  CHANGE_PASSWORD = "/v1/auth/change-password",
}

// 登录
export const login = (data: any) => sky.post(API.LOGIN, data);

// 多用户类型登录
export const typeLogin = (data: any) => sky.post(API.TYPE_LOGIN, data);

// 刷新令牌
export const refreshToken = (data: any) => sky.post(API.REFRESH_TOKEN, data);

// 注销
export const logout = () => sky.post(API.LOGOUT);

// 用户信息
export const userinfo = () => sky.post(API.USERINFO);

//修改密码
export const changePassword = (data: any) => sky.post(API.USERINFO, data);
