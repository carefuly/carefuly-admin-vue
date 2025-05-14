<script setup lang="ts">
import sky from "@/utils/axios";
import {ElLoading, ElNotification} from "element-plus";
import {Download, UploadFilled} from "@element-plus/icons-vue";
import {skyMsgSuccess} from "@/utils/sky";

// 当前组件获取父组件传递的事件方法，然后点击确认和提交是触发父组件传递过来的事件
const emits = defineEmits(["handleTemplateExcel", "handleConfirmUpload"]);

// 最大文件上传数
const excelLimit = ref(1);
// dialog状态
const dialogVisible = ref(false);
//限制.xls文件
const xlsFile = "application/vnd.ms-excel";
//限制.xlsx文件
const xlsxFile = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// 父组件传过来的参数
const skyParams = ref({
  title: "上传Excel",
  isApi: false,
  fileType: xlsFile + "," + xlsxFile,
  fileSize: 5,
  templeApi: "",
  importApi: ""
});
// 接收父组件参数
const excelParams = (params: any) => {
  skyParams.value = {...skyParams.value, ...params};
  dialogVisible.value = true;
};
// 下载文件
const handleTemplateExcel = () => {
  emits("handleTemplateExcel");
};
// 上传的excel表数据
const tableCustom = ref([]);
const excelList = ref([]);
const file = ref();
// 文件上传
const handleHttpUpload = async (param: any) => {
  if (skyParams.value?.isApi) {
    // 方法一：统一调用上传接口
    file.value = param.file;
  } else {
    // 方法二：返回上传方法，前端处理excel表
  }
};
/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: any) => {
  const isExcel = skyParams.value.fileType.includes(file.type);
  const fileSize = file.size / 1024 / 1024 < skyParams.value.fileSize;
  if (!isExcel)
    ElNotification({
      title: "温馨提示",
      message: "上传文件只能是xls / xlsx格式！",
      type: "warning"
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过 ${skyParams.value.fileSize}MB！`,
        type: "warning"
      });
    }, 0);
  return isExcel && fileSize;
};
// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning"
  });
};
// 上传错误提示
const handleUploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: `${skyParams.value.title}上传失败，请您重新上传！`,
    type: "error"
  });
};
// 上传成功提示
const handleUploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    message: `${skyParams.value.title}文件上传成功！`,
    type: "success"
  });
};
// 导入结果
const visible = ref(false);
// 导入信息
const importMsg = ref();
// 关闭信息
const closeDrawer = () => {
  visible.value = false;
  importMsg.value = null;
};
// 上传
const handleConfirm = async () => {
  if (skyParams.value.isApi) {
    const loading = ElLoading.service({
      lock: true,
      text: '数据导入中...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    // 统一调用上传接口
    let fileFormData = new FormData();
    fileFormData.append("file", file.value);
    const res: any = await sky.upload(skyParams.value.importApi, fileFormData);
    if (res?.code != 200) {
      ElNotification({
        title: "温馨提示",
        message: "上传失败，请重试！",
        type: "error"
      });
    } else {
      skyMsgSuccess("文件导入成功");
      visible.value = true;
      importMsg.value = res.msg;
    }
    loading.close();
    emits("handleConfirmUpload");
  } else {
    // 不走上传接口抛出上传数据
    if (excelList.value.length > 0) {
      // 不走上传接口抛出上传数据
      emits("handleConfirmUpload", {tableCustom: tableCustom.value, tableList: excelList.value});
    } else {
      ElNotification({
        title: "温馨提示",
        message: `当前上传数据为空，自动取消上传！`,
        type: "error"
      });
    }
  }
  dialogVisible.value = false;
};
// 取消
const handleCancel = () => {
  tableCustom.value = [];
  excelList.value = [];
  dialogVisible.value = false;
};
defineExpose({
  excelParams
});
</script>

<template>
  <!-- 上传文件 -->
  <el-dialog v-model="dialogVisible" :title="skyParams.title" :destroy-on-close="true" width="580px" draggable>
    <el-form label-width="100px">
      <el-form-item label="模板下载：">
        <el-button type="primary" :icon="Download" @click="handleTemplateExcel">点击下载</el-button>
      </el-form-item>
      <el-form-item label="文件上传：">
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="excelLimit"
          :multiple="false"
          :show-file-list="true"
          :http-request="handleHttpUpload"
          :before-upload="beforeExcelUpload"
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :accept="skyParams.fileType"
        >
          <slot name="content">
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">请上传 .xls, .xlsx 标准格式文件，文件最大为 {{ skyParams.fileSize }}M</div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleConfirm">上传</el-button>
      <el-button type="danger" @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
  <!-- 展示信息 -->
  <el-drawer
    v-model="visible"
    title="导入结果"
    :size="500"
    :close-on-click-modal="true"
  >
    <el-input v-model="importMsg" type="textarea" placeholder="导入结果" autosize clearable/>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
  border: 2px dashed var(--el-color-primary-light-6);

  &:hover {
    border: 2px dashed var(--el-color-primary);
  }
}

.upload {
  width: 80%;
}
</style>
