// 导入二次封装axios
import sky from "@/utils/axios";

// 统一管理接口
enum API {
  PASSWORD_LOGIN = "/v1/auth/password-login",
  LOGOUT = "/sky/auths/logout",
  USERINFO = "/sky/auths/userinfo",
}

// 登录
export const login = (data: any) => sky.post(API.PASSWORD_LOGIN, data);

// 注销
export const logout = () => sky.post(API.LOGOUT);

// 用户信息
export const userinfo = () => sky.post(API.USERINFO);
