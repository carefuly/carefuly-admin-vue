<script setup lang="ts">
import {useGlobalStore} from "@/store";
import {CloseBold} from "@element-plus/icons-vue";

const globalStore = useGlobalStore();

const onHandleExitMaximize = () => {
  globalStore.setGlobalState("maximize", false);
};
</script>

<template>
  <div class="maximize" @click="onHandleExitMaximize">
    <el-icon :size="22" class="exitIcon">
      <CloseBold/>
    </el-icon>
  </div>
</template>

<style scoped lang="scss">
.maximize {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 66px;
  height: 66px;
  cursor: pointer;
  background-color: var(--el-color-primary-light-8);
  border: 2px dashed var(--el-color-primary);
  border-radius: 50%;
  opacity: 0.9;

  &:hover {
    background-color: var(--el-color-primary-light-7);
  }

  .exitIcon {
    position: relative;
    top: 46%;
    left: 19%;
    color: var(--el-color-primary);
  }
}
</style>
