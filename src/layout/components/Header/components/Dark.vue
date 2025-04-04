<script setup lang="ts">
import {useGlobalStore} from "@/store";
import {useTheme} from "@/utils/theme";
import {Sunny, Moon} from "@element-plus/icons-vue";

defineProps({
  size: {
    type: Number,
    default: 22
  }
});
const globalStore = useGlobalStore();
const {switchDark} = useTheme();
// 暗黑主题和明亮主题切换
const handleSwitchDark = async (event: any) => {
  const x = event.clientX;
  const y = event.clientY;
  // 画圆
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-ignore
  if (document.startViewTransition === undefined) {
    /** 明亮和暗黑模式核心逻辑 */
    // 定义图标切换变量(true-月亮，false-太阳)
    globalStore.setGlobalState("isDark", !globalStore.isDark);
    switchDark();
    /** 明亮和暗黑模式核心逻辑 */
  } else {
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      /** 明亮和暗黑模式核心逻辑 */
      // 定义图标切换变量(true-月亮，false-太阳)
      globalStore.setGlobalState("isDark", !globalStore.isDark);
      switchDark();
      /** 明亮和暗黑模式核心逻辑 */
    });
    await transition.ready;
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: globalStore.isDark ? "::view-transition-new(root)" : "::view-transition-old(root)"
      }
    );
  }
};
</script>

<template>
  <!-- 明亮模式 -->
  <el-tooltip content="明亮模式" v-if="!globalStore.isDark">
    <el-icon class="sky-icon m-r-18px" :size="size" @click="handleSwitchDark">
      <Sunny/>
    </el-icon>
  </el-tooltip>
  <!-- 暗黑模式 -->
  <el-tooltip content="暗黑模式" v-if="globalStore.isDark">
    <el-icon class="sky-icon m-r-18px" :size="size" @click="handleSwitchDark">
      <Moon/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root) {
  z-index: 9999;
}

::view-transition-new(root) {
  z-index: 1;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>
