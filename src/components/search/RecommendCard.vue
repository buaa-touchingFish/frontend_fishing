<template>
    <div class="recommendCardContainer shadow">
        <div class="recommendCardTop">文献推荐</div>
        <div class="recommend" v-for="recommend in recommendList" :key="recommend.id">
            <div class="titleContainer" :data-title="recommend.title">
                <div class="title" @click="$router.push('/detail/'+recommend.id)">{{ recommend.title }}</div>
            </div>
            <div class="clickVolume">
                <n-icon :size="20" :component="CursorClick20Filled" color='var(--primary-100)'></n-icon>
                &nbsp;今日点击量：{{ recommend.browse }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted } from 'vue';
import { CursorClick20Filled } from '@vicons/fluent'
import { recommendPaper } from '@/models/model';
import { get } from '@/api/axios';
import { useMessage } from 'naive-ui';

const message = useMessage();

const recommendList: Ref<recommendPaper[]> = ref([]);
onMounted(async () => {
    recommendList.value = await get(message, '/paper/hot', {})
    console.log("recommendList:");
    console.log(recommendList);
})
</script>

<style scoped>
.shadow {
    box-shadow: 0 0 5px 3px var(--shadow);
}

.recommendCardContainer {
    width: 100%;
    padding: 10px 15px;
    padding-bottom: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: var(--bg-100);
}

.recommendCardTop {
    width: 100%;
    height: 40px;
    font-size: 17px;
    display: flex;
    align-items: center;
    color: var(--text-100);
}

.recommend {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    border-top: 1px solid #E8ECF3;
    color: var(--text-100);
}

.recommend:nth-child(2) {
    border: none;
}

.title {
    font-size: 16px;
    margin: 10px 0;
    cursor: pointer;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        text-decoration: underline;
        color: var(--primary-100);
    }
}

.titleContainer[data-title] {
    position: relative;
    width: fit-content;
    max-width: 100%;

    &:hover:after {
        opacity: 1;
        transition: all 0.1s ease 0.5s;
        visibility: visible;
    }

    &:after {
        content: attr(data-title);
        background-color: var(--bg-200);
        height: fit-content;
        font-size: 12px;
        position: absolute;
        padding: 4px 10px;
        right: 20px;
        top: -1.5rem;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 99999;
        visibility: hidden;
        opacity: 0;
    }
}

.clickVolume {
    color: #999;
    display: flex;
    align-items: center;
}</style>
