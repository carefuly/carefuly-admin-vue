<script setup>
import Collapse from "./components/Collapse.vue";
import BreadCrumb from "./components/BreadCrumb.vue";
import Toolbar from "./components/Toolbar.vue";
</script>

<template>
  <div class="header">
    <div class="header-left">
      <!-- 左侧菜单展开和折叠图标 -->
      <Collapse></Collapse>
      <!-- 面包屑 -->
      <BreadCrumb class="<md:visible"></BreadCrumb>
    </div>
    <!-- 工具栏 -->
    <Toolbar></Toolbar>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  height: $aside-header-height;

  .header-left {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
