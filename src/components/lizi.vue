<template>
    <div class="lz-container">
        <canvas id="canvas" ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import {ref, onMounted } from 'vue' 

const canvas = ref('')

onMounted(() => {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    const ctx = canvas.value.getContext('2d');
    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speed = 1.5
            this.dirX = (Math.random() * 5 - 2.5) * this.speed;
            this.dirY = (Math.random() * 5 - 2.5) * this.speed;
        }

        draw() {
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()

        }

        updateDot() {
            if (this.y > canvas.value.height || this.y <= 0) {
                this.dirY = -this.dirY;
            }
            if (this.x > canvas.value.width || this.x <= 0) {
                this.dirX = -this.dirX;
            }
            this.x += this.dirX
            this.y += this.dirY
            this.draw()
        }
    }

    const arr = []
    function init() {
        // 粒子数量
        for (let i = 0; i < 50; i++) {
            let dots = new Dot(Math.random() * canvas.value.width, Math.random() * canvas.value.height)
            arr.push(dots)
        }
    }
    function animation() {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
        requestAnimationFrame(animation)
        arr.forEach((item, index) => {
            arr.forEach((items, indexs) => {
                if (index == indexs)
                    return
                if (Math.abs(item.x - items.x) < 120 && Math.abs(item.y - items.y) < 120) {
                    setLine(item.x, item.y, items.x, items.y)
                }
            })
            item.updateDot()
        })
    }
    function setLine(x, y, x1, y1){
        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.moveTo(x, y)
        ctx.lineTo(x1, y1)
        ctx.stroke()
        ctx.closePath()
    }
    init()
    animation()
})
</script>

<style scoped>
.lz-container {
    height: 100vh;
    overflow: hidden;
}

#canvas {
    background-color: #000;
    width: 100%;
    height: 100%;
}
</style>