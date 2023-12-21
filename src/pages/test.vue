<template>
    <div style="height: 300px;">
        hello
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import * as PIXI from 'pixi.js';
import '@pixi/graphics-extras';

const app = new PIXI.Application({ background: '#ffff', resizeTo: window });
document.body.appendChild(app.view as any);
// const container = new PIXI.Container();
// app.stage.addChild(container);
const graphics = new PIXI.Graphics();

graphics.lineStyle(4, 0xFFFFFF);
graphics.beginFill(0x55335A, 1);
graphics.drawStar(470, 450, 4, 50,0);
graphics.endFill();

app.stage.addChild(graphics);
</script>

<style scoped>

</style>
