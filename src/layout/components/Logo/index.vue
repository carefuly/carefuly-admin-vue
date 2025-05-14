<script setup lang="ts">
import settings from "@/settings";
import {useGlobalStore} from "@/store";
import {getAssets} from "@/utils";

const globalStore = useGlobalStore();
// 接收父组件传递的参数
const props = defineProps({
  isCollapse: {
    require: false, // true显示，false隐藏
    type: Boolean
  },
  layout: {
    require: "vertical", // 布局模式 (纵向：vertical | 分栏：columns | 经典：classic | 上左：optimum | 横向：horizontal )
    type: String
  }
});
const title = ref(settings.logoTitle);
const titleSize = ref(`${settings.loginTitleSize}px`);
const logoUrl = ref(`${getAssets(settings.logoUrl)}`);
const hidden = ref(settings.logoHidden);
const logoSize = ref(settings.logoSize);
const titleAnimate = ref(settings.logoTitleAnimate);

const logoWidth = ref();
watch(
  () => globalStore.layout,
  () => {
    if (globalStore.layout === "classic" || globalStore.layout === "horizontal") {
      logoWidth.value = "220px";
    } else {
      logoWidth.value = "100%";
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div class="sky-logo" v-show="hidden">
    <img
      class="m-l-15px m-r-12px sky-logo-img rounded-full select-none"
      :src="logoUrl"
      alt="avatar"
      v-if="props.layout === 'vertical' || props.layout === 'mobile'"
    />
    <img
      class="m-l--3px m-r-12px sky-logo-img rounded-full select-none"
      :src="logoUrl"
      alt="avatar"
      v-if="props.layout === 'classic'"
    />
    <img
      class="m-l-6px m-r-12px sky-logo-img rounded-full select-none"
      :src="logoUrl"
      alt="avatar"
      v-if="props.layout === 'columns' || props.layout === 'optimum'"
    />
    <img
      class="m-l-17px m-r-12px sky-logo-img rounded-full select-none"
      :src="logoUrl"
      alt="avatar"
      v-if="props.layout === 'horizontal'"
    />
    <div class="sky-title chroma-text font-bold truncate" :class="titleAnimate" v-text="title" v-show="!props.isCollapse"></div>
  </div>
</template>

<style scoped lang="scss">
.sky-logo {
  display: flex;
  align-items: center;
  width: v-bind(logoWidth);
  height: $aside-header-height;
  line-height: $aside-header-height;
}

.sky-logo-img {
  width: v-bind(logoSize);
  height: v-bind(logoSize);
}

.sky-title {
  width: 160px;
  font-size: v-bind(titleSize);
}
</style>
