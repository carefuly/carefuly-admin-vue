<script setup lang="ts">
import {Minus, Plus, QuestionFilled} from "@element-plus/icons-vue";
import type {InputNumberProps} from "element-plus";

interface Props {
  isForm?: boolean;
  sm?: number;
  label?: string;
  description?: string;
  prop: string;
  pl?: boolean;
  model: Record<string, any>;
  precision?: number;
  step?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  controlsPosition?: "right" | "left";
  size?: InputNumberProps["size"];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isForm: true,
  sm: 0,
  label: "",
  description: "",
  pl: false,
  precision: 4,
  step: 1,
  disabled: false,
  min: -Infinity,
  max: Infinity,
  controlsPosition: "right",
  size: "default",
  placeholder: "请输入数字"
});

const emit = defineEmits<{
  (e: "input", value: number): void;
  (e: "change", value: number): void;
  (e: "update:model", value: Record<string, any>): void;
}>();

const inputValue = computed({
  get: () => props.model[props.prop],
  set: (value: number) => {
    emit("update:model", {...props.model, [props.prop]: value});
    emit("input", value);
  }
});

const handleChange = (value: number) => {
  emit("change", value);
};
</script>

<template>
  <template v-if="isForm">
    <el-col :xs="{ span: 24 }" :sm="{ span: sm }">
      <el-form-item :prop="prop" :class="{ 'p-l-10px': pl }">
        <template #label>
          <div class="label-container">
            <span class="label-text">{{ label }}</span>
            <el-tooltip v-if="description" :content="description">
              <el-icon class="description-icon">
                <QuestionFilled/>
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number
          class="number-input"
          v-model="inputValue"
          :precision="precision"
          :step="step"
          :disabled="disabled"
          :min="min"
          :max="max"
          :controls-position="controlsPosition"
          :size="size"
          :placeholder="placeholder"
          @change="handleChange"
        >
          <template #decrease-icon>
            <el-icon>
              <Minus/>
            </el-icon>
          </template>
          <template #increase-icon>
            <el-icon>
              <Plus/>
            </el-icon>
          </template>
        </el-input-number>
      </el-form-item>
    </el-col>
  </template>

  <template v-else>
    <el-input-number
      class="number-input"
      v-model="inputValue"
      :precision="precision"
      :step="step"
      :disabled="disabled"
      :min="min"
      :max="max"
      :controls-position="controlsPosition"
      :size="size"
      :placeholder="placeholder"
      @change="handleChange"
    >
      <template #decrease-icon>
        <el-icon>
          <Minus/>
        </el-icon>
      </template>
      <template #increase-icon>
        <el-icon>
          <Plus/>
        </el-icon>
      </template>
    </el-input-number>
  </template>
</template>

<style scoped lang="scss">
.label-container {
  display: flex;
  align-items: center;

  .label-text {
    margin-right: 5px;
  }

  .description-icon {
    color: var(--el-color-warning);
    cursor: help;
  }
}

.number-input {
  width: 100%;

  :deep(.el-input__inner) {
    text-align: left;
  }
}
</style>
