<script setup lang="ts">
import AsideSubMenu from "@/layout/components/Menu/AsideSubMenu.vue";
import {useRouter} from "vue-router";
import {skyMsgWarning} from "@/utils/sky";

const props = defineProps({
  menuList: {
    type: Array,
  }
});
const router = useRouter();
/* 打开标签页 或 外部链接 */
const handleMenuRouter = (value: any) => {
  if (value.meta?.isLink) {
    if (/^https?:\/\//.test(value.meta?.isLink)) {
      return window.open(value.meta.isLink, "_blank");
    } else {
      skyMsgWarning("非正确链接地址，禁止跳转");
      return;
    }
  }
  router.push(value.path);
};
</script>

<template>
  <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
  <template v-for="(item) in menuList" :key="item.path">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <SkyGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></SkyGlobalIcon>
        <span v-text="item.meta.title"></span>
      </template>
      <AsideSubMenu :menuList="item.children"/>
    </el-sub-menu>
    <!-- 叶子节点[功能节点] -->
    <el-menu-item v-else :index="item.path" @click="handleMenuRouter(item)">
      <SkyGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></SkyGlobalIcon>
      <template #title>
        <span v-text="item.meta.title"></span>
      </template>
    </el-menu-item>
  </template>
</template>

<style scoped lang="scss">
/** el-menu鼠标悬停和点击代码 */
// 父节点
.el-menu-item {
  height: $aside-menu-height !important;
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  --el-menu-item-height: $aside-menu-height;
  // color: #000000;

  /* 设置用户禁止选中 */
  user-select: none;
  border-left: $aside-menu-border-left solid transparent;
  border-radius: $aside-menu-border-left;

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);

  i {
    transform: translate($aside-menu-font-icon-translate); // 图标偏移
  }

  span {
    transform: translate($aside-menu-font-icon-translate); // 文字偏移
  }

  // 设置鼠标悬停时el-menu-item的样式
  &:hover {
    // color: var(--el-color-primary);
    color: var(--el-menu-hover-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-hover-bg-color);
    border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);

    // & 含义 .el-menu-item
    border-radius: $aside-menu-border-left;

    // 实现鼠标悬停时icon变色
    i {
      // color: var(--el-color-primary);
      color: var(--el-menu-hover-text-color);
    }
  }

  // 设置选中el-menu-item时的样式
  &.is-active {
    // color: var(--el-color-primary);
    color: var(--el-menu-active-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-active-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }
}

// 子节点
:deep(.el-sub-menu__title) {
  height: $aside-menu-height;
  padding-right: 0; // 去除collapse缩小多余的边框
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  // color: #000000;

  /* 设置用户禁止选中 */
  user-select: none;
  border-left: $aside-menu-border-left solid transparent;
  border-radius: $aside-menu-border-left;

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);

  i {
    transform: translate($aside-menu-font-icon-translate); // 图标偏移
  }

  span {
    transform: translate($aside-menu-font-icon-translate); // 文字偏移
  }

  &:hover {
    // color: var(--el-color-primary);
    color: var(--el-menu-hover-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-hover-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }

  &:active {
    // color: var(--el-color-primary);
    color: var(--el-menu-active-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-active-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }
}

</style>

<style scoped lang="scss">
/* 子级菜单字体高亮，父级菜单也高亮 */
.el-sub-menu.is-active > .el-sub-menu__title {
  // color: var(--el-color-primary) !important;
  color: var(--el-menu-active-text-color) !important;
}

/* icon图标也跟着变 */
.el-sub-menu.is-active > .el-sub-menu__title i {
  // color: var(--el-color-primary) !important;
  color: var(--el-menu-active-text-color) !important;
}
</style>
