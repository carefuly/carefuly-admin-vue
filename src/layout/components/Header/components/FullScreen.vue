<script setup lang="ts">
import {useFullscreen} from "@vueuse/core";
import {useGlobalStore} from "@/store";
import {FullScreen, CloseBold} from "@element-plus/icons-vue";

const globalStore = useGlobalStore();
// @vueuse/core 处理是否全屏
const {isFullscreen, toggle} = useFullscreen();
watch(isFullscreen, () => {
  if (isFullscreen.value) {
    globalStore.setGlobalState("isFullScreen", true);
  } else {
    globalStore.setGlobalState("isFullScreen", false);
  }
});
</script>

<template>
  <!-- 全屏 -->
  <el-tooltip :content="globalStore.isFullScreen === false ? '全屏' : '关闭全屏'">
    <el-icon class="sky-icon m-r-18px" :size="18" @click="toggle">
      <FullScreen v-if="!globalStore.isFullScreen"/>
      <CloseBold v-else/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped>

</style>
