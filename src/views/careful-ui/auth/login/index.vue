<script setup lang="ts">
import Dark from "./components/dark.vue";
import Language from "./components/language.vue";
import Loading from "./components/loading.vue";
import settings from "@/settings";
import type {FormInstance, FormRules} from "element-plus";
import {useRouter} from "vue-router";
import {captcha} from "@/apis/careful-ui/third/captcha";
import {login} from "@/apis/careful-ui/auth";
import {HOME_URL} from "@/config";
import {initDynamicRouter} from "@/router/modules/dynamicRouter";
import {useUserStore, useKeepAliveStore, useTabsStore, useGlobalStore} from "@/store";
import {getAssets, getLanguage} from "@/utils";
import {skyMsgSuccess, skyMsgError} from "@/utils/sky";
import {User, Lock, Open} from "@element-plus/icons-vue";

const router = useRouter();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

const logo = getAssets("images/logo/logo.jpg");
const bg = getAssets("images/login/bg.png");
const loginFormRef = ref<FormInstance>();
const loading = ref(false);

// 标题语言切换
const loginTitle = ref(settings.loginTitle);

loginTitle.value = computed(() => {
  return getLanguage(globalStore.language, settings.loginTitle, settings.loginEnTitle);
});

interface ILoginUser {
  username: string;
  password: string | number;
  id: string | number;
  code: string | number;
  bizType: string | number;
  img: any;
}

const loginForm = reactive<ILoginUser>({
  username: "careful",
  password: "123456",
  id: "",
  code: "",
  bizType: "BizCaptchaLogin",
  img: ""
});
let loginRules: any = reactive<FormRules<ILoginUser>>({});
loginRules = computed(() => {
  if (globalStore.language === "en") {
    return reactive<FormRules<ILoginUser>>({
      username: [{required: true, message: "The user name cannot be empty", trigger: "blur"}],
      password: [{required: true, message: "The password cannot be empty", trigger: "blur"}],
      code: [{required: true, message: "The verification code cannot be empty", trigger: "blur"}]
    });
  } else {
    return reactive<FormRules<ILoginUser>>({
      username: [{required: true, message: "用户名不能为空", trigger: "blur"}],
      password: [{required: true, message: "密码不能为空", trigger: "blur"}],
      code: [{required: true, message: "验证码不能为空", trigger: "blur"}]
    });
  }
});

/** 获取验证码 */
const handleCaptcha = async () => {
  try {
    const res: any = await captcha({
      bizType: "BizCaptchaLogin",
      type: 1,
    });
    loginForm.id = res.data.id;
    loginForm.img = res.data.img;
  } catch (error) {
    skyMsgError(`验证码获取失败🌻【${error}】】`);
  }
};

const cfTimer = ref();
// 验证码定时器
const getCaptchaTimer = () => {
  cfTimer.value = setInterval(() => {
    // 执行刷新数据的方法
    handleCaptcha();
  }, 345 * 1000);
};


/** 登录 */
const handlePassLogin = () => {
  if (!loginFormRef.value) return;
  loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        const res: any = await login(loginForm);
        userStore.setToken(res.data.token);
        // 添加动态路由 AND 用户按钮 AND 角色信息 AND 用户个人信息
        await initDynamicRouter();
        // 清空 tabs数据、keepAlive缓存数据
        await tabsStore.setTab([]);
        await keepAliveStore.setKeepAliveName([]);
        // 跳转到首页
        loading.value = false;
        skyMsgSuccess(res.msg);
        await router.push(HOME_URL);
      } catch (error) {
        skyMsgError(`登录失败🌻【${error}】`);
      } finally {
        // 等待1秒关闭loading
        let loadingTime = 1;
        setInterval(() => {
          loadingTime--;
          if (loadingTime === 0) {
            loading.value = false;
          }
        }, 1000);
      }
    } else {
      skyMsgError("校验失败，信息填写有误🌻");
    }
  });
};

onMounted(() => {
  // 获取验证码
  handleCaptcha();
  // 局部刷新定时器
  getCaptchaTimer();
});

