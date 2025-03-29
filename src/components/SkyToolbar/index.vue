<script setup lang="ts">
const emits = defineEmits(["update:showSearch", "refreshTable"]);
const props = defineProps(["showSearch", "showColumns"]);
// 点击子组件，调用父组件方法
const toggleSearch = () => {
  // 同步修改父子组件的值，但是父组件需要使用v-model:showSearch="showSearch"
  // @ts-ignore
  emits("update:showSearch", !props.showSearch);
};
// 点击子组件，调用父组件方法
const handleRefresh = () => {
  emits("refreshTable");
};
</script>

<template>
  <!-- 使用方式：<SkyToolbar v-model:showSearch="showSearch" @refreshTable="handleTableData"></KoiToolbar> -->
  <div class="sky-toolbar">
    <el-row>
      <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button circle icon="search" @click="toggleSearch()"/>
      </el-tooltip>
      <el-tooltip content="表格控制" placement="top">
        <el-dropdown class="m-l-12px m-r-12px" :hide-on-click="false">
          <el-button circle icon="menu"/>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in showColumns">
                <el-checkbox v-model="item.visible" :label="item.title" :true-value="1" :false-value="0"/>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
      <el-tooltip content="刷新" placement="top">
        <el-button circle icon="refresh" @click="handleRefresh()"/>
      </el-tooltip>
    </el-row>
  </div>
</template>

<style scoped>
.sky-toolbar {
  margin-left: auto;
}
</style>
