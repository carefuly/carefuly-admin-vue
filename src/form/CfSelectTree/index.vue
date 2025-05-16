<script setup lang="ts">
import {Warning} from "@element-plus/icons-vue";

interface Props {
  isForm?: boolean;
  sm?: number;
  label?: string;
  description?: string;
  prop: string;
  pl?: boolean;
  model: Record<string, any>;
  nodeKey?: string;
  data?: any[];
  props?: {
    label?: string;
    value?: string;
    children?: string;
    disabled?: string;
  };
  placeholder?: string;
  disabled?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  showCheckbox?: boolean;
  checkStrictly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isForm: true,
  sm: 0,
  label: "",
  description: "",
  pl: false,
  disabled: false,
  data: () => [],
  props: () => ({
    label: 'label',
    value: 'value',
    children: 'children',
    disabled: 'disabled'
  }),
  placeholder: "请选择",
  filterable: false,
  multiple: false,
  collapseTags: false,
  collapseTagsTooltip: false,
  showCheckbox: false,
  checkStrictly: false,
  nodeKey: 'id'
});

const emit = defineEmits<{
  (e: "change", value: any): void;
  (e: "update:model", value: Record<string, any>): void;
  (e: "node-click", node: Node, data: any): void;
}>();

const handleChange = (val: any) => {
  emit("change", val);
  emit("update:model", {...props.model, [props.prop]: val});
};

const handleNodeClick = (node: Node, data: any) => {
  emit("node-click", node, data);
};
</script>

<template>
  <el-col v-if="isForm" :xs="{ span: 24 }" :sm="{ span: sm }">
    <el-form-item :prop="prop" :class="pl ? 'p-l-10px' : ''">
      <template #label>
        <div class="label-container">
          <span class="label-text">{{ label }}</span>
          <el-tooltip v-if="description" :content="description">
            <el-icon class="label-tooltip">
              <Warning/>
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-tree-select
        v-model="model[prop]"
        :data="data"
        :props="props"
        :disabled="disabled"
        :placeholder="placeholder"
        :filterable="filterable"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        :show-checkbox="showCheckbox"
        :check-strictly="checkStrictly"
        :node-key="nodeKey"
        clearable
        @change="handleChange"
        @node-click="handleNodeClick"
      />
    </el-form-item>
  </el-col>
  <el-tree-select
    v-else
    v-model="model[prop]"
    :data="data"
    :props="props"
    :disabled="disabled"
    :placeholder="placeholder"
    :filterable="filterable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :show-checkbox="showCheckbox"
    :check-strictly="checkStrictly"
    :node-key="nodeKey"
    clearable
    @change="handleChange"
    @node-click="handleNodeClick"
  />
</template>

<style scoped lang="scss">
.label-container {
  display: flex;
  align-items: center;

  .label-text {
    margin-right: 5px;
  }

  .label-tooltip {
    color: var(--el-color-warning);
  }
}
</style>
