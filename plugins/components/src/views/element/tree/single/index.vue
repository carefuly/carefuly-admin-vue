<script setup lang="ts">
import ElementSingleTree from "@/components/element/Tree/Single.vue";
import ElementSingleLazyTree from "@/components/element/Tree/SingleLazy.vue";
import {createData} from "@/utils";

const singleTreeRef = ref();
const singleTreeLazyRef = ref();
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
const handleNodeClick = (data: any, node: any, component: any) => {
  console.log(data, node, component);
};
const handleLoadNode = (nodeData: any, resolve: any, reject: any) => {
  singleTreeLazyRef.value?.loadNodeData(nodeData.id);
};
onMounted(async () => {
  data.value = await fetchTreeData();
  console.log(data.value);
})
</script>

<template>
  <div style="display: flex">
    <div style="padding: 20px; width: 300px; height: 350px; border: 1px solid #ddd;">
      <ElementSingleTree
        ref="singleTreeRef"
        title="树形控件-基础用法"
        :loading="loading"
        :data="data"
        :nodeProps="props"
        :nodeKey="'id'"
        @search="handleSearch"
        @node-click="handleNodeClick"
      >
        <template #node-content="{ node, data }">
          <span>{{ node.label }}</span>
          <span>【{{ data.id }}】</span>
        </template>
      </ElementSingleTree>
    </div>

    <div style="padding: 20px; width: 300px; height: 350px; border: 1px solid #ddd;">
      <ElementSingleLazyTree
        ref="singleTreeLazyRef"
        title="树形控件-基础懒加载用法"
        :loading="loading"
        :data="data"
        :nodeProps="props"
        :nodeKey="'id'"
        @search="handleSearch"
        @node-click="handleNodeClick"
        @load-node="handleLoadNode"
      >
        <template #node-content="{ node, data }">
          <span>{{ node.label }}</span>
          <span>【{{ data.id }}】</span>
        </template>
      </ElementSingleLazyTree>
      <!--      <ElementSingleTree-->
      <!--        ref="singleTreeRef"-->
      <!--        title="树形控件-基础用法"-->
      <!--        :loading="loading"-->
      <!--        :data="data"-->
      <!--        :nodeProps="props"-->
      <!--        :nodeKey="'id'"-->
      <!--        @node-click="handleNodeClick"-->
      <!--        @search="handleSearch"-->
      <!--      >-->
      <!--        <template #node-content="{ node, data }">-->
      <!--          <span>{{ node.label }}</span>-->
      <!--          <span>【{{ data.id }}】</span>-->
      <!--        </template>-->
      <!--      </ElementSingleTree>-->
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
