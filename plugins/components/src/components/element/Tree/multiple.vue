<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import {Operation} from '@element-plus/icons-vue';
import type {ElTree} from 'element-plus';

defineOptions({name: "ElementMultiSelectTree"});

type TreeNode = Record<string, any>;
type TreeProps = {
  label?: string
  children?: string
  disabled?: string
  isLeaf?: string
  class?: string
};

// 定义组件事件
const emit = defineEmits<{
  /** 搜索事件（回车或清空时触发） */
  (e: 'search', text: string): void
  /** 复选框选中变化 */
  (e: 'check-change', data: TreeNode, checked: boolean, indeterminate: boolean): void
  /** 选中节点变化 */
  (e: 'selection-change', selectedNodes: TreeNode[]): void
}>();

interface TreeComponentProps {
  /** 标题文本 */
  title?: string
  /** 是否加载完成 */
  loading?: boolean
  /** 树数据 */
  data?: TreeNode[]
  /** 树配置项 */
  nodeProps?: TreeProps
  /** 节点唯一标识字段 */
  nodeKey?: string
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 默认选中的节点key数组 */
  defaultSelectedKeys?: (string | number)[]
  /** 是否可拖拽 */
  draggable?: boolean
  /** 自定义节点类名 */
  nodeClassName?: (data: TreeNode, node: any) => string
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标组件 */
  icon?: any
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否父子节点选中状态不关联 */
  checkStrictly?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
}

