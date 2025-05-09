<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import {Loading} from '@element-plus/icons-vue';
import type {ElTree} from 'element-plus';

defineOptions({name: "ElementSingleLazyTree"});

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
  /** 懒加载节点事件 */
  (e: 'load-node', data: TreeNode, resolve: (children: TreeNode[]) => void, reject: (error?: any) => void): void
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
  defaultSelectedKey?: string | number
  /** 是否高亮当前选中节点 */
  highlightCurrent?: boolean
  /** 自定义节点类名 */
  nodeClassName?: (data: TreeNode, node: any) => string
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
  showIcon: true,
  icon: Loading
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const pageData = reactive({
  filterText: '',
  currentSelectedKey: props.defaultSelectedKey,
  loadingNode: null as string | number | null // 当前正在加载的节点key
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

  /** 节点点击事件 */
  handleNodeClick: async (data: TreeNode, node: any, component: any) => {
    pageData.currentSelectedKey = data[props.nodeKey];
    emit('node-click', data, node, component);
    emit('current-change', data, node);

    // 如果节点未加载且不是叶子节点，则触发懒加载
    if (!node.loaded && !node.isLeaf) {
      await method.loadNode(node, data);
    }
  },

  /** 懒加载节点 */
  loadNode: (node: any, data: TreeNode) => {
    return new Promise((resolve, reject) => {
      // 如果节点已经加载过，直接返回
      if (node.loaded) {
        resolve(null);
        return;
      }

      pageData.loadingNode = data[props.nodeKey];

      // 触发加载事件，父组件需要监听此事件并返回子节点数据
      emit('load-node', data, (children: TreeNode[]) => {
        // 设置节点为已加载状态
        node.loaded = true;
        // 设置节点为不是叶子节点（如果有children）
        node.isLeaf = !(children && children.length > 0);
        // 添加子节点
        node.append(children);
        pageData.loadingNode = null;
        resolve(children);
      }, (error?: any) => {
        pageData.loadingNode = null;
        reject(error);
      });
    });
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
  },

  /** 更新节点数据 */
  updateNodeData: (key: string | number, data: Partial<TreeNode>) => {
    const node = treeRef.value?.getNode(key);
    if (node) {
      Object.assign(node.data, data);
    }
  },

  /** 手动触发节点加载 */
  loadNodeData: async (key: string | number) => {
    const node = treeRef.value?.getNode(key);
    if (node && !node.loaded) {
      return method.loadNode(node, node.data);
    }
    return Promise.resolve();
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
  updateNodeData: method.updateNodeData,
  loadNodeData: method.loadNodeData
});
</script>

<template>
  <div class="element-lazy-tree">
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
        :load="method.loadNode"
        :lazy="true"
        :node-class-name="nodeClassName"
        @node-click="method.handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="tree-node-wrapper">
            <slot name="node-content" :node="node" :data="data">
              <span class="node-label">{{ node.label }}</span>
              <el-icon v-if="pageData.loadingNode === data[nodeKey]" class="loading-icon">
                <Loading/>
              </el-icon>
            </slot>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped lang="scss">
.element-lazy-tree {
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
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: var(--el-color-primary-light-9);
      }
    }

    /* 节点内容容器 */
    .tree-node-wrapper {
      display: inline-flex;
      align-items: center;
      padding-right: 16px;
    }

    .node-label {
      margin-right: 8px;
    }

    .loading-icon {
      margin-left: 8px;
      color: var(--el-color-primary);
      animation: rotating 2s linear infinite;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
