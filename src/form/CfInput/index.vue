<script setup lang="ts">
import {Warning} from "@element-plus/icons-vue";

interface Props {
  isForm?: boolean;
  sm?: number;
  label?: string;
  description?: string;
  prop: string;
  pl?: boolean;
  type?: "text" | "textarea";
  model: Record<string, any>;
  disabled?: boolean;
  rows?: number;
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
});

const inputValue = computed({
  get: () => props.model[props.prop],
  set: (value) => {
    props.model[props.prop] = value;
  },
});
</script>

<template>
  <template v-if="props.isForm">
    <el-col :xs="{ span: 24 }" :sm="{ span: props.sm }">
      <el-form-item :prop="props.prop" :class="{ 'p-l-10px': props.pl }">
        <template #label>
          <div class="label-container">
            <span class="label-text">{{ props.label }}</span>
            <el-tooltip v-if="props.description" :content="props.description">
              <el-icon class="description-icon">
                <Warning/>
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input
          :type="props.type"
          v-model="inputValue"
          :placeholder="props.label"
          :disabled="props.disabled"
          :rows="props.rows"
          clearable
          v-bind="$attrs"
        />
      </el-form-item>
    </el-col>
  </template>

  <template v-else>
    <el-input
      :type="props.type"
      v-model="inputValue"
      :placeholder="props.label"
      :disabled="props.disabled"
      :rows="props.rows"
      clearable
      v-bind="$attrs"
    />
  </template>
</template>

<style scoped lang="scss">
.label-container {
  display: flex;
  align-items: center;
}

.label-text {
  margin-right: 5px;
}

.description-icon {
  cursor: help;
}
</style>
