<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-notification-provider>
        <router-view></router-view>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'

/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  common: {
    primaryColor: '#82cefd',
    primaryColorHover: '#45b8ff',
    primaryColorPressed: '#0a9ffc'
  },
  Button: {
    primaryColor: '#45b8ff',
    primaryColorHover: '#0a9ffc',
  },
  Select: {
    peers: {
      InternalSelection: {
      }
    }
  }
  // ...
}
</script>

<style scoped></style>
