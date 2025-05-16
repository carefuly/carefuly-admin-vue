<script setup lang="ts">
import {QuestionFilled, Search, More} from "@element-plus/icons-vue";

interface Props {
  isForm?: boolean;
  sm?: number;
  label?: string;
  description?: string;
  prop: string;
  pl?: boolean;
  type?: 'text' | "textarea";
  model: Record<string, any>;
  disabled?: boolean;
  rows?: number;
  buttonIcon?: string;
  buttonTooltip?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isForm: true,
  sm: 0,
  label: "",
  description: "",
  pl: false,
  type: "text",
  disabled: false,
  rows: 0,
  buttonIcon: "more",
  buttonTooltip: "更多操作"
});

const emit = defineEmits<{
  (e: "button-click"): void;
  (e: "update:model", value: Record<string, any>): void;
}>();

const inputValue = computed({
  get: () => props.model[props.prop],
  set: (value) => {
    emit("update:model", {...props.model, [props.prop]: value});
  }
});

const handleButtonClick = () => {
  emit("button-click");
};

const iconComponents = {
  more: More,
  search: Search,
  help: QuestionFilled
};

const buttonIconComponent = computed(() => {
  return iconComponents[props.buttonIcon] || More;
});
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
        <el-input
          :type="type"
          v-model="inputValue"
          :placeholder="label"
          :disabled="disabled"
          :rows="rows"
          clearable
        >
          <template #append>
            <el-tooltip :content="buttonTooltip">
              <el-button :icon="buttonIconComponent" @click="handleButtonClick"/>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
    </el-col>
  </template>

  <template v-else>
    <el-input
      :type="type"
      v-model="inputValue"
      :placeholder="label"
      :disabled="disabled"
      :rows="rows"
      clearable
    >
      <template #append>
        <el-tooltip :content="buttonTooltip">
          <el-button :icon="buttonIconComponent" @click="handleButtonClick"/>
        </el-tooltip>
      </template>
    </el-input>
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

:deep(.el-input-group__append) {
  padding: 0;
  border: none;
  background: transparent;

  .el-button {
    padding: 0 10px;
    border: none;
    border-left: 1px solid var(--el-border-color);
    border-radius: 0;
  }
}
</style>
