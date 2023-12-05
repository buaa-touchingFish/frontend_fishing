<template>
    <div id="earthContainer">

    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import earthFlyLine from "earth-flyline";
//请先下载地图文件（可去第三方下载） 然后注册地图 本项目的地图文件在src/map/world
import geojson from '@/assets/world.json'
import { onMounted } from "vue";
onMounted(() => {
    earthFlyLine.registerMap("world", geojson);
    //获取dom节点作为容器 注：该节点请设置宽高
    const dom = document.getElementById("earthContainer");
    const chart = earthFlyLine.init({
        dom,
        map: "world",
        config: {
            R: 140,
            earth: {
                color: "#13162c",
            },
            mapStyle: {
                areaColor: "#2e3564",
                lineColor: "#797eff",
            },
            spriteStyle: {
                color: "#797eff"
            },
            pathStyle: {
                color: "#cd79ff",
            },
            flyLineStyle: {
                color: "#cd79ff",
            },
            scatterStyle: {
                color: "#cd79ff",
            },
            hoverRegionStyle: {
                areaColor: "#cd79ff",
            },
            regions: {
                China: {
                    areaColor: "#2e3564",
                },
            },
        },
    });
})
</script>

<style scoped></style>