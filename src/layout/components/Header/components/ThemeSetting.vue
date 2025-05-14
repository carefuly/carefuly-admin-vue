<script setup>
import mittBus from "@/utils/mittBus";
import {Setting} from "@element-plus/icons-vue";
// 打开主题配置
const handleThemeDialog = () => {
  mittBus.emit("handleThemeConfig");
};
</script>

<template>
  <!-- 设置 -->
  <el-tooltip content="主题配置">
    <el-icon class="sky-icon m-r-18px" :size="20" @click="handleThemeDialog">
      <Setting/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped>

</style>