const props = withDefaults(defineProps<TreeComponentProps>(), {
  title: '',
  loading: false,
  data: () => [],
  nodeProps: () => ({
    label: 'label',
    children: 'children',
    disabled: 'disabled',
    isLeaf: 'isLeaf',
  }),
  nodeKey: 'id',
  showSearch: true,
  searchPlaceholder: '请输入关键词搜索',
  draggable: false,
  showIcon: true,
  icon: Operation,
  showCheckbox: true,
  checkStrictly: false,
  defaultExpandAll: false
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const pageData = reactive({
  filterText: '',
  selectedKeys: props.defaultSelectedKeys || []
});

const method = reactive({
  /** 触发搜索 */
  queryNode: () => {
    treeRef.value?.filter(pageData.filterText);
    emit('search', pageData.filterText);
  },

  /** 过滤节点方法 */
  filterNode: (value: string, data: TreeNode, node: any) => {
    if (!value) return true;
    return data[props.nodeProps?.label || 'label']?.includes(value);
  },

  /** 复选框状态变化 */
  handleCheckChange: (data: TreeNode, checked: boolean, indeterminate: boolean) => {
    emit('check-change', data, checked, indeterminate);
    method.updateSelectedKeys();
  },

  /** 更新选中的key数组 */
  updateSelectedKeys: () => {
    pageData.selectedKeys = treeRef.value?.getCheckedKeys() || [];
    emit('selection-change', treeRef.value?.getCheckedNodes() || []);
  },

  /** 设置选中的节点 */
  setCheckedNodes: (nodes: TreeNode[]) => {
    treeRef.value?.setCheckedNodes(nodes);
    method.updateSelectedKeys();
  },

  /** 通过key设置选中节点 */
  setCheckedKeys: (keys: (string | number)[]) => {
    treeRef.value?.setCheckedKeys(keys);
    method.updateSelectedKeys();
  },

  /** 获取选中的节点 */
  getCheckedNodes: (): TreeNode[] => {
    return treeRef.value?.getCheckedNodes() || [];
  },

  /** 获取选中的key数组 */
  getCheckedKeys: (): (string | number)[] => {
    return treeRef.value?.getCheckedKeys() || [];
  },

  /** 获取半选中的节点 */
  getHalfCheckedNodes: (): TreeNode[] => {
    return treeRef.value?.getHalfCheckedNodes() || [];
  },

  /** 获取半选中的key数组 */
  getHalfCheckedKeys: (): (string | number)[] => {
    return treeRef.value?.getHalfCheckedKeys() || [];
  },

  /** 获取树实例 */
  getTreeInstance: () => {
    return treeRef.value;
  },

  /** 清空选中状态 */
  clearSelection: () => {
    treeRef.value?.setCheckedKeys([]);
    method.updateSelectedKeys();
  }
});

// 监听默认选中节点变化
watch(() => props.defaultSelectedKeys, (newVal) => {
  if (newVal) {
    method.setCheckedKeys(newVal);
  }
}, {deep: true});

// 初始化时设置默认选中节点
if (props.defaultSelectedKeys) {
  method.setCheckedKeys(props.defaultSelectedKeys);
}

// 暴露组件方法
defineExpose({
  setCheckedNodes: method.setCheckedNodes,
  setCheckedKeys: method.setCheckedKeys,
  getCheckedNodes: method.getCheckedNodes,
  getCheckedKeys: method.getCheckedKeys,
  getHalfCheckedNodes: method.getHalfCheckedNodes,
  getHalfCheckedKeys: method.getHalfCheckedKeys,
  getTreeInstance: method.getTreeInstance,
  clearSelection: method.clearSelection
});
</script>

<template>
  <div class="element-multi-select-tree">
    <!-- 标题区域 -->
    <div v-if="title" class="tree-title">
      <el-icon v-if="showIcon">
        <component :is="icon"/>
      </el-icon>
      <span>{{ title }}</span>
    </div>

    <!-- 搜索框 -->
    <el-input
      v-if="showSearch"
      v-model="pageData.filterText"
      class="tree-search"
      :placeholder="searchPlaceholder"
      clearable
      @keydown.enter="method.queryNode"
      @clear="method.queryNode"
    />

    <!-- 其他输入框 -->
    <slot name="other-input"></slot>

    <!-- 树形组件容器 -->
    <div class="tree-scroll-wrapper">
      <el-tree
        ref="treeRef"
        class="scrollable-tree"
        v-loading="loading"
        :data="data"
        :props="nodeProps"
        :node-key="nodeKey"
        :filter-node-method="method.filterNode"
        :draggable="draggable"
        :node-class-name="nodeClassName"
        :show-checkbox="showCheckbox"
        :check-strictly="checkStrictly"
        :default-expand-all="defaultExpandAll"
        @check="method.handleCheckChange"
      >
        <template #default="{ node, data }">
          <div class="tree-node-wrapper">
            <slot name="node-content" :node="node" :data="data">
              <span class="node-label">{{ node.label }}</span>
            </slot>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped lang="scss">
.element-multi-select-tree {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tree-title {
    padding: 8px 0 12px 0;
    color: var(--el-color-primary);
    font-size: 16px;
    display: flex;
    align-items: center;
    font-weight: 500;

    .el-icon {
      margin-right: 8px;
    }
  }

  .tree-search {
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  /* 关键滚动区域 */
  .tree-scroll-wrapper {
    flex: 1;
    min-height: 0;
    overflow: auto;
    position: relative;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);

    /* 修复Element Tree的滚动问题 */
    :deep(.scrollable-tree) {
      width: max-content;
      min-width: 100%;

      .el-tree-node {
        white-space: nowrap;
      }

      .el-tree-node__content {
        height: 30px;
        display: inline-flex;
      }

      /* 选中状态样式 */
      .el-tree-node.is-checked > .el-tree-node__content {
        .el-checkbox {
          --el-checkbox-checked-input-border-color: var(--el-color-primary);
          --el-checkbox-checked-bg-color: var(--el-color-primary);
          --el-checkbox-checked-icon-color: var(--el-color-white);
        }
      }
    }

    /* 节点内容容器 */
    .tree-node-wrapper {
      display: inline-flex;
      align-items: center;
      padding-right: 16px;
    }

    .node-label {
      margin-left: 8px;
    }
  }
}
</style>
