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
  disabled?: boolean;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  filterable?: boolean;
  multiple?: boolean;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isForm: true,
  sm: 0,
  label: "",
  description: "",
  pl: false,
  disabled: false,
  options: () => [],
  optionLabel: "label",
  optionValue: "value",
  placeholder: "请选择",
  filterable: false,
  multiple: false,
  collapseTags: false,
  collapseTagsTooltip: false,
});

const emit = defineEmits<{
  (e: "change", value: any): void;
  (e: "update:model", value: Record<string, any>): void;
}>();

const handleChange = (val: any) => {
  emit("change", val);
  emit("update:model", {...props.model, [props.prop]: val});
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
      <el-select
        v-model="model[prop]"
        :disabled="disabled"
        :placeholder="placeholder"
        :filterable="filterable"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        clearable
        @change="handleChange"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item[optionLabel]"
          :value="optionValue ? item[optionValue] : item"
        />
        <slot name="option"></slot>
      </el-select>
    </el-form-item>
  </el-col>
  <el-select
    v-else
    v-model="model[prop]"
    :disabled="disabled"
    :placeholder="placeholder"
    :filterable="filterable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    clearable
    @change="handleChange"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item[optionLabel]"
      :value="optionValue ? item[optionValue] : item"
    />
    <slot name="option"></slot>
  </el-select>
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
