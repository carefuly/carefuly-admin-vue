<script setup lang="ts">
import {useGlobalStore} from "@/store";

const globalStore = useGlobalStore();
// 切换图标
const changeCollapseIcon = () => {
  // 定义图标切换变量(true-折叠，false-展开)
  globalStore.isCollapse = globalStore.setCollapse(globalStore.isCollapse);
};
</script>

<template>
  <el-icon class="collapse-icon sky-icon" :size="20" @click="changeCollapseIcon">
    <SkySvgIcon name="sky-menu-left" width="20px" height="20px" v-if="!globalStore.isCollapse"></SkySvgIcon>
    <SkySvgIcon name="sky-menu-right" width="20px" height="20px" v-if="globalStore.isCollapse"></SkySvgIcon>
  </el-icon>
</template>

<style scoped lang="scss">

</style>
