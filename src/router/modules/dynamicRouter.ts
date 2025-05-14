import router from "@/router/index";
import {LOGIN_URL} from "@/config";

import {staticRouter} from "@/router/modules/staticRouter";
import {useUserStore, useAuthStore} from "@/store";
import {getShowStaticAndDynamicMenuList} from "@/utils";
import {generateRoutes, generateFlattenRoutes} from "@/utils/filterRoute";
import {listRouter} from "@/apis/careful-ui/system/menu";

const modules = import.meta.glob("@/views/**/*.vue");
export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  try {
    // 1. 获取后端菜单数据
    const res = await listRouter();
    // 进行扁平化路由数据
    authStore.menuList = generateFlattenRoutes(res.data);
    // 持久化递归菜单数据，左侧菜单栏渲染，这里的菜单将后端数据进行递归
    // 需要将动态路由 hide_menu == ture 的隐藏菜单剔除，将静态路由 hide_menu == true 的隐藏菜单剔除
    authStore.recursiveMenuList = getShowStaticAndDynamicMenuList(staticRouter).concat(
      generateRoutes(getShowStaticAndDynamicMenuList(res.data), "")
    );
    // 面包屑需要静态和动态所有的数据，无论是否隐藏
    authStore.breadcrumbList = staticRouter.concat(generateRoutes(res.data, ""));
    // 2. 按钮权限列表 && 递归菜单数据
    await authStore.getLoginUserInfo();
    // 判断当前用户是否拥有菜单权限
    if (authStore.menuList == null || authStore.menuList.length === 0) {
      userStore.setToken("");
      await router.replace(LOGIN_URL);
      return;
    }
    // 添加动态路由[扁平化一级路由数据]
    authStore.menuList.forEach(item => {
      if (item.component && typeof item.component == "string") {
        // 扁平化路由也需要构造component路由函数
        item.component = modules["/src/views/" + item.component + ".vue"];
      }
      if (item.isFull) {
        // 如果是全屏的话，直接为整个页面
        router.addRoute(item);
      } else {
        router.addRoute("layout", item);
      }
    });
  } catch (error) {
    // 当菜单请求出错时，重定向到登陆页
    userStore.setToken("");
    userStore.setUser({});
    await router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
