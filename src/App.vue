<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-notification-provider>
        <router-view :key="route.fullPath"></router-view>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'
import '@/assets/style/animationStyle.css'
import { useRoute } from 'vue-router';
import { ref, Ref } from 'vue'
const route = useRoute();
const colorStyle = getComputedStyle(document.documentElement);
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides: Ref<GlobalThemeOverrides> = ref({
  common: {
    primaryColor: colorStyle.getPropertyValue('--primary-100'),
    primaryColorHover: colorStyle.getPropertyValue('--primary-200'),
    primaryColorPressed: colorStyle.getPropertyValue('--primary-300')
  },
  // ...
})
</script>

<style>
:root {
  /* white */
  --primary-100: #3F51B5;
  --primary-200: #757de8;
  --primary-300: #dedeff;
  --accent-100: #2196F3;
  --accent-200: #003f8f;
  --text-100: #333333;
  --text-200: #5c5c5c;
  --bg-100: #FFFFFF;
  --bg-200: #f5f5f5;
  --bg-300: #cccccc;



  /* black */
  /* --primary-100: #0085ff;
            --primary-200: #69b4ff;
            --primary-300: #e0ffff;
            --accent-100: #006fff;
            --accent-200: #e1ffff;
            --text-100: #FFFFFF;
            --text-200: #9e9e9e;
            --bg-100: #1E1E1E;
            --bg-200: #2d2d2d;
            --bg-300: #454545; */
}
</style>
