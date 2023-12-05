<template>
    <div id="earthContainer">

    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import earthFlyLine from "earth-flyline";
//请先下载地图文件（可去第三方下载） 然后注册地图 本项目的地图文件在src/map/world
import geojson from '@/assets/world.json'
earthFlyLine.registerMap("world", geojson);
//获取dom节点作为容器 注：该节点请设置宽高
const dom = document.getElementById("earthContainer");
const chart = earthFlyLine.init({
  dom,
  map: "world",
});
</script>

<style scoped>

</style>