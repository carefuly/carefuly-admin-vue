<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {HOME_URL} from "@/config";
import {useGlobalStore, useKeepAliveStore, useTabsStore} from "@/store";
import {Close, DArrowLeft, DArrowRight, FullScreen, Refresh, Remove, Star} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const keepAliveStore = useKeepAliveStore();
const tabsStore = useTabsStore();

// 点击鼠标右键点击出现菜单
const choosePath = ref();
const handleTabsMenu = (path: any, e: any) => {
  choosePath.value = path;
  const card = document.querySelector(".tabs-card");

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 设置 card 的位置为鼠标点击位置
    card.style.display = "block";
    card.style.left = (e.pageX + "px");
    card.style.top = (e.pageY + "px");

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.style.display = "none";
      }
      // 移除点击事件监听器，以免影响其他操作
      window.removeEventListener("click", hideCard);
    };
    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick]
  e.stopPropagation();
};
// 刷新当前页
const refreshCurrentPage = inject("refresh");
const handleRefresh = () => {
  setTimeout(() => {
    route.meta.keepalive && keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.keepalive && keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};
// 当前页全屏
const handleMaximize = () => {
  // 切换哪个，先跳转哪个
  router.push(choosePath.value);
  globalStore.setGlobalState("maximize", !globalStore.maximize);
};
// 关闭左边 OR 右边选项卡
const handleCloseSideTabs = (direction: any) => {
  // console.log("关闭左边 OR 右边选项卡", direction);
  if (choosePath.value) {
    tabsStore.closeSideTabs(choosePath.value, direction);
  } else {
    tabsStore.closeSideTabs(route.fullPath, direction);
  }
};
// 关闭当前选项卡
const handleCloseCurrentTab = () => {
  // console.log("关闭当前选项卡");
  if (choosePath.value) {
    tabsStore.removeTab(choosePath.value, true, route.fullPath);
  } else {
    tabsStore.removeTab(route.fullPath);
  }
};
// 关闭其他选项卡
const handleCloseOtherTabs = () => {
  // console.log("关闭其他选项卡");
  if (choosePath.value) {
    tabsStore.closeManyTabs(choosePath.value);
    router.push(choosePath.value);
  } else {
    tabsStore.closeManyTabs(route.fullPath);
  }
};
// 关闭全部选项卡
const handleCloseAllTabs = () => {
  // console.log("关闭全部选项卡");
  tabsStore.closeManyTabs();
  router.push(HOME_URL);
};
// 组件对外暴露
defineExpose({
  handleTabsMenu,
});
</script>

<template>
  <div class="tabs-card">
    <div @click="handleRefresh()" class="tab-menu-item c-#0C6ED0">
      <el-icon class="m-r-2px">
        <Refresh/>
      </el-icon>
      {{ $t("tabs.refresh") }}
    </div>
    <br/>
    <div @click="handleMaximize()" class="tab-menu-item c-#646cff">
      <el-icon class="m-r-2px">
        <FullScreen/>
      </el-icon>
      {{ $t("tabs.maximize") }}
    </div>
    <br/>
    <div @click="handleCloseCurrentTab()" class="tab-menu-item c-#C93992">
      <el-icon class="m-r-2px">
        <Close/>
      </el-icon>
      {{ $t("tabs.closeCurrent") }}
    </div>
    <br/>
    <div @click="handleCloseOtherTabs()" class="tab-menu-item c-#DD5858">
      <el-icon class="m-r-2px">
        <Star/>
      </el-icon>
      {{ $t("tabs.closeOther") }}
    </div>
    <br/>
    <div @click="handleCloseSideTabs('left')" class="tab-menu-item c-#31A24D">
      <el-icon class="m-r-2px">
        <DArrowLeft/>
      </el-icon>
      {{ $t("tabs.closeLeft") }}
    </div>
    <br/>
    <div @click="handleCloseSideTabs('right')" class="tab-menu-item c-#F77A05">
      <el-icon class="m-r-2px">
        <DArrowRight/>
      </el-icon>
      {{ $t("tabs.closeRight") }}
    </div>
    <br/>
    <div icon="Remove" @click="handleCloseAllTabs()" class="tab-menu-item c-#7723B0">
      <el-icon class="m-r-2px">
        <Remove/>
      </el-icon>
      {{ $t("tabs.closeAll") }}
    </div>
  </div>
</template>

<style scoped lang="scss">
/** 右键点击选项开始 */
.tabs-card {
  position: absolute;
  z-index: 10;
  display: none;
  cursor: pointer;
  background-color: #ffffff;
  @apply dark:bg-black;
  border-radius: var(--el-border-radius-base);
}

.tab-menu-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 10px;
  padding: 8px 15px;
  margin-top: 1px;
  font-size: var(--el-font-size-base);
  text-align: center;
  white-space: nowrap;
  user-select: none;
  background-color: var(--el-bg-color);
  border: 1px dashed var(--el-color-primary);
  border-radius: var(--el-border-radius-base);

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

/** 右键点击选项结束 */
</style>
