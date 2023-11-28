<template>
    <div class="recommendCardContainer shadow">
        <div class="recommendCardTop">文献推荐</div>
        <div class="recommend" v-for="(recommend,index) in recommendList" :key="index">
            <div class="title">{{ recommend.title }}</div>
            <div class="QueryVolume">
                <n-icon :size="20" :component="BookSearch24Regular"></n-icon>
                &nbsp;搜索量：{{ recommend.QueryVolume }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { BookSearch24Regular } from '@vicons/fluent'

const props = defineProps(['recommend'])

type recommend = {
    title:string,
    QueryVolume:number
}
const recommendList:recommend[] = props.recommend

</script>

<style scoped>
.shadow{
    box-shadow: 0 0 5px 3px #ddd;
}
.recommendCardContainer{
    width: 100%;
    padding: 10px 15px;
    padding-bottom: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: white;
    cursor: pointer;
}
.recommendCardTop{
    width: 100%;
    height: 40px;
    font-size: 17px;
    display: flex;
    align-items: center;
}
.recommend{
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    border-top: 1px solid #E8ECF3;
}
.recommend:nth-child(2){
    border: none;
}
.title{
    font-size: 16px;
    margin: 10px 0;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.QueryVolume{
    color:#999;
    display: flex;
    align-items: center;
}
</style>
