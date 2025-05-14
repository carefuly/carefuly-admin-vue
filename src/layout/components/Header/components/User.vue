<script setup lang="ts">
import Avatar from "@/assets/images/logo/favicon.svg";
import {useRouter} from "vue-router";
import {LOGIN_URL} from "@/config";
import {skySessionStorage, skyLocalStorage} from "@/utils/storage";
// import {logout, userinfo} from "@/apis/sky/auth/login";
import {skyMsgSuccess} from "@/utils/sky";
import {ArrowDown} from "@element-plus/icons-vue";

const router = useRouter();
const user = ref({
  avatar: "",
  name: "",
});
const avatar = ref(Avatar);
const errorAvatar = ref("");
// 获取用户信息
const getUserInfo = () => {
  // userinfo().then((res: any) => {
  //   if (res.code === 200) {
  //     user.value = res.data;
  //   }
  // });
};
// 退出登录
const handleLayout = () => {
  // logout().then((res: any) => {
  //   if (res.code === 200) {
  //     skyMsgSuccess("注销成功");
  //     // 清除缓存
  //     skySessionStorage.clear();
  //     // 如果不想要保存上次登录设置的全局颜色、布局等，则将下方第一行清空全部代码打开。
  //     // skyLocalStorage.clear();
  //     skyLocalStorage.remove("user");
  //     skyLocalStorage.remove("keepAlive");
  //     skyLocalStorage.remove("tabs");
  //     // 退出登录。必须使用replace把页面缓存刷掉。
  //     router.go(0);
  //   }
  // });
};
// 下拉折叠
const handleCommand = (command: any) => {
  switch (command) {
    case "skyMine":
      router.push("/system/personage");
      break;
    case "logout":
      handleLayout();
      break;
  }
};
onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <!-- 头像 -->
  <el-image class="w-34px h-34px rounded-full select-none user-avatar" :src="user.avatar || avatar">
    <template #error>
      <el-image class="w-34px h-34px rounded-full select-none user-avatar" :src="errorAvatar"></el-image>
    </template>
  </el-image>
  <el-dropdown class="m-l-10px" :hide-on-click="false" @command="handleCommand">
    <div class="sky-dropdown">
      <div class="max-w-113px text-14px m-r-6px line-clamp-1">{{ user.name }}</div>
      <el-icon>
        <arrow-down/>
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="skyMine">个人中心</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.sky-dropdown {
  color: var(--el-color-primary);
  white-space: nowrap; /* 不换行 */
  cursor: pointer;
  outline: none; // 去除伪元素
  display: flex;
  align-items: center;
}
</style>
