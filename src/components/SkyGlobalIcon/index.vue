<script setup lang="ts">
import {SVG_PREFIX} from '@/config';

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
const props = defineProps({
  name: {
    type: String,
    default: "Sunny",
  },
  size: {
    type: String,
    default: "18",
  },
});
</script>

<template>
  <el-icon :size="props.size">
    <component v-if="!props.name.startsWith(SVG_PREFIX)" :is="props.name"></component>
    <component v-if="props.name.startsWith(SVG_PREFIX)" is="SvgIcon" :name="props.name" :width="props.size"
               :height="props.size"></component>
  </el-icon>
</template>

<style scoped>

</style>
