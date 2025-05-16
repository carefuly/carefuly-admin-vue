<script setup lang="ts">
import page from "./index";

import {
  create,
  exportExcel,
  deleteById,
  batchDelete,
  update,
  listTree,
  getById
} from "@/apis/careful-ui/system/dept";
import {skyMsgError} from "@/utils/sky";

const skyDrawerRef = ref();
const skyDialogRef = ref();
const formRef = ref();

const pageData = reactive({
  ...page.pageData,
});
const method = reactive({
  /** 搜索 */
  handleSearch: () => {
    method.handleListPage();
  },
  /** 重置 */
  resetSearch: () => {
    method.resetSearchParams();
    method.handleListPage();
  },
  /** 重置搜索参数 */
  resetSearchParams: () => {
    pageData.pageParams.creator = null;
    pageData.pageParams.modifier = null;
    pageData.pageParams.page = 1;
    pageData.pageParams.pageSize = 10;
    pageData.pageParams.status = true;
    pageData.pageParams.name = "";
    pageData.pageParams.code = "";
  },

  /** 添加 */
  handleAdd: () => {
    // 打开弹出框
    skyDrawerRef.value.skyOpen();
    // 重置表单
    method.handleResetForm();
    // 标题
    pageData.title = "添加";
  },
  /** 清空表单数据 */
  handleResetForm: async () => {
    await nextTick(() => {
      if (formRef.value) {
        // 重置该表单项，将其值重置为初始值，并移除校验结果
        formRef.value.resetFields();
      }
    });
    pageData.form = {
      id: null,
      parent_id: null,
      name: "",
      code: "",
      owner: "",
      phone: "",
      email: "",
      sort: 1,
      status: true,
      remark: null,
    };
  },

  /** 确定  */
  handleConfirm: () => {

  },
  /** 取消 */
  handleCancel: () => {
    skyDrawerRef.value.skyClose();
  },

  /** 数据表格 */
  handleListPage: async () => {
    try {
      pageData.loading = true;
      pageData.tableList = [];
      const res: any = await listTree(pageData.pageParams);
      pageData.tableList = res.data;
    } catch (error) {
      skyMsgError("数据查询失败，请刷新重试🌻");
    } finally {
      pageData.loading = false;
    }
  },
});
onMounted(() => {
  method.handleListPage();
});
</script>

<template>
  <div class="sky-flex">
    <SkyCard>
      <!-- 搜索条件 -->
      <el-form v-show="pageData.showSearch" :inline="true" label-width="auto">
        <el-form-item label="部门名称">
          <el-input
            style="width: 160px"
            placeholder="部门名称"
            v-model="pageData.pageParams.name"
            clearable
            @keyup.enter.native="method.handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input
            style="width: 160px"
            placeholder="部门编码"
            v-model="pageData.pageParams.code"
            clearable
            @keyup.enter.native="method.handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pageData.pageParams.status" style="width: 160px" clearable>
            <el-option label="启用" :value="true"/>
            <el-option label="禁用" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-throttle="method.handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-debounce="method.resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" icon="plus" plain @click="method.handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <br/>

      <!-- 添加 OR 修改 -->
      <SkyDrawer
        ref="skyDrawerRef"
        :title="pageData.title"
        @skyConfirm="method.handleConfirm"
        @skyCancel="method.handleCancel"
        :loading="pageData.confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" :rules="pageData.rules" :model="pageData.form" label-width="auto" status-icon>
            <cf-input
              :sm="24"
              label="部门名称"
              prop="name"
              :model="pageData.form"
            />
            <cf-input
              :sm="24"
              label="部门编号"
              prop="code"
              :model="pageData.form"
            />
            <cf-input
              :sm="24"
              label="负责人"
              prop="owner"
              :model="pageData.form"
            />
            <cf-input
              :sm="24"
              label="联系电话"
              prop="phone"
              :model="pageData.form"
            />
            <cf-input
              :sm="24"
              label="邮箱"
              prop="email"
              :model="pageData.form"
            />
            <cf-input
              :sm="24"
              label="备注"
              prop="remark"
              :type="'textarea'"
              :model="pageData.form"
              :rows="2"
            />
          </el-form>
          {{ pageData.form }}
        </template>
      </SkyDrawer>
    </SkyCard>
  </div>
</template>

<style scoped lang="scss">

</style>
