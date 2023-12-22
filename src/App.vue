<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-notification-provider>
        <router-view :key="route.fullPath"></router-view>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { GlobalTheme, GlobalThemeOverrides, NConfigProvider, darkTheme } from 'naive-ui'
import './animationStyle.css'
import { useRoute } from 'vue-router';
import { ref, Ref } from 'vue'
import emitter from '@/eventBus/eventBus';

const route = useRoute();
const colorStyle = document.documentElement.style;
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const whiteTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: "#3F51B5",
    primaryColorHover: "#757de8",
    primaryColorPressed: "#dedeff",
    textColor1: "#333333",
    textColor2: "#333333"
  },
  // ...
};

const blackTheme: GlobalThemeOverrides =
{
  common: {
    primaryColor: '#0085ff',
    primaryColorHover: '#69b4ff',
    primaryColorPressed: '#e0ffff',
    textColor1: 'white',
    textColor2: 'white'
  },
  // ...
};
const themeOverrides: Ref<GlobalThemeOverrides> = ref(whiteTheme);
const theme: Ref<GlobalTheme | null> = ref(null);
emitter.on("themeChange", (data: any) => {
  const doc: any = document;
  doc.startViewTransition(() => {
    if (data) {
      /* 
  --primary-100: #0085ff;
          --primary-200: #69b4ff;
          --primary-300: #e0ffff;
          --accent-100: #006fff;
          --accent-200: #e1ffff;
          --text-100: #FFFFFF;
          --text-200: #9e9e9e;
          --bg-100: #1E1E1E;
          --bg-200: #2d2d2d;
          --bg-300: #454545; */
      themeOverrides.value = blackTheme;
      theme.value = darkTheme;
      colorStyle.setProperty('--primary-100', '#0085ff');
      colorStyle.setProperty('--primary-200', '#69b4ff');
      colorStyle.setProperty('--primary-300', '#e0ffff');
      colorStyle.setProperty('--accent-100', '#006fff');
      colorStyle.setProperty('--accent-200', '#e1ffff');
      colorStyle.setProperty('--text-100', '#FFFFFF');
      colorStyle.setProperty('--text-200', '#9e9e9e');
      colorStyle.setProperty('--bg-100', '#1E1E1E');
      colorStyle.setProperty('--bg-200', '#2d2d2d');
      colorStyle.setProperty('--bg-300', '#454545');
      colorStyle.setProperty('--bg-rendering', '#454545');
    }
    else {
      themeOverrides.value = whiteTheme;
      theme.value = null;
      colorStyle.setProperty('--primary-100', '#3F51B5');
      colorStyle.setProperty('--primary-200', '#757de8');
      colorStyle.setProperty('--primary-300', '#dedeff');
      colorStyle.setProperty('--accent-100', '#2196F3');
      colorStyle.setProperty('--accent-200', '#003f8f');
      colorStyle.setProperty('--text-100', '#333333');
      colorStyle.setProperty('--text-200', '#5c5c5c');
      colorStyle.setProperty('--bg-100', '#FFFFFF');
      colorStyle.setProperty('--bg-200', '#f5f5f5');
      colorStyle.setProperty('--bg-300', '#cccccc');
      colorStyle.setProperty('--bg-rendering', '#e5ecf6');
    }
  });

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
  --bg-rendering: #e5ecf6;
  /* black */
  /* 
  --primary-100: #0085ff;
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

.fafaffa {
  --primary-100: #0085ff;
  --primary-200: #69b4ff;
  --primary-300: #e0ffff;
  --accent-100: #006fff;
  --accent-200: #e1ffff;
  --text-100: #FFFFFF;
  --text-200: #9e9e9e;
  --bg-100: #1E1E1E;
  --bg-200: #2d2d2d;
  --bg-300: #454545;
}
</style>
