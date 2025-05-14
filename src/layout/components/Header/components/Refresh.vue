<script setup lang="ts">
import {LOGIN_URL} from "@/config";
import {skySessionStorage, skyLocalStorage} from "@/utils/storage";
import {skyMsgSuccess} from "@/utils/sky";
import {RefreshRight} from "@element-plus/icons-vue";

// 刷新本地缓存
const handleRefresh = () => {
  skySessionStorage.clear();
  skyLocalStorage.clear();
  skyMsgSuccess("刷新本地缓存成功🌻");
  // 必须使用这个把页面缓存刷掉
  window.location.replace(LOGIN_URL);
};
</script>

<template>
  <!-- 刷新 -->
  <el-tooltip content="刷新缓存">
    <el-icon class="sky-icon m-r-18px" :size="20" @click="handleRefresh">
      <RefreshRight/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped>

</style>
