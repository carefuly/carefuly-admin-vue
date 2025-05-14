import Layout from "@/layout/index.vue";
import {RouteRecordRaw} from "vue-router";
import {HOME_URL, LOGIN_URL} from "@/config";

/**
 * LayoutRouter (布局路由)
 */
export const layoutRouter: RouteRecordRaw[] = [
  {
    // 登录成功以后展示数据的路由[一级路由，可以将子路由放置Main模块中(核心)]
    path: "/", // 路由访问路径[唯一]
    name: "layout", // 命名路由[唯一] q
    component: Layout, // 登录进入这个页面，这个页面是整个布局
    redirect: HOME_URL, // path路径，<router-link name="/404"> 也是使用path进行跳转
    children: [
      {
        path: HOME_URL, // [唯一]
        component: () => import("@/views/careful-ui/dashboard/analysis/index.vue"),
        meta: {
          title: "分析页", // 标题
          icon: "HomeFilled", // 图标
          isHide: false, // 代表路由在菜单中是否隐藏，是否隐藏[false不隐藏, ture隐藏]
          isLink: "", // 是否外链[false否, true是]
          isKeepAlive: true, // 是否缓存路由数据[false否, true是]
          isFull: false, // 是否缓存全屏[false否, true是]
          isAffix: true, // 是否缓存固定路由[false否, true是]
        }
      }
    ]
  },
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/views/careful-ui/auth/login/index.vue"),
    meta: {
      title: "登录"
    }
  }
];

/**
 * LayoutRouter (布局路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  /** 首页 */
  // {
  //   path: "/dashboard/analysis", // [唯一]
  //   component: () => import("@/views/careful-ui/dashboard/analysis/index.vue"),
  //   meta: {
  //     title: "分析页", // 标题
  //     icon: "HomeFilled", // 图标 HomeFilled
  //     isHide: false, // 代表路由在菜单中是否隐藏，是否隐藏[false不隐藏, ture隐藏]
  //     isLink: "", // 是否外链[false否, true是]
  //     isKeepAlive: true, // 是否缓存路由数据[false否, true是]
  //     isFull: false, // 是否缓存全屏[false否, true是]
  //     isAffix: true, // 是否缓存固定路由[false否, true是]
  //   }
  // },
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/careful-ui/error/403/index.vue"),
    meta: {
      title: "403页面",
      icon: "QuestionFilled", // 菜单图标
      isHide: false, // 代表路由在菜单中是否隐藏，是否隐藏[false不隐藏, ture隐藏]
      isLink: "", // 是否外链[false否, true是]
      isKeepAlive: true, // 是否缓存路由数据[false否, true是]
      isFull: false, // 是否缓存全屏[false否, true是]
      isAffix: true, // 是否缓存固定路由[false否, true是]
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/careful-ui/error/404/index.vue"),
    meta: {
      title: "404页面",
      icon: "CircleCloseFilled", // 菜单图标
      isHide: false, // 代表路由在菜单中是否隐藏，是否隐藏[false不隐藏, ture隐藏]
      isLink: "", // 是否外链[false否, true是]
      isKeepAlive: true, // 是否缓存路由数据[false否, true是]
      isFull: false, // 是否缓存全屏[false否, true是]
      isAffix: true, // 是否缓存固定路由[false否, true是]
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/careful-ui/error/500/index.vue"),
    meta: {
      title: "500页面",
      icon: "WarningFilled", // 图标
      isHide: false, // 代表路由在菜单中是否隐藏，是否隐藏[false不隐藏, ture隐藏]
      isLink: "", // 是否外链[false否, true是]
      isKeepAlive: true, // 是否缓存路由数据[false否, true是]
      isFull: false, // 是否缓存全屏[false否, true是]
      isAffix: true, // 是否缓存固定路由[false否, true是]
    }
  },
  // 找不到path将跳转404页面
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/careful-ui/error/404/index.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/careful-ui/error/404/index.vue"),
  }
];
