<script setup lang="ts">
import ElementMultiSelectTree from "@/components/element/Tree/multiple.vue";
import {createData} from "@/utils";

const multipleTreeRef = ref();
const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}
const loading = ref(false);
const data = ref([]);

const fetchTreeData = () => {
  loading.value = true
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(createData(3, 5, 10))
      loading.value = false
    }, 1500) // 模拟1.5秒网络延迟
  })
}

const handleSearch = () => {
  console.log("搜索");
};

const handleSelectionChange = (data: any, checked: boolean, indeterminate: boolean) => {
  console.log(data, checked, indeterminate);
};

onMounted(async () => {
  data.value = await fetchTreeData();
})
</script>

<template>
  <div style="padding: 20px; width: 300px; height: 350px; border: 1px solid #ddd;">
    <ElementMultiSelectTree
      ref="multipleTreeRef"
      title="树形控件-多选用法"
      :loading="loading"
      :data="data"
      :nodeProps="props"
      :nodeKey="'id'"
      @search="handleSearch"
      @selection-change="handleSelectionChange"
    >
      <template #node-content="{ node, data }">
        <span>{{ node.label }}</span>
        <span>【{{ data.id }}】</span>
      </template>
    </ElementMultiSelectTree>
  </div>
</template>

<style scoped lang="scss">

</style>
