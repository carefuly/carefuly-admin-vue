/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单动态数据的列表 (需剔除 isHide == 0 隐藏的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowStaticAndDynamicMenuList(menuList: any): any {
  let newMenuList: any = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item: any) => {
    return item.isHide == false || item.meta?.isHide == false;
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: any, parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];

    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

const mode = import.meta.env.VITE_ROUTER_MODE;

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  // @ts-ignore
  return url[mode];
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  // @ts-ignore
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = "";
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
}

/**
 * @description 获取assets静态资源
 * @param url
 * @returns
 */
export const getAssets = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

/**
 * @description 获取匹配语言
 */
export const getLanguage = (language: string, zhName: string, enName?: any) => {
  switch (language) {
    case "zh":
      return zhName || "中文管理";
    case "en":
      return enName || "English Manage";
    default:
      return zhName || "中文管理";
  }
};