onUnmounted(() => {
  // 清除局部刷新定时器
  clearInterval(cfTimer.value);
  cfTimer.value = null;
});
</script>

<template>
  <div class="h-full">
    <el-row class="h-100%">
      <div class="absolute top-10px right-10px flex flex-items-center">
        <Language></Language>
        <Dark></Dark>
      </div>

      <el-col :lg="16" :md="12" :sm="15" :xs="0" class="flex flex-items-center flex-justify-center">
        <div class="login-background w-85% h-100%"></div>
        <div class="absolute text-center select-none">
          <el-image class="w-400px h-360px mb-50px animate-float <md:hidden <lg:w-360px h-320px" :src="bg"/>
          <div class="font-bold text-3xl chroma-text mb-6px text-center <lg:text-2xl <md:hidden">
            {{ $t("login.welcome") }} {{ loginTitle || "CAREFUL-ADMIN 管理平台" }}
          </div>
          <div class="chroma-text text-lg text-center <md:hidden">{{ $t("login.description") }}</div>
        </div>
        <!-- 备案号-->
        <div class="bei-an-hao select-none <md:hidden">
          <a class="chroma-text" href="https://beian.miit.gov.cn/" target="_blank">{{
              $t("login.beianhao")
            }}：豫ICP备2022022094号-1</a>
        </div>
      </el-col>

      <el-col :lg="8" :md="12" :sm="9" :xs="24"
              class="dark:bg-#161616 bg-gray-100 flex flex-items-center flex-justify-center flex-col">
        <div class="flex flex-items-center">
          <el-image class="rounded-full w-36px h-36px" :src="logo"/>
          <div class="ml-6px font-bold text-xl">{{ loginTitle || "CAREFUL-ADMIN 管理平台" }}</div>
        </div>
        <div class="flex flex-items-center space-x-3 text-gray-400 mt-16px mb-16px">
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
          <span class="text-center">{{ $t("login.account") }}</span>
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
        </div>
        <!-- 输入框盒子 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="w-260px">
          <el-form-item prop="username">
            <el-input type="text" :placeholder="$t('login.loginName')" :suffix-icon="User" v-model="loginForm.username"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :placeholder="$t('login.password')"
              show-password
              :suffix-icon="Lock"
              v-model="loginForm.password"
            />
          </el-form-item>
          <el-form-item prop="securityCode">
            <el-input
              type="text"
              :placeholder="$t('login.security')"
              :suffix-icon="Open"
              v-model="loginForm.code"
              @keydown.enter="handlePassLogin"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-image class="w-100px h-30px" :src="loginForm.img" @click="handleCaptcha"/>
            <el-button text size="small" class="ml-6px" @click="handleCaptcha">
              <div class="text-gray-400 hover:text-#8B5CF6 select-none">{{ $t("login.blur") }}</div>
            </el-button>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              v-if="!loading"
              class="w-245px bg-[--el-color-primary]"
              round
              v-throttle:3000="handlePassLogin"
            >{{ $t("login.in") }}
            </el-button
            >
            <el-button type="primary" v-else class="w-245px bg-[--el-color-primary]" round :loading="loading">{{
                $t("login.center")
              }}
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 备案号-->
        <div class="beianhao select-none lg:hidden">
          <a class="chroma-text" href="https://beian.miit.gov.cn/" target="_blank"
          >{{ $t("login.beianhao") }}：豫ICP备2022022094号-1</a
          >
        </div>
      </el-col>
    </el-row>

    <Loading></Loading>
  </div>
</template>

<style scoped lang="scss">
/** 备案号 */
.bei-an-hao {
  position: absolute;
  bottom: 10px;
  left: auto;
  font-size: 12px;
  font-weight: bold;
}

.login-background {
  background: linear-gradient(155deg, #07070915 12%, var(--el-color-primary) 36%, #07070915 76%);
  filter: blur(100px);
}

.animate-float {
  animation: float 5s linear 0ms infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
