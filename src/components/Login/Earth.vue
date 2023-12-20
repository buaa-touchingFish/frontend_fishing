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
    let dom = document.getElementById("earthContainer");
    const chart = earthFlyLine.init({
        dom,
        map: "world",
        autoRotate: true,
        stopRotateByHover: false,
        config: {
            R: 140,
            earth: {
                color: "blue",
            },
            bgStyle: {
                color: "#040D21",
                opacity: 0,
            },
            mapStyle: {
                areaColor: "#2e3564",
                lineColor: "#797eff",
            },
            spriteStyle: {
                color: "#797eff"
            },
            pathStyle: {
                color: "black",
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
            enableZoom: false,
        },
    });

    const flyLineData = [
        {
            from: {
                id: 2,
                lon: 149, //经度
                lat: -35, //维度
                
            },
            to: {
                id: 1,
                lon: 112.45, //经度
                lat: 34.62, //维度
                
            },
        },
        {
            from: {
                id: 3,
                lon: 4, //经度
                lat: 50.5, //维度
                
            },
            to: {
                id: 4,
                lon: -48, //经度
                lat: -15, //维度
                
            },
        },
        {
            from: {
                id: 5,
                lon: 2.2, //经度
                lat: 48.5, //维度
                
            },
            to: {
                id: 6,
                lon: 37.35, //经度
                lat: 55.45, //维度
                
            },
        },
        
    ]
    chart.addData('flyLine', flyLineData)
})
</script>

<style scoped>
#earthContainer {
    width: 80%;
    height: 60%;
}
</style>