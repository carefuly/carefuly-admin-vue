<script setup lang="ts">
import {useI18n} from "vue-i18n"
import {useGlobalStore} from "@/store";
import {SwitchFilled} from "@element-plus/icons-vue";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = [
  {label: "简体中文", value: "zh"},
  {label: "English", value: "en"}
];

const changeLanguage = (lang) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang);
};
</script>

<template>
  <el-tooltip placement="left" content="语言翻译">
    <el-dropdown @command="changeLanguage">
      <el-icon class="sky-icon m-r-18px" :size="20">
        <SwitchFilled/>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languageList"
            :key="item.value"
            :command="item.value"
            :disabled="language === item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>

<style scoped>

</style>
