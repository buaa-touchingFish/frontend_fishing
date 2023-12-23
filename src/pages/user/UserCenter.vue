<template>
  <div class="root">
    <div class="left-container">
      <div class="avatar-box">
        <n-avatar round :size=113 :src=avatarSrc></n-avatar>
      </div>
      <span class="name">{{ userName }}</span>
    </div>
    <div class="right-container"></div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar } from "naive-ui";
const avatarSrc: string = "https://avatars.githubusercontent.com/u/20698517?v=4";
const userName: string = "用户名";
</script>

<style scoped>
.root {
  display: flex;
  width: 1100px;
  margin: 32px auto 0;

  .left-container {
    flex: 1;
    height: 200px;
    background-color: rgb(198, 198, 207);
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar-box {
      margin-bottom: 10px;
    }

    .name {
      color: #333;
      font-size: 18px;
      line-height: 1.5;
    }
  }

  .right-container {
    flex: 2;
    height: 200px;
    background-color: burlywood;
  }
}
</style>