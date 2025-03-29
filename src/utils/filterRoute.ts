import Layout from "@/layout/index.vue";
import router from "@/router";
import {HOME_URL} from "@/config";

// 递归函数用于生成路由配置，登录的时候也需要调用一次。
export function generateRoutes(data: any[], parentId: any) {
  // 首先把你需要动态路由的组件地址全部获取[vue2中可以直接用拼接的方式，但是vue3中必须用这种方式]
  let modules = import.meta.glob("@/views/**/*.vue");
  const routeList: any[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] && !router.hasRoute(data[i].path)) {
      if (data[i].parent_id === parentId) {
        const componentTemplate = data[i].component;
        const route: any = {
          path: `${data[i].path}`,
          name: `${data[i].name}`,
          // 这里modules[`/src/views/${componentTemplate}.vue`] 一定要用绝对定位
          component: data[i]?.component ? modules[`/src/views/${componentTemplate}.vue`] : Layout,
          meta: {
            title: data[i].title,
            icon: data[i].icon,
            isHide: data[i].isHide,
            isKeepAlive: data[i].isKeepAlive,
            isLink: data[i].isLink,
            isFull: data[i].isFull,
            isAffix: data[i].isAffix,
            redirect: data[i].redirect,
          },
        };
        if (data[i].type === 1) {
          route.redirect = `${data[i]?.redirect}` || HOME_URL;
        }
        // 递归处理子节点
        const children = generateRoutes(data, data[i].id);
        if (children.length > 0) {
          route.children = children;
        }
        routeList.push(route);
      }
    }
  }
  return routeList;
}

/**
 * 初始化动态路由[用于生成扁平化一级路由，将后端一级路由数据转化为前端router格式的一级路由]
 */
export function generateFlattenRoutes(data: any[]) {
  // 首先把你需要动态路由的组件地址全部获取[vue2中可以直接用拼接的方式，但是vue3中必须用这种方式]
  let modules = import.meta.glob("@/views/**/*.vue");
  const routes = [];
  for (let i = 0; i < data.length; i++) {
    const componentTemplate = data[i].component;
    const route: any = {
      path: `${data[i].path}`,
      name: `${data[i].name}`,
      component: data[i]?.component ? modules[`/src/views/${componentTemplate}.vue`] : Layout,
      meta: {
        parentId: data[i].parent_id,
        title: data[i].title,
        icon: data[i].icon,
        isHide: data[i].isHide,
        isKeepAlive: data[i].isKeepAlive,
        isLink: data[i].isLink,
        isFull: data[i].isFull,
        isAffix: data[i].isAffix,
        redirect: data[i].redirect,
      }
    };
    if (data[i].type === 1) {
      route.redirect = `${data[i]?.redirect}` || HOME_URL;
    }
    routes.push(route);
  }
  return routes;
}
