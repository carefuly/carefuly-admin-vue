<script setup lang="ts">
import ThemeConfig from "./components/ThemeConfig/index.vue";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutColumns from "./LayoutColumns/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import LayoutHorizontal from "./LayoutHorizontal/index.vue";
import LayoutOptimum from "./LayoutOptimum/index.vue";
import LayoutMobile from "./LayoutMobile/index.vue";
import {useScreenStore} from "@/hooks/screen";
import {useGlobalStore} from "@/store";

const globalStore = useGlobalStore();
const layout = computed(() => globalStore.layout);
const {isMobile} = useScreenStore();
const LayoutComponent = {
  vertical: LayoutVertical,
  columns: LayoutColumns,
  classic: LayoutClassic,
  horizontal: LayoutHorizontal,
  optimum: LayoutOptimum
};

</script>

<template>
  <div>
    <!-- 同级进行选择不同布局时就不会被关闭 -->
    <ThemeConfig></ThemeConfig>
    <component :is="LayoutComponent[layout]" v-if="!isMobile"/>
    <component :is="LayoutMobile" v-if="isMobile"/>
  </div>
</template>

<style scoped>

</style>
