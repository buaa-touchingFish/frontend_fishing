<template lang="">
  <div class="root">
    <h2 class="title">
      <a :herf="herf" target="_blank" class="title-content">{{ title }}</a>
    </h2>
    <div class="buttons-container">
      <n-button icon-placement="left" strong secondary round type="info">
        <template #icon>
          <n-icon>
            <newspaper-outline />
          </n-icon>
        </template>
        获取全文
      </n-button>
    </div>
    <div class="content">
      <div class="authors">
        <span v-for="author in authors" :key="author">{{ author }}</span>
      </div>
      <div class="abstract">
        <span>{{ abstract }}</span>
      </div>
      <div class="press">{{ press }}</div>
      <div class="keywords">
        <span v-for="keyword in keywords" :key="keyword">{{ keyword }}</span>
      </div>
      <div class="citations">{{ citations }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NButton, Nicon } from 'naive-ui';
import { NewspaperOutline } from '@vicons/ionicons5';
defineProps({
  title: String,
  authors: Array<String>,
  abstract: String,
  press: String,
  keywords: Array<String>,
  citations: Number,
  herf: String,
});
</script>
<style scoped>
.root {
  display: flex;
  flex-direction: column;

  .title {
    color: #005cd9;
  }

  .buttons-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style>