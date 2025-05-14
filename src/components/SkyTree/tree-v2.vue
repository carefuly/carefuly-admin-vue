<script setup lang="ts">

import {Operation} from "@element-plus/icons-vue";

defineOptions({name: "SkyTree-V2"});
const emit = defineEmits(["currentChange"]);
const props = defineProps({
  treeName: {
    type: String,
    default: null,
  },
  props: {
    type: Object,
    default: null,
  },
  treeData: {
    type: Array,
    default: [],
  },
  nodeKey: {
    type: String,
    default: null,
  },
  checkedKeys: {
    type: String,
    default: null,
  },
});
const treeRef = ref();
// 过滤文本
const filterText = ref();
// 搜索
const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query);
};
// 搜索过滤
const filterNode = (query: string, node: any) => {
  if (!query) return true;
  return node[props.props?.label].includes(query);
};
// 选择节点触发
const currentChange = (node: any) => {
  emit("currentChange", node);
};
</script>

<template>
  <div class="tree">
    <div v-show="props.treeName" class="tree-title">
      <el-icon>
        <Operation/>
      </el-icon>
      <span class="title">{{ props.treeName }}</span>
    </div>
    <el-input v-model="filterText" placeholder="请输入指定名称查询" @input="onQueryChanged" clearable></el-input>
    <el-tree-v2
      ref="treeRef"
      class="el-tree"
      :node-key="props.nodeKey"
      :props="props.props"
      :data="props.treeData"
      :filter-method="filterNode"
      @current-change="currentChange"
      highlight-current
    />
  </div>
</template>

<style scoped lang="scss">
.tree {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;

  .el-tree {
    margin-top: 5px;
  }

  .tree-title {
    padding: 5px 0 10px 0;
    color: #e78784;
    font-size: 16px;

    span {
      margin-left: 10px;
    }
  }
}
</style>
