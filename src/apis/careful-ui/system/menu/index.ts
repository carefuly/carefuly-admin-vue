// 导入二次封装axios
import sky from "@/utils/axios";

// 统一管理接口
enum API {
  LIST_ROUTE = "/v1/system/menu/listRouter",
}

// 获取用户菜单所有列表
export const listRouter = () => sky.get(API.LIST_ROUTE);
