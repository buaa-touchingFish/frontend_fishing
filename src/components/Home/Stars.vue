<template>
    <div v-for="(name, index) in starClassNames" class="recommend" :class="[{ recommendStar: !recommendShow[index] }, name]"
        @mouseenter="recommendShow[index] = true" @mouseleave="recommendShow[index] = false">
        <div class="recommendTitle" v-show="recommendShow[index]">
            AcadVista 主页推荐
            <n-icon size="23" style="align-self: center; margin-right: 2px; cursor: pointer"
                :component="ArrowCircleRight24Regular" @click="$router.push('/detail/' + recommendPapers[index]?.id)" />
        </div>
        <div class="recommendContent" v-show="recommendShow[index]">
            {{ recommendPapers[index]?.title }}
        </div>
    </div>
</template>

<script setup lang='ts'>
import { get } from '@/api/axios';
import { Ref, onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { ArrowCircleRight24Regular } from '@vicons/fluent'
const message = useMessage();
//首页背景
const recommendShow = ref([false, false, false, false, false, false, false, false, false, false])
const starClassNames = ref(['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10']);
onMounted(() => {
    setInterval
})
const recommendPapers: Ref<{
    "id": string,
    "title": string,
    "browse": number
}[]> = ref([]);
onMounted(async () => {
    const res = await get(message, '/paper/hot', {});
    if (!res) return;
    recommendPapers.value = res;

})
</script>

<style scoped>
.recommend {
    position: absolute;
    height: 100px;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 5px;

    z-index: 666;
    transition: 0.5s all;

    &:hover {
        animation-play-state: paused;
    }
}

.recommendStar {
    width: 50px;
    height: 50px;
    border-radius: 0;
    background-color: transparent;
    backdrop-filter: inherit;

    transition: 0.5s all;

    &::after {
        content: "";
        text-align: right;
        position: absolute;
        top: 15px;
        right: 15px;
        height: 2px;
        background: linear-gradient(-45deg, white, rgba(0, 0, 255, 0));
        transform-origin: right;
        transform: scaleX(-1) rotateZ(45deg);
        width: 50px;
        animation: tail 20s linear infinite;
    }

    ;

    &::before {
        content: "";
        position: absolute;
        top: calc(0px);
        right: calc(0px);
        width: 30px;
        height: 30px;
        clip-path: path('M15,0 L17,13 L30,15 L17,17 L15,30 L13,17 L0,15 L13,13 z');
        background-image: radial-gradient(white 0px, black 15px);
        animation: shin 3s infinite;

        &:hover {
            animation-play-state: paused;
        }
    }
}

@keyframes shin {
    0% {
        transform: scaleX(0) scaleY(0)
    }

    50% {
        transform: scaleX(1.5) scaleY(1.5)
    }

    100% {
        transform: scaleX(0) scaleY(0)
    }
}

@keyframes tail {
    0% {
        width: 0;
    }

    20% {
        width: 200px;
    }

    80% {
        width: 200px;
    }

    100% {
        width: 0;
    }
}

.recommendTitle {
    color: white;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 15px;
    font-size: large;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.recommendContent {
    color: white;
    margin-top: 5px;
    margin-left: 10px;
}

.star1 {
    animation: shooting1 20s 418ms infinite;
}

@keyframes shooting1 {
    0% {
        top: calc(50% - 100px);
        right: calc(70%);
    }

    100% {
        top: calc(50% + 100px);
        right: calc(70% + 200px);
    }
}

.star2 {
    animation: shooting2 20s 100ms infinite;
}

@keyframes shooting2 {
    0% {
        top: calc(50% - 200px);
        right: calc(10%);
    }

    100% {
        top: calc(50% + 0px);
        right: calc(10% + 200px);
    }
}

.star3 {
    animation: shooting3 20s 2000ms infinite;
}

@keyframes shooting3 {
    0% {
        top: calc(50% - 300px);
        right: calc(20%);
    }

    100% {
        top: calc(50% - 100px);
        right: calc(20% + 200px);
    }
}

.star4 {
    animation: shooting4 20s 1432ms infinite;
}

@keyframes shooting4 {
    0% {
        top: calc(50% - 250px);
        right: calc(50%);
    }

    100% {
        top: calc(50% - 50px);
        right: calc(50% + 200px);
    }
}

.star5 {
    animation: shooting5 20s 682ms infinite;
}

@keyframes shooting5 {
    0% {
        top: calc(50% - 40px);
        right: calc(30%);
    }

    100% {
        top: calc(50% + 160px);
        right: calc(30% + 200px);
    }
}

.star6 {
    animation: shooting6 20s 310ms infinite;
}

@keyframes shooting6 {
    0% {
        top: calc(50% - 50px);
        right: calc(10%);
    }

    100% {
        top: calc(50% + 150px);
        right: calc(10% + 200px);
    }
}

.star7 {
    animation: shooting7 20s 1023ms infinite;
}

@keyframes shooting7 {
    0% {
        top: calc(50% - 200px);
        right: calc(70%);
    }

    100% {
        top: calc(50% + 0px);
        right: calc(70% + 200px);
    }
}

.star8 {
    animation: shooting8 20s 920ms infinite;
}

@keyframes shooting8 {
    0% {
        top: calc(50% - 250px);
        right: calc(30%);
    }

    100% {
        top: calc(50% - 50px);
        right: calc(30% + 200px);
    }
}

.star9 {
    animation: shooting9 20s 1943ms infinite;
}

@keyframes shooting9 {
    0% {
        top: calc(50% - 200px);
        right: calc(60%);
    }

    100% {
        top: calc(50% + 0px);
        right: calc(60% + 200px);
    }
}

.star10 {
    animation: shooting10 20s 1532ms infinite;
}

@keyframes shooting10 {
    0% {
        top: calc(50% - 100px);
        right: calc(40%);
    }

    100% {
        top: calc(50% + 100px);
        right: calc(40% + 200px);
    }
}
</style>
