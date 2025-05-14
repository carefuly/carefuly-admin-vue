<script setup lang="ts">
import {Operation} from "@element-plus/icons-vue";

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
const pageData = ref({
  treeList: props.treeData,
  filterText: "",
});
const method = reactive({
  currentChange: (node: any) => {
    emit("currentChange", node);
  },
  filterNode: (value: any, data: any) => {
    if (!value) return true;
    return data[props.props?.label].includes(value);
  },
});
watch(() => props.treeData, () => {
  pageData.value.treeList = props.treeData;
});
watch(() => pageData.value.filterText, (val) => {
  treeRef.value?.filter(val);
});
// 清除选择树状态
const skyClearChecked = () => {
  pageData.value.treeList = [];
  // 重新赋值一遍
  setTimeout(() => {
    pageData.value.treeList = props.treeData;
  }, 1);
};
// defineExpose是vue3新增的一个api，放在<script setup>下使用的，
// 目的是把属性和方法暴露出去，可以用于父子组件通信，子组件把属性暴露出去，
// 父组件用ref获取子组件DOM，子组件暴露的方法或属性可以用dom获取。
defineExpose({
  skyClearChecked,
});
</script>

<template>
  <div class="tree">
    <div v-show="props.treeName" class="tree-title">
      <el-icon>
        <Operation/>
      </el-icon>
      <span class="title">{{ props.treeName }}</span>
    </div>
    <el-input v-model="pageData.filterText" placeholder="请输入指定名称查询" clearable></el-input>
    <el-tree
      ref="treeRef"
      class="el-tree"
      :node-key="props.nodeKey"
      :props="props.props"
      :data="pageData.treeList"
      :filter-node-method="method.filterNode"
      @current-change="method.currentChange"
      highlight-current
    />
  </div>
</template>

<style scoped lang="scss">
.tree {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;

  .el-tree {
    margin-top: 5px;
  }

  .tree-title {
    padding: 5px 0 10px 0;
    color: #e78784;
    font-size: 16px;
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }
}
</style>
