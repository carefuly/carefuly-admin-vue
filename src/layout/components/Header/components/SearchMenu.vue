<script setup lang="ts">
import {useRouter} from "vue-router";
import {useDebounceFn} from "@vueuse/core";
import {useAuthStore} from "@/store";
import {Search} from "@element-plus/icons-vue";

const router = useRouter();
const authStore = useAuthStore();
const menuList = computed(() => authStore.menuList.filter((item) => !item.meta.hide_menu && item.meta.parentId));
const activePath = ref("");
const mouseoverMenuItem = (menu: any) => {
  activePath.value = menu.path;
};
const menuInputRef = ref(null);
const isShowSearch = ref(false);
const searchMenu = ref("");
watch(isShowSearch, val => {
  if (val) {
    document.addEventListener("keydown", keyboardOperation);
  } else {
    document.removeEventListener("keydown", keyboardOperation);
  }
});
const handleMenuOpen = () => {
  isShowSearch.value = true;
  nextTick(() => {
    setTimeout(() => {
      menuInputRef.value?.focus();
    });
  });
};
const searchList = ref([]);
const updateSearchList = () => {
  searchList.value = searchMenu.value
    ? menuList.value.filter(
      (item) =>
        (item.path.toLowerCase().includes(searchMenu.value.toLowerCase()) ||
          item.meta.title.toLowerCase().includes(searchMenu.value.toLowerCase())) &&
        !item.meta?.hide_menu
    )
    : [];
  activePath.value = searchList.value.length ? searchList.value[0].path : "";
};
const debouncedUpdateSearchList = useDebounceFn(updateSearchList, 300);
watch(searchMenu, debouncedUpdateSearchList);
const menuListRef = ref(null);
const keyPressUpOrDown = (direction: any) => {
  const length = searchList.value.length;
  if (length === 0) return;
  const index = searchList.value.findIndex((item) => item.path === activePath.value);
  const newIndex = (index + direction + length) % length;
  activePath.value = searchList.value[newIndex].path;
  nextTick(() => {
    if (!menuListRef.value?.firstElementChild) return;
    const menuItemHeight = menuListRef.value.firstElementChild.clientHeight + 12 || 0;
    menuListRef.value.scrollTop = newIndex * menuItemHeight;
  });
};
const keyboardOperation = (event: any) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    keyPressUpOrDown(-1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    keyPressUpOrDown(1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    handleClickMenu();
  }
};
const handleClickMenu = () => {
  const menu = searchList.value.find((item) => item.path === activePath.value);
  if (!menu) return;
  if (menu.meta?.is_ext) window.open(menu.meta.redirect, "_blank");
  else router.push(menu.path);
  searchMenu.value = "";
  isShowSearch.value = false;
};
</script>

<template>
  <!-- 搜索菜单 -->
  <div class="search-menu">
    <el-tooltip content="搜索菜单">
      <el-icon class="sky-icon m-x-18px" :size="20" @click="handleMenuOpen">
        <Search/>
      </el-icon>
    </el-tooltip>
    <el-dialog class="search-dialog" v-model="isShowSearch" :width="600" :show-close="false" top="10vh">
      <el-input
        v-model="searchMenu"
        ref="menuInputRef"
        placeholder="菜单搜索：支持菜单名称、路径🌻"
        size="large"
        clearable
        :prefix-icon="Search"
      ></el-input>
      <div v-if="searchList.length" class="menu-list" ref="menuListRef">
        <div
          v-for="item in searchList"
          :key="item.path"
          :class="['menu-item', { 'menu-active': item.path === activePath }]"
          @mouseenter="mouseoverMenuItem(item)"
          @click="handleClickMenu()"
        >
          <div class="menu-lf">
            <el-icon class="menu-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="menu-title">{{ item.meta.title }}</span>
          </div>
          <el-icon :size="20" @click="handleMenuOpen">
            <Search/>
          </el-icon>
        </div>
      </div>
      <el-empty v-else class="mt20 mb20" :image-size="100" description="暂无菜单"/>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-menu {
  display: flex;
  align-items: center;

  :deep(.el-dialog) {
    border-radius: 4px;

    .el-dialog__header {
      display: none;
    }
  }

  .menu-list {
    max-height: 515px;
    margin-top: 15px;
    overflow: auto;

    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 0 20px;
      margin: 10px 0;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      transition: all 0.2s ease;

      .menu-lf {
        display: flex;
        align-items: center;
      }

      .menu-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      .menu-title {
        font-size: 14px;
      }
    }

    .menu-active {
      color: #ffffff;
      background-color: var(--el-color-primary);

      .menu-icon {
        font-size: 18px;
      }

      .menu-title {
        font-size: 16px;
      }
    }
  }
}
</style>
