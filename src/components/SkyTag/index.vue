<script setup lang="ts">
// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
// withDefaults(defineProps<ITagProps>(), {
//   tagOptions: [],
//   value: "",
//   size: "default",
//   effect: "light"
// });
const props = defineProps({
  tagOptions: {default: []},
  value: {default: ""},
  size: {default: "default"},
  effect: {default: "light"},
});
</script>

<template>
  <div>
    <template v-for="item in props.tagOptions">
      <el-tag
        v-if="props.value.toString() === item.value.toString()"
        :disable-transitions="true"
        :key="item.name"
        :type="item.dictTag"
        :index="item.name + item.value.toString()"
        :effect="(item.dictColor.length === 0) ? props.effect : 'dark'"
        :size="props.size"
        :style="{
            'border-color': item.dictColor,
            background: item.dictColor
          }"
      >
        {{ item.name }}
      </el-tag>
    </template>
  </div>
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 10px;
}
</style>
