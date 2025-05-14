<script setup lang="ts">
import Logo from "@/layout/components/Logo/index.vue";
import Dark from "@/layout/components/Header/components/Dark.vue";
import User from "@/layout/components/Header/components/User.vue";
import ColumnSubMenu from "@/layout/components/Menu/ColumnSubMenu.vue";
import Main from "@/layout/components/Main/index.vue";
import settings from "@/settings";
import {useRoute} from "vue-router";
import {useAuthStore, useGlobalStore} from "@/store";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const menuList = computed(() => authStore.showMenuList);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
const mobileDrawer = ref(false);
</script>

<template>
  <el-container class="layout-container">
    <el-header class="layout-header flex items-center flex-justify-between">
      <div class="w-30px flex items-center">
        <SvgIcon name="sky-mobile-menu" width="30px" height="30px" @click="mobileDrawer = true"></SvgIcon>
      </div>
      <div class="flex items-center">
        <!-- 明亮/暗黑模式图标 -->
        <Dark></Dark>
        <!-- 头像 AND 下拉折叠 -->
        <User></User>
      </div>
    </el-header>
    <!-- 路由页面 -->
    <Main></Main>
  </el-container>

  <!-- 左侧抽屉菜单 -->
  <MobileDrawer style="width: 220px" v-model="mobileDrawer" placement="left">
    <div class="transition-all mobile-drawer">
      <Logo layout="mobile"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <!-- :unique-opened="true" 子菜单不能同时展开 -->
        <el-menu
          :default-active="activeMenu"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <ColumnSubMenu :menuList="menuList"></ColumnSubMenu>
        </el-menu>
      </el-scrollbar>
    </div>
  </MobileDrawer>
</template>

<style scoped lang="scss">
.mobile-drawer {
  background-color: var(--el-menu-bg-color);
}

// 去除菜单右侧边框
.el-menu {
  border-right: none;
}

.layout-container {
  width: 100vw;
  height: 100vh;

  .layout-header {
    height: $aside-header-height;
    overflow: hidden;
    background-color: var(--el-header-bg-color);
  }
}

.layout-scrollbar {
  width: 100%;
  height: calc(100vh - $aside-header-height);
}
</style>
