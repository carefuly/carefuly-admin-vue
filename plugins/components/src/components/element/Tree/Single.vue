<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import {Operation} from '@element-plus/icons-vue';
import type {ElTree} from 'element-plus';

defineOptions({name: "ElementSingleTree"});

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
  /** 节点点击事件 */
  (e: 'node-click', data: TreeNode, node: any, component: any): void
  /** 当前选中节点变化 */
  (e: 'current-change', data: TreeNode, node: any): void
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
  /** 默认选中的节点key */
  defaultSelectedKey?: string | number // 未初始化
  /** 是否高亮当前选中节点 */
  highlightCurrent?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 自定义节点类名 */
  nodeClassName?: (data: TreeNode, node: any) => string // 未初始化
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标组件 */
  icon?: any
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
  highlightCurrent: true,
  draggable: false,
  showIcon: true,
  icon: Operation
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const pageData = reactive({
  filterText: '',
  currentSelectedKey: props.defaultSelectedKey
});

const method = reactive({
  /** 触发搜索 */
  queryNode: () => {
    treeRef.value?.filter(pageData.filterText);
    // 预防搜索后触发其他ajax操作
    emit('search', pageData.filterText);
  },
  /** 过滤节点方法 */
  filterNode: (value: string, data: TreeNode, node: any) => {
    if (!value) return true
    return data[props.nodeProps?.label || 'label']?.includes(value)
  },
  /** 节点点击事件 */
  handleNodeClick: (data: TreeNode, node: any, component: any) => {
    pageData.currentSelectedKey = data[props.nodeKey];
    emit('node-click', data, node, component);
    emit('current-change', data, node);
  },
  /** 设置当前选中节点 */
  setCurrentNode: (key: string | number) => {
    treeRef.value?.setCurrentKey(key);
    pageData.currentSelectedKey = key;
  },
  /** 获取当前选中节点 */
  getCurrentNode: (): TreeNode | undefined => {
    return treeRef.value?.getCurrentNode();
  },
  /** 获取树实例 */
  getTreeInstance: () => {
    return treeRef.value;
  },
  /** 清空选中状态 */
  clearSelection: () => {
    treeRef.value?.setCurrentKey(null);
  }
});
// 监听默认选中节点变化
watch(() => props.defaultSelectedKey, (newVal) => {
  if (newVal) {
    method.setCurrentNode(newVal);
  }
});

// 初始化时设置默认选中节点
if (props.defaultSelectedKey) {
  method.setCurrentNode(props.defaultSelectedKey);
}

// 暴露组件方法
defineExpose({
  setCurrentNode: method.setCurrentNode,
  getCurrentNode: method.getCurrentNode,
  getTreeInstance: method.getTreeInstance,
  clearSelection: method.clearSelection,
});
</script>

<template>
  <div class="element-single-tree">
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
        :highlight-current="highlightCurrent"
        :draggable="draggable"
        :node-class-name="nodeClassName"
        @node-click="method.handleNodeClick"
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
.element-single-tree {
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
    overflow: auto; /* 启用双方向滚动 */
    position: relative;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);

    /* 修复Element Tree的滚动问题 */
    :deep(.scrollable-tree) {
      width: max-content; /* 关键：让树宽度由内容决定 */
      min-width: 100%; /* 至少填满容器 */

      .el-tree-node {
        white-space: nowrap; /* 防止节点内容换行 */
      }

      .el-tree-node__content {
        height: 30px;
        display: inline-flex; /* 关键：保持内容在一行 */
      }

      /* 选中状态样式 */
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: var(--el-color-primary-light-9);
      }
    }

    /* 节点内容容器 */
    .tree-node-wrapper {
      display: inline-flex;
      align-items: center;
      padding-right: 16px; /* 给滚动条留空间 */
    }

    .node-label {
      margin-right: 8px;
    }
  }
}
</style>
