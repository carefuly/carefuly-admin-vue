<script setup lang="ts">
import {QuestionFilled} from "@element-plus/icons-vue";

interface Props {
  isForm?: boolean;
  sm?: number;
  label?: string;
  description?: string;
  prop: string;
  pl?: boolean;
  model: Record<string, any>;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  activeText?: string;
  inactiveText?: string;
  inlinePrompt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isForm: true,
  sm: 0,
  label: "",
  description: "",
  pl: false,
  disabled: false,
  activeColor: "#13ce66", // 默认启用颜色 - 绿色
  inactiveColor: "#ff4949", // 默认停用颜色 - 红色
  activeText: "启用",
  inactiveText: "停用",
  inlinePrompt: true
});

const emit = defineEmits<{
  (e: "change", value: boolean): void;
  (e: "update:model", value: Record<string, any>): void;
}>();

const switchValue = computed({
  get: () => props.model[props.prop],
  set: (value: boolean) => {
    emit("update:model", {...props.model, [props.prop]: value});
    emit("change", value);
  }
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
        <el-switch
          v-model="switchValue"
          :disabled="disabled"
          :active-color="activeColor"
          :inactive-color="inactiveColor"
          :active-text="activeText"
          :inactive-text="inactiveText"
          :inline-prompt="inlinePrompt"
        />
      </el-form-item>
    </el-col>
  </template>

  <template v-else>
    <el-switch
      v-model="switchValue"
      :disabled="disabled"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :active-text="activeText"
      :inactive-text="inactiveText"
      :inline-prompt="inlinePrompt"
    />
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
</style>
